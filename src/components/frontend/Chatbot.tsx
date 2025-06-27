'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendMessage,
  selectChatMessages,
  addUserMessage,
  addBotMessage,
  ChatMessage,
} from '@/store/frontend/chatbotSlice';
import type { RootState, AppDispatch } from '@/store';

const Chatbot = () => {
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: RootState) => selectChatMessages(state)) as ChatMessage[];

  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false); // default to closed
  const [welcomeSent, setWelcomeSent] = useState(false); // track if welcome was sent
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show welcome message when chat opens (only once)
  useEffect(() => {
    if (open && messages.length === 0 && !welcomeSent) {
      dispatch(addBotMessage("👋 Hello! I’m your friendly AI chatbot. Ask me anything about properties!"));
      dispatch(addBotMessage("Tap a city to see"));
      setWelcomeSent(true);
    }
  }, [open, messages.length, welcomeSent, dispatch]);

  const handleSend = () => {
    if (!input.trim()) return;
    dispatch(addUserMessage(input));
    dispatch(sendMessage(input));
    setInput('');
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Chatbot"
          className="fixed bottom-5 right-5 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-5 shadow-lg"
          style={{ width: 64, height: 64 }}
        >
          💬
        </button>
      )}

      <div
        className={`fixed bottom-20 right-5 z-50 w-96 max-w-full bg-white border border-gray-300 rounded-xl shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}
        style={{ height: 500 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-blue-600 text-white rounded-t-xl px-4 py-3">
          <h2 className="text-lg font-semibold">Property Chatbot</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close Chatbot"
            className="hover:bg-blue-700 p-1 rounded"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="p-4 flex-grow overflow-auto bg-gray-50 space-y-3">
          {messages.map((msg: ChatMessage, idx: number) => (
            <div
              key={idx}
              className={`max-w-[75%] px-4 py-2 rounded-lg ${
                msg.from === 'bot'
                  ? 'ml-auto bg-blue-600 text-white rounded-br-none'
                  : 'mr-auto bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-300 flex items-center bg-white rounded-b-xl">
          <input
            type="text"
            className="flex-grow border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Ask about properties..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold ml-2"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
