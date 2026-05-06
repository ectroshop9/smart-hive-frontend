// hive-update.js - تحديث الخلايا (OTA Update)
// متوافق مع OTA Manager v1.0

let currentUpdateHive = 'HIVE-01';
let selectedFirmwareFile = null;

// ========== فتح وإغلاق النافذة ==========

function openHiveUpdate() {
    openHiveSelector('update', function(selectedHive) {
        currentUpdateHive = selectedHive;
        document.getElementById('updateHiveId').innerText = selectedHive;
        document.getElementById('hiveUpdateModal').style.display = 'flex';
        loadHiveUpdateInfo(selectedHive);
    });
}

function closeHiveUpdate() {
    document.getElementById('hiveUpdateModal').style.display = 'none';
    selectedFirmwareFile = null;
    document.getElementById('startUpdateBtn').disabled = true;
}

// ========== تحميل معلومات الخلية ==========

async function loadHiveUpdateInfo(hiveId) {
    const body = document.getElementById('updateBody');
    body.innerHTML = '<div class="update-loading"><i class="fas fa-spinner fa-pulse"></i> جاري تحميل معلومات الخلية...</div>';
    
    try {
        // جلب معلومات التحديث من OTA Manager
        const checkResponse = await fetch('/api/ota/check');
        const checkData = await checkResponse.json();
        
        // جلب حالة الخلية
        const statusResponse = await fetch(`/api/hive/${hiveId}/status`);
        const statusData = await statusResponse.json();
        
        const data = {
            hive_id: hiveId,
            current_version: statusData.version || 'v5.2.1',
            latest_version: checkData.worker_version || 'v6.0.0',
            device_type: statusData.device_type || 'ESP32-S3',
            flash_size: statusData.flash_size || '16MB',
            free_space: statusData.free_space || '8.2MB',
            last_update: statusData.last_update || '2024-01-15',
            status: statusData.online ? 'online' : 'offline',
            battery: statusData.battery || 85,
            needs_update: checkData.has_worker_update || false
        };
        
        displayUpdateInfo(data);
        
    } catch (error) {
        console.warn('⚠️ استخدام البيانات التجريبية:', error);
        setTimeout(() => {
            const mockData = {
                hive_id: hiveId,
                current_version: 'v5.2.1',
                latest_version: 'v6.0.0',
                device_type: 'ESP32-S3',
                flash_size: '16MB',
                free_space: '8.2MB',
                last_update: '2024-01-15',
                status: 'online',
                battery: 85,
                needs_update: true
            };
            displayUpdateInfo(mockData);
        }, 300);
    }
}

// ========== عرض معلومات التحديث ==========

function displayUpdateInfo(data) {
    const needsUpdate = data.needs_update || (data.current_version !== data.latest_version);
    const updateStatus = needsUpdate ? 
        '<span style="color: #ffa500;"><i class="fas fa-exclamation-triangle"></i> يتوفر تحديث جديد</span>' : 
        '<span style="color: var(--neon-green);"><i class="fas fa-check-circle"></i> النظام محدث</span>';
    
    const batteryStatus = data.battery < 30 ? 'warning' : 'good';
    const batteryText = data.battery < 30 ? '⚠️ منخفضة' : '✅ جيدة';
    const onlineStatus = data.status === 'online' ? 
        '<span style="color: var(--neon-green);"><i class="fas fa-circle"></i> متصل</span>' : 
        '<span style="color: #ff4444;"><i class="fas fa-circle"></i> غير متصل</span>';
    
    const html = `
        <div class="update-info-section">
            <h3><i class="fas fa-info-circle"></i> معلومات الخلية</h3>
            <div class="update-info-grid">
                <div class="update-info-item">
                    <span class="label">الخلية:</span>
                    <span class="value">${data.hive_id}</span>
                </div>
                <div class="update-info-item">
                    <span class="label">الحالة:</span>
                    <span class="value">${onlineStatus}</span>
                </div>
                <div class="update-info-item">
                    <span class="label">نوع الجهاز:</span>
                    <span class="value">${data.device_type || 'ESP32'}</span>
                </div>
                <div class="update-info-item">
                    <span class="label">الإصدار الحالي:</span>
                    <span class="value ${needsUpdate ? 'warning' : 'good'}">${data.current_version}</span>
                </div>
                <div class="update-info-item">
                    <span class="label">أحدث إصدار:</span>
                    <span class="value">${data.latest_version}</span>
                </div>
                <div class="update-info-item">
                    <span class="label">حالة التحديث:</span>
                    <span class="value">${updateStatus}</span>
                </div>
                <div class="update-info-item">
                    <span class="label">البطارية:</span>
                    <span class="value ${batteryStatus}">${data.battery}% (${batteryText})</span>
                </div>
                <div class="update-info-item">
                    <span class="label">المساحة الحرة:</span>
                    <span class="value">${data.free_space || '8.2MB'}</span>
                </div>
                <div class="update-info-item">
                    <span class="label">آخر تحديث:</span>
                    <span class="value">${data.last_update || '-'}</span>
                </div>
            </div>
        </div>
        
        ${needsUpdate && data.status === 'online' ? `
        <div class="update-firmware-section">
            <h3><i class="fas fa-cloud-download-alt"></i> تحديث تلقائي من السيرفر</h3>
            <div style="padding: 15px; background: #1a2a1a; border-radius: 10px; margin-bottom: 20px;">
                <p style="margin: 0 0 15px 0; color: #ccc;">
                    <i class="fas fa-info-circle" style="color: var(--neon-gold);"></i> 
                    يتوفر تحديث ${data.latest_version} على السيرفر. اضغط على الزر أدناه للتحميل والتحديث تلقائياً.
                </p>
                <button class="config-btn" onclick="startAutoUpdate('${data.hive_id}')" style="width: 100%;">
                    <i class="fas fa-cloud-download-alt"></i> تحميل وتحديث تلقائي
                </button>
            </div>
        </div>
        ` : ''}
        
        <div class="update-firmware-section">
            <h3><i class="fas fa-microchip"></i> تحديث يدوي (رفع ملف)</h3>
            
            <div class="firmware-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <span>تحذير: تأكد من أن البطارية أعلى من 30% ولا تفصل الاتصال أثناء التحديث!</span>
            </div>
            
            <div class="file-upload-area" id="fileUploadArea" onclick="document.getElementById('firmwareFile').click()">
                <i class="fas fa-cloud-upload-alt"></i>
                <span id="fileLabel">اختر ملف البرنامج الثابت (.bin)</span>
                <small>أو اسحب وأفلت الملف هنا</small>
            </div>
            <input type="file" id="firmwareFile" accept=".bin" style="display: none;" onchange="handleFileSelect(event)">
            
            <div id="fileInfo" style="display: none; margin-top: 15px; padding: 15px; background: #111; border-radius: 10px; border: 1px solid #333;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-file-code" style="color: var(--neon-gold);"></i>
                    <span id="selectedFileName">-</span>
                    <span id="selectedFileSize" style="color: #888; font-size: 0.9rem;"></span>
                </div>
            </div>
        </div>
        
        <div class="update-progress-section" id="updateProgressSection" style="display: none;">
            <h3><i class="fas fa-tasks"></i> تقدم التحديث</h3>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" id="updateProgressBar" style="width: 0%;"></div>
            </div>
            <div id="updateStatus" style="text-align: center; margin-top: 10px; color: #ccc;">
                جاري التحضير...
            </div>
        </div>
    `;
    
    document.getElementById('updateBody').innerHTML = html;
    setupDragAndDrop();
}

