
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Service for handling Gemini API interactions securely.
 */

export const isKeyNotFoundError = (error: any) => {
  const msg = error?.message || "";
  return msg.includes("Requested entity was not found") || msg.includes("404");
};

const handleApiError = (error: any) => {
  if (isKeyNotFoundError(error)) {
    window.dispatchEvent(new CustomEvent('aistudio:key_error'));
  }
  throw error;
};

/**
 * Professional Perfume Recommendation Engine
 */
export async function getPerfumeRecommendation(prompt: string): Promise<string> {
  if (!process.env.API_KEY) return "API Key not configured.";
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a luxury perfume consultant for 'Premium Parfumes'. Provide concise, elegant fragrance advice for modern men.",
      }
    });
    return response.text || "No recommendation found.";
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * Generates high-quality images using gemini-3-pro-image-preview
 */
export async function generateProImage(prompt: string, aspectRatio: string = "1:1", imageSize: string = "1K"): Promise<string | null> {
  if (!process.env.API_KEY) return null;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [{ text: prompt }],
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: imageSize as any
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * Edits an existing image based on a prompt
 */
export async function editImage(base64Data: string, prompt: string): Promise<string | null> {
  if (!process.env.API_KEY) return null;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: 'image/png' } },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * Generates cinematic videos using Veo
 */
export async function generateVeoVideo(prompt: string, imageBase64?: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string | null> {
  if (!process.env.API_KEY) return null;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      ...(imageBase64 && { image: { imageBytes: imageBase64, mimeType: 'image/png' } }),
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return null;
    
    // Returning the link with key as specified in guidelines
    return `${downloadLink}&key=${process.env.API_KEY}`;
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * Handles grounded chat with Google Search and Maps
 */
export async function getGroundedChatResponse(message: string): Promise<{ text: string, grounding: any[] }> {
  if (!process.env.API_KEY) return { text: "API Key missing", grounding: [] };
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: message,
      config: {
        tools: [{ googleSearch: {} }, { googleMaps: {} }]
      }
    });

    return {
      text: response.text || "",
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * Helper to convert File to Base64
 */
export async function fileToBtnBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}
