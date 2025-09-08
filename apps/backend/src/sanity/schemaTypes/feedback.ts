export default {
  name: "feedback",
  title: "Feedback",
  type: "document",
  fields: [
    {
      name: "workoutLogId",
      title: "Workout Log",
      type: "reference",
      to: [{ type: "workoutLog" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "authorId",
      title: "Author",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "content",
      title: "Content",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Praise", value: "praise" },
          { title: "Suggestion", value: "suggestion" },
          { title: "Concern", value: "concern" },
          { title: "Question", value: "question" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "attachments",
      title: "Attachments",
      type: "array",
      of: [{ type: "image" }, { type: "file" }],
    },
    {
      name: "parentId",
      title: "Parent Feedback (for replies)",
      type: "reference",
      to: [{ type: "feedback" }],
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
};