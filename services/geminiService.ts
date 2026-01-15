
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const processCarImage = async (
  carImageBase64: string, 
  backgroundBase64?: string,
  backgroundPrompt: string = "a professional automotive showroom with soft cinematic lighting and polished floors"
): Promise<string> => {
  const ai = getAI();
  
  const carPart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: carImageBase64.split(',')[1] || carImageBase64,
    },
  };

  const parts: any[] = [carPart];
  
  let promptText = `
    This is a photo of a car. 
    Task: Remove the background from the vehicle and place the vehicle realistically into a new professional background.
    New Background Description: ${backgroundPrompt}.
    Instructions:
    1. Detect the car precisely.
    2. Remove all elements of the original background.
    3. Place the car in the center of the new high-quality automotive environment.
    4. Ensure realistic shadows and reflections on the floor of the new environment.
    5. Return ONLY the new edited image.
  `;

  if (backgroundBase64) {
    const bgPart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: backgroundBase64.split(',')[1] || backgroundBase64,
      },
    };
    parts.push(bgPart);
    promptText += " Use the provided second image as the background.";
  }

  parts.push({ text: promptText });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from Gemini");
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
