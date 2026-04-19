import React, { useState, useEffect } from 'react';
import './VisitorCounter.css';

function VisitorCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const random = Math.floor(Math.random() * 50) + 20;
    setCount(random);
    const interval = setInterval(() => {
      setCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="visitor-counter">
      <i className="fas fa-eye"></i>
      <span>{count}</span>
      <small>متصل الآن</small>
    </div>
  );
}

export default VisitorCounter;
