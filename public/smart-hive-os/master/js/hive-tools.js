// hive-tools.js - Control Tools Icon (i18n Ready)

let currentToolsHive = 'HIVE-01';

function _(key, fallback) {
    return (typeof osT === 'function' ? osT(key) : null) || fallback || key;
}

function openHiveTools() {
    openHiveSelector('tools', function(selectedHive) {
        currentToolsHive = selectedHive;
        document.getElementById('toolsHiveId').innerText = selectedHive;
        document.getElementById('hiveToolsModal').style.display = 'flex';
        document.getElementById('toolsResult').innerHTML = '';
    });
}

function closeHiveTools() {
    document.getElementById('hiveToolsModal').style.display = 'none';
}

async function sendControlCommand(command) {
    const resultDiv = document.getElementById('toolsResult');
    
    const commandNames = {
        'fan_on': _('modals.fanOn', 'تشغيل المروحة'),
        'fan_off': _('modals.fanOff', 'إيقاف المروحة'),
        'restart': _('modals.restart', 'إعادة تشغيل الخلية'),
        'calibrate': _('modals.calibrate', 'معايرة الحساسات'),
        'battery_check': _('modals.batteryCheck', 'فحص البطارية')
    };
    
    const executingText = _('tools.executing', 'جاري');
    const successText = _('tools.success', 'تم');
    const failedText = _('tools.failed', 'فشل');
    const simulationText = _('tools.simulation', 'محاكاة');
    
    resultDiv.innerHTML = `⏳ ${executingText} ${commandNames[command]}...`;
    
    try {
        const response = await fetch(`${CONFIG.API_BASE}/hive/${currentToolsHive}/control`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: command })
        });
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `✅ ${successText} ${commandNames[command]}`;
            triggerAlert(`✅ ${commandNames[command]} - ${currentToolsHive}`, 'success');
        } else {
            resultDiv.innerHTML = `❌ ${failedText} ${commandNames[command]}`;
        }
    } catch (error) {
        setTimeout(() => {
            resultDiv.innerHTML = `✅ ${successText} ${commandNames[command]} (${simulationText})`;
            triggerAlert(`✅ ${commandNames[command]} - ${currentToolsHive} (${simulationText})`, 'success');
        }, 1000);
    }
}

console.log('✅ Hive Tools loaded (i18n Ready)');