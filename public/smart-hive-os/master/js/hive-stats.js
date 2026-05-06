// hive-stats.js - أيقونة إحصائيات الخلية
let currentStatsHive = 'all';

function openHiveStats() {
    openHiveSelector('stats', function(selectedHive) {
        currentStatsHive = selectedHive;
        document.getElementById('statsHiveId').innerText = selectedHive === 'all' ? 'جميع الخلايا' : selectedHive;
        document.getElementById('hiveStatsModal').style.display = 'flex';
        loadHiveStats(selectedHive);
    });
}

function closeHiveStats() {
    document.getElementById('hiveStatsModal').style.display = 'none';
}

function refreshHiveStats() {
    loadHiveStats(currentStatsHive);
}

async function loadHiveStats(hiveId) {
    const body = document.getElementById('statsBody');
    body.innerHTML = '<div class="stats-loading">جاري تحميل الإحصائيات...</div>';
    
    try {
        const response = await fetch(`${CONFIG.API_BASE}/hive/${hiveId}/stats`);
        const data = await response.json();
        displayStatsData(data);
    } catch (error) {
        console.log('⚠️ استخدام البيانات التجريبية للإحصائيات');
        const mockData = {
            total_hives: 3,
            avg_temp: 34.5,
            avg_humidity: 62,
            total_weight: 72.5,
            total_honey: 45.2,
            active_hives: 3,
            alerts_today: 0
        };
        displayStatsData(mockData);
    }
}

function displayStatsData(data) {
    const html = `
        <div class="stats-summary">
            <div class="stat-card">
                <i class="fas fa-database"></i>
                <div class="value">${data.total_hives || 0}</div>
                <div class="label">إجمالي الخلايا</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-wifi"></i>
                <div class="value">${data.active_hives || 0}</div>
                <div class="label">الخلايا النشطة</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-exclamation-triangle"></i>
                <div class="value">${data.alerts_today || 0}</div>
                <div class="label">تنبيهات اليوم</div>
            </div>
        </div>
        
        <div class="stats-summary">
            <div class="stat-card">
                <i class="fas fa-temperature-high"></i>
                <div class="value">${data.avg_temp?.toFixed(1) || '--'}°C</div>
                <div class="label">متوسط الحرارة</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-tint"></i>
                <div class="value">${data.avg_humidity?.toFixed(1) || '--'}%</div>
                <div class="label">متوسط الرطوبة</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-weight-scale"></i>
                <div class="value">${data.total_weight?.toFixed(1) || '--'} kg</div>
                <div class="label">الوزن الإجمالي</div>
            </div>
        </div>
        
        <div class="health-diagnosis">
            <h3><i class="fas fa-chart-line"></i> ملخص</h3>
            <p>إجمالي إنتاج العسل المقدر: <strong>${data.total_honey?.toFixed(1) || '--'} kg</strong></p>
        </div>
    `;
    
    document.getElementById('statsBody').innerHTML = html;
}

console.log('✅ Hive Stats loaded');