// --- src/app/lesson/[lessonId]/page.js (v11.1 - THE DEFINITIVE FINAL VERSION) ---
'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'next/navigation';
import Script from 'next/script';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';
import { database, functions, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';
import './lesson-page.css';

const ChatbotPortal = ({ lesson }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || !lesson?.chatbotId) {
        return null;
    }

    return createPortal(
        <Script
            id={`smartbot-chatbot-script-${lesson.chatbotId}`}
            src="https://app.simplebotinstall.com/js/chat_plugin.js"
            strategy="afterInteractive"
            data-bot-id={lesson.chatbotId}
            onLoad={() => console.log(`Chatbot script for bot ID ${lesson.chatbotId} loaded successfully.`)}
            onError={(e) => console.error('Chatbot script failed to load:', e)}
        />,
        document.body
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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setError("You must be logged in to view this content.");
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user || !lessonId) return;

        let modulesListener;
        const progressRef = ref(database, `users/${user.uid}/progress/unlockedLessons`);
        const progressListener = onValue(progressRef, (progressSnapshot) => {
            const unlockedLessons = progressSnapshot.val() || [];
            if (!unlockedLessons.includes(lessonId)) {
                setError("Access Denied. You have not unlocked this lesson yet.");
                setLoading(false);
                return;
            }

            const modulesRef = ref(database, 'courseContent/modules');
            modulesListener = onValue(modulesRef, (modulesSnapshot) => {
                const modules = modulesSnapshot.val();
                let foundLesson = null;
                if (modules) {
                    for (const moduleId in modules) {
                        if (modules[moduleId].lessons && modules[moduleId].lessons[lessonId]) {
                            foundLesson = modules[moduleId].lessons[lessonId];
                            break;
                        }
                    }
                }
                if (foundLesson) {
                    setLessonData(foundLesson);
                } else {
                    setError('Lesson data could not be found in the curriculum.');
                }
                setLoading(false);
            });

        }, (err) => {
            setError("Could not verify your lesson progress.");
            setLoading(false);
        });

        return () => {
            progressListener();
            if (modulesListener) {
                modulesListener();
            }
        };
    }, [user, lessonId]);

    useEffect(() => {
        if (!lessonId || !user) return;
        const messagesRef = ref(database, `messagingThreads/${user.uid}/${lessonId}`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const loadedMessages = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse() : [];
            setMessages(loadedMessages);
        });
        return () => unsubscribe();
    }, [lessonId, user]);

    const handleUnlockSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingCode(true);
        setUnlockStatus({ message: '', error: false });
        const unlockNextLesson = httpsCallable(functions, 'unlockNextLesson');
        try {
            const result = await unlockNextLesson({ currentLessonId: lessonId, submittedCode: unlockCode });
            setUnlockStatus({ message: result.data.message, error: false });
            setUnlockCode('');
        } catch (err) {
            setUnlockStatus({ message: err.message, error: true });
        }
        setIsSubmittingCode(false);
    };

    const handleMessageSubmit = async (e) => {
         e.preventDefault();
         if (!newMessage.trim() || !user) return;
         const messageRef = ref(database, `messagingThreads/${user.uid}/${lessonId}`);
         await push(messageRef, { sender: 'user', text: newMessage, timestamp: serverTimestamp() });
         setNewMessage('');
    };

    if (loading) return <div className="loading-state">Authenticating and loading lesson...</div>;
    if (error) return <div className="loading-state"><p>{error}</p><Link href="/" className="back-to-dash-error">← Back to Dashboard</Link></div>;
    if (!lessonData) return <div className="loading-state">Preparing lesson content...</div>;

    return (
        <>
            <div className="lesson-page-wrapper">
                <header className="lesson-header">
                    <div className="container">
                        <Link href="/" className="back-to-dash">← Back to Dashboard</Link>
                    </div>
                </header>
                <main className="lesson-container">
                    <div className="lesson-content">
                        <h1>{lessonData.title}</h1>
                        <p className="lesson-description">{lessonData.description}</p>
                        <a href={lessonData.videoUrl} target="_blank" rel="noopener noreferrer" className="thumbnail-link">
                            <Image src={lessonData.thumbnailUrl || '/default-thumbnail.jpg'} alt={`Thumbnail for ${lessonData.title}`} width={1280} height={720} style={{ width: '100%', height: 'auto' }} priority />
                            <div className="play-icon-overlay">
                                <svg width="80" height="80" viewBox="0 0 100 100"><polygon points="35,25 75,50 35,75" fill="white"/></svg>
                            </div>
                        </a>
                        <div className="ai-mentor-section">
                            <h3>Your AI Mentor</h3>
                            <p>Your AI Mentor is ready. Click the chat icon in the corner to begin your recitation and get the unlock code.</p>
                        </div>
                        <div className="unlock-gate">
                            <h3>Unlock the Next Lesson</h3>
                            <p>Once your AI Mentor gives you the secret code from the chat in the corner, enter it here.</p>
                            <form onSubmit={handleUnlockSubmit}>
                                <input type="text" value={unlockCode} onChange={(e) => setUnlockCode(e.target.value)} placeholder="Enter unlock code" />
                                <button type="submit" disabled={isSubmittingCode}>{isSubmittingCode ? 'Verifying...' : 'Unlock'}</button>
                            </form>
                            {unlockStatus.message && (<p className={`status-message ${unlockStatus.error ? 'error' : 'success'}`}>{unlockStatus.message}</p>)}
                        </div>
                        <div className="mentorship-qa">
                            <h3>Mentorship Q&A</h3>
                            <p>Have a question about this lesson? Ask me directly here.</p>
                            <div className="messages-display">
                                {messages.map(msg => (<div key={msg.id} className={`message-bubble ${msg.sender}`}>{msg.text}</div>))}
                            </div>
                            <form onSubmit={handleMessageSubmit} className="message-form">
                                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your question..." />
                                <button type="submit">Send</button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
            <ChatbotPortal lesson={lessonData} />
        </>
    );
}