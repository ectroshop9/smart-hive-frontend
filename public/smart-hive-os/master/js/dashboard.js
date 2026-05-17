// dashboard.js - لوحة المعلومات (Mesh Edition - i18n Ready)
let uptimeInterval = null, uptimeSeconds = 0;
let meshStatusInterval = null;
let currentHiveId = 1;

// ==================== Helper ====================
function _(key, fallback) {
    return (typeof osT === 'function' ? osT(key) : null) || fallback || key;
}

// ==================== تهيئة لوحة المعلومات ====================
function initDashboard() {
    startUptime();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    fetchData();
    fetchMeshStatus();
    setInterval(fetchData, 5000);
    setInterval(fetchMeshStatus, CONFIG.MESH?.REFRESH_INTERVAL || 3000);
}

function startUptime() {
    if (uptimeInterval) clearInterval(uptimeInterval);
    uptimeInterval = setInterval(() => {
        uptimeSeconds++;
        const h = Math.floor(uptimeSeconds / 3600), 
              m = Math.floor((uptimeSeconds % 3600) / 60), 
              s = uptimeSeconds % 60;
        const el = document.getElementById('uptime-display');
        if (el) el.innerHTML = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }, 1000);
}

function updateDateTime() {
    const dt = formatDateTime();
    const dateEl = document.getElementById('date-display');
    const timeEl = document.getElementById('time-display');
    if (dateEl) dateEl.innerHTML = dt.date;
    if (timeEl) timeEl.innerHTML = dt.time;
}

async function fetchMeshStatus() {
    try {
        if (typeof getMeshStatus === 'function') {
            const status = await getMeshStatus();
            updateMeshDisplay(status);
        }
        if (typeof getMeshRSSI === 'function' && currentHiveId) {
            const rssiData = await getMeshRSSI(currentHiveId);
            updateRSSIDisplay(rssiData.rssi);
        }
    } catch (error) {
        console.error('Mesh status error:', error);
    }
}

function updateMeshDisplay(status) {
    const hiveStatusEl = document.querySelector('.hive-status i');
    const hiveStatusText = document.querySelector('.hive-status');
    
    if (hiveStatusEl && hiveStatusText) {
        const connectedText = _('dashboard.connected', 'متصل');
        const meshText = ' (Mesh)';
        const disconnectedText = _('mesh.disconnected', 'غير متصل');
        
        if (status.connected) {
            hiveStatusEl.style.color = 'var(--neon-green)';
            hiveStatusText.innerHTML = `<i class="fas fa-circle" style="color: var(--neon-green);"></i> ${connectedText}${meshText}`;
        } else {
            hiveStatusEl.style.color = '#ff3e3e';
            hiveStatusText.innerHTML = `<i class="fas fa-circle" style="color: #ff3e3e;"></i> ${disconnectedText}`;
        }
    }
    
    const meshNodesEl = document.getElementById('mesh-nodes-display');
    if (!meshNodesEl) {
        const statsContainer = document.querySelector('.system-stats');
        if (statsContainer) {
            const meshBox = document.createElement('div');
            meshBox.className = 'system-stat-box';
            const nodesLabel = _('mesh.nodes', 'العقد المتصلة');
            meshBox.innerHTML = `
                <div class="system-stat-value" id="mesh-nodes-display">${status.total_nodes || 0}</div>
                <div class="system-stat-label">🕸️ ${nodesLabel}</div>
            `;
            statsContainer.appendChild(meshBox);
        }
    } else {
        meshNodesEl.innerHTML = status.total_nodes || 0;
    }
}

function updateRSSIDisplay(rssi) {
    let rssiEl = document.getElementById('mesh-rssi-display');
    
    if (!rssiEl) {
        const metricsGrid = document.querySelector('.metrics-grid');
        if (metricsGrid) {
            const rssiBox = document.createElement('div');
            rssiBox.className = 'm-box';
            const signalLabel = _('dashboard.signal', 'قوة الإشارة');
            rssiBox.innerHTML = `
                <small><i class="fas fa-signal"></i> ${signalLabel} (Mesh)</small>
                <div id="mesh-rssi-display" class="metric-value">-- dBm</div>
            `;
            metricsGrid.appendChild(rssiBox);
            rssiEl = document.getElementById('mesh-rssi-display');
        }
    }
    
    if (rssiEl) {
        rssiEl.innerHTML = `${rssi} dBm`;
        if (rssi > -60) rssiEl.style.color = '#39ff14';
        else if (rssi > -80) rssiEl.style.color = '#ffaa00';
        else rssiEl.style.color = '#ff3e3e';
    }
}

