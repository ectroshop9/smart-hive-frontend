// taskbar.js - شريط المهام
let startMenuOpen = false;
let espnowMenuOpen = false;

function toggleStartMenu() {
    const menu = document.getElementById('startMenu');
    startMenuOpen = !startMenuOpen;
    menu.style.display = startMenuOpen ? 'block' : 'none';
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('startMenu');
    const btn = document.querySelector('.start-btn');
    if (startMenuOpen && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = 'none';
        startMenuOpen = false;
    }
});

function updateTaskbarClock() {
    const now = new Date();
    const timeEl = document.getElementById('taskbarTime');
    const dateEl = document.getElementById('taskbarDate');
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    if (dateEl) dateEl.textContent = now.toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
setInterval(updateTaskbarClock, 1000);
updateTaskbarClock();

function updateBatteryLevel() {
    const level = 85;
    const batteryEl = document.getElementById('batteryLevel');
    if (batteryEl) batteryEl.textContent = level + '%';
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
        app.onclick = () => focusWindow(id);
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
    if (confirm('هل أنت متأكد من إعادة تشغيل النظام؟')) {
        triggerAlert('🔄 جاري إعادة التشغيل...');
        setTimeout(() => location.reload(), 2000);
    }
}

// قائمة ESP-NOW
function toggleESPNowMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('espnowMenu');
    if (!menu) return;
    espnowMenuOpen = !espnowMenuOpen;
    menu.style.display = espnowMenuOpen ? 'block' : 'none';
    if (espnowMenuOpen) updateESPNowStatus();
    if (startMenuOpen) toggleStartMenu();
}

function updateESPNowStatus() {
    const devices = [
        { name: 'HIVE-01', mac: '24:0A:C4:12:34:56', rssi: -45 },
        { name: 'HIVE-02', mac: '24:0A:C4:78:90:12', rssi: -62 },
        { name: 'HIVE-03', mac: '24:0A:C4:34:56:78', rssi: -71 }
    ];
    const countEl = document.getElementById('espnowDeviceCount');
    if (countEl) countEl.textContent = devices.length;
    
    const listContainer = document.getElementById('espnowDeviceList');
    if (listContainer) {
        listContainer.innerHTML = devices.map(d => `
            <div class="espnow-device-item">
                <div class="espnow-device-info">
                    <i class="fas fa-microchip"></i>
                    <div><div class="espnow-device-name">${d.name}</div><div class="espnow-device-mac">${d.mac}</div></div>
                </div>
                <div class="espnow-signal"><span>${d.rssi} dBm</span></div>
            </div>
        `).join('');
    }
}

function getSignalBars(rssi) {
    let bars = 4;
    if (rssi < -80) bars = 1;
    else if (rssi < -65) bars = 2;
    else if (rssi < -50) bars = 3;
    let html = '';
    for (let i = 0; i < 4; i++) html += `<div class="espnow-signal-bar ${i < bars ? 'active' : ''}"></div>`;
    return html;
}

function scanESPNowDevices() {
    triggerAlert('🔍 جاري مسح أجهزة ESP-NOW...');
    setTimeout(() => { updateESPNowStatus(); triggerAlert('✅ تم تحديث قائمة الأجهزة'); }, 1500);
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('espnowMenu');
    const wifi = document.querySelector('.taskbar-icons .fa-wifi');
    if (espnowMenuOpen && menu && !menu.contains(e.target) && wifi && !wifi.contains(e.target)) {
        menu.style.display = 'none';
        espnowMenuOpen = false;
    }
});

console.log('✅ Taskbar loaded');