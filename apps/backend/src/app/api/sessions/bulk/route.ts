import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from '@sanity/client';

// Auth configuration
const authOptions = {
  providers: [
    // Add your providers here
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
        session.user.role = token.role || 'runner';
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role || 'runner';
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
};

// Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2023-05-03',
  useCdn: false,
});

// POST /api/sessions/bulk - Create multiple training sessions
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
    
    // Import the bulk create schema
    const { bulkCreateTrainingSessionSchema } = await import('@nachoeybusycoach/types');
    
    // Validate request body
    const validatedData = bulkCreateTrainingSessionSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validatedData.error.errors
        },
        { status: 400 }
      );
    }

    const { sessions } = validatedData.data;

    // Check authorization - only coaches can create sessions for runners
    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;
    
    if (userRole === 'runner') {
      // Runners can only create sessions for themselves
      const invalidSessions = sessions.filter((s: any) => s.runnerId !== userId);
      if (invalidSessions.length > 0) {
        return NextResponse.json(
          { error: 'Forbidden: Cannot create sessions for other runners' },
          { status: 403 }
        );
      }
    }

    // Prepare documents for Sanity
    const now = new Date().toISOString();
    const sanityDocs = sessions.map((sessionData: any) => ({
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
      _updatedAt: now,
    }));

    // Create documents in Sanity using individual creates for better error handling
    const results = [];
    for (const doc of sanityDocs) {
      const result = await client.create(doc);
      results.push(result);
    }

    // Transform response to match our schema
    const transformedResults = results.map((result: any) => ({
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
      updatedAt: result._updatedAt,
    }));

    return NextResponse.json(
      { 
        message: `${results.length} training sessions created successfully`,
        data: transformedResults,
        count: results.length
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating training sessions:', error);
    
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
      if (error.message.includes('transaction')) {
        return NextResponse.json(
          { error: 'Bulk operation failed - some sessions may not have been created' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}