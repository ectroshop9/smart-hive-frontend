import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ActivationSuccess.css';

function ActivationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName || 'نحال';

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
        <h1 className="text-gradient">تم تفعيل حسابك بنجاح!</h1>
        <p className="welcome-text">مرحباً بك <span>{userName}</span> في فضاء النحال 🎉</p>
        <p className="redirect-text">جاري تحويلك إلى لوحة التحكم...</p>
        <button className="btn-gold" onClick={() => navigate('/dashboard')}>
          <i className="fas fa-arrow-left"></i> دخول إلى لوحة التحكم
        </button>
      </div>
    </div>
  );
}

export default ActivationSuccess;
