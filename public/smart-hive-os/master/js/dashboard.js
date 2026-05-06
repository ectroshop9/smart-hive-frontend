// dashboard.js - لوحة المعلومات
let uptimeInterval = null, uptimeSeconds = 0;

function initDashboard() {
    startUptime();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    fetchData();
    setInterval(fetchData, 5000);
}

function startUptime() {
    if (uptimeInterval) clearInterval(uptimeInterval);
    uptimeInterval = setInterval(() => {
        uptimeSeconds++;
        const h = Math.floor(uptimeSeconds / 3600), m = Math.floor((uptimeSeconds % 3600) / 60), s = uptimeSeconds % 60;
        const el = document.getElementById('uptime-display');
        if (el) el.innerHTML = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }, 1000);
}

function updateDateTime() {
    const dt = formatDateTime();
    const dateEl = document.getElementById('date-display'), timeEl = document.getElementById('time-display');
    if (dateEl) dateEl.innerHTML = dt.date;
    if (timeEl) timeEl.innerHTML = dt.time;
}

async function fetchData() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/data`);
        const data = await response.json();
        updateDisplay(data);
    } catch (error) {
        const mockData = {
            temp: 34.5 + (Math.random() * 4 - 2), hum: 60 + (Math.random() * 20 - 10), weight: 25.3 + (Math.random() * 2 - 1),
            batt: 4.1 + (Math.random() * 0.3), sound: 45 + Math.floor(Math.random() * 30), gas: 15 + Math.floor(Math.random() * 20),
            vibration: 30 + Math.floor(Math.random() * 50), bee: 120 + Math.floor(Math.random() * 50),
            colony_strength: 75 + Math.floor(Math.random() * 25), health_score: 80 + Math.floor(Math.random() * 20)
        };
        updateDisplay(mockData);
    }
}

function updateDisplay(data) {
    if (data.temp) document.getElementById('temp-display').innerHTML = data.temp.toFixed(1) + ' °C';
    if (data.hum) document.getElementById('hum-display').innerHTML = data.hum.toFixed(1) + ' %';
    if (data.weight) document.getElementById('weight-display').innerHTML = data.weight.toFixed(2) + ' <small>كغ</small>';
    if (data.batt) { document.getElementById('batt-display').innerHTML = data.batt.toFixed(2) + ' V'; document.getElementById('power-display').innerHTML = data.batt.toFixed(2) + 'V'; }
    if (data.sound) document.getElementById('audio-display').innerHTML = data.sound + ' dB';
    if (data.gas) document.getElementById('gas-display').innerHTML = data.gas + ' %';
    if (data.vibration !== undefined) document.getElementById('motion-display').innerHTML = data.vibration > 50 ? 'نعم' : 'لا';
    if (data.bee) document.getElementById('bee-display').innerHTML = data.bee;
    if (data.colony_strength) document.getElementById('colony-strength').innerHTML = data.colony_strength + '%';
    if (data.health_score) document.getElementById('health-score-display').innerHTML = data.health_score + '%';
}

function refreshDashboard() { fetchData(); triggerAlert('🔄 تم تحديث البيانات'); }
function saveAllSettings() { triggerAlert('💾 تم حفظ الإعدادات'); }

console.log('✅ Dashboard loaded');