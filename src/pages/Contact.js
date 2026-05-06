import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      console.log('Contact form:', formData);
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <div className="page-header">
          <h1 className="text-gradient">اتصل بنا</h1>
          <p className="page-subtitle">نحن هنا للإجابة على استفساراتك</p>
        </div>

        <div className="contact-page-wrapper">
          <div className="contact-info-cards">
            <div className="info-card">
              <i className="fas fa-phone"></i>
              <h3>اتصل بنا</h3>
              <p>0673310066</p>
              <small>السبت - الخميس: 9 ص - 6 م</small>
            </div>
            <div className="info-card">
              <i className="fas fa-envelope"></i>
              <h3>البريد الإلكتروني</h3>
              <p>support@smarthive.com</p>
              <small>نرد خلال 24 ساعة</small>
            </div>
            <div className="info-card">
              <i className="fab fa-whatsapp"></i>
              <h3>واتساب</h3>
              <p>+213673310066</p>
              <small>دعم فوري</small>
            </div>
            <div className="info-card">
              <i className="fas fa-map-marker-alt"></i>
              <h3>موقعنا</h3>
              <p>ورقلة، الجزائر</p>
              <small>المقر الرئيسي</small>
            </div>
          </div>

          <div className="contact-form-container">
            {submitted ? (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <h3>تم الإرسال بنجاح</h3>
                <p>شكراً لتواصلك معنا. سنرد عليك في أقرب وقت.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>الاسم الكامل</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="أحمد النحال"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>البريد الإلكتروني</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>رقم الهاتف</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="05XXXXXXXX"
                    />
                  </div>
                  <div className="form-group">
                    <label>الموضوع</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="موضوع الرسالة"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>الرسالة</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    placeholder="اكتب رسالتك هنا..."
                    required
                  ></textarea>
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
                      إرسال الرسالة
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
