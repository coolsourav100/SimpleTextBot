"use client";

import React, { useState } from "react";
import LandingPage from "./components/LandingPage/page";
import ChatPage from "./components/ChatPage/page";

const AppPage: React.FC = () => {
  const [view, setView] = useState<"landing" | "chat">("landing");

  return (
    <>
      {view === "landing" && (
        <LandingPage onStartChat={() => setView("chat")} />
      )}
      {view === "chat" && (
        <ChatPage onBackToHome={() => setView("landing")} />
      )}
    </>
  );
};

export default AppPage;
