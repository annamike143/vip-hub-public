// --- src/app/views/VipDashboard.js (v1.1 - LINT FIX) ---
'use client';

import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { FaLock, FaPlayCircle } from 'react-icons/fa';
import Link from 'next/link';
import './VipDashboard.css';

const VipDashboard = ({ user }) => {
    const [courseContent, setCourseContent] = useState({});
    const [userProgress, setUserProgress] = useState({ unlockedLessons: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const courseRef = ref(database, 'courseContent/modules');
        const progressRef = ref(database, `users/${user.uid}/progress`);

        const unsubCourse = onValue(courseRef, (snapshot) => {
            setCourseContent(snapshot.val() || {});
        });

        const unsubProgress = onValue(progressRef, (snapshot) => {
            setUserProgress(snapshot.val() || { unlockedLessons: [] });
            setLoading(false);
        });

        return () => {
            unsubCourse();
            unsubProgress();
        };
    }, [user]);

    const sortedModules = Object.keys(courseContent).sort((a,b) => courseContent[a].order - courseContent[b].order);

    if (loading) {
        return <div className="loading-state">Loading Your Curriculum...</div>;
    }

    return (
        <div className="dashboard-container">
            <h2>Your Course Curriculum</h2>
            <p>Your journey to becoming a top affiliate starts here. Select an unlocked lesson to begin.</p>
            <div className="modules-list">
                {sortedModules.map(moduleId => {
                    const moduleData = courseContent[moduleId]; // <-- THE CORRECT VARIABLE NAME
                    const sortedLessons = moduleData.lessons ? Object.keys(moduleData.lessons).sort((a,b) => moduleData.lessons[a].order - moduleData.lessons[b].order) : [];
                    
                    return (
                        <div key={moduleId} className="module-card">
                            <h3>{moduleData.title}</h3>
                            <div className="lessons-list">
                                {sortedLessons.map(lessonId => {
                                    const lesson = moduleData.lessons[lessonId];
                                    const isUnlocked = userProgress.unlockedLessons.includes(lessonId);

                                    return (
                                        <Link 
                                            key={lessonId} 
                                            href={isUnlocked ? `/lesson/${lessonId}` : '#'} 
                                            className={`lesson-item ${isUnlocked ? 'unlocked' : 'locked'}`}
                                            onClick={(e) => !isUnlocked && e.preventDefault()}
                                        >
                                            <div className="lesson-icon">
                                                {isUnlocked ? <FaPlayCircle /> : <FaLock />}
                                            </div>
                                            <div className="lesson-details">
                                                <h4>{lesson.title}</h4>
                                                <p>{lesson.description}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VipDashboard;