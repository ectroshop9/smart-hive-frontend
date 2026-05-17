import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContext } from '../App';
import { setSecureItem } from '../utils/encrypt';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      newErrors.email = t('login.errors.email');
    }
    if (!formData.password) {
      newErrors.password = t('login.errors.password');
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
        setSecureItem('isLoggedIn', 'true');
        setSecureItem('authToken', data.token || 'dummy-token');
        setSecureItem('userName', data.name || formData.email.split('@')[0]);
        setSecureItem('userId', data.user_id || 'BEEK-0010');        
        
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('savedEmail', formData.email);
        }
        
        addToast(t('login.success'), 'success');
        navigate('/dashboard');
      } else {
        if (response.status === 401) {
          setErrors({ general: t('login.errors.invalid') });
        } else {
          setErrors({ general: data.error || t('login.errors.failed') });
        }
      }
    } catch (error) {
      setErrors({ general: t('login.errors.server') });
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
              <h1 className="text-gradient">{t('login.title')}</h1>
              <p>{t('login.subtitle')}</p>
            </div>

            {errors.general && (
              <div className="error-alert">
                <i className="fas fa-exclamation-circle"></i>
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                <label><i className="fas fa-envelope"></i> {t('login.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('login.emailPlaceholder')}
                  disabled={loading}
                  autoComplete="email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                <label><i className="fas fa-lock"></i> {t('login.password')}</label>
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
                  <span>{t('login.rememberMe')}</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">{t('login.forgot')}</Link>
              </div>

              <button type="submit" className="btn-login-submit" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    {t('login.loading')}
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    {t('login.button')}
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>{t('login.noAccount')} <Link to="/activate">{t('login.register')}</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;