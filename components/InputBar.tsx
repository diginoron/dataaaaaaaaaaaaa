
import React, { useState, KeyboardEvent } from 'react';
import { RiSendPlaneFill } from 'react-icons/ri'; // Using react-icons for a send icon

interface InputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState<string>('');

  const handleSend = () => {
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSend();
    }
  };

  return (
    <div className="flex items-center p-4 bg-white border-t border-gray-200 sticky bottom-0 w-full">
      <textarea
        className="flex-1 resize-none border border-gray-300 rounded-xl p-3 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500 text-base max-h-32 min-h-[48px]"
        rows={1}
        placeholder={isLoading ? "در حال ارسال..." : "پیام خود را اینجا بنویسید..."}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        aria-label="پیام چت"
        style={{ overflowY: 'auto' }}
      />
      <button
        onClick={handleSend}
        disabled={!inputText.trim() || isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="ارسال پیام"
      >
        <RiSendPlaneFill size={24} />
      </button>
    </div>
  );
};

export default InputBar;
