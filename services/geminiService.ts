
import { GoogleGenAI, Type } from "@google/genai";

// Keep only core helper if needed for future extensions, otherwise simplified.
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

// Generic generate content if needed for hidden features
export async function getResponse(prompt: string): Promise<string> {
  if (!process.env.API_KEY) return "";
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "";
  } catch (e) {
    return handleApiError(e);
  }
}

// Fix: Implement getPerfumeRecommendation
export async function getPerfumeRecommendation(prompt: string): Promise<string> {
  if (!process.env.API_KEY) return "";
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert perfume consultant. Provide professional advice based on the user's preference.",
      }
    });
    return response.text || "";
  } catch (e) {
    return handleApiError(e);
  }
}

// Fix: Implement generateProImage
export async function generateProImage(prompt: string, aspectRatio: string, imageSize: string): Promise<string | null> {
  if (!process.env.API_KEY) return null;
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

// Fix: Implement editImage
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

// Fix: Implement fileToBtnBase64 helper
export async function fileToBtnBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Fix: Implement generateVeoVideo
export async function generateVeoVideo(prompt: string, imageBase64?: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string | null> {
  if (!process.env.API_KEY) return null;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      ...(imageBase64 && { image: { imageBytes: imageBase64, mimeType: 'image/png' } }),
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
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

// Fix: Implement getGroundedChatResponse
export async function getGroundedChatResponse(message: string): Promise<{ text: string, grounding: any[] }> {
  if (!process.env.API_KEY) return { text: "", grounding: [] };
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    return handleApiError(e);
  }
}
