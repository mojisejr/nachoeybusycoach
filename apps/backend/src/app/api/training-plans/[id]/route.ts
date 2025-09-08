import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/lib/sanity';
import { trainingPlanUpdateSchema } from '@/lib/validations/trainingPlan';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/training-plans/[id]
 * Retrieves a specific training plan by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session found' },
        { status: 401 }
      );
    }

    // Get current user to check role and permissions
    const userQuery = `*[_type == "user" && email == $email][0] { _id, role, coachId }`;
    const currentUser = await client.fetch(userQuery, { email: session.user.email });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch the training plan with related data
    const trainingPlanQuery = `*[_type == "trainingPlan" && _id == $id][0] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      description,
      runnerId,
      coachId,
      weekStart,
      weekEnd,
      status,
      "runner": *[_type == "user" && _id == ^.runnerId][0] {
        _id,
        name,
        email
      },
      "coach": *[_type == "user" && _id == ^.coachId][0] {
        _id,
        name,
        email
      },
      "sessions": *[_type == "trainingSession" && references(^._id)] {
        _id,
        title,
        description,
        date,
        type,
        duration,
        distance,
        intensity,
        status,
        notes
      }
    }`;

    const trainingPlan = await client.fetch(trainingPlanQuery, { id: params.id });

    if (!trainingPlan) {
      return NextResponse.json(
        { error: 'Training plan not found' },
        { status: 404 }
      );
    }

    // Check access permissions
    const hasAccess = 
      currentUser.role === 'coach' || // Coaches can see all plans
      (currentUser.role === 'runner' && trainingPlan.runnerId === currentUser._id); // Runners can only see their own

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have access to this training plan' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: trainingPlan
    });

  } catch (error) {
    console.error('Error fetching training plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/training-plans/[id]
 * Updates a specific training plan (coach only)
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session found' },
        { status: 401 }
      );
    }

    // Get current user to check role
    const userQuery = `*[_type == "user" && email == $email][0] { _id, role }`;
    const currentUser = await client.fetch(userQuery, { email: session.user.email });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is a coach
    if (currentUser.role !== 'coach') {
      return NextResponse.json(
        { error: 'Forbidden - Only coaches can update training plans' },
        { status: 403 }
      );
    }

    // Check if training plan exists and user has access
    const existingPlanQuery = `*[_type == "trainingPlan" && _id == $id][0] { _id, coachId, runnerId, weekStart, weekEnd }`;
    const existingPlan = await client.fetch(existingPlanQuery, { id: params.id });

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Training plan not found' },
        { status: 404 }
      );
    }

    // Verify coach ownership (optional - could allow any coach to edit)
    // if (existingPlan.coachId !== currentUser._id) {
    //   return NextResponse.json(
    //     { error: 'Forbidden - You can only update your own training plans' },
    //     { status: 403 }
    //   );
    // }

    // Parse and validate request body
    const body = await request.json();
    
    const validationResult = trainingPlanUpdateSchema.safeParse(body);
    
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

    // If updating week dates, check for overlaps with other plans
    if (validatedData.weekStart || validatedData.weekEnd) {
      const newWeekStart = validatedData.weekStart || existingPlan.weekStart;
      const newWeekEnd = validatedData.weekEnd || existingPlan.weekEnd;
      
      const overlapQuery = `*[_type == "trainingPlan" && _id != $currentId && runnerId == $runnerId && 
        ((weekStart <= $weekStart && weekEnd >= $weekStart) || 
         (weekStart <= $weekEnd && weekEnd >= $weekEnd) ||
         (weekStart >= $weekStart && weekEnd <= $weekEnd))] { _id }`;
      
      const overlappingPlans = await client.fetch(overlapQuery, {
        currentId: params.id,
        runnerId: existingPlan.runnerId,
        weekStart: newWeekStart,
        weekEnd: newWeekEnd
      });

      if (overlappingPlans.length > 0) {
        return NextResponse.json(
          { error: 'Updated training plan would overlap with existing plan for this runner' },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData = {
      ...validatedData,
      updatedAt: new Date().toISOString()
    };

    // Update the training plan
    const updatedPlan = await client
      .patch(params.id)
      .set(updateData)
      .commit();

    // Fetch the updated plan with related data
    const updatedPlanQuery = `*[_type == "trainingPlan" && _id == $id][0] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      description,
      runnerId,
      coachId,
      weekStart,
      weekEnd,
      status,
      "runner": *[_type == "user" && _id == ^.runnerId][0] {
        _id,
        name,
        email
      },
      "coach": *[_type == "user" && _id == ^.coachId][0] {
        _id,
        name,
        email
      }
    }`;

    const planWithRelations = await client.fetch(updatedPlanQuery, { id: params.id });

    return NextResponse.json({
      success: true,
      message: 'Training plan updated successfully',
      data: planWithRelations
    });

  } catch (error) {
    console.error('Error updating training plan:', error);
    
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

/**
 * DELETE /api/training-plans/[id]
 * Deletes a specific training plan (coach only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session found' },
        { status: 401 }
      );
    }

    // Get current user to check role
    const userQuery = `*[_type == "user" && email == $email][0] { _id, role }`;
    const currentUser = await client.fetch(userQuery, { email: session.user.email });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is a coach
    if (currentUser.role !== 'coach') {
      return NextResponse.json(
        { error: 'Forbidden - Only coaches can delete training plans' },
        { status: 403 }
      );
    }

    // Check if training plan exists and get related data
    const existingPlanQuery = `*[_type == "trainingPlan" && _id == $id][0] { 
      _id, 
      coachId, 
      title,
      "sessionsCount": count(*[_type == "trainingSession" && references(^._id)])
    }`;
    const existingPlan = await client.fetch(existingPlanQuery, { id: params.id });

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Training plan not found' },
        { status: 404 }
      );
    }

    // Verify coach ownership (optional - could allow any coach to delete)
    // if (existingPlan.coachId !== currentUser._id) {
    //   return NextResponse.json(
    //     { error: 'Forbidden - You can only delete your own training plans' },
    //     { status: 403 }
    //   );
    // }

    // Check if there are associated training sessions
    if (existingPlan.sessionsCount > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete training plan with associated training sessions',
          details: `This plan has ${existingPlan.sessionsCount} training sessions. Please delete them first.`
        },
        { status: 409 }
      );
    }

    // Delete the training plan
    await client.delete(params.id);

    return NextResponse.json({
      success: true,
      message: `Training plan "${existingPlan.title}" deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting training plan:', error);
    
    // Handle Sanity-specific errors
    if (error instanceof Error && error.message.includes('Document not found')) {
      return NextResponse.json(
        { error: 'Training plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}