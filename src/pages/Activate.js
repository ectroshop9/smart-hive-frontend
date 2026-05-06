import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setSecureItem } from '../utils/encrypt';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import './Activate.css';

function Activate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serialKey: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    address: ''
  });
  
  const [errors, setErrors] = useState({});
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const validateSerialKey = (key) => {
    const pattern = /^SMART-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return pattern.test(key);
  };

  const checkEmailExists = async (email) => {
    if (!email || !email.includes('@')) return;
    
    setCheckingEmail(true);
    try {
      const response = await fetch(`${API_URL}/api/check-email/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      setEmailExists(data.exists);
      if (data.exists) {
        setErrors(prev => ({ ...prev, email: 'هذا البريد الإلكتروني مستخدم مسبقاً' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    } catch (error) {
      console.error('Error checking email:', error);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'serialKey') {
      const upperValue = value.toUpperCase();
      setFormData({ ...formData, [name]: upperValue });
      
      if (upperValue && !validateSerialKey(upperValue)) {
        setErrors(prev => ({ ...prev, serialKey: 'صيغة السيريال: SMART-XXXX-XXXX' }));
      } else {
        setErrors(prev => ({ ...prev, serialKey: '' }));
      }
      return;
    }
    
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: phoneValue });
      
      if (phoneValue && phoneValue.length < 10) {
        setErrors(prev => ({ ...prev, phone: 'رقم الهاتف يجب أن يكون 10 أرقام' }));
      } else {
        setErrors(prev => ({ ...prev, phone: '' }));
      }
      return;
    }
    
    setFormData({ ...formData, [name]: value });
    
    if (name === 'password' || name === 'passwordConfirm') {
      const password = name === 'password' ? value : formData.password;
      const confirm = name === 'passwordConfirm' ? value : formData.passwordConfirm;
      
      if (password && confirm && password !== confirm) {
        setErrors(prev => ({ ...prev, passwordConfirm: 'كلمة المرور غير متطابقة' }));
      } else {
        setErrors(prev => ({ ...prev, passwordConfirm: '' }));
      }
    }
    
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setErrors(prev => ({ ...prev, email: 'بريد إلكتروني غير صالح' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
        if (value && emailRegex.test(value)) {
          const timeoutId = setTimeout(() => checkEmailExists(value), 500);
          return () => clearTimeout(timeoutId);
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateSerialKey(formData.serialKey)) {
      setErrors(prev => ({ ...prev, serialKey: 'صيغة السيريال: SMART-XXXX-XXXX' }));
      return;
    }
    
    if (formData.phone.length !== 10) {
      setErrors(prev => ({ ...prev, phone: 'رقم الهاتف يجب أن يكون 10 أرقام' }));
      return;
    }
    
    if (formData.password !== formData.passwordConfirm) {
      setErrors(prev => ({ ...prev, passwordConfirm: 'كلمة المرور غير متطابقة' }));
      return;
    }
    
    if (emailExists) {
      setErrors(prev => ({ ...prev, email: 'هذا البريد الإلكتروني مستخدم مسبقاً' }));
      return;
    }

    setLoading(true);

    fetch(`${API_URL}/api/activate/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serial_key: formData.serialKey,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address
      })
    })
    .then(response => response.json())
    .then(data => {
      setLoading(false);
      
      if (data.success) {
        setSecureItem('isLoggedIn', 'true');
        setSecureItem('userName', formData.name);
        navigate('/activation-success', { state: { userName: formData.name } });
      } else {
        setErrors(prev => ({ ...prev, general: data.error || 'كود التفعيل غير صحيح' }));
      }
    })
    .catch(error => {
      setLoading(false);
      setErrors(prev => ({ ...prev, general: 'فشل الاتصال بالسيرفر' }));
    });
  };

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <div className="activate-wrapper">
          <div className="activate-card">
            <div className="activate-header">
              <div className="hex-icon-large"><i className="fas fa-key"></i></div>
              <h1 className="text-gradient">تسجيل</h1>
              <p>أدخل السيريال الموجود مع الجهاز</p>
            </div>

            {errors.general && (
              <div className="error-alert">
                <i className="fas fa-exclamation-circle"></i>
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="activate-form">
              <div className={`form-group ${errors.serialKey ? 'has-error' : ''}`}>
                <label><i className="fas fa-ticket-alt"></i> السيريال</label>
                <input 
                  type="text" 
                  name="serialKey" 
                  value={formData.serialKey} 
                  onChange={handleChange} 
                  placeholder="SMART-XXXX-XXXX" 
                  required 
                  disabled={loading}
                  maxLength="15"
                />
                {errors.serialKey && <span className="error-message">{errors.serialKey}</span>}
              </div>
              
              <div className="form-row">
                <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                  <label><i className="fas fa-user"></i> الاسم الكامل</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={loading} />
                </div>
                <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                  <label><i className="fas fa-phone"></i> رقم الهاتف</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    disabled={loading}
                    maxLength="10"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>
              
              <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                <label><i className="fas fa-envelope"></i> البريد الإلكتروني</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                />
                {checkingEmail && <span className="info-message"><i className="fas fa-spinner fa-spin"></i> جاري التحقق...</span>}
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label><i className="fas fa-lock"></i> كلمة المرور</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required disabled={loading} />
                  <PasswordStrengthMeter password={formData.password} />
                </div>
                <div className={`form-group ${errors.passwordConfirm ? 'has-error' : ''}`}>
                  <label><i className="fas fa-lock"></i> تأكيد كلمة المرور</label>
                  <input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} required disabled={loading} />
                  {errors.passwordConfirm && <span className="error-message">{errors.passwordConfirm}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label><i className="fas fa-map-marker-alt"></i> عنوان الشحن (اختياري)</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows="3" disabled={loading}></textarea>
              </div>
              
              <button type="submit" className="btn-activate-submit" disabled={loading}>
                <i className={`fas fa-${loading ? 'spinner fa-spin' : 'check-circle'}`}></i> 
                {loading ? 'جاري التسجيل...' : 'تسجيل'}
              </button>
            </form>
            
            <div className="activate-footer">
              <p>لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Activate;
