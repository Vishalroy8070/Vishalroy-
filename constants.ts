import type { Effect } from './types';

export const PHOTO_EFFECTS: Effect[] = [
  {
    id: 'enhance-details',
    name: 'Enhance Details',
    prompt: 'Dramatically enhance the details, sharpness, and clarity of this image. Make it look like a high-resolution professional photograph without adding unnatural artifacts.',
  },
  {
    id: 'cinematic-look',
    name: 'Cinematic Look',
    prompt: 'Apply a cinematic color grade to this image. Deepen the shadows, add a subtle teal and orange look, and increase the contrast for a moody, movie-like feel.',
  },
  {
    id: 'vintage-vibe',
    name: 'Vintage Vibe',
    prompt: 'Give this photo a warm, vintage, retro look. Add a subtle film grain, slightly fade the blacks, and shift the colors towards a nostalgic, 1970s film-like palette.',
  },
  {
    id: 'vintage-fade',
    name: 'Vintage Fade',
    prompt: 'Give this photo a subtle, faded, retro look. Mute the colors, slightly crush the blacks, add a soft, fine grain, and give it a gentle warm tint to emulate the look of a well-loved, aged photograph from the past.',
  },
  {
    id: 'studio-lighting',
    name: 'Studio Lighting',
    prompt: 'Relight this image as if it were taken in a professional photo studio. Add a soft key light on the main subject, a gentle fill light to reduce harsh shadows, and a subtle rim light to create separation from the background.',
  },
  {
    id: 'remove-noise',
    name: 'Remove Noise & Upscale',
    prompt: 'Analyze this image for digital noise and compression artifacts. Remove them cleanly, then intelligently upscale the image to a higher resolution while preserving and enhancing natural details.',
  },
  {
    id: 'vibrant-colors',
    name: 'Vibrant Colors',
    prompt: 'Boost the vibrancy and saturation of the colors in this image to make them pop. Enhance the blues, greens, and reds to create a lively and energetic feel, without making skin tones look unnatural.',
  },
  {
    id: 'upscale-4k',
    name: 'Upscale to 4K',
    prompt: 'Intelligently upscale this image to 4K resolution (3840x2160), enhancing details, removing compression artifacts, and ensuring the result is sharp and clear without looking artificial. Maintain the original color and lighting as much as possible.',
  },
  {
    id: 'cartoonify',
    name: 'Cartoonify',
    prompt: 'Transform this photo into a cute 3D cartoon character. Exaggerate features to create an adorable, animated look, similar to modern animated movie characters. Maintain the likeness of the subject but render it in a playful, stylized, and vibrant cartoon style.',
  },
  {
    id: 'black-and-white',
    name: 'Black & White',
    prompt: 'Convert this image to a high-contrast, dramatic black and white photograph. Emphasize textures and shapes by deepening the blacks and brightening the whites, creating a timeless, classic look.'
  },
  {
    id: 'sepia-tone',
    name: 'Sepia Tone',
    prompt: 'Apply a classic sepia tone to this image. Give it a warm, brownish tint reminiscent of early photography to evoke a sense of nostalgia and historical feeling.'
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    prompt: 'Significantly increase the contrast of this image. Make the dark areas much darker and the bright areas much brighter to create a bold, punchy, and dramatic visual impact.'
  }
];