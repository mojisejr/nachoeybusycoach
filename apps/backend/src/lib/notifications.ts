import { client } from '@/sanity/lib/client';

/**
 * Notification types supported by the system
 */
export type NotificationType = 
  | 'new_feedback'
  | 'plan_assigned'
  | 'session_updated'
  | 'workout_reminder'
  | 'coach_message'
  | 'system_update';

/**
 * Notification priority levels
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Notification category
 */
export type NotificationCategory = 'training' | 'communication' | 'system' | 'reminder';

/**
 * Metadata structure for notifications
 */
export interface NotificationMetadata {
  feedbackId?: string;
  workoutLogId?: string;
  trainingPlanId?: string;
  sessionId?: string;
  authorId?: string;
  priority?: NotificationPriority;
  category?: NotificationCategory;
}

/**
 * Parameters for creating a notification
 */
export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: NotificationMetadata;
  expiresAt?: Date;
}

/**
 * Creates a new notification in the system
 * @param params - Notification creation parameters
 * @returns Promise resolving to the created notification
 */
export async function createNotification(params: CreateNotificationParams) {
  const {
    userId,
    type,
    title,
    message,
    actionUrl,
    metadata = {},
    expiresAt
  } = params;

  try {
    // Validate required parameters
    if (!userId || !type || !title || !message) {
      throw new Error('Missing required notification parameters');
    }

    // Determine default priority and category based on notification type
    const defaultMetadata = getDefaultMetadata(type);
    const finalMetadata = {
      ...defaultMetadata,
      ...metadata
    };

    // Create notification document
    const notificationData = {
      _type: 'notification',
      userId: {
        _type: 'reference',
        _ref: userId
      },
      type,
      title: title.substring(0, 100), // Ensure title length limit
      message: message.substring(0, 500), // Ensure message length limit
      read: false,
      ...(actionUrl && { actionUrl }),
      metadata: finalMetadata,
      createdAt: new Date().toISOString(),
      ...(expiresAt && { expiresAt: expiresAt.toISOString() })
    };

    const createdNotification = await client.create(notificationData);
    
    console.log(`Notification created for user ${userId}: ${title}`);
    
    return createdNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Creates a notification for new feedback
 * @param params - Feedback notification specific parameters
 */
export async function createFeedbackNotification({
  recipientId,
  authorId,
  authorName,
  feedbackContent,
  workoutLogId,
  feedbackId,
  isReply = false
}: {
  recipientId: string;
  authorId: string;
  authorName: string;
  feedbackContent: string;
  workoutLogId: string;
  feedbackId: string;
  isReply?: boolean;
}) {
  // Don't create notification if author is the same as recipient
  if (recipientId === authorId) {
    return null;
  }

  const title = isReply ? 'New Reply to Your Feedback' : 'New Feedback on Your Workout';
  const action = isReply ? 'replied to your feedback' : 'left feedback on your workout';
  const truncatedContent = feedbackContent.substring(0, 100);
  const message = `${authorName} ${action}: "${truncatedContent}${feedbackContent.length > 100 ? '...' : ''}"`;;

  return createNotification({
    userId: recipientId,
    type: 'new_feedback',
    title,
    message,
    actionUrl: `/workout-logs/${workoutLogId}#feedback-${feedbackId}`,
    metadata: {
      feedbackId,
      workoutLogId,
      authorId,
      priority: 'medium',
      category: 'communication'
    }
  });
}

/**
 * Creates a notification for plan assignment
 */
export async function createPlanAssignedNotification({
  runnerId,
  coachId,
  coachName,
  planId,
  planTitle
}: {
  runnerId: string;
  coachId: string;
  coachName: string;
  planId: string;
  planTitle: string;
}) {
  return createNotification({
    userId: runnerId,
    type: 'plan_assigned',
    title: 'New Training Plan Assigned',
    message: `${coachName} has assigned you a new training plan: "${planTitle}"`,
    actionUrl: `/training-plans/${planId}`,
    metadata: {
      trainingPlanId: planId,
      authorId: coachId,
      priority: 'high',
      category: 'training'
    }
  });
}

/**
 * Creates a notification for session updates
 */
export async function createSessionUpdatedNotification({
  runnerId,
  coachId,
  coachName,
  sessionId,
  sessionTitle
}: {
  runnerId: string;
  coachId: string;
  coachName: string;
  sessionId: string;
  sessionTitle: string;
}) {
  return createNotification({
    userId: runnerId,
    type: 'session_updated',
    title: 'Training Session Updated',
    message: `${coachName} has updated your training session: "${sessionTitle}"`,
    actionUrl: `/sessions/${sessionId}`,
    metadata: {
      sessionId,
      authorId: coachId,
      priority: 'medium',
      category: 'training'
    }
  });
}

/**
 * Marks a notification as read
 * @param notificationId - ID of the notification to mark as read
 * @param userId - ID of the user marking the notification as read (for security)
 */
export async function markNotificationAsRead(notificationId: string, userId: string) {
  try {
    // Verify the notification belongs to the user
    const notification = await client.fetch(
      `*[_type == "notification" && _id == $notificationId && userId._ref == $userId][0] { _id }`,
      { notificationId, userId }
    );

    if (!notification) {
      throw new Error('Notification not found or access denied');
    }

    // Update the notification
    const updatedNotification = await client
      .patch(notificationId)
      .set({
        read: true,
        readAt: new Date().toISOString()
      })
      .commit();

    return updatedNotification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Gets unread notification count for a user
 * @param userId - ID of the user
 * @returns Promise resolving to the count of unread notifications
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  try {
    const count = await client.fetch(
      `count(*[_type == "notification" && userId._ref == $userId && read == false])`,
      { userId }
    );
    return count || 0;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    return 0;
  }
}

/**
 * Deletes expired notifications
 * @returns Promise resolving to the number of deleted notifications
 */
export async function cleanupExpiredNotifications(): Promise<number> {
  try {
    const now = new Date().toISOString();
    const expiredNotifications = await client.fetch(
      `*[_type == "notification" && defined(expiresAt) && expiresAt < $now] { _id }`,
      { now }
    );

    if (expiredNotifications.length === 0) {
      return 0;
    }

    // Delete expired notifications
    const deletePromises = expiredNotifications.map((notification: { _id: string }) =>
      client.delete(notification._id)
    );

    await Promise.all(deletePromises);
    
    console.log(`Cleaned up ${expiredNotifications.length} expired notifications`);
    return expiredNotifications.length;
  } catch (error) {
    console.error('Error cleaning up expired notifications:', error);
    return 0;
  }
}

/**
 * Gets default metadata based on notification type
 * @param type - Notification type
 * @returns Default metadata object
 */
function getDefaultMetadata(type: NotificationType): NotificationMetadata {
  const defaults: Record<NotificationType, NotificationMetadata> = {
    new_feedback: {
      priority: 'medium',
      category: 'communication'
    },
    plan_assigned: {
      priority: 'high',
      category: 'training'
    },
    session_updated: {
      priority: 'medium',
      category: 'training'
    },
    workout_reminder: {
      priority: 'low',
      category: 'reminder'
    },
    coach_message: {
      priority: 'medium',
      category: 'communication'
    },
    system_update: {
      priority: 'low',
      category: 'system'
    }
  };

  return defaults[type] || {
    priority: 'medium',
    category: 'system'
  };
}