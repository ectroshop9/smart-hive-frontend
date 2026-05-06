import React, { useState, useEffect } from 'react';

const MyHive = () => {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://smart-hive-backend.onrender.com/api/readings/')
      .then(r => r.json())
      .then(data => {
        setReadings(data.slice(0, 15)); // آخر 15 قراءة
        setLoading(false);
      });
  }, []);

  if (loading) return <div>جاري تحميل بيانات المنحل...</div>;

  return (
    <div className="my-hive">
      <h1>🐝 منحلي</h1>
      {readings.map(r => (
        <div key={r.id} className="reading-card">
          <span>🌡️ {r.temperature_1}°C</span>
          <span>💧 {r.humidity}%</span>
          <span>⚖️ {r.weight}kg</span>
          <span>🔋 {r.battery_level}%</span>
        </div>
      ))}
    </div>
  );
};

export default MyHive;