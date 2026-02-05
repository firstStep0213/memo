import { GoogleGenAI } from "@google/genai";
import { AIActionType } from "../types";

// Initialize the Gemini API client
// We use the environment variable as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

export const generateAIResponse = async (
  noteContent: string,
  action: AIActionType
): Promise<string> => {
  if (!noteContent.trim()) {
    return "Please write some content in your note first.";
  }

  let prompt = "";

  switch (action) {
    case AIActionType.SUMMARIZE:
      prompt = `Summarize the following learning note into concise bullet points to help me review quickly:\n\n"${noteContent}"`;
      break;
    case AIActionType.QUIZ:
      prompt = `Based on the following learning note, generate 3 short quiz questions (with answers hidden or at the bottom) to test my understanding:\n\n"${noteContent}"`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster simple text tasks
      }
    });
    
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't process that request right now. Please check your connection or API key.";
  }
};