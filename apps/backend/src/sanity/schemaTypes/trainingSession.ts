export default {
  name: "trainingSession",
  title: "Training Session",
  type: "document",
  fields: [
    {
      name: "planId",
      title: "Training Plan",
      type: "reference",
      to: [{ type: "trainingPlan" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "day",
      title: "Day of Week",
      type: "string",
      options: {
        list: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "type",
      title: "Session Type",
      type: "string",
      options: {
        list: [
          { title: "Easy Run", value: "easy" },
          { title: "Interval Training", value: "interval" },
          { title: "Tempo Run", value: "tempo" },
          { title: "Long Run", value: "long" },
          { title: "Recovery Run", value: "recovery" },
          { title: "Rest Day", value: "rest" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "distance",
      title: "Distance",
      type: "string",
    },
    {
      name: "duration",
      title: "Duration",
      type: "string",
    },
    {
      name: "pace",
      title: "Target Pace",
      type: "string",
    },
    {
      name: "notes",
      title: "Notes",
      type: "text",
    },
    {
      name: "order",
      title: "Order",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0),
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