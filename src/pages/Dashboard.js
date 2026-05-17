import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import LogoutModal from '../components/LogoutModal';
import { getSecureItem, removeSecureItem } from '../utils/encrypt';
import './Dashboard.css';

// ==================== نظرة عامة (النسخة الأصلية) ====================
const Overview = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalHives: 0, activeDevices: 0, avgTemp: 0, avgHumidity: 0,
    avgWeight: 0, co2: 0, sound: 0, vibration: 0,
    light: 0, uv: 0, battery: 0, signal: 0
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
          totalHives: devices.length, activeDevices: active,
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
        setLastUpdate(new Date().toLocaleString('ar-EG'));
        setLoading(false);
      })
      .catch(() => { setLastUpdate(new Date().toLocaleString('ar-EG')); setLoading(false); });
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

// ==================== باقي المكونات كما هي ====================
const Alerts = () => {
  const { t } = useTranslation();
  const alerts = [
    { type: 'danger', icon: '🌡️', msg: `${t('dashboard.highTemp')}: 39°C` },
    { type: 'warning', icon: '🔋', msg: `${t('dashboard.lowBattery')}: 18%` },
    { type: 'success', icon: '✅', msg: t('dashboard.allNormal') }
  ];

  return (
    <div className="dashboard-page">
      <h1 className="page-title text-gradient">🔔 {t('dashboard.alerts')}</h1>
      <div className="alerts-list">
        {alerts.map((alert, i) => (
          <div key={i} className={`alert-card alert-${alert.type}`}>
            <span className="alert-icon">{alert.icon}</span>
            <span className="alert-msg">{alert.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MyHive = () => <div className="dashboard-page"><h1 className="page-title text-gradient">🐝 منحلي</h1></div>;
const Certificates = () => <div className="dashboard-page"><h1 className="page-title text-gradient">📜 شهادات المنشأ</h1></div>;
const MyDevices = () => <div className="dashboard-page"><h1 className="page-title text-gradient">📱 أجهزتي</h1></div>;
const Profile = () => <div className="dashboard-page"><h1 className="page-title text-gradient">👤 حسابي</h1></div>;

function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pageLoading] = useState(false);

  useEffect(() => {
    const name = getSecureItem('userName') || t('sidebar.role');
    setUserName(name);
    
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';

    return () => {
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, [t]);

  const handleLogoutConfirm = () => {
    removeSecureItem('isLoggedIn');
    removeSecureItem('authToken');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar userName={userName} onLogout={() => setShowLogoutModal(true)} />
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
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        userName={userName}
      />
    </div>
  );
}

export default Dashboard;