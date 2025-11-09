
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleClasses = isUser
    ? 'bg-blue-500 text-white rounded-bl-xl rounded-tr-xl rounded-tl-xl self-end'
    : 'bg-gray-200 text-gray-800 rounded-br-xl rounded-tr-xl rounded-tl-xl self-start';
  const alignmentClasses = isUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${alignmentClasses} mb-4`}>
      <div className={`p-3 max-w-[80%] ${bubbleClasses} shadow-md`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
        <span className="block text-xs mt-1 opacity-75">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
