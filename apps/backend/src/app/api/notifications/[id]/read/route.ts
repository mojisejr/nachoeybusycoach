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

/**
 * PATCH /api/notifications/[id]/read
 * Marks a notification as read for the authenticated user
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const notificationId = params.id;

    // Validate notification ID format
    if (!notificationId || typeof notificationId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid notification ID' },
        { status: 400 }
      );
    }

    // Verify the notification exists and belongs to the current user
    const notificationQuery = `*[_type == "notification" && _id == $notificationId && userId._ref == $userId][0] {
      _id,
      title,
      read,
      readAt,
      createdAt
    }`;
    
    const notification = await client.fetch(notificationQuery, {
      notificationId,
      userId: currentUser._id
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found or access denied' },
        { status: 404 }
      );
    }

    // Check if notification is already read
    if (notification.read) {
      return NextResponse.json({
        success: true,
        message: 'Notification was already marked as read',
        data: {
          _id: notification._id,
          read: true,
          readAt: notification.readAt
        }
      });
    }

    // Mark the notification as read
    const readAt = new Date().toISOString();
    
    const updatedNotification = await client
      .patch(notificationId)
      .set({
        read: true,
        readAt
      })
      .commit();

    // Get updated unread count for the user
    const unreadCountQuery = `count(*[_type == "notification" && userId._ref == $userId && read == false])`;
    const unreadCount = await client.fetch(unreadCountQuery, { userId: currentUser._id });

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read successfully',
      data: {
        _id: updatedNotification._id,
        read: true,
        readAt
      },
      meta: {
        unreadCount
      }
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    
    // Handle specific Sanity errors
    if (error && typeof error === 'object' && 'message' in error) {
      if ((error as any).message.includes('document not found')) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
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

/**
 * POST /api/notifications/[id]/read
 * Alternative endpoint for marking notification as read (for compatibility)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Delegate to PATCH handler
  return PATCH(request, { params });
}

/**
 * DELETE /api/notifications/[id]/read
 * Marks a notification as unread (opposite of read)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const notificationId = params.id;

    // Validate notification ID format
    if (!notificationId || typeof notificationId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid notification ID' },
        { status: 400 }
      );
    }

    // Verify the notification exists and belongs to the current user
    const notificationQuery = `*[_type == "notification" && _id == $notificationId && userId._ref == $userId][0] {
      _id,
      title,
      read,
      readAt,
      createdAt
    }`;
    
    const notification = await client.fetch(notificationQuery, {
      notificationId,
      userId: currentUser._id
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found or access denied' },
        { status: 404 }
      );
    }

    // Check if notification is already unread
    if (!notification.read) {
      return NextResponse.json({
        success: true,
        message: 'Notification was already marked as unread',
        data: {
          _id: notification._id,
          read: false,
          readAt: null
        }
      });
    }

    // Mark the notification as unread
    const updatedNotification = await client
      .patch(notificationId)
      .set({
        read: false
      })
      .unset(['readAt'])
      .commit();

    // Get updated unread count for the user
    const unreadCountQuery = `count(*[_type == "notification" && userId._ref == $userId && read == false])`;
    const unreadCount = await client.fetch(unreadCountQuery, { userId: currentUser._id });

    return NextResponse.json({
      success: true,
      message: 'Notification marked as unread successfully',
      data: {
        _id: updatedNotification._id,
        read: false,
        readAt: null
      },
      meta: {
        unreadCount
      }
    });

  } catch (error) {
    console.error('Error marking notification as unread:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}