import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'النحال';
    setUserName(name);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="welcome-page hex-bg">
      <div className="container">
        <div className="welcome-card">
          <div className="welcome-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1 className="text-gradient">تم تفعيل حسابك بنجاح!</h1>
          <p className="welcome-message">مرحباً بك في فضاء النحالين، {userName}</p>
          <p className="welcome-subtitle">🐝 Smart Hive - مجتمع النحالين الأذكياء</p>
          <div className="redirect-info">
            <p>سيتم تحويلك إلى لوحة التحكم خلال {countdown} ثوانٍ...</p>
            <button className="btn-gold" onClick={() => navigate('/dashboard')}>
              الذهاب الآن <i className="fas fa-arrow-left"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
