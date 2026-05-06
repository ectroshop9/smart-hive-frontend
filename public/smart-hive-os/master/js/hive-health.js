// hive-health.js - أيقونة صحة الخلية
let currentHealthHive = 'HIVE-01';

function openHiveHealth() {
    openHiveSelector('health', function(selectedHive) {
        currentHealthHive = selectedHive;
        document.getElementById('healthHiveId').innerText = selectedHive;
        document.getElementById('hiveHealthModal').style.display = 'flex';
        loadHiveHealth(selectedHive);
    });
}

function closeHiveHealth() {
    document.getElementById('hiveHealthModal').style.display = 'none';
}

function refreshHiveHealth() {
    loadHiveHealth(currentHealthHive);
}

async function loadHiveHealth(hiveId) {
    const body = document.getElementById('healthBody');
    body.innerHTML = '<div class="health-loading">جاري تحميل بيانات الصحة...</div>';
    
    try {
        const response = await fetch(`${CONFIG.API_BASE}/hive/${hiveId}/health`);
        const data = await response.json();
        displayHealthData(data);
    } catch (error) {
        console.log('⚠️ استخدام البيانات التجريبية للصحة');
        const mockData = {
            hive_id: hiveId,
            temp_avg: 34.5,
            temp_top: 35.2,
            temp_mid: 34.8,
            temp_bottom: 33.9,
            humidity: 62,
            weight: 25.3,
            sound: 45,
            gas: 12,
            vibration: 28,
            battery: 85,
            status: '✅ صحة جيدة',
            diagnosis: 'الخلية في حالة ممتازة. جميع المؤشرات ضمن المعدلات الطبيعية.'
        };
        displayHealthData(mockData);
    }
}

function displayHealthData(data) {
    const tempStatus = data.temp_avg > 37 ? 'warning' : (data.temp_avg < 32 ? 'warning' : 'good');
    const humStatus = data.humidity > 80 ? 'warning' : (data.humidity < 40 ? 'warning' : 'good');
    const vibrationStatus = data.vibration > 70 ? 'critical' : (data.vibration > 40 ? 'warning' : 'good');
    const batteryStatus = data.battery < 20 ? 'critical' : (data.battery < 40 ? 'warning' : 'good');
    
    const html = `
        <div class="health-indicators">
            <div class="health-indicator">
                <i class="fas fa-temperature-high"></i>
                <div class="label">درجة الحرارة</div>
                <div class="value">${data.temp_avg?.toFixed(1) || '--'}°C</div>
                <div class="status ${tempStatus}">${getTempStatusText(data.temp_avg)}</div>
                <small>أعلى: ${data.temp_top?.toFixed(1) || '--'}°C / أسفل: ${data.temp_bottom?.toFixed(1) || '--'}°C</small>
            </div>
            
            <div class="health-indicator">
                <i class="fas fa-tint"></i>
                <div class="label">الرطوبة</div>
                <div class="value">${data.humidity?.toFixed(1) || '--'}%</div>
                <div class="status ${humStatus}">${getHumStatusText(data.humidity)}</div>
            </div>
            
            <div class="health-indicator">
                <i class="fas fa-weight-scale"></i>
                <div class="label">الوزن</div>
                <div class="value">${data.weight?.toFixed(1) || '--'} kg</div>
                <div class="status good">طبيعي</div>
            </div>
            
            <div class="health-indicator">
                <i class="fas fa-microphone"></i>
                <div class="label">الصوت</div>
                <div class="value">${data.sound || '--'} dB</div>
                <div class="status ${data.sound > 75 ? 'warning' : 'good'}">${data.sound > 75 ? 'مرتفع' : 'طبيعي'}</div>
            </div>
            
            <div class="health-indicator">
                <i class="fas fa-wave-square"></i>
                <div class="label">الاهتزاز</div>
                <div class="value">${data.vibration || '--'}</div>
                <div class="status ${vibrationStatus}">${getVibrationStatusText(data.vibration)}</div>
            </div>
            
            <div class="health-indicator">
                <i class="fas fa-battery-three-quarters"></i>
                <div class="label">البطارية</div>
                <div class="value">${data.battery || '--'}%</div>
                <div class="status ${batteryStatus}">${getBatteryStatusText(data.battery)}</div>
            </div>
        </div>
        
        <div class="health-diagnosis">
            <h3><i class="fas fa-stethoscope"></i> التشخيص</h3>
            <p>${data.diagnosis || 'الخلية في حالة طبيعية.'}</p>
        </div>
    `;
    
    document.getElementById('healthBody').innerHTML = html;
}

function getTempStatusText(temp) {
    if (!temp) return 'غير معروف';
    if (temp > 37) return '⚠️ مرتفعة';
    if (temp < 32) return '⚠️ منخفضة';
    return '✅ مثالية';
}

function getHumStatusText(hum) {
    if (!hum) return 'غير معروف';
    if (hum > 80) return '⚠️ مرتفعة';
    if (hum < 40) return '⚠️ منخفضة';
    return '✅ مثالية';
}

function getVibrationStatusText(vib) {
    if (!vib) return 'غير معروف';
    if (vib > 70) return '🚨 خطر';
    if (vib > 40) return '⚠️ مرتفع';
    return '✅ طبيعي';
}

function getBatteryStatusText(bat) {
    if (!bat) return 'غير معروف';
    if (bat < 20) return '🚨 منخفضة';
    if (bat < 40) return '⚠️ متوسطة';
    return '✅ جيدة';
}

console.log('✅ Hive Health loaded');