import React, { useState, useEffect, useCallback } from 'react';
import { getSecureItem } from '../utils/encrypt';
import './MyDevices.css';

const MyDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [macAddress, setMacAddress] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [notes, setNotes] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  const userId = getSecureItem('userId');
  const token = getSecureItem('authToken');

  const fetchDevices = useCallback(() => {
    setLoading(true);
    setError('');
    fetch(`https://smart-hive-backend.onrender.com/api/devices/list/?user_id=${userId}`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' }
    })
      .then(r => { if (!r.ok) throw new Error('فشل في جلب الأجهزة'); return r.json(); })
      .then(data => { setDevices(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [userId, token]);

  useEffect(() => { fetchDevices(); }, [fetchDevices]);

  const handleAddDevice = (e) => {
    e.preventDefault();
    setAdding(true);
    setAddError('');
    setAddSuccess('');

    const macRegex = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i;
    if (!macAddress.trim() || !macRegex.test(macAddress.trim())) {
      setAddError('يرجى إدخال MAC Address صحيح. مثال: AA:BB:CC:DD:EE:FF');
      setAdding(false);
      return;
    }

    fetch('https://smart-hive-backend.onrender.com/api/devices/register/', {
      method: 'POST',
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: deviceName.trim() || `جهاز ${macAddress.trim().slice(-5)}`,
        mac_address: macAddress.trim().toUpperCase(),
        device_type: 'MASTER',
        notes: notes.trim(),
        user: userId
      })
    })
      .then(r => { if (!r.ok) return r.json().then(err => { throw new Error(JSON.stringify(err)); }); return r.json(); })
      .then(() => {
        setAddSuccess('✅ تم إضافة الجهاز بنجاح!');
        setMacAddress(''); setDeviceName(''); setNotes('');
        setAdding(false); setShowAddForm(false);
        fetchDevices();
      })
      .catch(err => { setAddError(err.message); setAdding(false); });
  };

  if (loading) return (
    <div className="dashboard-page">
      <h1 className="page-title text-gradient">📱 أجهزتي</h1>
      <div className="loading-spinner-container"><div className="loading-spinner"></div><p>جاري التحميل...</p></div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <h1 className="page-title text-gradient">📱 أجهزتي</h1>

      {error && <div className="message-error">❌ {error}</div>}
      {addError && <div className="message-error">❌ {addError}</div>}
      {addSuccess && <div className="message-success">{addSuccess}</div>}

      {devices.length === 0 && !showAddForm ? (
        <div className="no-devices">
          <p>لا توجد أجهزة مسجلة بعد.</p>
          <p className="subtle-text">قم بإضافة جهاز الماستر (ESP32-S3) الخاص بك.</p>
        </div>
      ) : (
        <div className="devices-list">
          {devices.map(device => (
            <div key={device.id} className="device-card">
              <div className="device-icon">{device.is_online ? '🟢' : '🔴'}</div>
              <div className="device-info">
                <h3>{device.name || 'جهاز بدون اسم'}</h3>
                <p className="device-mac">🔖 MAC: {device.mac_address || 'غير محدد'}</p>
                <p className="device-type">📟 النوع: {device.device_type === 'MASTER' ? 'ماستر' : 'تابع'}</p>
                {device.notes && <p className="device-notes">📝 {device.notes}</p>}
                <p className="device-date">📅 آخر ظهور: {device.last_seen ? new Date(device.last_seen).toLocaleDateString('ar-SA') : 'لم يتصل بعد'}</p>
              </div>
              <div className="device-status">
                <span className={`status-badge ${device.is_online ? 'online' : 'offline'}`}>{device.is_online ? 'متصل' : 'غير متصل'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showAddForm && (
        <button className="btn btn-primary add-device-btn" onClick={() => setShowAddForm(true)}>➕ إضافة جهاز جديد</button>
      )}

      {showAddForm && (
        <div className="add-device-form">
          <h3>إضافة جهاز ماستر جديد (ESP32-S3)</h3>
          <p className="subtle-text">MAC Address مطبوع على ملصق الجهاز.</p>
          <form onSubmit={handleAddDevice}>
            <div className="form-group">
              <label htmlFor="macAddress">📱 MAC Address *</label>
              <input id="macAddress" type="text" value={macAddress} onChange={e => setMacAddress(e.target.value.toUpperCase())} placeholder="AA:BB:CC:DD:EE:FF" maxLength={17} required disabled={adding} />
              <small>ستة أزواج من الأرقام والحروف مفصولة بنقطتين</small>
            </div>
            <div className="form-group">
              <label htmlFor="deviceName">📝 اسم الجهاز (اختياري)</label>
              <input id="deviceName" type="text" value={deviceName} onChange={e => setDeviceName(e.target.value)} placeholder="جهاز منحل رقم 1" maxLength={50} disabled={adding} />
            </div>
            <div className="form-group">
              <label htmlFor="notes">📋 ملاحظات (اختياري)</label>
              <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="موقع الجهاز..." maxLength={500} rows={2} disabled={adding} />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={adding}>{adding ? '⏳ جاري الإضافة...' : '✅ إضافة الجهاز'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowAddForm(false); setAddError(''); setAddSuccess(''); setMacAddress(''); setDeviceName(''); setNotes(''); }} disabled={adding}>❌ إلغاء</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyDevices;