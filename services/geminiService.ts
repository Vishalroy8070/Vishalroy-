
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function enhanceImage(base64ImageData: string, mimeType: string, prompt: string): Promise<string> {
  const base64Data = base64ImageData.split(',')[1];
  if (!base64Data) {
    throw new Error("Invalid base64 image data");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const enhancedBase64 = part.inlineData.data;
        const enhancedMimeType = part.inlineData.mimeType;
        return `data:${enhancedMimeType};base64,${enhancedBase64}`;
      }
    }

    throw new Error("AI did not return an image. It might have refused the request.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error('The provided API key is not valid. Please check your configuration.');
        }
        throw new Error(`An error occurred while enhancing the image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while enhancing the image.");
  }
}
