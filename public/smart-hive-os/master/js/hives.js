// hives.js - الخلايا النشطة
let hives = [];
let currentFilter = 'all';

async function fetchHives() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/hives`);
        hives = await response.json();
    } catch (error) {
        hives = [
            { id: 'HIVE-01', status: 'متصل', rssi: -45, lastSeen: 'الآن', temp: 34.5, weight: 25.3, signal: 'strong', mac: '24:0A:C4:12:34:56' },
            { id: 'HIVE-02', status: 'متصل', rssi: -62, lastSeen: 'منذ 5 ثوان', temp: 33.2, weight: 22.1, signal: 'medium', mac: '24:0A:C4:78:90:12' },
            { id: 'HIVE-03', status: 'آخر اتصال', rssi: -89, lastSeen: 'منذ 5 دقائق', temp: 38.1, weight: 18.5, signal: 'weak', mac: '24:0A:C4:34:56:78' }
        ];
    }
    updateHivesList();
    updateHivesStats();
    updateHiveSelector();
    updateHiveAlertBadge();
}

function updateHivesList() {
    const container = document.getElementById('hives-status-list');
    if (!container) return;
    let filtered = currentFilter === 'connected' ? hives.filter(h => h.status === 'متصل') : hives;
    container.innerHTML = filtered.map(h => `
        <div class="status-card">
            <div style="display:flex; justify-content:space-between;">
                <div><i class="fas fa-microchip"></i> <strong>${h.id}</strong></div>
                <div class="hive-actions">
                    <button onclick="editHive('${h.mac}')"><i class="fas fa-edit"></i></button>
                    <button onclick="removeHive('${h.mac}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:10px;">
                <div class="signal-${h.signal}"><i class="fas fa-signal"></i> ${h.rssi} dBm</div>
                <div><i class="fas fa-circle" style="color:${h.status==='متصل'?'#39ff14':'#ff3e3e'};"></i> ${h.status}</div>
            </div>
        </div>
    `).join('');
}

function updateHivesStats() {
    const total = hives.length;
    const connected = hives.filter(h => h.status === 'متصل').length;
    document.getElementById('totalHives').innerText = total;
    document.getElementById('connectedHives').innerText = connected;
    document.getElementById('offlineHives').innerText = total - connected;
}

function updateHiveSelector() {
    const s = document.getElementById('hive-selector');
    if (s) s.innerHTML = hives.map(h => `<option>${h.id}</option>`).join('');
}

function updateHiveAlertBadge() {
    const offline = hives.filter(h => h.status !== 'متصل').length;
    const badge = document.getElementById('hiveAlertBadge');
    if (badge) {
        if (offline > 0) { badge.style.display = 'inline-block'; badge.innerText = offline; }
        else { badge.style.display = 'none'; }
    }
}

function filterHives(filter) { currentFilter = filter; updateHivesList(); }
function sortHivesBySignal() { hives.sort((a,b) => (a.rssi||-100) - (b.rssi||-100)); updateHivesList(); triggerAlert('📶 تم ترتيب الخلايا'); }
function scanForHives() { triggerAlert('🔍 جاري المسح...'); setTimeout(() => { fetchHives(); triggerAlert('✅ تم التحديث'); }, 2000); }
function searchHives(query) {
    if (!query) { updateHivesList(); return; }
    const filtered = hives.filter(h => h.id.includes(query) || h.mac.includes(query));
    const container = document.getElementById('hives-status-list');
    container.innerHTML = filtered.map(h => `<div class="status-card"><div><strong>${h.id}</strong> - ${h.mac}</div></div>`).join('');
}
function editHive(mac) {
    const hive = hives.find(h => h.mac === mac);
    if (hive) { const newName = prompt('اسم جديد:', hive.id); if (newName) hive.id = newName; updateHivesList(); }
}
async function removeHive(mac) {
    if (confirm('حذف الخلية؟')) {
        try { await fetch(`${CONFIG.API_BASE}/hives/${mac}`, { method: 'DELETE' }); } catch (e) {}
        hives = hives.filter(h => h.mac !== mac);
        updateHivesList(); updateHivesStats(); updateHiveSelector(); updateHiveAlertBadge();
    }
}
function getCurrentHive() { return hives.find(h => h.id === document.getElementById('hive-selector')?.value); }

fetchHives();
console.log('✅ Hives loaded');