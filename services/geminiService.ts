import { GoogleGenAI, Type } from "@google/genai";
import { DreamInterpretationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const interpretDream = async (dreamText: string): Promise<DreamInterpretationResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please interpret this dream or context into lucky Thai lottery numbers (2 digits and 3 digits).
      Input text: "${dreamText}"
      
      Provide a brief reasoning in Thai language explaining why these numbers are related to the dream.
      Return strictly JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            twoDigits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of lucky 2-digit numbers (e.g., '99', '05'). Generate 1-3 numbers."
            },
            threeDigits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of lucky 3-digit numbers (e.g., '999', '123'). Generate 1-2 numbers."
            },
            reason: {
              type: Type.STRING,
              description: "Short explanation in Thai language."
            }
          },
          required: ["twoDigits", "threeDigits", "reason"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as DreamInterpretationResponse;
    }
    
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Gemini interpretation failed:", error);
    // Fallback to random numbers if AI fails, but ideally UI handles error
    throw error;
  }
};