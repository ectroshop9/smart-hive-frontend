import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSecureItem, removeSecureItem } from '../utils/encrypt';
import './SessionTimeout.css';

// المدة: 15 دقيقة (900,000 مللي ثانية)
const TIMEOUT_DURATION = 15 * 60 * 1000;
// تنبيه قبل دقيقة واحدة (60,000 مللي ثانية)
const WARNING_BEFORE = 60 * 1000;

function SessionTimeout() {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // التحقق من حالة الدخول
  useEffect(() => {
    const loggedIn = getSecureItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  // تحديث وقت آخر نشاط
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
    setCountdown(60);
  }, []);

  // تسجيل الخروج
  const handleLogout = useCallback(() => {
    removeSecureItem('isLoggedIn');
    removeSecureItem('userName');
    removeSecureItem('authToken');
    removeSecureItem('userId');
    setShowWarning(false);
    navigate('/login');
  }, [navigate]);

  // تمديد الجلسة
  const handleExtend = () => {
    updateActivity();
  };

  // مراقبة نشاط المستخدم
  useEffect(() => {
    if (!isLoggedIn) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isLoggedIn, updateActivity]);

  // فحص انتهاء الجلسة
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      
      // تنبيه قبل دقيقة
      if (timeSinceLastActivity >= TIMEOUT_DURATION - WARNING_BEFORE && !showWarning) {
        setShowWarning(true);
        setCountdown(60);
      }
      
      // تسجيل خروج تلقائي
      if (timeSinceLastActivity >= TIMEOUT_DURATION) {
        handleLogout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoggedIn, lastActivity, showWarning, handleLogout]);

  // عداد تنازلي للتحذير
  useEffect(() => {
    if (!showWarning) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning]);

  if (!isLoggedIn) return null;

  return (
    <>
      {showWarning && (
        <div className="session-timeout-warning">
          <div className="warning-content">
            <div className="warning-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="warning-text">
              <h3>تنبيه انتهاء الجلسة</h3>
              <p>سيتم تسجيل خروجك تلقائياً خلال <span className="countdown">{countdown}</span> ثانية بسبب عدم النشاط.</p>
            </div>
            <div className="warning-actions">
              <button className="btn-extend" onClick={handleExtend}>
                <i className="fas fa-check"></i>
                تمديد الجلسة
              </button>
              <button className="btn-logout-now" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SessionTimeout;
