import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Contact.css';

function Contact() {
  const { t } = useTranslation();
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
          <h1 className="text-gradient">{t('contact.title')}</h1>
          <p className="page-subtitle">{t('contact.subtitle')}</p>
        </div>

        <div className="contact-page-wrapper">
          <div className="contact-info-cards">
            <div className="info-card">
              <i className="fas fa-phone"></i>
              <h3>{t('contact.call')}</h3>
              <p>0673310066</p>
              <small>{t('contact.hours')}</small>
            </div>
            <div className="info-card">
              <i className="fas fa-envelope"></i>
              <h3>{t('contact.email')}</h3>
              <p>support@smarthive.com</p>
              <small>{t('contact.reply')}</small>
            </div>
            <div className="info-card">
              <i className="fab fa-whatsapp"></i>
              <h3>{t('contact.whatsapp')}</h3>
              <p>+213673310066</p>
              <small>{t('contact.instant')}</small>
            </div>
            <div className="info-card">
              <i className="fas fa-map-marker-alt"></i>
              <h3>{t('contact.location')}</h3>
              <p>{t('contact.city')}</p>
              <small>{t('contact.hq')}</small>
            </div>
          </div>

          <div className="contact-form-container">
            {submitted ? (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <h3>{t('contact.sent')}</h3>
                <p>{t('contact.thanks')}</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('contact.name')}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('contact.namePlaceholder')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('contact.emailLabel')}</label>
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
                    <label>{t('contact.phone')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="05XXXXXXXX"
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('contact.subject')}</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t('contact.subjectPlaceholder')}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>{t('contact.message')}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    placeholder={t('contact.messagePlaceholder')}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      {t('contact.sending')}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      {t('contact.send')}
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