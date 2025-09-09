import { client } from "./sanity";

export type NotificationType = 
  | "new_workout_plan"
  | "workout_completed"
  | "coach_feedback"
  | "workout_reminder";

export interface CreateNotificationParams {
  type: NotificationType;
  title: string;
  message: string;
  recipientId: string;
  senderId?: string;
  relatedWorkoutId?: string;
  relatedSessionId?: string;
}

/**
 * Creates a new notification in Sanity
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = {
      _type: "notification",
      type: params.type,
      title: params.title,
      message: params.message,
      recipient: {
        _type: "reference",
        _ref: params.recipientId,
      },
      ...(params.senderId && {
        sender: {
          _type: "reference",
          _ref: params.senderId,
        },
      }),
      ...(params.relatedWorkoutId && {
        relatedWorkout: {
          _type: "reference",
          _ref: params.relatedWorkoutId,
        },
      }),
      ...(params.relatedSessionId && {
        relatedSession: {
          _type: "reference",
          _ref: params.relatedSessionId,
        },
      }),
      read: false,
      createdAt: new Date().toISOString(),
    };

    const result = await client.create(notification);
    return result;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Failed to create notification");
  }
}

/**
 * Creates a notification when a new workout plan is assigned
 */
export async function createWorkoutPlanNotification(
  recipientId: string,
  coachId: string,
  workoutId: string,
  coachName: string
) {
  return createNotification({
    type: "new_workout_plan",
    title: "New Workout Plan Assigned",
    message: `${coachName} has assigned you a new workout plan. Check it out and start training!`,
    recipientId,
    senderId: coachId,
    relatedWorkoutId: workoutId,
  });
}

/**
 * Creates a notification when a workout is completed
 */
export async function createWorkoutCompletedNotification(
  coachId: string,
  runnerId: string,
  sessionId: string,
  runnerName: string
) {
  return createNotification({
    type: "workout_completed",
    title: "Workout Completed",
    message: `${runnerName} has completed their workout session. Review their performance and provide feedback.`,
    recipientId: coachId,
    senderId: runnerId,
    relatedSessionId: sessionId,
  });
}

/**
 * Creates a notification when coach provides feedback
 */
export async function createCoachFeedbackNotification(
  runnerId: string,
  coachId: string,
  sessionId: string,
  coachName: string
) {
  return createNotification({
    type: "coach_feedback",
    title: "New Feedback from Coach",
    message: `${coachName} has provided feedback on your workout session. Check it out to improve your training!`,
    recipientId: runnerId,
    senderId: coachId,
    relatedSessionId: sessionId,
  });
}

/**
 * Creates a workout reminder notification
 */
export async function createWorkoutReminderNotification(
  runnerId: string,
  workoutTitle: string,
  workoutId: string
) {
  return createNotification({
    type: "workout_reminder",
    title: "Workout Reminder",
    message: `Don't forget about your scheduled workout: ${workoutTitle}. Time to get moving!`,
    recipientId: runnerId,
    relatedWorkoutId: workoutId,
  });
}

/**
 * Marks a notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const result = await client
      .patch(notificationId)
      .set({ read: true })
      .commit();
    return result;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Failed to mark notification as read");
  }
}

/**
 * Gets notifications for a user with pagination
 */
export async function getUserNotifications(
  userId: string,
  page: number = 1,
  limit: number = 20,
  unreadOnly: boolean = false
) {
  try {
    const offset = (page - 1) * limit;
    
    const query = `
      *[_type == "notification" && recipient._ref == $userId ${unreadOnly ? '&& read == false' : ''}] 
      | order(createdAt desc) 
      [$offset...$end] {
        _id,
        type,
        title,
        message,
        read,
        createdAt,
        sender->{
          _id,
          name,
          email
        },
        relatedWorkout->{
          _id,
          title
        },
        relatedSession->{
          _id,
          status
        }
      }
    `;

    const params = {
      userId,
      offset,
      end: offset + limit,
    };

    const notifications = await client.fetch(query, params);
    
    // Get total count for pagination
    const countQuery = `count(*[_type == "notification" && recipient._ref == $userId ${unreadOnly ? '&& read == false' : ''}])`;
    const total = await client.fetch(countQuery, { userId });

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    throw new Error("Failed to fetch notifications");
  }
}

/**
 * Gets unread notification count for a user
 */
export async function getUnreadNotificationCount(userId: string) {
  try {
    const query = `count(*[_type == "notification" && recipient._ref == $userId && read == false])`;
    const count = await client.fetch(query, { userId });
    return count;
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    throw new Error("Failed to fetch unread notification count");
  }
}