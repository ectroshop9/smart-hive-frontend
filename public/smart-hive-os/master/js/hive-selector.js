// hive-selector.js - نافذة اختيار الخلية المشتركة
let currentCallback = null;
let currentMode = 'health'; // 'health', 'stats', 'tools', 'update'

function openHiveSelector(mode, callback) {
    currentMode = mode;
    currentCallback = callback;
    
    // تحديث عنوان النافذة
    const titles = {
        'health': '❤️ اختر الخلية - صحة الخلية',
        'stats': '📊 اختر الخلية - إحصائيات',
        'tools': '🛠️ اختر الخلية - أدوات التحكم',
        'update': '🔄 اختر الخلية - تحديث النظام'
    };
    document.getElementById('selectorTitle').innerText = titles[mode] || 'اختر الخلية';
    
    // تحديث القائمة المنسدلة
    updateHiveSelectorDropdown();
    
    // إظهار النافذة
    document.getElementById('hiveSelectorModal').style.display = 'flex';
}

function closeHiveSelector() {
    document.getElementById('hiveSelectorModal').style.display = 'none';
    currentCallback = null;
}

function updateHiveSelectorDropdown() {
    const dropdown = document.getElementById('hiveSelectorDropdown');
    if (!dropdown) return;
    
    // استخدام hives من hives.js (إذا كان محملاً)
    if (typeof hives !== 'undefined' && hives.length > 0) {
        dropdown.innerHTML = hives.map(h => 
            `<option value="${h.id}">${h.id} - ${h.status}</option>`
        ).join('');
    } else {
        // بيانات تجريبية
        dropdown.innerHTML = `
            <option value="HIVE-01">HIVE-01 - متصل</option>
            <option value="HIVE-02">HIVE-02 - متصل</option>
            <option value="HIVE-03">HIVE-03 - متصل</option>
        `;
    }
}

function confirmHiveSelection() {
    console.log('✅ تم الضغط على تأكيد');
    
    const dropdown = document.getElementById('hiveSelectorDropdown');
    const selectedHive = dropdown?.value || 'HIVE-01';
    
    console.log('✅ الخلية المختارة:', selectedHive);
    console.log('✅ النمط الحالي:', currentMode);
    
    // إغلاق نافذة الاختيار
    closeHiveSelector();
    
    // ✅ افتح النافذة المناسبة
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
            console.log('🔵 فتح نافذة التحديث...');
            document.getElementById('updateHiveId').innerText = selectedHive;
            document.getElementById('hiveUpdateModal').style.display = 'flex';
            if (typeof loadHiveUpdateInfo === 'function') {
                loadHiveUpdateInfo(selectedHive);
            }
        }
    }, 100);
    
    // استدعاء callback إذا وجد
    if (currentCallback) {
        currentCallback(selectedHive);
    }
}

window.confirmHiveSelection = confirmHiveSelection;
console.log('✅ Hive Selector loaded');