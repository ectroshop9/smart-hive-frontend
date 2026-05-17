// hives.js - Active Hives (Mesh Edition + i18n Ready)

let hives = [];
let currentFilter = 'all';
let meshNodes = [];

function _(key, fallback) {
    return (typeof osT === 'function' ? osT(key) : null) || fallback || key;
}

async function fetchHives() {
    try {
        const meshData = await getMeshNodes();
        meshNodes = meshData.nodes || [];
        
        const connectedText = _('dashboard.connected', 'متصل');
        const nowText = _('hives.now', 'الآن');
        
        hives = meshNodes.map(node => ({
            id: `HIVE-${node.id.toString().padStart(2, '0')}`,
            status: connectedText,
            rssi: node.rssi,
            lastSeen: nowText,
            temp: 34.5, weight: 25.3,
            signal: node.rssi > -60 ? 'strong' : (node.rssi > -80 ? 'medium' : 'weak'),
            mac: node.mac || `24:0A:C4:${node.id.toString(16).padStart(2, '0')}:${(node.id*2).toString(16).padStart(2, '0')}:${(node.id*3).toString(16).padStart(2, '0')}`,
            layer: node.layer || 1
        }));
        await enrichHivesData();
    } catch (error) {
        const connectedText = _('dashboard.connected', 'متصل');
        const lastSeenText = _('hives.lastSeen', 'آخر اتصال');
        hives = [
            { id: 'HIVE-01', status: connectedText, rssi: -45, lastSeen: _('hives.now', 'الآن'), temp: 34.5, weight: 25.3, signal: 'strong', mac: '24:0A:C4:12:34:56', layer: 1 },
            { id: 'HIVE-02', status: connectedText, rssi: -62, lastSeen: _('hives.secondsAgo', 'منذ 5 ثوان'), temp: 33.2, weight: 22.1, signal: 'medium', mac: '24:0A:C4:78:90:12', layer: 1 },
            { id: 'HIVE-03', status: lastSeenText, rssi: -89, lastSeen: _('hives.minutesAgo', 'منذ 5 دقائق'), temp: 38.1, weight: 18.5, signal: 'weak', mac: '24:0A:C4:34:56:78', layer: 2 }
        ];
    }
    
    updateHivesList();
    updateHivesStats();
    updateHiveSelector();
    updateHiveAlertBadge();
    updateMeshStatusDisplay();
}

async function enrichHivesData() {
    try {
        const response = await fetch(CONFIG.ENDPOINTS.DATA);
        if (!response.ok) return;
        const data = await response.json();
        hives.forEach((hive, index) => {
            if (index === 0) { hive.temp = data.temp || 34.5; hive.weight = data.weight || 25.3; }
        });
    } catch (e) {}
}

async function updateMeshStatusDisplay() {
    const status = await getMeshStatus();
    const stateEl = document.getElementById('meshState');
    const channelEl = document.getElementById('meshChannel');
    const countEl = document.getElementById('meshDeviceCount');
    
    const connectedText = _('dashboard.connected', 'متصل');
    const disconnectedText = _('mesh.disconnected', 'غير متصل');
    
    if (stateEl) {
        stateEl.textContent = status.connected ? connectedText : disconnectedText;
        stateEl.className = `mesh-status-value ${status.connected ? 'connected' : ''}`;
    }
    if (channelEl) channelEl.textContent = status.channel || CONFIG.MESH.CHANNEL;
    if (countEl) countEl.textContent = status.total_nodes || hives.length;
}

function updateHivesList() {
    const container = document.getElementById('hives-status-list');
    if (!container) return;
    
    const connectedText = _('dashboard.connected', 'متصل');
    let filtered = currentFilter === 'connected' ? hives.filter(h => h.status === connectedText) : hives;
    const layerText = _('hives.layer', 'طبقة');
    
    container.innerHTML = filtered.map(h => `
        <div class="status-card">
            <div style="display:flex; justify-content:space-between;">
                <div>
                    <i class="fas fa-microchip"></i> 
                    <strong>${h.id}</strong>
                    ${h.layer ? `<span style="font-size:0.8rem; color:#888; margin-right:5px;">(${layerText} ${h.layer})</span>` : ''}
                </div>
                <div class="hive-actions">
                    <button onclick="editHive('${h.mac}')" title="${_('context.properties', 'تعديل')}"><i class="fas fa-edit"></i></button>
                    <button onclick="removeHive('${h.mac}')" title="${_('hives.delete', 'حذف')}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:10px;">
                <div class="signal-${h.signal}"><i class="fas fa-signal"></i> ${h.rssi} dBm</div>
                <div>
                    <i class="fas fa-circle" style="color:${h.status===connectedText?'#39ff14':'#ff3e3e'};"></i> ${h.status}
                </div>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:0.8rem; color:#888;">
                <span><i class="fas fa-microchip"></i> ${h.mac}</span>
                <span><i class="fas fa-clock"></i> ${h.lastSeen}</span>
            </div>
        </div>
    `).join('');
}

