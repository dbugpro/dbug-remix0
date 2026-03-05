import { GoogleGenAI, Type } from "@google/genai";
import { Bug, BugPriority } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeBug = async (bug: Partial<Bug>) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this bug report and provide a structured analysis:
      Title: ${bug.title}
      Description: ${bug.description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedPriority: {
              type: Type.STRING,
              enum: Object.values(BugPriority),
              description: "The suggested priority level based on impact.",
            },
            summary: {
              type: Type.STRING,
              description: "A concise 1-sentence summary of the issue.",
            },
            possibleFix: {
              type: Type.STRING,
              description: "A brief technical suggestion for a fix.",
            },
          },
          required: ["suggestedPriority", "summary", "possibleFix"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
};
