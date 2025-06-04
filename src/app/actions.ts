'use server';

import { FormSchema } from '@/lib/schemas';
import { getEstimation } from '@/services/github';
import { z } from 'zod';

export async function estimateAction(prevState: unknown, formData: FormData) {
  try {
    const parsed = FormSchema.parse(Object.fromEntries(formData.entries()));
    const estimation = await getEstimation(parsed);
    return { estimation };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw { success: false, errors: error.flatten() };
    }
    throw { success: false, error: 'Unexpected error' };
  }
}
