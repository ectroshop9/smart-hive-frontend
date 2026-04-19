import React, { useState } from 'react';
import './NotificationBell.css';

function NotificationBell({ count = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'تنبيه حراري', message: 'ارتفاع درجة حرارة الخلية', time: 'منذ 5 دقائق', read: false },
    { id: 2, title: 'تحديث متوفر', message: 'الإصدار 2.3.0 متاح للتحديث', time: 'منذ 1 ساعة', read: false },
    { id: 3, title: 'انخفاض الوزن', message: 'وزن الخلية انخفض بنسبة 10%', time: 'منذ 3 ساعات', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-bell">
      <button className="bell-btn" onClick={() => setIsOpen(!isOpen)}>
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
      </button>
      
      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h4>الإشعارات</h4>
            <button className="mark-read">تحديد الكل كمقروء</button>
          </div>
          <div className="notifications-list">
            {notifications.map(n => (
              <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
                <div className="notification-content">
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                  <small>{n.time}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
