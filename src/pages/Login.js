import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContext } from '../App';
import { setSecureItem } from '../utils/encrypt';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'none';
    
    return () => {
      if (footer) footer.style.display = '';
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    if (errors.general) {
      setErrors({ ...errors, general: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    }
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok && (data.success || data.token)) {
        // تخزين مشفر
        setSecureItem('isLoggedIn', 'true');
        setSecureItem('authToken', data.token || 'dummy-token');
        setSecureItem('userName', data.name || formData.email.split('@')[0]);
        setSecureItem('userId', data.user_id || 'BEEK-0010');        
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('savedEmail', formData.email);
        }
        
        addToast('تم تسجيل الدخول بنجاح!', 'success');
        navigate('/dashboard');
      } else {
        if (response.status === 401) {
          setErrors({ general: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        } else {
          setErrors({ general: data.error || 'فشل تسجيل الدخول' });
        }
      }
    } catch (error) {
      setErrors({ general: 'فشل الاتصال بالسيرفر' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <div className="login-wrapper">
          <div className="login-card">
            <div className="login-header">
              <div className="hex-icon-large">
                <i className="fas fa-sign-in-alt"></i>
              </div>
              <h1 className="text-gradient">تسجيل الدخول</h1>
              <p>مرحباً بعودتك إلى Smart Hive</p>
            </div>

            {errors.general && (
              <div className="error-alert">
                <i className="fas fa-exclamation-circle"></i>
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                <label><i className="fas fa-envelope"></i> البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  disabled={loading}
                  autoComplete="email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                <label><i className="fas fa-lock"></i> كلمة المرور</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span>تذكرني</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">نسيت كلمة المرور؟</Link>
              </div>

              <button type="submit" className="btn-login-submit" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    جاري الدخول...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    دخول
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>ليس لديك حساب؟ <Link to="/activate">صفحة التسجيل</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
