import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ActivationSuccess.css';

function ActivationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const userName = location.state?.userName || t('activationSuccess.defaultName');

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h1 className="text-gradient">{t('activationSuccess.title')}</h1>
        <p className="welcome-text">{t('activationSuccess.welcome', { name: userName })}</p>
        <p className="redirect-text">{t('activationSuccess.redirect')}</p>
        <button className="btn-gold" onClick={() => navigate('/dashboard')}>
          <i className="fas fa-arrow-left"></i> {t('activationSuccess.goToDashboard')}
        </button>
      </div>
    </div>
  );
}

export default ActivationSuccess;