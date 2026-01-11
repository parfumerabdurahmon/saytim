
import { GoogleGenAI, Type, Modality } from "@google/genai";

export const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&q=80&w=1200"
];

// Helper to check for the specific 404 error that requires key re-selection
const isKeyNotFoundError = (error: any) => {
  const msg = error?.message || "";
  return msg.includes("Requested entity was not found") || msg.includes("404");
};

const handleApiError = (error: any) => {
  if (isKeyNotFoundError(error)) {
    window.dispatchEvent(new CustomEvent('aistudio:key_error'));
  }
  throw error;
};

export const fileToBtnBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export async function getPerfumeRecommendation(prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are the Premium Parfumes Sommelier. Your goal is to recommend luxury scents based on user moods or preferences.",
      }
    });
    return response.text || "";
  } catch (e) {
    return handleApiError(e);
  }
}

export async function getGroundedChatResponse(message: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: "You are the Premium Parfumes Concierge. Use Google Search and Google Maps. Provide URLs.",
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      }
    });
    const response = await chat.sendMessage({ message });
    return {
      text: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (e) {
    return handleApiError(e);
  }
}

export async function generateProImage(prompt: string, aspectRatio: string = "1:1", size: string = "1K") {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: `Luxury perfume photography: ${prompt}` }] },
      config: {
        imageConfig: { aspectRatio: aspectRatio as any, imageSize: size as any },
      },
    });
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    throw new Error("No image generated");
  } catch (e) {
    if (isKeyNotFoundError(e)) handleApiError(e);
    return FALLBACK_IMAGES[0];
  }
}

export async function editImage(base64Image: string, prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/png' } },
          { text: prompt }
        ]
      }
    });
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    return part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : null;
  } catch (e) {
    return handleApiError(e);
  }
}

export async function generateVeoVideo(prompt: string, imageBase64?: string, aspectRatio: '16:9' | '9:16' = '16:9') {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  try {
    const payload: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    };

    if (imageBase64) {
      payload.image = { imageBytes: imageBase64, mimeType: 'image/png' };
    }

    let operation = await ai.models.generateVideos(payload);
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    return handleApiError(e);
  }
}
