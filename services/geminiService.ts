
import { GoogleGenAI, Type } from "@google/genai";

export const isKeyNotFoundError = (error: any) => {
  const msg = error?.message || "";
  return msg.includes("Requested entity was not found") || msg.includes("404");
};

const handleApiError = (error: any) => {
  console.error("Gemini API Error:", error);
  if (isKeyNotFoundError(error)) {
    window.dispatchEvent(new CustomEvent('aistudio:key_error'));
  }
  return "Kechirasiz, xizmat vaqtinchalik mavjud emas. / Извините, сервис временно недоступен.";
};

/**
 * Professional Perfume Recommendation Engine
 */
export async function getPerfumeRecommendation(prompt: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "API Key not configured.";
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a luxury perfume consultant for 'Premium Parfumes'. Provide concise, elegant fragrance advice for modern men. Be professional and sophisticated.",
      }
    });
    return response.text || "No recommendation found.";
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * Generate high-quality images using gemini-3-pro-image-preview
 */
export async function generateProImage(prompt: string, aspectRatio: string = "1:1", imageSize: string = "1K"): Promise<string | null> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [{ text: prompt }],
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: imageSize as any,
        }
      }
    });

    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imagePart?.inlineData) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Edit images using gemini-2.5-flash-image
 */
export async function editImage(base64Data: string, prompt: string): Promise<string | null> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: 'image/png' } },
          { text: prompt }
        ]
      }
    });

    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imagePart?.inlineData) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Generate video using veo-3.1-fast-generate-preview
 */
export async function generateVeoVideo(prompt: string, imageBase64?: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string | null> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
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
      return `${downloadLink}&key=${apiKey}`;
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Chat with Google Search and Maps grounding
 */
export async function getGroundedChatResponse(message: string): Promise<{ text: string, grounding?: any[] }> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return { text: "API Key missing" };

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: message,
      config: {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
        systemInstruction: "You are a luxury perfume concierge. Use Google Search and Maps to find stores, reviews, and latest trends."
      }
    });

    return {
      text: response.text || "No response",
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (e) {
    console.error(e);
    return { text: "Error fetching response." };
  }
}

/**
 * Utility to convert file to base64 string
 */
export async function fileToBtnBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}
