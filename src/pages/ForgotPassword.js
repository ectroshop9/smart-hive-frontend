import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'https://smart-hive-backend.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('البريد الإلكتروني مطلوب');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/api/password-reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.error || 'فشل إرسال رابط استعادة كلمة المرور');
      }
    } catch (error) {
      setError('فشل الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="page-container hex-bg">
        <div className="container">
          <div className="forgot-password-wrapper">
            <div className="forgot-password-card">
              <div className="success-icon-large">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2 className="text-gradient">تم الإرسال</h2>
              <p>تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.</p>
              <p className="email-sent">📧 {email}</p>
              <Link to="/login" className="btn-gold">
                <i className="fas fa-arrow-right"></i> العودة لتسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <div className="forgot-password-wrapper">
          <div className="forgot-password-card">
            <div className="forgot-password-header">
              <div className="hex-icon-large">
                <i className="fas fa-lock"></i>
              </div>
              <h1 className="text-gradient">نسيت كلمة المرور</h1>
              <p>أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة كلمة المرور</p>
            </div>

            {error && (
              <div className="error-alert">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="form-group">
                <label><i className="fas fa-envelope"></i> البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    إرسال رابط الاستعادة
                  </>
                )}
              </button>
            </form>

            <div className="forgot-password-footer">
              <Link to="/login">
                <i className="fas fa-arrow-right"></i> العودة لتسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
