import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import ThemeToggle from './ThemeToggle';
import LogoutModal from './LogoutModal';
import { getSecureItem, removeSecureItem } from '../utils/encrypt';
import './Header.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);
  
  const isActive = (path) => location.pathname === path ? 'active' : '';
  
  useEffect(() => {
    const loggedIn = getSecureItem('isLoggedIn') === 'true';
    const name = getSecureItem('userName') || '';
    setIsLoggedIn(loggedIn);
    setUserName(name);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    removeSecureItem('isLoggedIn');
    removeSecureItem('userName');
    removeSecureItem('authToken');
    removeSecureItem('userId');
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    navigate('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const scrollToContact = () => {
    if (location.pathname === '/') {
      document.querySelector('.contact-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.querySelector('.contact-section')?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-text">SmartHiveDZ</span>
        </Link>
        
        <nav className="nav-menu">
          <Link to="/" className={`nav-link ${isActive('/')}`}>الرئيسية</Link>
          <Link to="/store" className={`nav-link ${isActive('/store')}`}>المتجر</Link>
          <Link to="/smart-hive-os" className={`nav-link ${isActive('/smart-hive-os')}`}>نظام التشغيل</Link>
        </nav>
        
        <div className="header-actions">
          <ThemeToggle />
          {!isLoggedIn ? (
            <>
              <Link to="/activate" className="btn-activate"><i className="fas fa-key"></i><span>تسجيل</span></Link>
              <Link to="/login" className="btn-login"><i className="fas fa-user"></i></Link>
            </>
          ) : (
            <div className="user-menu" ref={dropdownRef}>
              <button className="btn-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <i className="fas fa-user-circle"></i>
                <span>{userName}</span>
                <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`} style={{ marginRight: '5px', fontSize: '0.8rem' }}></i>
              </button>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                    <i className="fas fa-tachometer-alt"></i> لوحة التحكم
                  </Link>
                  <Link to="/dashboard/profile" onClick={() => setDropdownOpen(false)}>
                    <i className="fas fa-user-circle"></i> الملف الشخصي
                  </Link>
                  <button onClick={handleLogoutClick}>
                    <i className="fas fa-sign-out-alt"></i> تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <MobileMenu isLoggedIn={isLoggedIn} userName={userName} onLogout={handleLogoutClick} scrollToContact={scrollToContact} />
      </div>
      
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={userName}
      />
    </header>
  );
}

export default Header;