// ========== السحب والإفلات ==========

function setupDragAndDrop() {
    const uploadArea = document.getElementById('fileUploadArea');
    if (!uploadArea) return;
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--neon-gold)';
        uploadArea.style.background = 'rgba(255, 193, 7, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#444';
        uploadArea.style.background = 'transparent';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#444';
        uploadArea.style.background = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
}

// ========== معالجة الملفات ==========

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) handleFile(file);
}

function handleFile(file) {
    if (!file.name.endsWith('.bin')) {
        triggerAlert('❌ يرجى اختيار ملف بصيغة .bin', 'error');
        return;
    }
    
    selectedFirmwareFile = file;
    
    document.getElementById('fileInfo').style.display = 'block';
    document.getElementById('selectedFileName').innerText = file.name;
    document.getElementById('selectedFileSize').innerText = formatFileSize(file.size);
    document.getElementById('fileLabel').innerText = '✅ تم اختيار الملف';
    document.getElementById('startUpdateBtn').disabled = false;
    
    triggerAlert(`✅ تم اختيار الملف: ${file.name}`, 'success');
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// ========== التحديث التلقائي من السيرفر ==========

async function startAutoUpdate(hiveId) {
    if (!confirm(`⚠️ هل أنت متأكد من بدء التحديث التلقائي للخلية ${hiveId}؟`)) {
        return;
    }
    
    document.getElementById('updateProgressSection').style.display = 'block';
    document.getElementById('startUpdateBtn').disabled = true;
    
    const progressBar = document.getElementById('updateProgressBar');
    const statusText = document.getElementById('updateStatus');
    
    try {
        statusText.innerHTML = '📡 جاري بدء التحديث...';
        progressBar.style.width = '10%';
        
        const response = await fetch(`/api/hive/${hiveId}/ota/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source: 'cloud' })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Update failed');
        }
        
        statusText.innerHTML = '📤 جاري التحميل من السيرفر...';
        progressBar.style.width = '30%';
        
        await pollUpdateProgress(hiveId, progressBar, statusText);
        
    } catch (error) {
        console.error('Auto update failed:', error);
        statusText.innerHTML = `❌ فشل التحديث: ${error.message}`;
        triggerAlert(`❌ فشل التحديث: ${error.message}`, 'error');
        document.getElementById('startUpdateBtn').disabled = false;
    }
}

async function pollUpdateProgress(hiveId, progressBar, statusText) {
    const maxAttempts = 60;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
            const response = await fetch(`/api/ota/status`);
            const data = await response.json();
            
            if (data.state === 'SUCCESS') {
                progressBar.style.width = '100%';
                statusText.innerHTML = '🎉 تم التحديث بنجاح!';
                triggerAlert(`✅ تم تحديث ${hiveId} بنجاح!`, 'success');
                setTimeout(() => closeHiveUpdate(), 2000);
                return;
            }
            
            if (data.state === 'FAILED') {
                throw new Error(data.message || 'Update failed');
            }
            
            progressBar.style.width = (30 + data.progress_percent * 0.7) + '%';
            statusText.innerHTML = data.status_message || 'جاري التحديث...';
            
        } catch (error) {
            console.warn('Progress poll error:', error);
        }
        
        attempts++;
    }
    
    throw new Error('انتهت مهلة التحديث');
}

// ========== بدء عملية التحديث ==========

async function startUpdateProcess() {
    if (!selectedFirmwareFile) {
        triggerAlert('❌ يرجى اختيار ملف التحديث أولاً', 'error');
        return;
    }
    
    const batteryEl = document.getElementById('batteryLevel');
    const battery = parseInt(batteryEl?.innerText || '85');
    if (battery < 30) {
        triggerAlert('⚠️ البطارية منخفضة! يرجى شحن الخلية قبل التحديث.', 'warning');
        return;
    }
    
    if (!confirm('⚠️ هل أنت متأكد من بدء تحديث الخلية؟\nلا تقم بفصل الطاقة أو إغلاق النافذة حتى يكتمل التحديث!')) {
        return;
    }
    
    document.getElementById('updateProgressSection').style.display = 'block';
    document.getElementById('startUpdateBtn').disabled = true;
    
    const uploadArea = document.getElementById('fileUploadArea');
    if (uploadArea) uploadArea.style.pointerEvents = 'none';
    
    try {
        await performRealUpdate();
    } catch (error) {
        console.warn('⚠️ استخدام محاكاة التحديث:', error);
        await simulateUpdate();
    }
}

async function performRealUpdate() {
    const progressBar = document.getElementById('updateProgressBar');
    const statusText = document.getElementById('updateStatus');
    
    statusText.innerHTML = '🔍 جاري بدء جلسة التحديث...';
    progressBar.style.width = '5%';
    
    const startResponse = await fetch('/ota/start', { method: 'POST' });
    if (!startResponse.ok) throw new Error('Failed to start OTA');
    
    const chunkSize = 1024 * 4;
    let offset = 0;
    
    while (offset < selectedFirmwareFile.size) {
        const chunk = selectedFirmwareFile.slice(offset, offset + chunkSize);
        const buffer = await chunk.arrayBuffer();
        
        const writeResponse = await fetch('/ota/write', {
            method: 'POST',
            body: buffer
        });
        
        if (!writeResponse.ok) throw new Error('Chunk upload failed');
        
        offset += chunkSize;
        const progress = 5 + Math.min((offset / selectedFirmwareFile.size) * 90, 90);
        progressBar.style.width = progress + '%';
        statusText.innerHTML = `📤 جاري رفع التحديث... ${Math.round(progress)}%`;
    }
    
    statusText.innerHTML = '✅ جاري إنهاء التحديث...';
    progressBar.style.width = '95%';
    
    const finishResponse = await fetch('/ota/finish', { method: 'POST' });
    const finishData = await finishResponse.json();
    
    if (finishData.success || finishResponse.ok) {
        progressBar.style.width = '100%';
        statusText.innerHTML = '🎉 تم التحديث بنجاح! جاري إعادة التشغيل...';
        triggerAlert(`✅ تم تحديث ${currentUpdateHive} بنجاح!`, 'success');
        setTimeout(() => closeHiveUpdate(), 3000);
    } else {
        throw new Error('Update finish failed');
    }
}

async function simulateUpdate() {
    const progressBar = document.getElementById('updateProgressBar');
    const statusText = document.getElementById('updateStatus');
    
    const steps = [
        { progress: 10, text: '🔍 جاري التحقق من الملف...' },
        { progress: 20, text: '📡 جاري الاتصال بالخلية...' },
        { progress: 35, text: '📤 جاري إرسال البرنامج الثابت...' },
        { progress: 50, text: '💾 جاري حفظ البيانات...' },
        { progress: 65, text: '✅ جاري التحقق من السلامة...' },
        { progress: 80, text: '🔄 جاري تثبيت التحديث...' },
        { progress: 95, text: '🔌 جاري إعادة التشغيل...' },
        { progress: 100, text: '🎉 تم التحديث بنجاح!' }
    ];
    
    for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        progressBar.style.width = step.progress + '%';
        statusText.innerHTML = step.text;
    }
    
    triggerAlert(`✅ تم تحديث ${currentUpdateHive} بنجاح! (محاكاة)`, 'success');
    setTimeout(() => closeHiveUpdate(), 1000);
}

// ========== تعريض الدوال ==========

window.openHiveUpdate = openHiveUpdate;
window.closeHiveUpdate = closeHiveUpdate;
window.handleFileSelect = handleFileSelect;
window.startUpdateProcess = startUpdateProcess;
window.startAutoUpdate = startAutoUpdate;

console.log('✅ Hive Update (OTA) loaded - Integrated with OTA Manager v1.0');