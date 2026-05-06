// hive-tools.js - أيقونة أدوات التحكم
let currentToolsHive = 'HIVE-01';

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
        'fan_on': 'تشغيل المروحة',
        'fan_off': 'إيقاف المروحة',
        'restart': 'إعادة تشغيل',
        'calibrate': 'معايرة الحساسات',
        'battery_check': 'فحص البطارية'
    };
    
    resultDiv.innerHTML = `⏳ جاري ${commandNames[command]}...`;
    
    try {
        const response = await fetch(`${CONFIG.API_BASE}/hive/${currentToolsHive}/control`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: command })
        });
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `✅ تم ${commandNames[command]} بنجاح`;
            triggerAlert(`✅ ${commandNames[command]} - ${currentToolsHive}`, 'success');
        } else {
            resultDiv.innerHTML = `❌ فشل ${commandNames[command]}`;
        }
    } catch (error) {
        console.log('⚠️ استخدام المحاكاة لأدوات التحكم');
        
        setTimeout(() => {
            resultDiv.innerHTML = `✅ تم ${commandNames[command]} بنجاح (محاكاة)`;
            triggerAlert(`✅ ${commandNames[command]} - ${currentToolsHive} (محاكاة)`, 'success');
        }, 1000);
    }
}

console.log('✅ Hive Tools loaded');