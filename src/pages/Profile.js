import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    userId: '',
    dateJoined: ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // جلب بيانات المستخدم من localStorage (مؤقتاً)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // بيانات وهمية للتجربة
    setFormData({
      name: localStorage.getItem('userName') || 'أحمد النحال',
      email: localStorage.getItem('userEmail') || 'ahmed@example.com',
      phone: localStorage.getItem('userPhone') || '0555123456',
      address: localStorage.getItem('userAddress') || 'الجزائر - البليدة',
      userId: localStorage.getItem('userId') || 'BEEK-0001',
      dateJoined: '15 يناير 2026'
    });
    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // مسح الخطأ عند الكتابة
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const validateProfile = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'الاسم الكامل مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (formData.phone && formData.phone.length !== 10) newErrors.phone = 'رقم الهاتف يجب أن يكون 10 أرقام';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    
    if (!validateProfile()) return;
    
    setSaving(true);
    
    // محاكاة حفظ البيانات (مؤقتاً)
    setTimeout(() => {
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userPhone', formData.phone);
      localStorage.setItem('userAddress', formData.address);
      
      setSuccessMessage('تم حفظ التغييرات بنجاح');
      setSaving(false);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('كلمة المرور غير متطابقة');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    
    // محاكاة تغيير كلمة المرور (مؤقتاً)
    alert('تم تغيير كلمة المرور بنجاح');
    setShowPasswordModal(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (loading) {
    return (
      <div className="page-container hex-bg">
        <div className="container">
          <div className="loading">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <div className="profile-wrapper">
          <div className="profile-card">
            <div className="profile-header">
              <div className="hex-icon-large">
                <i className="fas fa-user-circle"></i>
              </div>
              <h1 className="text-gradient">الملف الشخصي</h1>
              <p>إدارة معلومات حسابك</p>
            </div>

            {successMessage && (
              <div className="success-alert">
                <i className="fas fa-check-circle"></i>
                <span>{successMessage}</span>
              </div>
            )}

            {/* معلومات العضوية */}
            <div className="membership-info">
              <div className="info-item">
                <i className="fas fa-id-card"></i>
                <span>رقم العضوية:</span>
                <strong>{formData.userId}</strong>
              </div>
              <div className="info-item">
                <i className="fas fa-calendar"></i>
                <span>تاريخ التسجيل:</span>
                <strong>{formData.dateJoined}</strong>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="profile-form">
              <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                <label><i className="fas fa-user"></i> الاسم الكامل</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="أحمد النحال"
                  disabled={saving}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                <label><i className="fas fa-envelope"></i> البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  disabled={saving}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                <label><i className="fas fa-phone"></i> رقم الهاتف</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="05XXXXXXXX"
                  maxLength="10"
                  disabled={saving}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label><i className="fas fa-map-marker-alt"></i> العنوان</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="العنوان الكامل"
                  disabled={saving}
                ></textarea>
              </div>

              <div className="profile-actions">
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      حفظ التغييرات
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn-change-password"
                  onClick={() => setShowPasswordModal(true)}
                  disabled={saving}
                >
                  <i className="fas fa-lock"></i>
                  تغيير كلمة المرور
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* نافذة تغيير كلمة المرور */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>تغيير كلمة المرور</h2>
              <button className="close-modal" onClick={() => setShowPasswordModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="password-form">
              <div className="form-group">
                <label>كلمة المرور الحالية</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group">
                <label>كلمة المرور الجديدة</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group">
                <label>تأكيد كلمة المرور</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowPasswordModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn-save">
                  حفظ كلمة المرور
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