async function fetchData() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/data`);
        const data = await response.json();
        updateDisplay(data);
    } catch (error) {
        const mockData = {
            temp: 34.5 + (Math.random() * 4 - 2), 
            hum: 60 + (Math.random() * 20 - 10), 
            weight: 25.3 + (Math.random() * 2 - 1),
            batt: 4.1 + (Math.random() * 0.3), 
            sound: 45 + Math.floor(Math.random() * 30), 
            gas: 15 + Math.floor(Math.random() * 20),
            uv: 30 + Math.floor(Math.random() * 40),
            vibration: 30 + Math.floor(Math.random() * 50), 
            colony: 75 + Math.floor(Math.random() * 25), 
            health: 80 + Math.floor(Math.random() * 20)
        };
        updateDisplay(mockData);
    }
}

function updateDisplay(data) {
    if (data.temp !== undefined) {
        document.getElementById('temp-display').innerHTML = data.temp.toFixed(1) + ' °C';
    }
    if (data.hum !== undefined) {
        document.getElementById('hum-display').innerHTML = data.hum.toFixed(1) + ' %';
    }
    if (data.weight !== undefined) {
        document.getElementById('weight-display').innerHTML = data.weight.toFixed(2) + ' <small>kg</small>';
    }
    if (data.batt !== undefined) {
        document.getElementById('batt-display').innerHTML = data.batt.toFixed(2) + ' V';
        document.getElementById('power-display').innerHTML = data.batt.toFixed(2) + 'V';
        const batteryPercent = Math.min(100, Math.max(0, ((data.batt - 3.3) / (4.2 - 3.3)) * 100));
        const batteryEl = document.getElementById('batteryLevel');
        if (batteryEl) batteryEl.textContent = Math.round(batteryPercent) + '%';
    }
    if (data.sound !== undefined) {
        document.getElementById('audio-display').innerHTML = data.sound + ' dB';
    }
    if (data.gas !== undefined) {
        document.getElementById('gas-display').innerHTML = data.gas + ' %';
    }
    if (data.uv !== undefined) {
        document.getElementById('uv-display').innerHTML = data.uv + ' %';
    }
    if (data.vibration !== undefined) {
        const yesText = _('dashboard.yes', 'نعم');
        const noText = _('dashboard.no', 'لا');
        document.getElementById('motion-display').innerHTML = data.vibration > 50 ? yesText : noText;
    }
    if (data.colony !== undefined) {
        document.getElementById('colony-strength').innerHTML = data.colony + '%';
    }
    if (data.health !== undefined) {
        document.getElementById('health-score-display').innerHTML = data.health + '%';
    }
}

function setCurrentHive(hiveId) {
    currentHiveId = hiveId;
    fetchMeshStatus();
    fetchData();
    const selector = document.getElementById('hive-selector');
    if (selector) {
        selector.value = `HIVE-${hiveId.toString().padStart(2, '0')}`;
    }
}

function refreshDashboard() { 
    fetchData(); 
    fetchMeshStatus();
    const updatedText = _('dashboard.updated', 'تم تحديث البيانات');
    triggerAlert('🔄 ' + updatedText, 'info'); 
}

async function showMeshDetails() {
    try {
        const status = await getMeshStatus();
        const nodes = await getMeshNodes();
        const meshStatusLabel = _('mesh.status', 'حالة Mesh');
        const connectedLabel = _('mesh.connected', 'متصل');
        const rootLabel = _('mesh.root', 'العقدة الجذرية');
        const nodesLabel = _('mesh.nodes', 'عدد العقد');
        const channelLabel = _('mesh.channel', 'القناة');
        const meshIdLabel = _('mesh.id', 'معرف الشبكة');
        
        const message = `
            📡 ${meshStatusLabel}:
            • ${connectedLabel}: ${status.connected ? '✅' : '❌'}
            • ${rootLabel}: ${status.is_root ? '✅' : '❌'}
            • ${nodesLabel}: ${status.total_nodes}
            • ${channelLabel}: ${status.channel}
            • ${meshIdLabel}: ${status.mesh_id || 'WHIVE'}
        `;
        triggerAlert(message, 'info');
    } catch (e) {
        triggerAlert('❌ ' + _('mesh.error', 'فشل جلب تفاصيل Mesh'), 'error');
    }
}

function stopDashboardUpdates() {
    if (uptimeInterval) { clearInterval(uptimeInterval); uptimeInterval = null; }
    if (meshStatusInterval) { clearInterval(meshStatusInterval); meshStatusInterval = null; }
}

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    const selector = document.getElementById('hive-selector');
    if (selector) {
        selector.addEventListener('change', (e) => {
            const match = e.target.value.match(/HIVE-(\d+)/);
            if (match) setCurrentHive(parseInt(match[1]));
        });
    }
});

window.addEventListener('beforeunload', () => stopDashboardUpdates());
console.log('✅ Dashboard loaded (i18n Ready)');