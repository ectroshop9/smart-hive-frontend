// wizard.js - معالج الإعداد
let setupCurrentStep = 1;
let setupConfig = { username: 'admin', password: '1234', apiaryName: '', location: '', wilaya: '16', apSsid: 'SmartHive_OS' };
let setupSelectedDevices = [];

function openSetupWizard() { setupCurrentStep = 1; document.getElementById('setupModal').style.display = 'flex'; showSetupStep(1); }
function closeSetupWizard() { document.getElementById('setupModal').style.display = 'none'; }

function showSetupStep(step) {
    for (let i=1; i<=6; i++) document.getElementById(`setupStep${i}`)?.classList.remove('active');
    document.getElementById(`setupStep${step}`).classList.add('active');
    document.querySelectorAll('.setup-step-indicator').forEach((el, idx) => {
        el.classList.remove('active', 'completed');
        if (idx+1 === step) el.classList.add('active'); else if (idx+1 < step) el.classList.add('completed');
    });
    document.getElementById('setupPrevBtn').style.display = step > 1 ? 'inline-flex' : 'none';
    document.getElementById('setupNextBtn').innerHTML = step === 6 ? '✅ تأكيد وحفظ' : 'التالي <i class="fas fa-chevron-left"></i>';
    if (step === 3) populateWilayaSelect();
    if (step === 6) generateSetupSummary();
    document.getElementById('currentStepDisplay').innerText = step;
    document.getElementById('setupProgress').style.width = (step/6*100) + '%';
    setupCurrentStep = step;
}

function checkPasswordStrength(p) {
    let s = 0; if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    const levels = ['ضعيف', 'متوسط', 'جيد', 'قوي'], colors = ['#ff3e3e', '#ffa500', '#ffc107', '#39ff14'];
    const idx = Math.min(s, 3);
    document.getElementById('strengthText').textContent = levels[idx];
    document.getElementById('strengthFill').style.width = ['25%','50%','75%','100%'][idx];
    document.getElementById('strengthFill').style.background = colors[idx];
}

function setupNext() {
    if (setupCurrentStep === 1) {
        const pass = document.getElementById('setupPass').value;
        if (pass !== document.getElementById('setupConfirmPass').value) { triggerAlert('❌ كلمة المرور غير متطابقة'); return; }
        setupConfig.username = document.getElementById('setupUser').value;
        setupConfig.password = pass;
    }
    if (setupCurrentStep === 2) { setupConfig.apiaryName = document.getElementById('setupApiary').value; setupConfig.location = document.getElementById('setupLocation').value; }
    if (setupCurrentStep === 4) { setupConfig.apSsid = document.getElementById('setupApSsid').value || 'SmartHive_OS'; }
    if (setupCurrentStep === 6) { completeSetup(); return; }
    if (setupCurrentStep < 6) showSetupStep(setupCurrentStep + 1);
}
function setupPrev() { if (setupCurrentStep > 1) showSetupStep(setupCurrentStep - 1); }
function populateWilayaSelect() { const s=document.getElementById('setupWilaya'); if(s) s.innerHTML=CONFIG.WILAYA_LIST.map((w,i)=>`<option value="${i+1}">${w}</option>`).join(''); }
function generateSetupSummary() {
    document.getElementById('setupSummary').innerHTML = `
        <div class="summary-line"><strong>👤 المسؤول:</strong> ${setupConfig.username}</div>
        <div class="summary-line"><strong>🏠 المنحل:</strong> ${setupConfig.apiaryName || 'غير محدد'}</div>
        <div class="summary-line"><strong>📡 الشبكة:</strong> ${setupConfig.apSsid}</div>
    `;
}
async function completeSetup() {
    try { await fetch(`${CONFIG.API_BASE}/setup/complete`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(setupConfig) }); } catch (e) {}
    closeSetupWizard();
    triggerAlert('✅ تم حفظ الإعدادات');
}
function scanDevicesSetup() { triggerAlert('🔍 جاري البحث...'); }

console.log('✅ Wizard loaded');