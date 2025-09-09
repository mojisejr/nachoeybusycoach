import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/sanity/lib/client';
import { z } from 'zod';
import { authOptions } from '../../../lib/auth';
import { createNotification, NotificationType } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Max 50 per page
    const type = searchParams.get('type') as NotificationType | null;
    const unreadOnly = searchParams.get('unread') === 'true';
    const offset = (page - 1) * limit;

    // Build query filters
    let filters = [`recipient._ref == "${session.user.id}"`];
    
    if (type) {
      filters.push(`type == "${type}"`);
    }
    
    if (unreadOnly) {
      filters.push('!read');
    }

    const filterQuery = filters.join(' && ');

    // Get notifications with pagination
    const notificationsQuery = `
      *[_type == "notification" && ${filterQuery}] | order(createdAt desc) [${offset}...${offset + limit}] {
        _id,
        type,
        title,
        message,
        read,
        createdAt,
        metadata,
        priority,
        category,
        recipient->{
          _id,
          name,
          email
        }
      }
    `;

    // Get total count for pagination
    const countQuery = `count(*[_type == "notification" && ${filterQuery}])`;

    const [notifications, totalCount] = await Promise.all([
      client.fetch(notificationsQuery),
      client.fetch(countQuery)
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage
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

// POST endpoint for creating notifications (admin/system use)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow coaches or system to create notifications
    // You might want to add role-based authorization here
    const user = await client.fetch(
      `*[_type == "user" && _id == "${session.user.id}"][0]{
        _id,
        role
      }`
    );

    if (!user || user.role !== 'coach') {
      return NextResponse.json(
        { error: 'Forbidden - Only coaches can create notifications' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, title, message, recipientId, metadata, priority, category } = body;

    // Validate required fields
    if (!type || !title || !message || !recipientId) {
      return NextResponse.json(
        { error: 'Missing required fields: type, title, message, recipientId' },
        { status: 400 }
      );
    }

    // Create notification document
    const notification = await client.create({
      _type: 'notification',
      type,
      title,
      message,
      recipient: {
        _type: 'reference',
        _ref: recipientId
      },
      read: false,
      createdAt: new Date().toISOString(),
      metadata: metadata || {},
      priority: priority || 'medium',
      category: category || 'general'
    });

    return NextResponse.json({
      success: true,
      notification
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}