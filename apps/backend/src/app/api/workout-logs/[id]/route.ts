import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { workoutLogUpdateSchema } from '@/lib/validations/workoutLog';
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

// PUT /api/workout-logs/[id] - Update an existing workout log
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if workout log exists
    const existingWorkoutLog = await client.fetch(
      '*[_type == "workoutLog" && _id == $id][0]',
      { id }
    );

    if (!existingWorkoutLog) {
      return NextResponse.json(
        { error: 'Workout log not found' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = workoutLogUpdateSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: 'Invalid workout log data',
          details: validatedData.error.errors
        },
        { status: 400 }
      );
    }

    const updateData = validatedData.data;

    // Update the workout log
    const updatedWorkoutLog = await client
      .patch(id)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString()
      })
      .commit();

    // Fetch the updated workout log with references
    const workoutLogWithRefs = await client.fetch(
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
      { id }
    );

    return NextResponse.json({
      message: 'Workout log updated successfully',
      data: workoutLogWithRefs
    });

  } catch (error) {
    console.error('Error updating workout log:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/workout-logs/[id] - Delete a workout log
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if workout log exists
    const existingWorkoutLog = await client.fetch(
      '*[_type == "workoutLog" && _id == $id][0]',
      { id }
    );

    if (!existingWorkoutLog) {
      return NextResponse.json(
        { error: 'Workout log not found' },
        { status: 404 }
      );
    }

    // Delete the workout log
    await client.delete(id);

    return NextResponse.json({
      message: 'Workout log deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting workout log:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/workout-logs/[id] - Get a specific workout log
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Fetch the workout log with references
    const workoutLog = await client.fetch(
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
      { id }
    );

    if (!workoutLog) {
      return NextResponse.json(
        { error: 'Workout log not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: workoutLog
    });

  } catch (error) {
    console.error('Error fetching workout log:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}