import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContext } from '../App';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', formData.email.split('@')[0] || 'نحال');
    addToast('تم تسجيل الدخول بنجاح!', 'success');
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', 'أحمد النحال');
    addToast('تم الدخول التجريبي بنجاح!', 'success');
    navigate('/dashboard');
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

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label><i className="fas fa-envelope"></i> البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label><i className="fas fa-lock"></i> كلمة المرور</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span>تذكرني</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">نسيت كلمة المرور؟</Link>
              </div>

              <button type="submit" className="btn-login-submit">
                <i className="fas fa-sign-in-alt"></i>
                دخول
              </button>

              <button type="button" className="btn-demo-login" onClick={handleDemoLogin}>
                <i className="fas fa-flask"></i>
                دخول تجريبي (Demo)
              </button>
            </form>

            <div className="login-footer">
              <p>ليس لديك حساب؟ <Link to="/activate">تفعيل جهاز جديد</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
