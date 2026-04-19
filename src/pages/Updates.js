import React from 'react';
import './Updates.css';

function Updates() {
  const masterUpdates = [
    { version: '6.0.0', date: '2024-04-15', size: '1.2 MB', changes: 'تحسين استقرار Mesh، إضافة دعم OTA' },
    { version: '5.2.0', date: '2024-03-01', size: '1.1 MB', changes: 'إصلاحات أمنية، تحسين الأداء' },
    { version: '5.0.0', date: '2024-01-10', size: '1.0 MB', changes: 'إصدار أولي' },
  ];

  const slaveUpdates = [
    { version: '2.2.0', date: '2024-04-15', size: '1.1 MB', changes: 'تحسين استهلاك الطاقة، إصلاح I2C' },
    { version: '2.1.0', date: '2024-02-20', size: '1.0 MB', changes: 'إضافة Battery Health، ضغط البيانات' },
    { version: '2.0.0', date: '2024-01-10', size: '0.9 MB', changes: 'إصدار أولي' },
  ];

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <h1 className="page-title text-gradient text-center">التحديثات والبرامج الثابتة</h1>
        <p className="page-subtitle text-center">أحدث إصدارات Firmware للماستر والسلايف</p>
        
        <div className="updates-page-grid">
          <div className="update-column">
            <div className="update-header master">
              <i className="fas fa-server"></i>
              <h3>تحديثات الماستر</h3>
              <span className="latest-badge">أحدث: v{masterUpdates[0].version}</span>
            </div>
            <div className="updates-list">
              {masterUpdates.map((u, i) => (
                <div key={i} className={`update-item ${i === 0 ? 'latest' : ''}`}>
                  <div className="update-version">
                    <span className="version">v{u.version}</span>
                    <span className="date">{u.date}</span>
                  </div>
                  <p className="update-changes">{u.changes}</p>
                  <div className="update-footer">
                    <span className="size">{u.size}</span>
                    <button className="download-btn"><i className="fas fa-download"></i> تحميل</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="update-column">
            <div className="update-header slave">
              <i className="fas fa-microchip"></i>
              <h3>تحديثات السلايف</h3>
              <span className="latest-badge">أحدث: v{slaveUpdates[0].version}</span>
            </div>
            <div className="updates-list">
              {slaveUpdates.map((u, i) => (
                <div key={i} className={`update-item ${i === 0 ? 'latest' : ''}`}>
                  <div className="update-version">
                    <span className="version">v{u.version}</span>
                    <span className="date">{u.date}</span>
                  </div>
                  <p className="update-changes">{u.changes}</p>
                  <div className="update-footer">
                    <span className="size">{u.size}</span>
                    <button className="download-btn"><i className="fas fa-download"></i> تحميل</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Updates;
