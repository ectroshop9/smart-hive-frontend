// hive-selector.js - Shared Hive Selector Modal (i18n Ready)

let currentCallback = null;
let currentMode = 'health';

function _(key, fallback) {
    return (typeof osT === 'function' ? osT(key) : null) || fallback || key;
}

function openHiveSelector(mode, callback) {
    currentMode = mode;
    currentCallback = callback;
    
    const titles = {
        'health': '❤️ ' + _('modals.hiveSelector', 'اختر الخلية') + ' - ' + _('desktop.hiveHealth', 'صحة الخلية'),
        'stats': '📊 ' + _('modals.hiveSelector', 'اختر الخلية') + ' - ' + _('desktop.hiveStats', 'إحصائيات'),
        'tools': '🛠️ ' + _('modals.hiveSelector', 'اختر الخلية') + ' - ' + _('desktop.controlTools', 'أدوات التحكم'),
        'update': '🔄 ' + _('modals.hiveSelector', 'اختر الخلية') + ' - ' + _('desktop.updateHives', 'تحديث النظام')
    };
    document.getElementById('selectorTitle').innerText = titles[mode] || _('modals.hiveSelector', 'اختر الخلية');
    
    updateHiveSelectorDropdown();
    document.getElementById('hiveSelectorModal').style.display = 'flex';
}

function closeHiveSelector() {
    document.getElementById('hiveSelectorModal').style.display = 'none';
    currentCallback = null;
}

function updateHiveSelectorDropdown() {
    const dropdown = document.getElementById('hiveSelectorDropdown');
    if (!dropdown) return;
    
    const connectedText = _('dashboard.connected', 'متصل');
    
    if (typeof hives !== 'undefined' && hives.length > 0) {
        dropdown.innerHTML = hives.map(h => 
            `<option value="${h.id}">${h.id} - ${h.status || connectedText}</option>`
        ).join('');
    } else {
        dropdown.innerHTML = `
            <option value="HIVE-01">HIVE-01 - ${connectedText}</option>
            <option value="HIVE-02">HIVE-02 - ${connectedText}</option>
            <option value="HIVE-03">HIVE-03 - ${connectedText}</option>
        `;
    }
}

function confirmHiveSelection() {
    const dropdown = document.getElementById('hiveSelectorDropdown');
    const selectedHive = dropdown?.value || 'HIVE-01';
    
    closeHiveSelector();
    
    setTimeout(() => {
        if (currentMode === 'health') {
            document.getElementById('healthHiveId').innerText = selectedHive;
            document.getElementById('hiveHealthModal').style.display = 'flex';
        } else if (currentMode === 'stats') {
            document.getElementById('statsHiveId').innerText = selectedHive;
            document.getElementById('hiveStatsModal').style.display = 'flex';
        } else if (currentMode === 'tools') {
            document.getElementById('toolsHiveId').innerText = selectedHive;
            document.getElementById('hiveToolsModal').style.display = 'flex';
        } else if (currentMode === 'update') {
            document.getElementById('updateHiveId').innerText = selectedHive;
            document.getElementById('hiveUpdateModal').style.display = 'flex';
            if (typeof loadHiveUpdateInfo === 'function') {
                loadHiveUpdateInfo(selectedHive);
            }
        }
    }, 100);
    
    if (currentCallback) {
        currentCallback(selectedHive);
    }
}

window.confirmHiveSelection = confirmHiveSelection;
console.log('✅ Hive Selector loaded (i18n Ready)');