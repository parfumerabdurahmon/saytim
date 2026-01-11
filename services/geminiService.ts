
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Service for handling Gemini API interactions securely.
 * Optimized for speed and reliability.
 */

export const isKeyNotFoundError = (error: any) => {
  const msg = error?.message || "";
  return msg.includes("Requested entity was not found") || msg.includes("404");
};

const handleApiError = (error: any) => {
  console.error("Gemini API error handled:", error);
  if (isKeyNotFoundError(error)) {
    window.dispatchEvent(new CustomEvent('aistudio:key_error'));
  }
  return "Xizmat vaqtinchalik mavjud emas. / Сервис временно недоступен.";
};

/**
 * High-speed recommendation engine using gemini-3-flash-preview for quick response
 */
export async function getPerfumeRecommendation(prompt: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "API Key missing.";
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a high-end perfume expert. Keep advice brief, ultra-luxurious, and sharp. Response should be in the user's language.",
        temperature: 0.7,
      }
    });
    return response.text || "No recommendation found.";
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * Professional Image Generation
 */
export async function generateProImage(prompt: string, aspectRatio: string = "1:1", imageSize: string = "1K"): Promise<string | null> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
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

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    return part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : null;
  } catch (e) {
    console.error("Image gen error:", e);
    return null;
  }
}

/**
 * Professional Image Editing
 */
export async function editImage(base64Image: string, prompt: string): Promise<string | null> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    return part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : null;
  } catch (e) {
    console.error("Image edit error:", e);
    return null;
  }
}

/**
 * Cinematic Video Generation using Veo
 */
export async function generateVeoVideo(prompt: string, imageBase64?: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string | null> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      ...(imageBase64 && {
        image: {
          imageBytes: imageBase64,
          mimeType: 'image/png',
        }
      }),
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return null;
    
    // In a browser environment, we return the URI with key for direct video tag usage
    return `${downloadLink}&key=${apiKey}`;
  } catch (e) {
    console.error("Video gen error:", e);
    return null;
  }
}

/**
 * Grounded Concierge using Google Search for real-time data
 */
export async function getGroundedChatResponse(message: string): Promise<{ text: string, grounding?: any[] }> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return { text: "API Key missing" };
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    return {
      text: response.text || "",
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (e) {
    console.error("Search error:", e);
    return { text: "Connection error." };
  }
}

export async function fileToBtnBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });
}
