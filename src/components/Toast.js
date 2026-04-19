import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = { success: 'check-circle', error: 'times-circle', warning: 'exclamation-triangle', info: 'info-circle' };
  const colors = { success: 'var(--neon-green)', error: 'var(--alert-red)', warning: 'var(--neon-gold)', info: 'var(--pure-white)' };

  return (
    <div className={`toast toast-${type} ${isVisible ? 'visible' : ''}`} style={{ borderColor: colors[type] }}>
      <i className={`fas fa-${icons[type]}`} style={{ color: colors[type] }}></i>
      <span>{message}</span>
      <button onClick={() => setIsVisible(false)}><i className="fas fa-times"></i></button>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => (
  <div className="toast-container">
    {toasts.map(toast => <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />)}
  </div>
);

export const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
  return { toasts, addToast, removeToast };
};
