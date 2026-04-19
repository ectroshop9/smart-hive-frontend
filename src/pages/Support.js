import React from 'react';
import './Support.css';

function Support() {
  const faqs = [
    { q: 'كيف أقوم بتفعيل الجهاز؟', a: 'أدخل كود التفعيل الموجود مع جهازك في صفحة التفعيل.' },
    { q: 'كم عدد السلايفات التي يمكن توصيلها؟', a: 'يمكن توصيل حتى 10 سلايفات لكل ماستر.' },
    { q: 'هل يعمل النظام بدون إنترنت؟', a: 'نعم، شبكة Mesh تعمل محلياً بدون إنترنت.' },
    { q: 'كم تدوم البطارية؟', a: 'تدوم بطارية السلايف حتى 6 أشهر مع النوم العميق.' },
    { q: 'كيف يتم تحديث النظام؟', a: 'يتم التحديث تلقائياً عبر OTA من الماستر.' },
  ];

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <h1 className="text-gradient text-center">الدعم والمساعدة</h1>
        <p className="page-subtitle text-center">نحن هنا لمساعدتك في أي وقت</p>

        <div className="support-content">
          <div className="faq-section">
            <h2>الأسئلة الشائعة</h2>
            <div className="faq-list">
              {faqs.map((f, i) => (
                <details key={i} className="faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="contact-section">
            <h2>تواصل معنا</h2>
            <div className="contact-cards">
              <div className="contact-card">
                <i className="fas fa-phone"></i>
                <h3>اتصل بنا</h3>
                <p>+966 00 000 0000</p>
                <small>السبت - الخميس: 9 ص - 6 م</small>
              </div>
              <div className="contact-card">
                <i className="fas fa-envelope"></i>
                <h3>البريد الإلكتروني</h3>
                <p>support@smarthive.com</p>
                <small>نرد خلال 24 ساعة</small>
              </div>
              <div className="contact-card">
                <i className="fab fa-whatsapp"></i>
                <h3>واتساب</h3>
                <p>+966 00 000 0000</p>
                <small>دعم فوري</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
