export default {
  name: "workoutLog",
  title: "Workout Log",
  type: "document",
  fields: [
    {
      name: "sessionId",
      title: "Training Session",
      type: "reference",
      to: [{ type: "trainingSession" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "runnerId",
      title: "Runner",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Completed", value: "completed" },
          { title: "Did Not Finish (DNF)", value: "dnf" },
          { title: "Undone", value: "undone" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "externalLink",
      title: "External Link (Garmin/Strava)",
      type: "url",
    },
    {
      name: "actualDistance",
      title: "Actual Distance (km)",
      type: "number",
    },
    {
      name: "actualDuration",
      title: "Actual Duration",
      type: "string",
    },
    {
      name: "actualPace",
      title: "Actual Pace",
      type: "string",
    },
    {
      name: "notes",
      title: "Notes",
      type: "text",
    },
    {
      name: "feeling",
      title: "Feeling",
      type: "string",
      options: {
        list: [
          { title: "Excellent", value: "excellent" },
          { title: "Good", value: "good" },
          { title: "Okay", value: "okay" },
          { title: "Tired", value: "tired" },
          { title: "Exhausted", value: "exhausted" },
        ],
      },
    },
    {
      name: "injuries",
      title: "Injuries",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "weather",
      title: "Weather",
      type: "string",
    },
    {
      name: "temperature",
      title: "Temperature (°C)",
      type: "number",
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