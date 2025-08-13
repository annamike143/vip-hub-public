// --- src/app/lesson/[lessonId]/page.js (v7.0 - THE DEFINITIVE BRUTE FORCE INJECTION) ---
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';
import { database, functions, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';
import './lesson-page.css';

// --- NEW: A dedicated component for the raw HTML embed ---
const ChatbotEmbed = ({ lesson }) => {
    // We use a useEffect hook to ensure this only runs on the client, preventing hydration errors.
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || !lesson?.chatbotEmbedCode) return null;

    // We use dangerouslySetInnerHTML to inject the raw HTML
    // The key={lesson.id} is CRITICAL. It tells React to completely re-render this
    // component from scratch when you navigate to a new lesson, forcing the script to re-run.
    return (
        <div key={lesson.id} dangerouslySetInnerHTML={{ __html: lesson.chatbotEmbedCode }} />
    );
};

export default function LessonPage() {
    const params = useParams();
    const { lessonId } = params;
    
    const [lessonData, setLessonData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [unlockCode, setUnlockCode] = useState('');
    const [unlockStatus, setUnlockStatus] = useState({ message: '', error: false });
    const [isSubmittingCode, setIsSubmittingCode] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => { /* ... Same as before ... */ }, []);
    useEffect(() => { /* ... Same as before ... */ }, [lessonId, user]);
    useEffect(() => { /* ... Same as before ... */ }, [lessonId, user]); // Message listener
    
    const handleUnlockSubmit = async (e) => { /* ... Same as before ... */ };
    const handleMessageSubmit = async (e) => { /* ... Same as before ... */ };

    if (loading) { /* ... same as before ... */ }
    if (error) { /* ... same as before ... */ }

    return (
        <div className="lesson-page-wrapper">
            {/* ... (Header and main content are the same) ... */}
            
            <div className="ai-mentor-section">
                <h3>Your AI Mentor</h3>
                <p>Complete your recitation with your AI mentor below to receive the unlock code for the next lesson.</p>
                <div className="chatbot-container">
                    {/* We now call our new, dedicated, hydration-safe component */}
                    <ChatbotEmbed lesson={{...lessonData, id: lessonId}} />
                </div>
            </div>

            {/* ... (Unlock Gate and Q&A JSX are the same) ... */}
        </div>
    );
}