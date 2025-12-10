"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Zap, MessageCircle, ArrowRight } from "lucide-react";

type Sender = "user" | "ai";
type ChatPreviewMessage = { text: string; sender: Sender; delay: number; };
type LandingPageProps = { onStartChat: () => void };


const LandingPage: React.FC<LandingPageProps> = ({ onStartChat }) => {
  const [showConversation, setShowConversation] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<
    Omit<ChatPreviewMessage, "delay">[]
  >([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConversation(true);
      animateConversation();
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animateConversation = () => {
    const conversation: ChatPreviewMessage[] = [
      {
        text: "What can you help me with?",
        sender: "user",
        delay: 500,
      },
      {
        text: "I can help with ideas, questions, creative writing, and more! ✦",
        sender: "ai",
        delay: 2000,
      },
      {
        text: "Tell me about quantum computing",
        sender: "user",
        delay: 3500,
      },
      {
        text:
          "Quantum computing uses quantum mechanics to process information in ways classical computers can't...",
        sender: "ai",
        delay: 5000,
      },
    ];

    conversation.forEach((msg) => {
      setTimeout(() => {
        const { delay: _delay, ...rest } = msg;
        setChatMessages((prev) => [...prev, rest]);
      }, msg.delay);
    });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-spin-slow">✦</span>
            <span className="text-xl font-light tracking-wider">
              SimpleTextBot
            </span>
          </div>
          <button
            onClick={onStartChat}
            className="px-6 py-2 border border-white/20 rounded-full hover:bg-white/10 transition-all text-sm"
          >
            Launch App
          </button>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-8 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-300">Now Live</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-7xl md:text-8xl font-light mb-8 leading-none tracking-tight">
              Chat with
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Intelligence
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              A minimal AI experience that feels natural, responds instantly,
              and looks stunning.
            </p>

            {/* CTA Button */}
            <div className="flex items-center justify-center mb-20">
              <button
                onClick={onStartChat}
                className="group px-8 py-4 bg-white text-black rounded-full font-medium hover:scale-105 transition-all flex items-center gap-2 shadow-2xl shadow-white/20"
              >
                Start Chatting
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Animated Conversation Preview */}
            {showConversation && (
              <div className="relative">
                <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-4 text-left max-h-64 overflow-hidden">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${
                          msg.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        } animate-slideIn`}
                      >
                        <div
                          className={`flex gap-3 max-w-[80%] ${
                            msg.sender === "user" ? "flex-row-reverse" : ""
                          }`}
                        >
                          {msg.sender === "ai" && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-xs">
                              ✦
                            </div>
                          )}
                          <div
                            className={`px-4 py-2 rounded-2xl text-sm ${
                              msg.sender === "ai"
                                ? "bg-white/10 text-gray-200"
                                : "bg-white/90 text-black"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl -z-10"></div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-light mb-3">Smart Responses</h3>
              <p className="text-gray-400 leading-relaxed">
                Contextual understanding that feels natural and human-like in
                every conversation.
              </p>
            </div>

            <div className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-light mb-3">Instant Speed</h3>
              <p className="text-gray-400 leading-relaxed">
                Lightning-fast responses with buttery smooth animations. No lag,
                pure flow.
              </p>
            </div>

            <div className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-light mb-3">Clean Design</h3>
              <p className="text-gray-400 leading-relaxed">
                Zero clutter. Beautiful interface. Just you and meaningful
                conversation.
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="max-w-7xl mx-auto px-8 py-20 text-center">
          <h2 className="text-5xl font-light mb-6">Ready to start?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join the conversation in seconds
          </p>
          <button
            onClick={onStartChat}
            className="px-8 py-4 bg-white text-black rounded-full font-medium hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            Get Started
            <span>→</span>
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-8 text-center text-gray-500 text-sm">
            <p>Built with care ✦ Designed for clarity</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
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

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
