
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestSubTasks = async (title: string, description: string): Promise<string[]> => {
  if (!process.env.API_KEY) {
    return [];
  }

  const prompt = `Based on the following task, suggest a list of actionable sub-tasks.
  Task Title: ${title}
  Task Description: ${description || 'No description provided.'}
  
  Return the sub-tasks as a JSON array of strings. For example: ["Sub-task 1", "Sub-task 2"]. If no sub-tasks are applicable, return an empty array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const subTasks = JSON.parse(jsonText);
    return Array.isArray(subTasks) ? subTasks : [];
  } catch (error) {
    console.error("Error suggesting sub-tasks:", error);
    return [];
  }
};
