import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { trainingSessionQuerySchema } from 'types';
import { client } from '@/sanity/lib/client';

// Import auth configuration
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }: any) => {
      if (session?.user) {
        (session.user as any).role = token.role || "runner";
        (session.user as any).id = token.sub;
      }
      return session;
    },
    jwt: async ({ user, token }: any) => {
      if (user) {
        token.role = "runner";
      }
      return token;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
};

// GET /api/sessions - Retrieve training sessions with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    const validatedQuery = trainingSessionQuerySchema.safeParse(queryParams);
    if (!validatedQuery.success) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters',
          details: validatedQuery.error.errors
        },
        { status: 400 }
      );
    }

    const {
      runnerId,
      coachId,
      status,
      type,
      startDate,
      endDate,
      page,
      limit
    } = validatedQuery.data;

    // Build GROQ query
    let groqQuery = `*[_type == "trainingSession"`;
    const queryConditions: string[] = [];

    // Add filters based on user role and permissions
    if (runnerId) {
      queryConditions.push(`runnerId == "${runnerId}"`);
    }
    if (coachId) {
      queryConditions.push(`coachId == "${coachId}"`);
    }
    if (status) {
      queryConditions.push(`status == "${status}"`);
    }
    if (type) {
      queryConditions.push(`type == "${type}"`);
    }
    if (startDate) {
      queryConditions.push(`scheduledDate >= "${startDate}"`);
    }
    if (endDate) {
      queryConditions.push(`scheduledDate <= "${endDate}"`);
    }

    // Add conditions to query
    if (queryConditions.length > 0) {
      groqQuery += ` && (${queryConditions.join(' && ')})`;
    }

    // Add sorting and pagination
    groqQuery += `] | order(scheduledDate desc)`;
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    groqQuery += `[${offset}...${offset + limit}]`;

    // Add field selection
    groqQuery += `{
      _id,
      title,
      description,
      type,
      intensity,
      status,
      scheduledDate,
      duration,
      distance,
      targetPace,
      actualPace,
      heartRate,
      stravaLink,
      garminLink,
      runnerNotes,
      coachNotes,
      coachFeedback,
      injuryNotes,
      wellnessRating,
      runnerId,
      coachId,
      _createdAt,
      _updatedAt,
      completedAt,
      reviewedAt
    }`;

    // Execute query
    const sessions = await client.fetch(groqQuery);

    // Get total count for pagination
    let countQuery = `count(*[_type == "trainingSession"`;
    if (queryConditions.length > 0) {
      countQuery += ` && (${queryConditions.join(' && ')})`;
    }
    countQuery += `])`;
    
    const totalCount = await client.fetch(countQuery);
    const totalPages = Math.ceil(totalCount / limit);

    // Transform data to match our schema
    const transformedSessions = sessions.map((session: any) => ({
      id: session._id,
      title: session.title,
      description: session.description,
      type: session.type,
      intensity: session.intensity,
      status: session.status,
      scheduledDate: session.scheduledDate,
      duration: session.duration,
      distance: session.distance,
      targetPace: session.targetPace,
      actualPace: session.actualPace,
      heartRate: session.heartRate,
      stravaLink: session.stravaLink,
      garminLink: session.garminLink,
      runnerNotes: session.runnerNotes,
      coachNotes: session.coachNotes,
      coachFeedback: session.coachFeedback,
      injuryNotes: session.injuryNotes,
      wellnessRating: session.wellnessRating,
      runnerId: session.runnerId,
      coachId: session.coachId,
      createdAt: session._createdAt,
      updatedAt: session._updatedAt,
      completedAt: session.completedAt,
      reviewedAt: session.reviewedAt
    }));

    return NextResponse.json({
      data: transformedSessions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching training sessions:', error);
    
    // Handle specific Sanity errors
    if (error instanceof Error) {
      if (error.message.includes('unauthorized')) {
        return NextResponse.json(
          { error: 'Database access unauthorized' },
          { status: 401 }
        );
      }
      if (error.message.includes('network')) {
        return NextResponse.json(
          { error: 'Database connection failed' },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Create a new training session
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Import the create schema
    const { createTrainingSessionSchema } = await import('types');
    
    // Validate request body
    const validatedData = createTrainingSessionSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validatedData.error.errors
        },
        { status: 400 }
      );
    }

    const sessionData = validatedData.data;

    // Check authorization - only coaches can create sessions for runners
    // or runners can create sessions for themselves
    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;
    
    if (userRole === 'runner' && sessionData.runnerId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: Cannot create sessions for other runners' },
        { status: 403 }
      );
    }

    // Prepare document for Sanity
    const now = new Date().toISOString();
    const sanityDoc = {
      _type: 'trainingSession',
      title: sessionData.title,
      description: sessionData.description,
      type: sessionData.type,
      intensity: sessionData.intensity,
      status: sessionData.status || 'scheduled',
      scheduledDate: sessionData.scheduledDate,
      duration: sessionData.duration,
      distance: sessionData.distance,
      targetPace: sessionData.targetPace,
      actualPace: sessionData.actualPace,
      heartRate: sessionData.heartRate,
      stravaLink: sessionData.stravaLink,
      garminLink: sessionData.garminLink,
      runnerNotes: sessionData.runnerNotes,
      coachNotes: sessionData.coachNotes,
      coachFeedback: sessionData.coachFeedback,
      injuryNotes: sessionData.injuryNotes,
      wellnessRating: sessionData.wellnessRating,
      runnerId: sessionData.runnerId,
       coachId: sessionData.coachId,
       _createdAt: now,
       _updatedAt: now
    };

    // Create document in Sanity
    const result = await client.create(sanityDoc);

    // Transform response to match our schema
    const transformedResult = {
      id: result._id,
      title: result.title,
      description: result.description,
      type: result.type,
      intensity: result.intensity,
      status: result.status,
      scheduledDate: result.scheduledDate,
      duration: result.duration,
      distance: result.distance,
      targetPace: result.targetPace,
      actualPace: result.actualPace,
      heartRate: result.heartRate,
      stravaLink: result.stravaLink,
      garminLink: result.garminLink,
      runnerNotes: result.runnerNotes,
      coachNotes: result.coachNotes,
      coachFeedback: result.coachFeedback,
      injuryNotes: result.injuryNotes,
      wellnessRating: result.wellnessRating,
      runnerId: result.runnerId,
       coachId: result.coachId,
       createdAt: result._createdAt,
       updatedAt: result._updatedAt
    };

    return NextResponse.json(
      { 
        message: 'Training session created successfully',
        data: transformedResult
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating training session:', error);
    
    // Handle specific Sanity errors
    if (error instanceof Error) {
      if (error.message.includes('unauthorized')) {
        return NextResponse.json(
          { error: 'Database access unauthorized' },
          { status: 401 }
        );
      }
      if (error.message.includes('network')) {
        return NextResponse.json(
          { error: 'Database connection failed' },
          { status: 503 }
        );
      }
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { error: 'Data validation failed', details: error.message },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}