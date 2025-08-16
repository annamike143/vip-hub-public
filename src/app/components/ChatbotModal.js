// --- src/app/components/ChatbotModal.js (THE DEFINITIVE TWO-STEP SANDBOX) ---
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatbotModal.css';

const ChatbotModal = ({ lesson, isOpen, onClose }) => {
    const [iframeUrl, setIframeUrl] = useState('');

    useEffect(() => {
        if (isOpen && lesson?.chatbotId) {
            // We construct the URL to our own, local sandbox file
            setIframeUrl(`/chatbot.html?botId=${lesson.chatbotId}`);
        }
    }, [isOpen, lesson]);

    useEffect(() => {
        if (isOpen) { document.body.style.overflow = 'hidden'; } 
        else { document.body.style.overflow = 'unset'; }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                        <button className="close-button" onClick={onClose}>&times;</button>
                        {iframeUrl ? (
                            <iframe
                                key={iframeUrl} // Force re-render on URL change
                                src={iframeUrl}
                                title="AI Mentor Chatbot"
                                className="chatbot-iframe"
                                sandbox="allow-scripts allow-same-origin"
                            />
                        ) : (
                            <div className="chatbot-placeholder">Loading AI Mentor...</div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default ChatbotModal;