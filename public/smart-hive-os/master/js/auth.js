// auth.js - Auto Login (i18n Ready)

let currentUser = null;

function _(key, fallback) {
    return (typeof osT === 'function' ? osT(key) : null) || fallback || key;
}

function validateLogin() {
    const u = document.getElementById('user')?.value || CONFIG.DEFAULT_USER;
    const p = document.getElementById('pass')?.value || CONFIG.DEFAULT_PASS;
    
    if (u === CONFIG.DEFAULT_USER && p === CONFIG.DEFAULT_PASS) {
        loginSuccess(u);
    } else {
        const errorEl = document.getElementById('error');
        if (errorEl) errorEl.style.display = 'block';
    }
}

function loginSuccess(user) {
    currentUser = user;
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('desktop').style.display = 'block';
    document.getElementById('taskbar').style.display = 'flex';
    
    const startMenuUser = document.getElementById('startMenuUser');
    if (startMenuUser) startMenuUser.innerText = user;
    
    localStorage.setItem('os-user', user);
    
    if (typeof initDashboard === 'function') initDashboard();
    if (typeof updateHiveSelector === 'function') updateHiveSelector();
    if (typeof updateHivesList === 'function') updateHivesList();
    if (typeof initFreeDesktop === 'function') setTimeout(initFreeDesktop, 500);
    
    const welcomeText = _('login.welcome', 'مرحباً');
    const readyText = _('login.ready', 'Smart Hive OS جاهز');
    triggerAlert(`✅ ${welcomeText} ${user} - ${readyText}`);
}

function logout() {
    currentUser = null;
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('desktop').style.display = 'none';
    document.getElementById('taskbar').style.display = 'none';
    document.querySelectorAll('.os-window').forEach(w => w.remove());
    const taskbarApps = document.getElementById('taskbarApps');
    if (taskbarApps) taskbarApps.innerHTML = '';
    localStorage.removeItem('os-user');
    
    const logoutText = _('login.loggedOut', 'تم تسجيل الخروج');
    triggerAlert('👋 ' + logoutText);
}

function changePassword() {
    const promptText = _('settings.changePassword', 'أدخل كلمة المرور الجديدة:');
    const newPass = prompt(promptText);
    if (newPass && newPass.length >= 4) {
        const successText = _('login.passwordChanged', 'تم تغيير كلمة المرور');
        triggerAlert('✅ ' + successText);
    }
}

// ==================== تسجيل تلقائي ====================
(function autoLogin() {
    const savedUser = localStorage.getItem('os-user');
    if (savedUser) {
        loginSuccess(savedUser);
    } else {
        loginSuccess(CONFIG.DEFAULT_USER);
    }
})();

console.log('✅ Auth loaded (Auto Login + i18n Ready)');