"use client";

import React, { useState, useRef, useEffect } from "react";

type Sender = "user" | "ai";

type Message = {
  id: number;
  text: string;
  sender: Sender;
};

type ChatPageProps = {
  onBackToHome: () => void;
};

const ChatPage: React.FC<ChatPageProps> = ({ onBackToHome }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const [backendHistory, setBackendHistory] = useState<any[]>([]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleSend = async (): Promise<void> => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now(),
      text: trimmed,
      sender: "user",
    };

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

        const aiMessage: Message = {
          id: Date.now() + 1,
          text: "Sorry, something went wrong talking to the server.",
          sender: "ai",
        };
        setMessages((prev) => [...prev, aiMessage]);
        return;
      }

      const data = await res.json();

      const aiMessage: Message = {
        id: Date.now() + 2,
        text: data.reply || "…",
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setBackendHistory(data.history || backendHistory);
    } catch (err) {
      console.error("Network error:", err);
      const aiMessage: Message = {
        id: Date.now() + 3,
        text: "Network error. Please try again.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed lg:relative top-0 left-0 bottom-0 bg-[#202123] flex flex-col z-40 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-0 lg:w-0"
        } overflow-hidden`}
      >
        <div className="flex-1 overflow-y-auto p-4">
          {/* New Chat Button */}
          {/* <button className="w-full flex items-center gap-3 px-3 py-3 text-white rounded-lg border border-white/20 hover:bg-white/10 transition-colors mb-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-sm">New chat</span>
          </button> */}

          {/* Chat History */}
          {/* <div className="mt-4 space-y-1">
            <div className="text-xs text-gray-400 px-3 py-2 font-medium">
              Today
            </div>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 group">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span className="truncate flex-1">Previous conversation</span>
            </button>
          </div> */}
        </div>

        {/* User Section */}
        <div className="border-t border-white/20 p-3">
          <button
            onClick={onBackToHome}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg transition-all duration-200 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-200">
              ←
            </span>
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center gap-3 px-3 py-2 mt-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">✦</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">User</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Hamburger */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={toggleSidebar}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-all duration-200 active:scale-95"
            aria-label="Toggle Sidebar"
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span
                className={`h-0.5 bg-gray-700 transition-all duration-300 ${
                  isSidebarOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`h-0.5 bg-gray-700 transition-all duration-300 ${
                  isSidebarOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`h-0.5 bg-gray-700 transition-all duration-300 ${
                  isSidebarOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✦</span>
            </div>
            <span className="text-lg font-medium text-gray-900">
              SimpleTextBot
            </span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          <div
            className={`max-w-3xl mx-auto px-4 md:px-6 ${
              messages.length === 0
                ? "h-full flex items-center justify-center"
                : "py-8 md:py-12"
            }`}
          >
            {/* Empty State */}
            {messages.length === 0 && !isTyping && (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl">✦</span>
                </div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  How can I help you today?
                </h2>
                <p className="text-gray-500">
                  Start a conversation by typing below
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  } animate-slideIn`}
                >
                  <div
                    className={`flex gap-3 md:gap-4 max-w-[85%] ${
                      msg.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white text-xs md:text-sm">✦</span>
                      </div>
                    )}
                    <div
                      className={`px-4 md:px-6 py-3 md:py-4 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-md text-sm md:text-base ${
                        msg.sender === "ai"
                          ? "bg-white text-gray-900"
                          : "bg-gray-900 text-white"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-slideIn">
                  <div className="flex gap-3 md:gap-4 max-w-[85%]">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-white text-xs md:text-sm">✦</span>
                    </div>
                    <div className="px-4 md:px-6 py-3 md:py-4 bg-white rounded-2xl shadow-md">
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2.5 h-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2.5 h-2.5 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white sticky bottom-0">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 md:py-6">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message SimpleTextBot..."
                rows={1}
                className="w-full resize-none rounded-3xl border border-gray-300 bg-white px-4 md:px-6 py-3 md:py-4 pr-12 md:pr-14 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all text-gray-900 placeholder-gray-500 shadow-sm text-sm md:text-base"
                style={{ minHeight: "48px", maxHeight: "200px" }}
              />
                    <button
        onClick={handleSend}
        disabled={!input.trim() || isTyping}
        className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:scale-110 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md"
      >
        <span className="text-base md:text-lg font-bold">↑</span>
      </button>

            </div>
            <p className="text-xs text-gray-500 text-center mt-2 md:mt-3">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
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

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #e5e5e5;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #d4d4d4;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
