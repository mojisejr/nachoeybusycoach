import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/lib/sanity';
import { trainingPlanSchema, trainingPlanQuerySchema } from '@/lib/validations/trainingPlan';

/**
 * GET /api/training-plans
 * Retrieves training plans with optional filtering
 * Query parameters: runnerId, status, weekStart, weekEnd, limit, offset
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

    // Get current user to check role and permissions
    const userQuery = `*[_type == "user" && email == $email][0] { _id, role, coachId }`;
    const currentUser = await client.fetch(userQuery, { email: session.user.email });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      runnerId: searchParams.get('runnerId') || undefined,
      status: searchParams.get('status') || undefined,
      weekStart: searchParams.get('weekStart') || undefined,
      weekEnd: searchParams.get('weekEnd') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined
    };

    const validationResult = trainingPlanQuerySchema.safeParse(queryParams);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const validatedParams = validationResult.data;

    // Build Sanity query based on user role and filters
    let sanityQuery = `*[_type == "trainingPlan"`;
    const queryFilters: string[] = [];
    const queryValues: Record<string, any> = {};

    // Role-based access control
    if (currentUser.role === 'runner') {
      // Runners can only see their own training plans
      queryFilters.push('runnerId == $currentUserId');
      queryValues.currentUserId = currentUser._id;
    } else if (currentUser.role === 'coach') {
      // Coaches can see plans for their runners
      if (validatedParams.runnerId) {
        queryFilters.push('runnerId == $runnerId');
        queryValues.runnerId = validatedParams.runnerId;
      }
      // Add coach verification query here if needed
    }

    // Add other filters
    if (validatedParams.status) {
      queryFilters.push('status == $status');
      queryValues.status = validatedParams.status;
    }

    if (validatedParams.weekStart) {
      queryFilters.push('weekStart >= $weekStart');
      queryValues.weekStart = validatedParams.weekStart;
    }

    if (validatedParams.weekEnd) {
      queryFilters.push('weekEnd <= $weekEnd');
      queryValues.weekEnd = validatedParams.weekEnd;
    }

    // Complete the query
    if (queryFilters.length > 0) {
      sanityQuery += ` && ${queryFilters.join(' && ')}`;
    }
    
    sanityQuery += `] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      description,
      runnerId,
      weekStart,
      weekEnd,
      status,
      "runner": *[_type == "user" && _id == ^.runnerId][0] {
        _id,
        name,
        email
      },
      "coach": *[_type == "user" && role == "coach" && references(^.runnerId)][0] {
        _id,
        name,
        email
      },
      "sessionsCount": count(*[_type == "trainingSession" && references(^._id)])
    } | order(weekStart desc)`;

    // Add pagination
    if (validatedParams.limit) {
      const offset = validatedParams.offset || 0;
      sanityQuery += `[${offset}...${offset + validatedParams.limit}]`;
    }

    const trainingPlans = await client.fetch(sanityQuery, queryValues);

    return NextResponse.json({
      success: true,
      data: trainingPlans,
      pagination: {
        limit: validatedParams.limit || null,
        offset: validatedParams.offset || 0,
        total: trainingPlans.length
      }
    });

  } catch (error) {
    console.error('Error fetching training plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/training-plans
 * Creates a new training plan (coach only)
 */
export async function POST(request: NextRequest) {
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
        { error: 'Forbidden - Only coaches can create training plans' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    
    const validationResult = trainingPlanSchema.safeParse(body);
    
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

    // Verify that the runner exists
    const runnerQuery = `*[_type == "user" && _id == $runnerId && role == "runner"][0] { _id }`;
    const runner = await client.fetch(runnerQuery, { runnerId: validatedData.runnerId });

    if (!runner) {
      return NextResponse.json(
        { error: 'Runner not found or invalid runner ID' },
        { status: 400 }
      );
    }

    // Check for overlapping training plans
    const overlapQuery = `*[_type == "trainingPlan" && runnerId == $runnerId && 
      ((weekStart <= $weekStart && weekEnd >= $weekStart) || 
       (weekStart <= $weekEnd && weekEnd >= $weekEnd) ||
       (weekStart >= $weekStart && weekEnd <= $weekEnd))] { _id }`;
    
    const overlappingPlans = await client.fetch(overlapQuery, {
      runnerId: validatedData.runnerId,
      weekStart: validatedData.weekStart,
      weekEnd: validatedData.weekEnd
    });

    if (overlappingPlans.length > 0) {
      return NextResponse.json(
        { error: 'Training plan overlaps with existing plan for this runner' },
        { status: 409 }
      );
    }

    // Create the training plan
    const trainingPlanData = {
      _type: 'trainingPlan',
      ...validatedData,
      coachId: currentUser._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const createdPlan = await client.create(trainingPlanData);

    // Fetch the created plan with related data
    const createdPlanQuery = `*[_type == "trainingPlan" && _id == $id][0] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      description,
      runnerId,
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

    const planWithRelations = await client.fetch(createdPlanQuery, { id: createdPlan._id });

    return NextResponse.json({
      success: true,
      message: 'Training plan created successfully',
      data: planWithRelations
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating training plan:', error);
    
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