"use client";

import React, { useState, useRef, useEffect } from "react";

const SimpleTextBot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! I'm SimpleTextBot. Ask me anything ✦", sender: "ai" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // history in OpenAI-style format (what your backend/HF Space expects)
  const [backendHistory, setBackendHistory] = useState([]);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

 const handleSend = async () => {
  const trimmed = input.trim();
  if (!trimmed) return;

  const userMessage = {
    id: Date.now(),
    text: trimmed,
    sender: "user",
  };

  // Add user message to UI
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsTyping(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: trimmed,
        history: backendHistory,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API error:", errorText);

      const aiMessage = {
        id: Date.now() + 1,
        text: "Sorry, something went wrong contacting the AI server.",
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
      return;
    }

    const data = await res.json();

    // Add real AI response
    const aiMessage = {
      id: Date.now() + 2,
      text: data.reply || "…",
      sender: "ai",
    };

    setMessages((prev) => [...prev, aiMessage]);
    setBackendHistory(data.history || backendHistory);
  } catch (err) {
    console.error("Network error:", err);
    const aiMessage = {
      id: Date.now() + 3,
      text: "Network error. Please try again.",
      sender: "ai",
    };
    setMessages((prev) => [...prev, aiMessage]);
  } finally {
    setIsTyping(false);
  }
};


  const handleClear = () => {
    setMessages([
      {
        id: 1,
        text: "Hey! I'm SimpleTextBot. Ask me anything ✦",
        sender: "ai",
      },
    ]);
    setBackendHistory([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex-1"></div>
          <h1 className="text-lg font-light text-gray-800 tracking-wide">
            SimpleTextBot ✦
          </h1>
          <div className="flex-1 flex justify-end">
            <button
              onClick={handleClear}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } animate-fadeIn`}
            >
              <div
                className={`flex items-start gap-2 max-w-[80%] ${
                  msg.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {msg.sender === "ai" && (
                  <span className="text-gray-400 text-xs mt-1">✦</span>
                )}
                <div
                  className={`px-5 py-3 rounded-2xl ${
                    msg.sender === "ai"
                      ? "bg-gray-50 text-gray-800 rounded-tl-md"
                      : "bg-blue-100 text-gray-800 rounded-tr-md"
                  } transition-all`}
                  style={{
                    animation: `slideIn 0.3s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex items-start gap-2 max-w-[80%]">
                <span className="text-gray-400 text-xs mt-1">✦</span>
                <div className="px-5 py-3 bg-gray-50 rounded-2xl rounded-tl-md">
                  <div className="flex gap-1">
                    <span
                      className="animate-pulse"
                      style={{ animationDelay: "0ms" }}
                    >
                      ✦
                    </span>
                    <span
                      className="animate-pulse"
                      style={{ animationDelay: "200ms" }}
                    >
                      ✦
                    </span>
                    <span
                      className="animate-pulse"
                      style={{ animationDelay: "400ms" }}
                    >
                      ✦
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Box */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center gap-3 bg-gray-50 rounded-full px-5 py-3 border border-gray-200 hover:border-blue-200 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type something…"
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="text-blue-300 hover:text-blue-400 disabled:text-gray-300 transition-all hover:scale-110 disabled:scale-100"
            >
              <span className="text-xl">➤</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #e3e3e3;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #d0d0d0;
        }
      `}</style>
    </div>
  );
};

export default SimpleTextBot;
