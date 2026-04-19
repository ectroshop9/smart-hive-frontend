import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContext } from '../App';
import './Activate.css';

function Activate() {
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);
  const [formData, setFormData] = useState({
    serialKey: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      addToast('كلمة المرور غير متطابقة', 'error');
      return;
    }
    addToast('تم تفعيل الحساب بنجاح!', 'success');
    navigate('/login');
  };

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <div className="activate-wrapper">
          <div className="activate-card">
            <div className="activate-header">
              <div className="hex-icon-large">
                <i className="fas fa-key"></i>
              </div>
              <h1 className="text-gradient">تفعيل الجهاز</h1>
              <p>أدخل كود التفعيل الموجود مع جهازك</p>
            </div>

            <form onSubmit={handleSubmit} className="activate-form">
              <div className="form-group">
                <label><i className="fas fa-ticket-alt"></i> كود التفعيل</label>
                <input type="text" name="serialKey" value={formData.serialKey} onChange={handleChange} placeholder="SMART-XXXX-XXXX" required />
              </div>
              <div className="form-row">
                <div className="form-group"><label><i className="fas fa-user"></i> الاسم الكامل</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
                <div className="form-group"><label><i className="fas fa-phone"></i> رقم الهاتف</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required /></div>
              </div>
              <div className="form-group"><label><i className="fas fa-envelope"></i> البريد الإلكتروني</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
              <div className="form-row">
                <div className="form-group"><label><i className="fas fa-lock"></i> كلمة المرور</label><input type="password" name="password" value={formData.password} onChange={handleChange} required /></div>
                <div className="form-group"><label><i className="fas fa-lock"></i> تأكيد كلمة المرور</label><input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} required /></div>
              </div>
              <div className="form-group"><label><i className="fas fa-map-marker-alt"></i> عنوان الشحن (اختياري)</label><textarea name="address" value={formData.address} onChange={handleChange} rows="3"></textarea></div>
              <button type="submit" className="btn-activate-submit"><i className="fas fa-check-circle"></i> تفعيل الحساب</button>
            </form>
            <div className="activate-footer"><p>لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link></p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Activate;
