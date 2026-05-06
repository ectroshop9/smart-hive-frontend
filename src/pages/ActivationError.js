import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ActivationError.css';

function ActivationError() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || 'حدث خطأ غير متوقع';
  const userName = location.state?.userName || '';

  return (
    <div className="error-page hex-bg">
      <div className="container">
        <div className="error-card">
          <div className="error-icon">
            <i className="fas fa-times-circle"></i>
          </div>
          <h1 className="text-gradient">فشل التفعيل</h1>
          {userName && <p className="user-greeting">مرحباً {userName}</p>}
          <p className="error-message">{message}</p>
          <div className="error-actions">
            <button className="btn-gold" onClick={() => navigate('/activate')}>
              <i className="fas fa-redo"></i> المحاولة مرة أخرى
            </button>
            <button className="btn-outline" onClick={() => navigate('/')}>
              <i className="fas fa-home"></i> الرئيسية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivationError;
