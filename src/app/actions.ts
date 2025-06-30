'use server';

import {
  generatePoemFromImage,
} from '@/ai/flows/generate-poem-from-image';

export async function handlePoemGeneration(photoDataUri: string) {
  try {
    const result = await generatePoemFromImage({ photoDataUri });
    return result;
  } catch (error) {
    console.error('Poem generation failed:', error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: 'An unknown error occurred while generating the poem.' };
  }
}
