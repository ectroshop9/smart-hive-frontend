import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MobileMenu.css';

function MobileMenu({ isLoggedIn, userName, onLogout, scrollToContact }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mobile-menu-container">
      <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
        <i className={`fas fa-${isOpen ? 'times' : 'bars'}`}></i>
      </button>
      
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>الرئيسية</Link>
        <Link to="/store" onClick={() => setIsOpen(false)}>المتجر</Link>
        <button className="mobile-link" onClick={() => { scrollToContact(); setIsOpen(false); }}>راسلنا</button>
        
        {!isLoggedIn ? (
          <>
            <Link to="/activate" onClick={() => setIsOpen(false)} className="mobile-special">تسجيل</Link>
            <Link to="/login" onClick={() => setIsOpen(false)}>دخول</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" onClick={() => setIsOpen(false)}>لوحة التحكم</Link>
            <Link to="/dashboard/profile" onClick={() => setIsOpen(false)}>الملف الشخصي</Link>
            <button onClick={() => { onLogout(); setIsOpen(false); }} className="logout-btn">تسجيل الخروج</button>
          </>
        )}
      </div>
    </div>
  );
}

export default MobileMenu;
