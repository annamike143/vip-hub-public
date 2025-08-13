// --- src/app/views/VipDashboard.js ---
'use client';

import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { FaLock, FaPlayCircle } from 'react-icons/fa';
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
                    const module = courseContent[moduleId];
                    const sortedLessons = module.lessons ? Object.keys(module.lessons).sort((a,b) => module.lessons[a].order - module.lessons[b].order) : [];
                    
                    return (
                        <div key={moduleId} className="module-card">
                            <h3>{module.title}</h3>
                            <div className="lessons-list">
                                {sortedLessons.map(lessonId => {
                                    const lesson = module.lessons[lessonId];
                                    const isUnlocked = userProgress.unlockedLessons.includes(lessonId);

                                    return (
                                        <a 
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
                                        </a>
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