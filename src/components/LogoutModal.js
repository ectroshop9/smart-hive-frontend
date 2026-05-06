import React from 'react';
import './LogoutModal.css';

function LogoutModal({ isOpen, onClose, onConfirm, userName }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon">
            <i className="fas fa-sign-out-alt"></i>
          </div>
          <h2>تأكيد تسجيل الخروج</h2>
        </div>
        
        <div className="modal-body">
          <p>هل أنت متأكد من تسجيل الخروج <span className="user-name-highlight">{userName}</span>؟</p>
          <p className="modal-note">يمكنك العودة في أي وقت باستخدام بريدك الإلكتروني وكلمة المرور.</p>
        </div>
        
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            <i className="fas fa-times"></i>
            إلغاء
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            <i className="fas fa-sign-out-alt"></i>
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
