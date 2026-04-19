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
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>روابط سريعة</h4>
            <Link to="/">الرئيسية</Link>
            <Link to="/product">المنتج</Link>
            <Link to="/pricing">الأسعار</Link>
            <Link to="/store">المتجر</Link>
          </div>
          
          <div className="footer-section">
            <h4>الدعم</h4>
            <Link to="/support">مركز المساعدة</Link>
            <Link to="/contact">اتصل بنا</Link>
            <Link to="/privacy">سياسة الخصوصية</Link>
            <Link to="/terms">شروط الاستخدام</Link>
          </div>
          
          <div className="footer-section">
            <h4>تواصل معنا</h4>
            <p><i className="fas fa-envelope"></i> info@smarthive.com</p>
            <p><i className="fas fa-phone"></i> +966 00 000 0000</p>
            <p><i className="fas fa-map-marker-alt"></i> الرياض، المملكة العربية السعودية</p>
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
