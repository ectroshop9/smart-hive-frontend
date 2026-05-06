import React, { useState, useEffect } from 'react';
import { getSecureItem } from '../utils/encrypt';
import './Certificates.css';

const Certificates = () => {
  const [devices, setDevices] = useState([]);
  const [selectedMac, setSelectedMac] = useState('');
  const [manualMac, setManualMac] = useState('');
  const [mode, setMode] = useState('select');
  const [chain, setChain] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const userId = getSecureItem('userId');
  const token = getSecureItem('authToken');

  useEffect(() => {
    fetch(`https://smart-hive-backend.onrender.com/api/devices/list/?user_id=${userId}`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' }
    })
      .then(r => r.json())
      .then(data => setDevices(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [userId, token]);

  const fetchCertificates = () => {
    const mac = mode === 'select' ? selectedMac : manualMac;
    if (!mac.trim()) { setError('يرجى اختيار جهاز أو إدخال MAC Address'); return; }

    setLoading(true); setError(''); setSearched(true);

    fetch(`https://smart-hive-backend.onrender.com/vault/chain/?mac=${mac.trim().toUpperCase()}`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' }
    })
      .then(r => { if (!r.ok) throw new Error('فشل في جلب الشهادات'); return r.json(); })
      .then(data => { setChain(data.chain || []); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  };

  const handleVerify = (hash) => window.open(`https://smart-hive-backend.onrender.com/vault/verify/?hash=${hash}`, '_blank');

  const handlePrint = (block) => {
    const w = window.open('', '_blank');
    w.document.write(`<html dir="rtl"><head><meta charset="UTF-8"><title>وثيقة إثبات المنشأ الرقمية</title><style>body{font-family:Tahoma;padding:40px;text-align:center}.cert{border:2px solid #2e7d32;padding:30px;border-radius:16px;max-width:600px;margin:auto}.hash{font-family:monospace;font-size:11px;word-break:break-all;background:#f0f0f0;padding:10px;border-radius:8px;direction:ltr}h2{color:#2e7d32}.stamp{color:#d32f2f;font-weight:bold;font-size:20px;margin-top:20px}</style></head><body><div class="cert"><h2>📜 وثيقة إثبات المنشأ الرقمية</h2><p><strong>الجهاز:</strong> ${block.mac}</p><p><strong>البصمة:</strong></p><div class="hash">${block.hash}</div><p><strong>التاريخ:</strong> ${new Date(block.timestamp*1000).toLocaleDateString('ar-SA')}</p><p><strong>رقم الكتلة:</strong> ${block.nonce}</p><p class="stamp">✅ موثقة وغير قابلة للتزوير</p><p style="margin-top:30px">صادرة عن: <strong>Electro Shop - منصة البركة</strong></p></div></body></html>`);
    w.document.close(); w.print();
  };

  return (
    <div className="dashboard-page certificates-page">
      <h1 className="page-title text-gradient">📜 شهادات المنشأ</h1>
      <p className="subtitle">وثيقة إثبات المنشأ الرقمية لمنحلك</p>

      <div className="mode-switch">
        <button className={`mode-btn ${mode==='select'?'active':''}`} onClick={()=>setMode('select')}>📋 من أجهزتي</button>
        <button className={`mode-btn ${mode==='manual'?'active':''}`} onClick={()=>setMode('manual')}>✍️ إدخال يدوي</button>
      </div>

      <div className="search-form">
        {mode === 'select' ? (
          <div className="search-input-group">
            <select value={selectedMac} onChange={e=>setSelectedMac(e.target.value)}>
              <option value="">-- اختر جهازاً --</option>
              {devices.map(d=><option key={d.id} value={d.mac_address}>{d.name} ({d.mac_address})</option>)}
            </select>
            <button onClick={fetchCertificates} disabled={loading}>{loading?'⏳ جاري البحث...':'🔍 عرض الشهادات'}</button>
          </div>
        ) : (
          <div className="search-input-group">
            <input type="text" value={manualMac} onChange={e=>setManualMac(e.target.value.toUpperCase())} placeholder="MAC Address: AA:BB:CC:DD:EE:FF" maxLength={17} />
            <button onClick={fetchCertificates} disabled={loading}>{loading?'⏳ جاري البحث...':'🔍 عرض الشهادات'}</button>
          </div>
        )}
        {error && <div className="message-error">❌ {error}</div>}
      </div>

      {loading && <div className="loading-spinner-container"><div className="loading-spinner"></div><p>جاري تحميل الشهادات...</p></div>}

      {!loading && searched && chain.length===0 && !error && <div className="no-data"><p>لا توجد شهادات لهذا الجهاز بعد.</p></div>}

      {!loading && chain.length>0 && (
        <div className="certificates-list">
          <h3>📋 الشهادات ({chain.length})</h3>
          {chain.map(block=>(
            <div key={block.hash} className="cert-card">
              <div className="cert-card-header">
                <span className="cert-nonce">📌 كتلة #{block.nonce}</span>
                <span className="cert-date">{new Date(block.timestamp*1000).toLocaleDateString('ar-SA')}</span>
              </div>
              <div className="cert-card-body">
                <p className="cert-hash">🔐 <strong>البصمة:</strong> {block.hash.slice(0,32)}...</p>
                <p className="cert-previous">🔗 <strong>السابق:</strong> {block.previous.slice(0,32)}...</p>
                <p className="cert-mac">📱 <strong>الجهاز:</strong> {block.mac}</p>
              </div>
              <div className="cert-card-actions">
                <button className="btn btn-primary" onClick={()=>handleVerify(block.hash)}>🔍 تحقق</button>
                <button className="btn btn-secondary" onClick={()=>handlePrint(block)}>🖨️ طباعة</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !searched && <div className="empty-state"><div className="empty-icon">📜</div><h3>اختر جهازاً لعرض شهاداته</h3><p>كل شهادة هي وثيقة إثبات منشأ رقمية غير قابلة للتزوير.</p></div>}
    </div>
  );
};

export default Certificates;