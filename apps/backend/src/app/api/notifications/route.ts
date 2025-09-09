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
const notificationQuerySchema = z.object({
  unreadOnly: z.string().optional().transform(val => val === 'true'),
  limit: z.string().optional().transform(val => {
    const num = parseInt(val || '20');
    return Math.min(Math.max(num, 1), 100); // Limit between 1-100
  }),
  offset: z.string().optional().transform(val => {
    const num = parseInt(val || '0');
    return Math.max(num, 0); // Minimum 0
  }),
  type: z.string().optional(),
  category: z.string().optional(),
});

/**
 * GET /api/notifications
 * Retrieves notifications for the authenticated user
 * Query parameters: unreadOnly, limit, offset, type, category
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

    // Get current user
    const userQuery = `*[_type == "user" && email == $email][0] { _id, role, name }`;
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
      unreadOnly: searchParams.get('unreadOnly') || undefined,
      limit: searchParams.get('limit') || '20',
      offset: searchParams.get('offset') || '0',
      type: searchParams.get('type') || undefined,
      category: searchParams.get('category') || undefined,
    };

    const validationResult = notificationQuerySchema.safeParse(queryParams);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { unreadOnly, limit, offset, type, category } = validationResult.data;

    // Build the query conditions
    let conditions = [`_type == "notification"`, `userId._ref == $userId`];
    
    if (unreadOnly) {
      conditions.push('read == false');
    }
    
    if (type) {
      conditions.push('type == $type');
    }
    
    if (category) {
      conditions.push('metadata.category == $category');
    }

    // Build the complete query
    const whereClause = conditions.join(' && ');
    const notificationsQuery = `*[${whereClause}] | order(createdAt desc) [$offset...$limit] {
      _id,
      type,
      title,
      message,
      read,
      actionUrl,
      metadata,
      createdAt,
      readAt,
      expiresAt
    }`;

    // Also get the total count for pagination
    const countQuery = `count(*[${whereClause}])`;

    // Execute both queries
    const [notifications, totalCount] = await Promise.all([
      client.fetch(notificationsQuery, {
        userId: currentUser._id,
        type,
        category,
        limit: offset + limit,
        offset
      }),
      client.fetch(countQuery, {
        userId: currentUser._id,
        type,
        category
      })
    ]);

    // Get unread count if not filtering by unread only
    let unreadCount = 0;
    if (!unreadOnly) {
      const unreadCountQuery = `count(*[_type == "notification" && userId._ref == $userId && read == false])`;
      unreadCount = await client.fetch(unreadCountQuery, { userId: currentUser._id });
    }

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        limit,
        offset,
        total: totalCount,
        hasMore: offset + limit < totalCount
      },
      meta: {
        unreadCount: unreadOnly ? notifications.length : unreadCount,
        filters: {
          unreadOnly,
          type,
          category
        }
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Creates a new notification (admin/system use)
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

    // Get current user and check permissions
    const userQuery = `*[_type == "user" && email == $email][0] { _id, role }`;
    const currentUser = await client.fetch(userQuery, { email: session.user.email });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only allow admins or coaches to create notifications via API
    if (currentUser.role !== 'admin' && currentUser.role !== 'coach') {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    
    const notificationSchema = z.object({
      userId: z.string().min(1, 'User ID is required'),
      type: z.enum(['new_feedback', 'plan_assigned', 'session_updated', 'workout_reminder', 'coach_message', 'system_update']),
      title: z.string().min(1).max(100, 'Title must be between 1-100 characters'),
      message: z.string().min(1).max(500, 'Message must be between 1-500 characters'),
      actionUrl: z.string().optional(),
      metadata: z.object({
        feedbackId: z.string().optional(),
        workoutLogId: z.string().optional(),
        trainingPlanId: z.string().optional(),
        sessionId: z.string().optional(),
        authorId: z.string().optional(),
        priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
        category: z.enum(['training', 'communication', 'system', 'reminder']).optional(),
      }).optional(),
      expiresAt: z.string().datetime().optional(),
    });
    
    const validationResult = notificationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { userId, type, title, message, actionUrl, metadata, expiresAt } = validationResult.data;

    // Verify target user exists
    const targetUser = await client.fetch(
      `*[_type == "user" && _id == $userId][0] { _id }`,
      { userId }
    );
    
    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user not found' },
        { status: 400 }
      );
    }

    // Create the notification
    const notificationData = {
      _type: 'notification',
      userId: {
        _type: 'reference',
        _ref: userId
      },
      type,
      title,
      message,
      read: false,
      ...(actionUrl && { actionUrl }),
      metadata: {
        ...metadata,
        authorId: currentUser._id, // Set the creator as author
        priority: metadata?.priority || 'medium',
        category: metadata?.category || 'system'
      },
      createdAt: new Date().toISOString(),
      ...(expiresAt && { expiresAt })
    };

    const createdNotification = await client.create(notificationData);

    return NextResponse.json({
      success: true,
      data: createdNotification
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating notification:', error);
    
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
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}