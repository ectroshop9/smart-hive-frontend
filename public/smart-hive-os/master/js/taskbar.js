// taskbar.js - Taskbar (i18n Ready)

let startMenuOpen = false;
let meshMenuOpen = false;

function _(key, fallback) {
    return (typeof osT === 'function' ? osT(key) : null) || fallback || key;
}

function toggleStartMenu() {
    const menu = document.getElementById('startMenu');
    const meshMenu = document.getElementById('meshMenu');
    if (!menu) return;
    if (meshMenu && meshMenu.style.display === 'block') {
        meshMenu.style.display = 'none';
        meshMenuOpen = false;
    }
    startMenuOpen = !startMenuOpen;
    menu.style.display = startMenuOpen ? 'block' : 'none';
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('startMenu');
    const btn = document.querySelector('.start-btn');
    if (!menu) return;
    if (startMenuOpen && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = 'none';
        startMenuOpen = false;
    }
});

function updateTaskbarClock() {
    const now = new Date();
    const lang = localStorage.getItem('os-language') || 'ar';
    const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
    const timeEl = document.getElementById('taskbarTime');
    const dateEl = document.getElementById('taskbarDate');
    if (timeEl) timeEl.textContent = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    if (dateEl) dateEl.textContent = now.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
}
setInterval(updateTaskbarClock, 1000);
updateTaskbarClock();

function updateBatteryLevel() {
    const batteryEl = document.getElementById('batteryLevel');
    if (batteryEl) batteryEl.textContent = '85%';
}
updateBatteryLevel();

function addTaskbarApp(id, name) {
    const apps = document.getElementById('taskbarApps');
    if (!apps) return;
    if (!document.getElementById(`taskbar-${id}`)) {
        const app = document.createElement('div');
        app.id = `taskbar-${id}`;
        app.className = 'taskbar-app';
        app.innerHTML = `<i class="fas fa-window-maximize"></i><span>${name}</span>`;
        app.onclick = () => { if (typeof focusWindow === 'function') focusWindow(id); };
        apps.appendChild(app);
    }
}

function removeTaskbarApp(id) {
    const app = document.getElementById(`taskbar-${id}`);
    if (app) app.remove();
}

function setActiveTaskbarApp(id) {
    document.querySelectorAll('.taskbar-app').forEach(a => a.classList.remove('active'));
    const app = document.getElementById(`taskbar-${id}`);
    if (app) app.classList.add('active');
}

function restartSystem() {
    const confirmText = _('taskbar.confirmRestart', 'هل أنت متأكد من إعادة تشغيل النظام؟');
    const restartingText = _('taskbar.restarting', 'جاري إعادة التشغيل...');
    if (confirm(confirmText)) {
        if (typeof triggerAlert === 'function') triggerAlert('🔄 ' + restartingText);
        setTimeout(() => location.reload(), 2000);
    }
}

function toggleMeshMenu(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('meshMenu');
    if (!menu) return;
    meshMenuOpen = !meshMenuOpen;
    menu.style.display = meshMenuOpen ? 'block' : 'none';
}

function getSignalBars(rssi) {
    if (rssi < -80) return 1;
    if (rssi < -65) return 2;
    if (rssi < -50) return 3;
    return 4;
}

console.log('✅ Taskbar loaded (i18n Ready)');