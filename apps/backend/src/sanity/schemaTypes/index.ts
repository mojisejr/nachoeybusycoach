import { type SchemaTypeDefinition } from 'sanity'
import user from './user';
import trainingPlan from './trainingPlan';
import trainingSession from './trainingSession';
import workoutLog from './workoutLog';
import feedback from './feedback';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    user,
    trainingPlan,
    trainingSession,
    workoutLog,
    feedback,
  ],
}
