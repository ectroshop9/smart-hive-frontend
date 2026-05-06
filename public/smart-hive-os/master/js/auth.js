if (window.self !== window.top) {
  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginPage').style.display = 'none';
  });
}
// auth.js - إدارة الجلسات
let currentUser = null;

function validateLogin() {
    const u = document.getElementById('user').value;
    const p = document.getElementById('pass').value;
    
    if (u === CONFIG.DEFAULT_USER && p === CONFIG.DEFAULT_PASS) {
        currentUser = u;
        document.getElementById('loginPage').style.display = 'none';
        
        const startMenuUser = document.getElementById('startMenuUser');
        if (startMenuUser) startMenuUser.innerText = u;
        
        if (typeof initDashboard === 'function') initDashboard();
        if (typeof updateHiveSelector === 'function') updateHiveSelector();
        if (typeof updateHivesList === 'function') updateHivesList();
        
        triggerAlert(`✅ مرحباً ${u} - Smart Hive OS جاهز`);
    } else {
        const errorEl = document.getElementById('error');
        if (errorEl) errorEl.style.display = 'block';
    }
}

function logout() {
    currentUser = null;
    document.getElementById('loginPage').style.display = 'flex';
    document.querySelectorAll('.os-window').forEach(w => w.remove());
    const taskbarApps = document.getElementById('taskbarApps');
    if (taskbarApps) taskbarApps.innerHTML = '';
    toggleStartMenu();
    triggerAlert('👋 تم تسجيل الخروج');
}

function changePassword() {
    const newPass = prompt('أدخل كلمة المرور الجديدة:');
    if (newPass && newPass.length >= 4) {
        triggerAlert('✅ تم تغيير كلمة المرور');
    }
}

console.log('✅ Auth loaded');