import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>SMART HIVE</h4>
            <p>نظام ذكي لمراقبة خلايا النحل وإدارتها عن بعد</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>الدعم</h4>
            <Link to="/contact">اتصل بنا</Link>
            <Link to="/privacy">سياسة الخصوصية</Link>
            <Link to="/terms">شروط الاستخدام</Link>
          </div>
          
          <div className="footer-section">
            <h4>تواصل معنا</h4>
            <p><i className="fas fa-envelope"></i> support@smarthive.com</p>
            <p><i className="fas fa-phone"></i> 0673310066</p>
            <p><i className="fas fa-map-marker-alt"></i> ورقلة، الجزائر</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 Smart Hive. جميع الحقوق محفوظة</p>
          <div className="footer-hex"></div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
