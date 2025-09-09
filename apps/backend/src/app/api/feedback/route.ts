import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/sanity/lib/client';
import { z } from 'zod';

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

// Validation schemas
const feedbackSchema = z.object({
  workoutLogId: z.string().min(1, 'Workout log ID is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['praise', 'suggestion', 'concern', 'question']),
  parentId: z.string().optional(),
});

const feedbackQuerySchema = z.object({
  workoutLogId: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

/**
 * GET /api/feedback
 * Retrieves feedback for a specific workout log
 * Query parameters: workoutLogId (required), limit, offset
 */
export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session found' },
        { status: 401 }
      );
    }

    // Get current user to check permissions
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
      workoutLogId: searchParams.get('workoutLogId') || undefined,
      limit: searchParams.get('limit') || '20',
      offset: searchParams.get('offset') || '0',
    };

    const validationResult = feedbackQuerySchema.safeParse(queryParams);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { workoutLogId, limit, offset } = validationResult.data;

    if (!workoutLogId) {
      return NextResponse.json(
        { error: 'workoutLogId parameter is required' },
        { status: 400 }
      );
    }

    // Verify access to the workout log
    const workoutLogQuery = `*[_type == "workoutLog" && _id == $workoutLogId][0] {
      _id,
      runnerId,
      "session": sessionId-> {
        "plan": planId-> {
          coachId
        }
      }
    }`;
    
    const workoutLog = await client.fetch(workoutLogQuery, { workoutLogId });

    if (!workoutLog) {
      return NextResponse.json(
        { error: 'Workout log not found' },
        { status: 404 }
      );
    }

    // Check access permissions
    const hasAccess = 
      currentUser._id === workoutLog.runnerId || // Runner owns the workout log
      currentUser._id === workoutLog.session?.plan?.coachId || // Coach owns the training plan
      currentUser.role === 'admin'; // Admin access

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have access to this workout log feedback' },
        { status: 403 }
      );
    }

    // Fetch feedback with author and parent details
    const feedbackQuery = `*[_type == "feedback" && workoutLogId._ref == $workoutLogId] | order(createdAt desc) [$offset...$limit] {
      _id,
      content,
      type,
      createdAt,
      updatedAt,
      "author": authorId-> {
        _id,
        name,
        email,
        role
      },
      "parent": parentId-> {
        _id,
        content,
        "author": authorId-> {
          _id,
          name,
          role
        }
      },
      "replies": *[_type == "feedback" && parentId._ref == ^._id] | order(createdAt asc) {
        _id,
        content,
        type,
        createdAt,
        "author": authorId-> {
          _id,
          name,
          email,
          role
        }
      }
    }`;

    const limitNum = parseInt(limit || '20');
    const offsetNum = parseInt(offset || '0');

    const feedback = await client.fetch(feedbackQuery, {
      workoutLogId,
      limit: offsetNum + limitNum,
      offset: offsetNum
    });

    return NextResponse.json({
      success: true,
      data: feedback,
      pagination: {
        limit: limitNum,
        offset: offsetNum,
        total: feedback.length
      }
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/feedback
 * Creates new feedback for a workout log
 */
export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session found' },
        { status: 401 }
      );
    }

    // Get current user
    const userQuery = `*[_type == "user" && email == $email][0] { _id, role, name }`;
    const currentUser = await client.fetch(userQuery, { email: session.user.email });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    
    const validationResult = feedbackSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { workoutLogId, content, type, parentId } = validationResult.data;

    // Verify access to the workout log
    const workoutLogQuery = `*[_type == "workoutLog" && _id == $workoutLogId][0] {
      _id,
      runnerId,
      "session": sessionId-> {
        "plan": planId-> {
          coachId,
          runnerId
        }
      }
    }`;
    
    const workoutLog = await client.fetch(workoutLogQuery, { workoutLogId });

    if (!workoutLog) {
      return NextResponse.json(
        { error: 'Workout log not found' },
        { status: 404 }
      );
    }

    // Check access permissions
    const hasAccess = 
      currentUser._id === workoutLog.runnerId || // Runner owns the workout log
      currentUser._id === workoutLog.session?.plan?.coachId || // Coach owns the training plan
      currentUser.role === 'admin'; // Admin access

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have access to provide feedback on this workout log' },
        { status: 403 }
      );
    }

    // If parentId is provided, verify it exists
    if (parentId) {
      const parentFeedback = await client.fetch(
        `*[_type == "feedback" && _id == $parentId][0] { _id }`,
        { parentId }
      );
      
      if (!parentFeedback) {
        return NextResponse.json(
          { error: 'Parent feedback not found' },
          { status: 400 }
        );
      }
    }

    // Create the feedback
    const feedbackData = {
      _type: 'feedback',
      workoutLogId: {
        _type: 'reference',
        _ref: workoutLogId
      },
      authorId: {
        _type: 'reference',
        _ref: currentUser._id
      },
      content,
      type,
      ...(parentId && {
        parentId: {
          _type: 'reference',
          _ref: parentId
        }
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const createdFeedback = await client.create(feedbackData);

    // Create notification for the recipient
    // If it's a reply, notify the parent feedback author
    // If it's new feedback, notify the runner (if coach is commenting) or coach (if runner is commenting)
    let recipientId = null;
    
    if (parentId) {
      // Get parent feedback author
      const parentAuthor = await client.fetch(
        `*[_type == "feedback" && _id == $parentId][0] { "authorId": authorId._ref }`,
        { parentId }
      );
      recipientId = parentAuthor?.authorId;
    } else {
      // New feedback - notify the other party
      if (currentUser._id === workoutLog.runnerId) {
        // Runner is commenting, notify coach
        recipientId = workoutLog.session?.plan?.coachId;
      } else {
        // Coach is commenting, notify runner
        recipientId = workoutLog.runnerId;
      }
    }

    // Create notification if we have a recipient
    if (recipientId && recipientId !== currentUser._id) {
      const notificationData = {
        _type: 'notification',
        userId: {
          _type: 'reference',
          _ref: recipientId
        },
        type: 'new_feedback',
        title: parentId ? 'New Reply to Your Feedback' : 'New Feedback on Your Workout',
        message: `${currentUser.name} ${parentId ? 'replied to your feedback' : 'left feedback on your workout'}: "${content.substring(0, 100)}${content.length > 100 ? '...' : ''}"`,
        read: false,
        actionUrl: `/workout-logs/${workoutLogId}#feedback-${createdFeedback._id}`,
        metadata: {
          feedbackId: createdFeedback._id,
          workoutLogId,
          authorId: currentUser._id
        },
        createdAt: new Date().toISOString()
      };

      await client.create(notificationData);
    }

    // Fetch the created feedback with author details
    const createdFeedbackQuery = `*[_type == "feedback" && _id == $id][0] {
      _id,
      content,
      type,
      createdAt,
      updatedAt,
      "author": authorId-> {
        _id,
        name,
        email,
        role
      },
      "parent": parentId-> {
        _id,
        content,
        "author": authorId-> {
          _id,
          name,
          role
        }
      }
    }`;

    const feedbackWithDetails = await client.fetch(createdFeedbackQuery, { id: createdFeedback._id });

    return NextResponse.json({
      success: true,
      data: feedbackWithDetails
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating feedback:', error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      );
    }
    
    // Handle Sanity errors
    if (error && typeof error === 'object' && 'message' in error) {
      if ((error as any).message.includes('reference')) {
        return NextResponse.json(
          { error: 'Invalid reference provided' },
          { status: 400 }
        );
      }
      if ((error as any).message.includes('network')) {
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