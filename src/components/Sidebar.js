import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ userName, onLogout }) {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', icon: 'tachometer-alt', label: 'لوحة التحكم' },
    { path: '/dashboard/devices', icon: 'microchip', label: 'الأجهزة' },
    { path: '/dashboard/readings', icon: 'chart-line', label: 'القراءات' },
    { path: '/dashboard/alerts', icon: 'bell', label: 'التنبيهات' },
    { path: '/dashboard/settings', icon: 'cog', label: 'الإعدادات' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo" onClick={() => navigate('/')}>
          <i className="fas fa-hive"></i>
          <span>SMART HIVE</span>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="user-info">
          <span className="user-name">{userName}</span>
          <span className="user-role">نحال</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            end={item.path === '/dashboard'}
          >
            <i className={`fas fa-${item.icon}`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
