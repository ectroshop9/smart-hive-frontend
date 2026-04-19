import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

// مكونات الصفحات الفرعية
const Overview = () => (
  <div className="dashboard-page">
    <h1 className="page-title text-gradient">لوحة التحكم</h1>
    <div className="stats-grid-dash">
      <div className="stat-card-dash"><span className="stat-value">3</span><span>أجهزة</span></div>
      <div className="stat-card-dash"><span className="stat-value">2</span><span>متصل</span></div>
      <div className="stat-card-dash"><span className="stat-value">3</span><span>تنبيهات</span></div>
      <div className="stat-card-dash"><span className="stat-value">v2.2.0</span><span>الإصدار</span></div>
    </div>
  </div>
);

const Devices = () => (
  <div className="dashboard-page">
    <h1 className="page-title text-gradient">الأجهزة</h1>
    <table className="devices-table">
      <thead><tr><th>المعرف</th><th>الاسم</th><th>النوع</th><th>الحالة</th></tr></thead>
      <tbody>
        <tr><td>A4F2-8C1E</td><td>ماستر المنزل</td><td>ماستر</td><td><span className="status-online">متصل</span></td></tr>
        <tr><td>B3E1-9D2F</td><td>خلية الحديقة</td><td>سلايف</td><td><span className="status-online">متصل</span></td></tr>
        <tr><td>C5D3-7A8B</td><td>خلية السطح</td><td>سلايف</td><td><span className="status-offline">غير متصل</span></td></tr>
      </tbody>
    </table>
  </div>
);

const Readings = () => <div className="dashboard-page"><h1 className="page-title text-gradient">القراءات</h1><p>الرسوم البيانية والقراءات...</p></div>;
const Alerts = () => <div className="dashboard-page"><h1 className="page-title text-gradient">التنبيهات</h1><p>قائمة التنبيهات...</p></div>;
const Settings = () => <div className="dashboard-page"><h1 className="page-title text-gradient">الإعدادات</h1><p>إعدادات الحساب والجهاز...</p></div>;

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('نحال');

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'أحمد النحال';
    setUserName(name);
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) navigate('/login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar userName={userName} onLogout={handleLogout} />
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/readings" element={<Readings />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
