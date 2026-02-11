
import { GoogleGenAI } from "@google/genai";
import { TableItem } from "../types";

export const generateDataInsights = async (items: TableItem[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const names = items.map(item => item.name).join(", ");
  
  const prompt = `다음은 데이터베이스에서 순차적으로 배정된 명단입니다: ${names}. 
  이 배정된 인원들에 대해 아주 짧고 긍정적인 요약이나 한 줄 인사를 작성해 주세요. 
  (예: "이 팀은 독특한 이름들로 구성되어 있네요", "배정된 3분께 환영의 인사를 전합니다" 등)
  한국어로 1-2문장 내외로 작성해 주세요.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "데이터 분석 결과가 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 분석을 불러오는 도중 오류가 발생했습니다.";
  }
};
