import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { workoutLogSchema, workoutLogQuerySchema } from '@/lib/validations/workoutLog';
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

// GET /api/workout-logs - Retrieve workout logs with filtering and pagination
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
    
    const validatedQuery = workoutLogQuerySchema.safeParse(queryParams);
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
      sessionId,
      runnerId,
      status,
      feeling,
      weather,
      dateFrom,
      dateTo,
      limit = 20,
      offset = 0
    } = validatedQuery.data;

    // Build GROQ query
    let groqQuery = '*[_type == "workoutLog"';
    const queryParams_groq: any[] = [];

    // Add filters
    if (sessionId) {
      groqQuery += ' && sessionId == $sessionId';
      queryParams_groq.push({ sessionId });
    }

    if (runnerId) {
      groqQuery += ' && runnerId == $runnerId';
      queryParams_groq.push({ runnerId });
    }

    if (status) {
      groqQuery += ' && status == $status';
      queryParams_groq.push({ status });
    }

    if (feeling) {
      groqQuery += ' && feeling == $feeling';
      queryParams_groq.push({ feeling });
    }

    if (weather) {
      groqQuery += ' && weather == $weather';
      queryParams_groq.push({ weather });
    }

    if (dateFrom) {
      groqQuery += ' && _createdAt >= $dateFrom';
      queryParams_groq.push({ dateFrom });
    }

    if (dateTo) {
      groqQuery += ' && _createdAt <= $dateTo';
      queryParams_groq.push({ dateTo });
    }

    // Close filter and add ordering, pagination
    groqQuery += '] | order(_createdAt desc)';
    groqQuery += `[${offset}...${offset + limit}]`;

    // Add field selection with references
    groqQuery += `{
      _id,
      _createdAt,
      _updatedAt,
      sessionId,
      runnerId,
      status,
      externalLink,
      actualDistance,
      actualDuration,
      notes,
      feeling,
      injuries,
      weather,
      temperature,
      "session": *[_type == "trainingSession" && _id == ^.sessionId][0]{
        _id,
        title,
        plannedDistance,
        plannedDuration
      },
      "runner": *[_type == "user" && _id == ^.runnerId][0]{
        _id,
        name,
        email
      }
    }`;

    // Execute query
    const workoutLogs = await client.fetch(groqQuery, Object.assign({}, ...queryParams_groq));

    return NextResponse.json({
      data: workoutLogs,
      pagination: {
        limit,
        offset,
        total: workoutLogs.length
      }
    });

  } catch (error) {
    console.error('Error fetching workout logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/workout-logs - Create a new workout log
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = workoutLogSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: 'Invalid workout log data',
          details: validatedData.error.errors
        },
        { status: 400 }
      );
    }

    const workoutLogData = validatedData.data;

    // Check if workout log already exists for this session and runner
    const existingLog = await client.fetch(
      '*[_type == "workoutLog" && sessionId == $sessionId && runnerId == $runnerId][0]',
      {
        sessionId: workoutLogData.sessionId,
        runnerId: workoutLogData.runnerId
      }
    );

    if (existingLog) {
      return NextResponse.json(
        { error: 'Workout log already exists for this session and runner' },
        { status: 409 }
      );
    }

    // Verify that the session exists
    const sessionExists = await client.fetch(
      '*[_type == "trainingSession" && _id == $sessionId][0]',
      { sessionId: workoutLogData.sessionId }
    );

    if (!sessionExists) {
      return NextResponse.json(
        { error: 'Training session not found' },
        { status: 404 }
      );
    }

    // Verify that the runner exists
    const runnerExists = await client.fetch(
      '*[_type == "user" && _id == $runnerId][0]',
      { runnerId: workoutLogData.runnerId }
    );

    if (!runnerExists) {
      return NextResponse.json(
        { error: 'Runner not found' },
        { status: 404 }
      );
    }

    // Create the workout log
    const newWorkoutLog = await client.create({
      _type: 'workoutLog',
      ...workoutLogData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Fetch the created workout log with references
    const createdWorkoutLog = await client.fetch(
      `*[_type == "workoutLog" && _id == $id][0]{
        _id,
        _createdAt,
        _updatedAt,
        sessionId,
        runnerId,
        status,
        externalLink,
        actualDistance,
        actualDuration,
        notes,
        feeling,
        injuries,
        weather,
        temperature,
        "session": *[_type == "trainingSession" && _id == ^.sessionId][0]{
          _id,
          title,
          plannedDistance,
          plannedDuration
        },
        "runner": *[_type == "user" && _id == ^.runnerId][0]{
          _id,
          name,
          email
        }
      }`,
      { id: newWorkoutLog._id }
    );

    return NextResponse.json(
      {
        message: 'Workout log created successfully',
        data: createdWorkoutLog
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating workout log:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}