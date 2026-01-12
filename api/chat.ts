
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { message, lang, arsenal } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured in Vercel environment variables.' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `You are the "Scent Strategist", a world-class luxury perfume advisor for "Premium Parfumes Elite". 
    Tone: Sophisticated, masculine, exclusive, and professional.
    Task: Help users choose a perfume from the available Arsenal.
    Arsenal Data: ${arsenal}.
    Language: Please respond exclusively in ${lang === 'uz' ? 'Uzbek' : 'Russian'}. 
    Strategy: Analyze the user's mood or occasion and recommend specific perfumes from the Arsenal with a brief reason why they fit.`;

    // Correct generateContent call according to @google/genai guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I apologize, I couldn't formulate a strategy. Please try again.";

    return new Response(JSON.stringify({ reply: replyText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Gemini Backend Error:', error);
    return new Response(JSON.stringify({ 
      error: 'The Scent Strategist is currently unavailable.', 
      details: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
