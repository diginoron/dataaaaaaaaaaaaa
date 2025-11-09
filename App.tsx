
import React, { useState, useEffect, useRef } from 'react';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import { Message } from './types';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import { v4 as uuidv4 } from 'uuid'; // For unique message IDs

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Use useRef to store the currently streaming Gemini message ID
  const currentGeminiMessageId = useRef<string | null>(null);

  useEffect(() => {
    try {
      initializeChat();
    } catch (e: any) {
      setError(`خطای راه اندازی: ${e.message || 'خطای ناشناخته'}`);
      console.error(e);
    }
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    setError(null);
    setIsLoading(true);

    const newUserMessage: Message = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    // Create a placeholder for the Gemini response
    const geminiResponseId = uuidv4();
    currentGeminiMessageId.current = geminiResponseId;
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: geminiResponseId, text: '', sender: 'gemini', timestamp: new Date() },
    ]);

    await sendMessageToGemini(
      text,
      (chunk: string) => {
        // This callback is called for each chunk of the stream
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((msg) =>
            msg.id === currentGeminiMessageId.current
              ? { ...msg, text: msg.text + chunk }
              : msg
          );
          return updatedMessages;
        });
      },
      () => {
        // This callback is called when the stream ends
        setIsLoading(false);
        currentGeminiMessageId.current = null;
      },
      (errorMessage: string) => {
        // This callback is called if an error occurs
        setError(errorMessage);
        setIsLoading(false);
        currentGeminiMessageId.current = null;
        // Optionally, remove the empty Gemini message if an error occurred before any content was streamed
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== geminiResponseId || msg.text !== '')
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: uuidv4(),
            text: `خطا: ${errorMessage}`,
            sender: 'gemini',
            timestamp: new Date(),
          },
        ]);
      }
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-lg shadow-xl">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-lg shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold">چت با جمینی</h1>
        <span className="text-sm opacity-80">مدل: gemini-2.5-flash</span>
      </header>
      {error && (
        <div className="p-3 bg-red-100 text-red-700 border-l-4 border-red-500 m-4 rounded">
          <p className="font-semibold">خطا:</p>
          <p>{error}</p>
        </div>
      )}
      <ChatWindow messages={messages} isLoading={isLoading} />
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
