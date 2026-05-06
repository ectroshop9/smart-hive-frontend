import React, { useState, useEffect } from 'react';
import './PasswordStrengthMeter.css';

function PasswordStrengthMeter({ password }) {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setLabel('');
      setColor('');
      return;
    }

    let score = 0;
    
    // طول كلمة المرور
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 10;
    
    // أحرف كبيرة وصغيرة
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 20;
    
    // أرقام
    if (/\d/.test(password)) score += 20;
    
    // رموز خاصة
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    
    // حد أقصى 100
    score = Math.min(score, 100);
    
    setStrength(score);
    
    // تحديد التسمية واللون
    if (score < 30) {
      setLabel('ضعيفة جداً');
      setColor('#ff4444');
    } else if (score < 60) {
      setLabel('متوسطة');
      setColor('#ffa500');
    } else if (score < 80) {
      setLabel('جيدة');
      setColor('#2196f3');
    } else {
      setLabel('قوية');
      setColor('#4caf50');
    }
  }, [password]);

  if (!password) return null;

  return (
    <div className="password-strength-meter">
      <div className="strength-bar-container">
        <div 
          className="strength-bar" 
          style={{ width: `${strength}%`, backgroundColor: color }}
        ></div>
      </div>
      <div className="strength-info">
        <span className="strength-label" style={{ color: color }}>
          {label}
        </span>
        <span className="strength-percentage">{strength}%</span>
      </div>
    </div>
  );
}

export default PasswordStrengthMeter;
