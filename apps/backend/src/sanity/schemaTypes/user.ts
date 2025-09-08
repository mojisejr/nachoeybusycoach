export default {
  name: "user",
  title: "User",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Runner", value: "runner" },
          { title: "Coach", value: "coach" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "avatar",
      title: "Avatar",
      type: "image",
    },
    {
      name: "profile",
      title: "Profile",
      type: "object",
      fields: [
        { name: "age", title: "Age", type: "number" },
        { name: "weight", title: "Weight (kg)", type: "number" },
        { name: "height", title: "Height (cm)", type: "number" },
        { name: "experience", title: "Running Experience", type: "string" },
        { name: "goals", title: "Goals", type: "text" },
      ],
    },
    {
      name: "coachId",
      title: "Coach",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule: any) =>
        Rule.custom((coachId: any, context: any) => {
          if (context.document?.role === "runner" && !coachId) {
            return "Runner must have a coach";
          }
          return true;
        }),
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