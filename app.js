// ── 密碼設定 ──────────────────────────────────────────────────────
const PASSWORD = 'Create52601671';
const SESSION_KEY = 'nrrc_auth';
// ── 檢查登入狀態 ──────────────────────────────────────────────────
function checkSession() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}
// ── 切換頁面 ──────────────────────────────────────────────────────
function showView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (view === 'internal') {
    if (checkSession()) {
      document.getElementById('view-internal').classList.add('active');
      document.querySelectorAll('.nav-btn')[1].classList.add('active');
    } else {
      document.getElementById('view-login').classList.add('active');
      document.querySelectorAll('.nav-btn')[1].classList.add('active');
    }
  } else if (view === 'login') {
    if (checkSession()) {
      document.getElementById('view-internal').classList.add('active');
      document.querySelectorAll('.nav-btn')[1].classList.add('active');
    } else {
      document.getElementById('view-login').classList.add('active');
      document.querySelectorAll('.nav-btn')[1].classList.add('active');
    }
  } else {
    document.getElementById('view-public').classList.add('active');
    document.querySelectorAll('.nav-btn')[0].classList.add('active');
  }
}
// ── 密碼驗證 ──────────────────────────────────────────────────────
function checkPwd() {
  const input = document.getElementById('pwd-input').value;
  const error = document.getElementById('pwd-error');
  if (input === PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    error.style.display = 'none';
    document.getElementById('pwd-input').value = '';
    showView('internal');
  } else {
    error.style.display = 'block';
    document.getElementById('pwd-input').value = '';
    document.getElementById('pwd-input').focus();
  }
}
// ── 登出 ──────────────────────────────────────────────────────────
function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  showView('public');
}
// ── 初始化 ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#internal' && sessionStorage.getItem(SESSION_KEY) === 'true') {
    history.replaceState(null, '', window.location.pathname);
    showView('internal');
  } else {
    showView('public');
  }
});
