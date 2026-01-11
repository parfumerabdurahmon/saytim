
import { GoogleGenAI } from "@google/genai";

/**
 * Service for handling Gemini API interactions.
 * Note: Key handling is managed via process.env.API_KEY.
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

// Helper to convert file to base64
export const fileToBtnBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
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
        systemInstruction: "You are a luxury perfume consultant for a high-end boutique. Provide concise, elegant, and professional fragrance advice.",
      }
    });
    return response.text || "No recommendation found.";
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * Generate High Quality Images using Gemini 3 Pro Image
 */
export async function generateProImage(prompt: string, aspectRatio: string = "1:1", imageSize: string = "1K"): Promise<string | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
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
 * Edit existing images using Gemini 2.5 Flash Image
 */
export async function editImage(base64Data: string, prompt: string): Promise<string | null> {
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
 * Generate Videos using Veo 3.1
 */
export async function generateVeoVideo(prompt: string, imageBase64?: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      image: imageBase64 ? { imageBytes: imageBase64, mimeType: 'image/png' } : undefined,
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
    if (downloadLink) {
      return `${downloadLink}&key=${process.env.API_KEY}`;
    }
    return null;
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * Grounded Chat for Concierge with Google Search and Maps
 */
export async function getGroundedChatResponse(message: string): Promise<{ text: string, grounding: any[] }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "";
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, grounding };
  } catch (e) {
    return handleApiError(e);
  }
}
