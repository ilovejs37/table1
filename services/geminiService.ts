
import { GoogleGenAI } from "@google/genai";
import { TableItem } from "../types";

export const generateDataInsights = async (items: TableItem[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const names = items.map(item => item.name).join(", ");
  
  const prompt = `Here is a list of names retrieved from a database table: ${names}. 
  Please provide a creative summary or a short insight about these names (e.g., are they common, do they share a theme, or just a friendly greeting for them). 
  Keep the response professional yet engaging and short (2-3 sentences).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate AI insights at this time.";
  }
};
