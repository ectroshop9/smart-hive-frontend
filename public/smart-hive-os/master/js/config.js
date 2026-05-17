// config.js - Smart Hive OS Configuration
const CONFIG = {
    API_BASE: '/api',
    APP_NAME: 'Smart Hive OS',
    VERSION: '6.0.0',
    DEFAULT_USER: 'admin',
    DEFAULT_PASS: '1234',
    WILAYA_LIST: [
        "1 - أدرار", "2 - الشلف", "3 - الأغواط", "4 - أم البواقي",
        "5 - باتنة", "6 - بجاية", "7 - بسكرة", "8 - بشار",
        "9 - البليدة", "10 - البويرة", "11 - تمنراست", "12 - تبسة",
        "13 - تلمسان", "14 - تيارت", "15 - تيزي وزو", "16 - الجزائر"
    ],
    
    ENDPOINTS: {
        DATA: '/api/data',
        HIVE_HEALTH: '/api/hive/',
        HIVE_STATS: '/api/hive/',
        HIVE_CONTROL: '/api/hive/',
        OTA_CHECK: '/api/ota/check',
        OTA_DOWNLOAD: '/api/ota/download',
        OTA_PROGRESS: '/api/ota/progress',
        MESH_STATUS: '/api/mesh/status',
        MESH_NODES: '/api/mesh/nodes',
        MESH_RSSI: '/api/mesh/rssi',
        MESH_COMMAND: '/api/mesh/command'
    },
    
    MESH: {
        CHANNEL: 1,
        SSID: 'SmartHiveMesh',
        REFRESH_INTERVAL: 3000
    }
};

// ==================== Utility Functions ====================

