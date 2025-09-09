import { defineType } from "sanity";

export const notification = defineType({
  name: "notification",
  title: "Notification",
  type: "document",
  fields: [
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "New Workout Plan", value: "new_workout_plan" },
          { title: "Workout Completed", value: "workout_completed" },
          { title: "Coach Feedback", value: "coach_feedback" },
          { title: "Workout Reminder", value: "workout_reminder" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    },
    {
      name: "message",
      title: "Message",
      type: "text",
      validation: (Rule) => Rule.required().max(500),
    },
    {
      name: "recipient",
      title: "Recipient",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "sender",
      title: "Sender",
      type: "reference",
      to: [{ type: "user" }],
    },
    {
      name: "relatedWorkout",
      title: "Related Workout",
      type: "reference",
      to: [{ type: "workout" }],
    },
    {
      name: "relatedSession",
      title: "Related Session",
      type: "reference",
      to: [{ type: "workoutSession" }],
    },
    {
      name: "read",
      title: "Read",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
  orderings: [
    {
      title: "Created At, New",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
});