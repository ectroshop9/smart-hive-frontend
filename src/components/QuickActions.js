import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuickActions.css';

function QuickActions() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: 'shopping-cart', label: 'المتجر', action: () => navigate('/store') },
    { icon: 'headset', label: 'الدعم', action: () => document.querySelector('.support-alt')?.scrollIntoView({ behavior: 'smooth' }) },
    { icon: 'arrow-up', label: 'الأعلى', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  ];

  return (
    <div className="quick-actions">
      {isOpen && (
        <div className="quick-menu">
          {actions.map((a, i) => (
            <button key={i} onClick={a.action} title={a.label}>
              <i className={`fas fa-${a.icon}`}></i>
            </button>
          ))}
        </div>
      )}
      <button className="quick-toggle" onClick={() => setIsOpen(!isOpen)}>
        <i className={`fas fa-${isOpen ? 'times' : 'plus'}`}></i>
      </button>
    </div>
  );
}

export default QuickActions;
