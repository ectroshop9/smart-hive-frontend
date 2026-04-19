import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <i className="fas fa-cookie-bite"></i>
        <p>نستخدم ملفات تعريف الارتباط لتحسين تجربتك. بالموافقة، أنت توافق على سياستنا.</p>
        <div className="cookie-buttons">
          <button className="btn-gold" onClick={accept}>موافق</button>
          <button className="btn-outline" onClick={accept}>رفض</button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
