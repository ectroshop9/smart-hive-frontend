import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Profile from './Profile';
import MyHive from './MyHive';
import Certificates from './Certificates';
import MyDevices from './MyDevices';
import LogoutModal from '../components/LogoutModal';
import { getSecureItem, removeSecureItem } from '../utils/encrypt';
import { formatDateArabic } from '../utils/formatDate';
import './Dashboard.css';

// ==================== نظرة عامة ====================
const Overview = () => {
  const [stats, setStats] = useState({
    totalHives: 0,
    avgTemp: 0,
    avgHumidity: 0,
    activeDevices: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    const token = getSecureItem('authToken');

    Promise.all([
      fetch('https://smart-hive-backend.onrender.com/api/readings/', {
        headers: { 'Authorization': `Token ${token}` }
      }).then(r => r.json()),
      fetch('https://smart-hive-backend.onrender.com/api/devices/', {
        headers: { 'Authorization': `Token ${token}` }
      }).then(r => r.json())
    ])
      .then(([readings, devices]) => {
        const latest = readings[0];
        const active = devices.filter(d => d.online).length;

        setStats({
          totalHives: devices.length,
          avgTemp: latest ? latest.temperature_1 : 0,
          avgHumidity: latest ? latest.humidity || 0 : 0,
          activeDevices: active
        });
        setLastUpdate(formatDateArabic(new Date()));
        setLoading(false);
      })
      .catch(() => {
        setLastUpdate(formatDateArabic(new Date()));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <h1 className="page-title text-gradient">لوحة التحكم</h1>
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل الإحصائيات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1 className="page-title text-gradient">لوحة التحكم</h1>
      <p className="last-update">آخر تحديث: {lastUpdate}</p>
      
      <div className="stats-grid-dash">
        <div className="stat-card-dash">
          <span className="stat-icon">🐝</span>
          <span className="stat-value">{stats.totalHives}</span>
          <span>إجمالي الخلايا</span>
        </div>
        <div className="stat-card-dash">
          <span className="stat-icon">🌡️</span>
          <span className="stat-value">{stats.avgTemp}°C</span>
          <span>متوسط الحرارة</span>
        </div>
        <div className="stat-card-dash">
          <span className="stat-icon">💧</span>
          <span className="stat-value">{stats.avgHumidity}%</span>
          <span>متوسط الرطوبة</span>
        </div>
        <div className="stat-card-dash">
          <span className="stat-icon">📱</span>
          <span className="stat-value">{stats.activeDevices}</span>
          <span>أجهزة متصلة</span>
        </div>
      </div>
    </div>
  );
};

// ==================== التنبيهات ====================
const Alerts = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const token = getSecureItem('authToken');
    fetch('https://smart-hive-backend.onrender.com/api/readings/', {
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(r => r.json())
      .then(readings => {
        const latest = readings[0];
        const newAlerts = [];
        
        if (latest) {
          if (latest.temperature_1 > 38) {
            newAlerts.push({ type: 'warning', msg: `🌡️ حرارة مرتفعة: ${latest.temperature_1}°C` });
          }
          if (latest.battery_level < 20) {
            newAlerts.push({ type: 'danger', msg: `🔋 بطارية منخفضة: ${latest.battery_level}%` });
          }
        }
        
        if (newAlerts.length === 0) {
          newAlerts.push({ type: 'success', msg: '✅ جميع المؤشرات طبيعية' });
        }
        
        setAlerts(newAlerts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <h1 className="page-title text-gradient">التنبيهات</h1>
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p>جاري فحص التنبيهات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1 className="page-title text-gradient">🔔 التنبيهات</h1>
      {alerts.map((alert, i) => (
        <div key={i} className={`alert-item alert-${alert.type}`}>
          {alert.msg}
        </div>
      ))}
    </div>
  );
};

// ==================== لوحة التحكم الرئيسية ====================
function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('نحال');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const name = getSecureItem('userName') || 'نحال';
    setUserName(name);
    
    const isLoggedIn = getSecureItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'none';

    setTimeout(() => setPageLoading(false), 500);

    return () => {
      if (footer) footer.style.display = '';
    };
  }, [navigate]);

  const handleLogoutClick = () => setShowLogoutModal(true);

  const handleLogoutConfirm = () => {
    removeSecureItem('isLoggedIn');
    removeSecureItem('userName');
    removeSecureItem('authToken');
    removeSecureItem('userId');
    setShowLogoutModal(false);
    navigate('/login');
  };

  const handleLogoutCancel = () => setShowLogoutModal(false);

  if (pageLoading) {
    return (
      <div className="page-container hex-bg">
        <div className="loading-fullpage">
          <div className="loading-spinner-large"></div>
          <h2 className="text-gradient">جاري تحميل لوحة التحكم</h2>
          <p>يرجى الانتظار...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar userName={userName} onLogout={handleLogoutClick} />
      
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/my-hive" element={<MyHive />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/my-devices" element={<MyDevices />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={userName}
      />
    </div>
  );
}

export default Dashboard;