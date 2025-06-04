import { z } from 'zod';

export const FormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  publicRepo: z.string().min(1, 'Public repo is required'),
  feature: z.string().min(1, 'Feature is required'),
});

export const FilesSchema = z.object({ files: z.array(z.string()) });

export const EstimationSchema = z.object({
  hours: z.number().describe('Estimated hours to implement the feature'),
  cost: z.number().describe('Estimated cost in euros (€20/hour)'),
  explanation: z.string().describe('Explanation of the estimation'),
});
