import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/lib/sanity';
import { userProfileSchema } from '@/lib/validations/user';
import { z } from 'zod';

/**
 * GET /api/users/profile
 * Retrieves the authenticated user's profile information
 */
export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session found' },
        { status: 401 }
      );
    }

    // Query Sanity for user profile by email
    const query = `*[_type == "user" && email == $email][0] {
      _id,
      name,
      email,
      role,
      "avatar": avatar.asset->url,
      profile,
      coachId,
      createdAt,
      updatedAt
    }`;

    const user = await client.fetch(query, { email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Return user profile data
    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/profile
 * Updates the authenticated user's profile information
 */
export async function PUT(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session found' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    
    // Validate the request data against our schema
    const validationResult = userProfileSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // First, find the user by email to get their _id
    const userQuery = `*[_type == "user" && email == $email][0] { _id }`;
    const existingUser = await client.fetch(userQuery, { email: session.user.email });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      ...validatedData,
      updatedAt: new Date().toISOString()
    };

    // Handle profile nested object separately
    if (validatedData.weight || validatedData.height || validatedData.fitnessLevel || validatedData.goals) {
      updateData.profile = {
        weight: validatedData.weight,
        height: validatedData.height,
        experience: validatedData.fitnessLevel,
        goals: validatedData.goals?.join(', ') || ''
      };
      
      // Remove these from the top level
      delete updateData.weight;
      delete updateData.height;
      delete updateData.fitnessLevel;
      delete updateData.goals;
    }

    // Update the user document in Sanity
    const updatedUser = await client
      .patch(existingUser._id)
      .set(updateData)
      .commit();

    // Fetch the updated user data to return
    const updatedUserQuery = `*[_type == "user" && _id == $id][0] {
      _id,
      name,
      email,
      role,
      "avatar": avatar.asset->url,
      profile,
      coachId,
      createdAt,
      updatedAt
    }`;

    const updatedUserData = await client.fetch(updatedUserQuery, { id: existingUser._id });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUserData
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    
    // Handle Sanity-specific errors
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Data validation failed', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}