function updateHivesStats() {
    const connectedText = _('dashboard.connected', 'متصل');
    const total = hives.length;
    const connected = hives.filter(h => h.status === connectedText).length;
    document.getElementById('totalHives').innerText = total;
    document.getElementById('connectedHives').innerText = connected;
    document.getElementById('offlineHives').innerText = total - connected;
}

function updateHiveSelector() {
    const s = document.getElementById('hive-selector');
    if (s) s.innerHTML = hives.map(h => `<option value="${h.id}">${h.id} (${h.rssi} dBm)</option>`).join('');
}

function updateHiveAlertBadge() {
    const connectedText = _('dashboard.connected', 'متصل');
    const offline = hives.filter(h => h.status !== connectedText).length;
    const badge = document.getElementById('hiveAlertBadge');
    if (badge) {
        if (offline > 0) { badge.style.display = 'inline-block'; badge.innerText = offline; }
        else { badge.style.display = 'none'; }
    }
}

function filterHives(filter) { currentFilter = filter; updateHivesList(); }

function sortHivesBySignal() {
    hives.sort((a, b) => (a.rssi || -100) - (b.rssi || -100));
    updateHivesList();
    triggerAlert('📶 ' + _('hives.sortedBySignal', 'تم ترتيب الخلايا حسب قوة الإشارة'), 'info');
}

async function scanForHives() {
    triggerAlert('🔍 ' + _('hives.scanning', 'جاري مسح العقد المتصلة عبر Mesh...'), 'info');
    await scanMeshDevices();
    setTimeout(async () => {
        await fetchHives();
        const foundText = _('hives.found', 'تم العثور على');
        const hiveText = _('hives.hive', 'خلية');
        triggerAlert(`✅ ${foundText} ${hives.length} ${hiveText}`, 'info');
    }, 1500);
}

function searchHives(query) {
    if (!query) { updateHivesList(); return; }
    const filtered = hives.filter(h => h.id.toLowerCase().includes(query.toLowerCase()) || h.mac.toLowerCase().includes(query.toLowerCase()));
    const container = document.getElementById('hives-status-list');
    container.innerHTML = filtered.map(h => `
        <div class="status-card">
            <div><strong>${h.id}</strong></div>
            <div style="font-size:0.8rem; color:#888;">${h.mac}</div>
            <div style="margin-top:5px;"><span class="signal-${h.signal}">📶 ${h.rssi} dBm</span><span style="margin-right:10px;">${h.status}</span></div>
        </div>
    `).join('');
}

function editHive(mac) {
    const hive = hives.find(h => h.mac === mac);
    if (hive) {
        const newName = prompt(_('hives.newName', 'اسم جديد للخلية:'), hive.id);
        if (newName) { hive.id = newName; updateHivesList(); updateHiveSelector(); triggerAlert(`✅ ${newName}`, 'info'); }
    }
}

async function removeHive(mac) {
    if (confirm('⚠️ ' + _('hives.confirmDelete', 'هل أنت متأكد من حذف هذه الخلية؟'))) {
        try { await fetch(`${CONFIG.API_BASE}/hives/${mac}`, { method: 'DELETE' }); } catch (e) {}
        hives = hives.filter(h => h.mac !== mac);
        updateHivesList(); updateHivesStats(); updateHiveSelector(); updateHiveAlertBadge();
        triggerAlert('🗑️ ' + _('hives.deleted', 'تم حذف الخلية'), 'info');
    }
}

function getCurrentHive() {
    const selector = document.getElementById('hive-selector');
    return selector ? hives.find(h => h.id === selector.value) : hives[0];
}

async function getMeshNodeInfo(nodeId) {
    try { const d = await getMeshRSSI(nodeId); return { id: nodeId, rssi: d.rssi, connected: true }; }
    catch (e) { return { id: nodeId, rssi: -120, connected: false }; }
}

function startHivesAutoRefresh(intervalMs = 5000) {
    setInterval(async () => { await fetchHives(); }, intervalMs);
}

fetchHives();
startHivesAutoRefresh(CONFIG.MESH?.REFRESH_INTERVAL || 5000);

console.log('✅ Hives loaded (Mesh + i18n Ready)');