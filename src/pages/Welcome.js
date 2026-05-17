import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const name = localStorage.getItem('userName') || t('welcome.defaultName');
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
  }, [navigate, t]);

  return (
    <div className="welcome-page hex-bg">
      <div className="container">
        <div className="welcome-card">
          <div className="welcome-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1 className="text-gradient">{t('welcome.title')}</h1>
          <p className="welcome-message">{t('welcome.message', { name: userName })}</p>
          <p className="welcome-subtitle">{t('welcome.subtitle')}</p>
          <div className="redirect-info">
            <p>{t('welcome.redirect', { count: countdown })}</p>
            <button className="btn-gold" onClick={() => navigate('/dashboard')}>
              {t('welcome.goNow')} <i className="fas fa-arrow-left"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;