import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { Message } from '../types';

let chatSession: Chat | null = null;
let aiInstance: GoogleGenAI | null = null;

const getAIInstance = (): GoogleGenAI => {
  if (!aiInstance) {
    // Access the API key using process.env.API_KEY as per coding guidelines.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY is not set in environment variables. Please ensure it's provided by the execution environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey });
  }
  return aiInstance;
};

export const initializeChat = () => {
  const ai = getAIInstance();
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a friendly and helpful conversational AI assistant. You must always respond in Persian (Farsi) language.',
    },
  });
};

export const sendMessageToGemini = async (
  prompt: string,
  onStreamChunk: (chunk: string) => void,
  onStreamEnd: () => void,
  onError: (error: string) => void
): Promise<void> => {
  if (!chatSession) {
    initializeChat(); // Ensure chatSession is initialized
  }

  if (!chatSession) {
    onError("Chat session not initialized.");
    return;
  }

  try {
    const responseStream = await chatSession.sendMessageStream({ message: prompt });
    for await (const chunk of responseStream) {
      if (chunk.text) {
        onStreamChunk(chunk.text);
      }
    }
    onStreamEnd();
  } catch (error: any) {
    console.error("Gemini API error:", error);
    onError(`خطا در ارتباط با Gemini: ${error.message || 'خطای ناشناخته'}`);
  }
};