function triggerAlert(message, type = 'info') {
    const toast = document.getElementById('alertToast');
    const msg = document.getElementById('alertMsg');
    const title = document.querySelector('.toast-title');
    if (toast && msg) {
        msg.innerText = message;
        // استخدام الترجمة للعنوان
        if (typeof osT === 'function') {
            title.innerText = type === 'error' ? '❌ ' + osT('login.error') : osT('alert.title');
        } else {
            title.innerText = type === 'error' ? '❌ خطأ' : 'تنبيه النظام';
        }
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

function formatDateTime() {
    const d = new Date();
    const lang = localStorage.getItem('os-language') || 'ar';
    const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
    
    return {
        date: d.toLocaleDateString(locale),
        time: d.toLocaleTimeString(locale)
    };
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen();
    }
}

// ==================== Mesh API Functions ====================

async function getMeshStatus() {
    try {
        const response = await fetch(CONFIG.ENDPOINTS.MESH_STATUS);
        if (!response.ok) throw new Error('Mesh status failed');
        return await response.json();
    } catch (e) {
        console.error('Mesh status error:', e);
        return { 
            connected: false, 
            total_nodes: 0, 
            is_root: false,
            master_ap_active: false,
            channel: 1,
            mesh_id: 'WHIVE'
        };
    }
}

async function getMeshNodes() {
    try {
        const response = await fetch(CONFIG.ENDPOINTS.MESH_NODES);
        if (!response.ok) throw new Error('Mesh nodes failed');
        return await response.json();
    } catch (e) {
        console.error('Mesh nodes error:', e);
        return { nodes: [], total: 0 };
    }
}

async function getMeshRSSI(nodeId = null) {
    try {
        let url = CONFIG.ENDPOINTS.MESH_RSSI;
        if (nodeId) url += `?id=${nodeId}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Mesh RSSI failed');
        return await response.json();
    } catch (e) {
        console.error('Mesh RSSI error:', e);
        return { node_id: nodeId || 0, rssi: -120 };
    }
}

async function sendMeshCommand(slaveId, command, param = 0) {
    try {
        const response = await fetch(CONFIG.ENDPOINTS.MESH_COMMAND, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                slave_id: slaveId, 
                command: command, 
                param: param 
            })
        });
        if (!response.ok) throw new Error('Mesh command failed');
        return await response.json();
    } catch (e) {
        console.error('Mesh command error:', e);
        const msg = typeof osT === 'function' ? osT('mesh.commandFailed') : 'فشل إرسال الأمر';
        return { success: false, message: msg };
    }
}

async function updateMeshDisplay() {
    const status = await getMeshStatus();
    
    const stateEl = document.getElementById('meshState');
    const channelEl = document.getElementById('meshChannel');
    const countEl = document.getElementById('meshDeviceCount');
    
    if (stateEl) {
        const connectedText = typeof osT === 'function' ? osT('mesh.connected') : 'متصل';
        const disconnectedText = typeof osT === 'function' ? osT('mesh.disconnected') || 'غير متصل' : 'غير متصل';
        stateEl.textContent = status.connected ? connectedText : disconnectedText;
        stateEl.className = `mesh-status-value ${status.connected ? 'connected' : ''}`;
    }
    if (channelEl) channelEl.textContent = status.channel || CONFIG.MESH.CHANNEL;
    if (countEl) countEl.textContent = status.total_nodes || 0;
    
    return status;
}

async function scanMeshDevices() {
    triggerAlert('🔄 ' + (typeof osT === 'function' ? osT('mesh.scanning') || 'جاري مسح العقد المتصلة...' : 'جاري مسح العقد المتصلة...'), 'info');
    
    const data = await getMeshNodes();
    const listEl = document.getElementById('meshDeviceList');
    
    if (listEl) {
        if (data.nodes && data.nodes.length > 0) {
            const hiveLabel = typeof osT === 'function' ? (osT('hives.hive') || 'خلية') : 'خلية';
            const noNodesText = typeof osT === 'function' ? (osT('mesh.noNodes') || 'لا توجد عقد متصلة') : 'لا توجد عقد متصلة';
            
            listEl.innerHTML = data.nodes.map(node => `
                <div class="mesh-device-item">
                    <i class="fas fa-broadcast-tower"></i>
                    <div class="device-info">
                        <span class="device-name">${hiveLabel} #${node.id}</span>
                        <span class="device-mac">RSSI: ${node.rssi} dBm</span>
                    </div>
                    <span class="device-signal ${node.rssi > -60 ? 'good' : (node.rssi > -80 ? 'fair' : 'weak')}">
                        ${node.rssi > -60 ? '📶📶📶' : (node.rssi > -80 ? '📶📶' : '📶')}
                    </span>
                </div>
            `).join('');
            
            const foundText = typeof osT === 'function' ? (osT('mesh.foundNodes') || 'تم العثور على') : 'تم العثور على';
            const nodeText = typeof osT === 'function' ? (osT('mesh.node') || 'عقدة') : 'عقدة';
            triggerAlert(`✅ ${foundText} ${data.total} ${nodeText}`, 'info');
        } else {
            const noNodesText = typeof osT === 'function' ? (osT('mesh.noNodes') || 'لا توجد عقد متصلة') : 'لا توجد عقد متصلة';
            listEl.innerHTML = `<div class="mesh-device-item"><i class="fas fa-info-circle"></i><span>${noNodesText}</span></div>`;
            triggerAlert('ℹ️ ' + noNodesText, 'info');
        }
    }
}

function toggleMeshMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('meshMenu');
    const startMenu = document.getElementById('startMenu');
    
    if (menu) {
        if (startMenu) startMenu.style.display = 'none';
        
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.display = 'block';
            updateMeshDisplay();
        } else {
            menu.style.display = 'none';
        }
    }
}

document.addEventListener('click', function(event) {
    const menu = document.getElementById('meshMenu');
    const icon = event.target.closest('.fa-wifi');
    
    if (menu && menu.style.display === 'block') {
        if (!menu.contains(event.target) && !icon) {
            menu.style.display = 'none';
        }
    }
});

console.log(`✅ ${CONFIG.APP_NAME} v${CONFIG.VERSION} loaded (Mesh + i18n Ready)`);