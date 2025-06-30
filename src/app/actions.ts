'use server';

import {
  generatePoemFromImage,
} from '@/ai/flows/generate-poem-from-image';

const SERVER_MAX_FILE_SIZE_MB = 10;
const SERVER_MAX_FILE_SIZE_BYTES = SERVER_MAX_FILE_SIZE_MB * 1024 * 1024;
const SERVER_ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function handlePoemGeneration(photoDataUri: string) {
  try {
    // Basic Data URI validation
    if (!photoDataUri.startsWith('data:image/')) {
      return { error: 'Invalid image data format. Please upload a valid image.' };
    }

    const parts = photoDataUri.split(';');
    if (parts.length < 2 || !parts[1].startsWith('base64,')) {
      return { error: 'Invalid image data encoding. Please use base64 encoding.'};
    }
    const mimeType = parts[0].substring(5); // "data:".length
    const base64Data = parts[1].substring(7); // "base64,".length

    if (!SERVER_ACCEPTED_IMAGE_TYPES.includes(mimeType)) {
      return { error: `Unsupported image type. Please use one of: ${SERVER_ACCEPTED_IMAGE_TYPES.map(t => t.split('/')[1]).join(', ')}.` };
    }

    // Estimate byte size from base64 string length
    // Base64 string length is roughly 4/3 times the original data size
    // Actual size = (Base64_Length * 3/4) - padding
    // We'll use a rough approximation for this server-side check.
    const estimatedDecodedSize = (base64Data.length * 3) / 4;
    if (estimatedDecodedSize > SERVER_MAX_FILE_SIZE_BYTES) {
      return { error: `Image is too large. Maximum size is ${SERVER_MAX_FILE_SIZE_MB}MB.` };
    }

    const result = await generatePoemFromImage({ photoDataUri });
    // Ensure result is not null and has a poem property, though the flow should throw if not.
    if (!result || typeof result.poem !== 'string') {
        console.error('Poem generation returned unexpected result structure:', result);
        return { error: 'The AI returned an unexpected result. Please try again.' };
    }
    return result;
  } catch (error) {
    console.error('Poem generation failed:', error);
    // Check if the error message is one we threw intentionally from the flow
    if (error instanceof Error) {
        if (error.message.startsWith('The AI failed to generate a poem')) {
            return { error: error.message };
        }
        // For other errors that might be more generic or internal
        return { error: 'An error occurred while generating the poem. Please check the server logs for details.' };
    }
    // Fallback for non-Error objects thrown
    return { error: 'An unknown error occurred while generating the poem. Please try again later.' };
  }
}
