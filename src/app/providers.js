// --- src/app/providers.js ---
'use client'; // THIS is our new Client Component boundary

import React, { useState, createContext, useContext } from 'react';
import Script from 'next/script';

const ChatbotContext = createContext(null);
export const useChatbot = () => useContext(ChatbotContext);

const ChatbotLoader = () => {
    const { botId } = useChatbot();
    if (!botId) return null;

    return (
        <Script
            id={`smartbot-chatbot-script-${botId}`}
            src="https://app.simplebotinstall.com/js/chat_plugin.js"
            strategy="afterInteractive"
            data-bot-id={botId}
        />
    );
};

export const AppProvider = ({ children }) => {
    const [botId, setBotId] = useState(null);

    return (
        <ChatbotContext.Provider value={{ botId, setBotId }}>
            {children}
            <ChatbotLoader />
        </ChatbotContext.Provider>
    );
};