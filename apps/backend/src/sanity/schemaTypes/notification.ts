import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'notification',
  title: 'Notification',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required().error('User ID is required'),
    }),
    defineField({
      name: 'type',
      title: 'Notification Type',
      type: 'string',
      options: {
        list: [
          { title: 'New Feedback', value: 'new_feedback' },
          { title: 'Plan Assigned', value: 'plan_assigned' },
          { title: 'Session Updated', value: 'session_updated' },
          { title: 'Workout Reminder', value: 'workout_reminder' },
          { title: 'Coach Message', value: 'coach_message' },
          { title: 'System Update', value: 'system_update' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required().error('Notification type is required'),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => 
        Rule.required()
          .min(1)
          .max(100)
          .error('Title is required and must be between 1-100 characters'),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      validation: (Rule) => 
        Rule.required()
          .min(1)
          .max(500)
          .error('Message is required and must be between 1-500 characters'),
    }),
    defineField({
      name: 'read',
      title: 'Read Status',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'actionUrl',
      title: 'Action URL',
      type: 'string',
      description: 'URL to navigate to when notification is clicked',
      validation: (Rule) => 
        Rule.custom((value) => {
          if (value && !value.startsWith('/')) {
            return 'Action URL must start with /';
          }
          return true;
        }),
    }),
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      description: 'Additional data related to the notification',
      fields: [
        defineField({
          name: 'feedbackId',
          title: 'Feedback ID',
          type: 'string',
          description: 'ID of related feedback (for feedback notifications)',
        }),
        defineField({
          name: 'workoutLogId',
          title: 'Workout Log ID',
          type: 'string',
          description: 'ID of related workout log',
        }),
        defineField({
          name: 'trainingPlanId',
          title: 'Training Plan ID',
          type: 'string',
          description: 'ID of related training plan',
        }),
        defineField({
          name: 'sessionId',
          title: 'Session ID',
          type: 'string',
          description: 'ID of related training session',
        }),
        defineField({
          name: 'authorId',
          title: 'Author ID',
          type: 'string',
          description: 'ID of the user who triggered the notification',
        }),
        defineField({
          name: 'priority',
          title: 'Priority',
          type: 'string',
          options: {
            list: [
              { title: 'Low', value: 'low' },
              { title: 'Medium', value: 'medium' },
              { title: 'High', value: 'high' },
              { title: 'Urgent', value: 'urgent' },
            ],
            layout: 'radio',
          },
          initialValue: 'medium',
        }),
        defineField({
          name: 'category',
          title: 'Category',
          type: 'string',
          options: {
            list: [
              { title: 'Training', value: 'training' },
              { title: 'Communication', value: 'communication' },
              { title: 'System', value: 'system' },
              { title: 'Reminder', value: 'reminder' },
            ],
            layout: 'dropdown',
          },
          initialValue: 'communication',
        }),
      ],
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'readAt',
      title: 'Read At',
      type: 'datetime',
      description: 'Timestamp when the notification was marked as read',
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      description: 'Optional expiration date for the notification',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'message',
      media: 'type',
      user: 'userId.name',
      read: 'read',
    },
    prepare(selection) {
      const { title, subtitle, user, read } = selection;
      return {
        title: `${read ? '✓' : '●'} ${title}`,
        subtitle: `To: ${user || 'Unknown User'} - ${subtitle?.substring(0, 60)}${subtitle?.length > 60 ? '...' : ''}`,
      };
    },
  },
  orderings: [
    {
      title: 'Created Date (Newest First)',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      title: 'Created Date (Oldest First)',
      name: 'createdAtAsc',
      by: [{ field: 'createdAt', direction: 'asc' }],
    },
    {
      title: 'Unread First',
      name: 'unreadFirst',
      by: [
        { field: 'read', direction: 'asc' },
        { field: 'createdAt', direction: 'desc' },
      ],
    },
  ],
});