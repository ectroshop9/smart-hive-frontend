import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalHives: 0,
    activeDevices: 0,
    avgTemp: 0,
    avgHumidity: 0,
    avgWeight: 0,
    co2: 0,
    sound: 0,
    vibration: 0,
    light: 0,
    uv: 0,
    battery: 0,
    signal: 0
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
          activeDevices: active,
          avgTemp: latest ? latest.temperature_1 : 0,
          avgHumidity: latest ? latest.humidity || 0 : 0,
          avgWeight: latest ? latest.weight || 0 : 0,
          co2: latest ? latest.gas_1 || 0 : 0,
          sound: latest ? latest.sound || 0 : 0,
          vibration: latest ? latest.vibration || 0 : 0,
          light: latest ? latest.light_level || 0 : 0,
          uv: latest ? latest.uv || 0 : 0,
          battery: latest ? latest.battery_level || 0 : 0,
          signal: latest ? latest.signal_rssi || 0 : 0
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
        <h1 className="page-title text-gradient">{t('dashboard.overview')}</h1>
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p>{t('dashboard.loadingStats')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1 className="page-title text-gradient">{t('dashboard.overview')}</h1>
      <p className="last-update">{t('dashboard.lastUpdate')}: {lastUpdate}</p>
      
      <div className="stats-grid-dash">
        <div className="stat-card-dash">
          <span className="stat-icon">🐝</span>
          <span className="stat-value">{stats.totalHives}</span>
          <span>{t('dashboard.totalHives')}</span>
        </div>
        <div className="stat-card-dash">
          <span className="stat-icon">📱</span>
          <span className="stat-value">{stats.activeDevices}</span>
          <span>{t('dashboard.activeDevices')}</span>
        </div>
        <div className="stat-card-dash">
          <span className="stat-icon">🌡️</span>
          <span className="stat-value">{stats.avgTemp}°C</span>
          <span>{t('dashboard.avgTemp')}</span>
        </div>
        <div className="stat-card-dash">
          <span className="stat-icon">💧</span>
          <span className="stat-value">{stats.avgHumidity}%</span>
          <span>{t('dashboard.avgHumidity')}</span>
        </div>
        <div className="stat-card-dash">
          <span className="stat-icon">⚖️</span>
          <span className="stat-value">{stats.avgWeight}kg</span>
          <span>{t('dashboard.avgWeight')}</span>
        </div>
        <div className="stat-card-dash">
          <span className="stat-icon">🫁</span>
          <span className="stat-value">{stats.co2}</span>
          <span>{t('dashboard.co2')}</span>
        </div>
        <div className="stat-card-dash">
          <span className="stat-icon">🔊</span>
          <span className="stat-value">{stats.sound}</span>
          <span>{t('dashboard.sound')}</span>
        </div>
        <div className="stat-card-dash">
          <span className="stat-icon">📳</span>
          <span className="stat-value">{stats.vibration}</span>
          <span>{t('dashboard.vibration')}</span>
        </div>
        <div className="stat-card-dash">
          <span className="stat-icon">☀️</span>
          <span className="stat-value">{stats.light}</span>
          <span>{t('dashboard.light')}</span>
        </div>
        <div className="stat-card-dash">
          <span className="stat-icon">☢️</span>
          <span className="stat-value">{stats.uv}</span>
          <span>{t('dashboard.uv')}</span>
        </div>
        <div className="stat-card-dash">
          <span className="stat-icon">🔋</span>
          <span className="stat-value">{stats.battery}%</span>
          <span>{t('dashboard.battery')}</span>
        </div>
        <div className="stat-card-dash">
          <span className="stat-icon">📶</span>
          <span className="stat-value">{stats.signal}</span>
          <span>{t('dashboard.signal')}</span>
        </div>
      </div>
    </div>
  );
};

// ==================== التنبيهات (محسنة) ====================
const Alerts = () => {
  const { t } = useTranslation();
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
            newAlerts.push({ type: 'danger', msg: `${t('dashboard.highTemp')}: ${latest.temperature_1}°C` });
          } else if (latest.temperature_1 > 35) {
            newAlerts.push({ type: 'warning', msg: `${t('dashboard.highTemp')}: ${latest.temperature_1}°C` });
          }
          
          if (latest.humidity < 30) {
            newAlerts.push({ type: 'danger', msg: `${t('dashboard.lowHumidity')}: ${latest.humidity}%` });
          }
          
          if (latest.battery_level < 10) {
            newAlerts.push({ type: 'danger', msg: `${t('dashboard.lowBattery')}: ${latest.battery_level}%` });
          } else if (latest.battery_level < 20) {
            newAlerts.push({ type: 'warning', msg: `${t('dashboard.lowBattery')}: ${latest.battery_level}%` });
          }
          
          if (latest.gas_1 > 50) {
            newAlerts.push({ type: 'danger', msg: `${t('dashboard.highCO2')}: ${latest.gas_1}` });
          }
          
          if (latest.vibration > 100) {
            newAlerts.push({ type: 'warning', msg: `${t('dashboard.highVibration')}: ${latest.vibration}` });
          }
        }
        
        if (newAlerts.length === 0) {
          newAlerts.push({ type: 'success', msg: t('dashboard.allNormal') });
        }
        
        setAlerts(newAlerts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [t]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <h1 className="page-title text-gradient">{t('dashboard.alerts')}</h1>
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p>{t('dashboard.checkingAlerts')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1 className="page-title text-gradient">🔔 {t('dashboard.alerts')}</h1>
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
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const name = getSecureItem('userName') || t('sidebar.role');
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
  }, [navigate, t]);

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
          <h2 className="text-gradient">{t('dashboard.loading')}</h2>
          <p>{t('dashboard.pleaseWait')}</p>
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