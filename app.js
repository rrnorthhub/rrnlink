// ══════════════════════════════════════════════════
//  北輔中心入口網站 app.js
//  Google 帳號登入版（取代密碼保護）
//  登入有效期：30天
// ══════════════════════════════════════════════════

const CLIENT_ID = '480177769070-t922jh5s6svflimji6ehk0jvr5omfgf6.apps.googleusercontent.com';
const SESSION_KEY = 'nrrc_auth';
const SESSION_EXPIRE_KEY = 'nrrc_auth_expire';
const SESSION_EMAIL_KEY = 'nrrc_auth_email';
const EXPIRE_DAYS = 30;

// 白名單（全部小寫比對）
const ALLOWED_EMAILS = [
  'mr.bosslou@gmail.com',
  'sharon293981@gmail.com',
  'blossom.tw.c@gmail.com',
  'create9717@gmail.com',
  'haokung0816@gmail.com',
  'jay81121@gmail.com',
  'linsc5103@gmail.com',
  'rrnorthhub@gmail.com',
  'shangkuanlc@gmail.com',
  'tzuyu09211219@gmail.com',
  'xtinac.99s@gmail.com',
  'yijing780130@gmail.com',
  'yu810117@gmail.com',
  'yuwen0630@gmail.com',
  'zzt077133@gmail.com',
];

// ── 工具函式 ──────────────────────────────────────

function isSessionValid() {
  const auth   = localStorage.getItem(SESSION_KEY);
  const expire = localStorage.getItem(SESSION_EXPIRE_KEY);
  if (!auth || !expire) return false;
  return Date.now() < parseInt(expire);
}

function saveSession(email) {
  const expire = Date.now() + EXPIRE_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(SESSION_KEY, 'true');
  localStorage.setItem(SESSION_EXPIRE_KEY, expire.toString());
  localStorage.setItem(SESSION_EMAIL_KEY, email);
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_EXPIRE_KEY);
  localStorage.removeItem(SESSION_EMAIL_KEY);
}

function getSessionEmail() {
  return localStorage.getItem(SESSION_EMAIL_KEY) || '';
}

// ── 畫面切換 ──────────────────────────────────────

function showView(view) {
  document.querySelectorAll('.view').forEach(function(v) {
    v.classList.remove('active');
  });
  document.querySelectorAll('.nav-btn').forEach(function(b) {
    b.classList.remove('active');
  });

  if (view === 'internal') {
    if (isSessionValid()) {
      document.getElementById('view-internal').classList.add('active');
      // 顯示登入者 email
      var emailEl = document.getElementById('logged-email');
      if (emailEl) emailEl.textContent = getSessionEmail();
    } else {
      showGoogleLogin();
      return;
    }
  } else if (view === 'login') {
    if (isSessionValid()) {
      document.getElementById('view-internal').classList.add('active');
      var emailEl = document.getElementById('logged-email');
      if (emailEl) emailEl.textContent = getSessionEmail();
    } else {
      showGoogleLogin();
    }
    return;
  } else {
    document.getElementById('view-' + view).classList.add('active');
    var btn = document.querySelector('[onclick="showView(\'' + view + '\')"]');
    if (btn) btn.classList.add('active');
  }
}

function showGoogleLogin() {
  document.getElementById('view-google-login').classList.add('active');
}

function logout() {
  clearSession();
  // 撤銷 Google token
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.disableAutoSelect();
  }
  showView('public');
  var btn = document.querySelector('[onclick="showView(\'public\')"]');
  if (btn) btn.classList.add('active');
}

// ── Google 登入回呼 ───────────────────────────────

function parseJwt(token) {
  // URL-safe base64 解碼（Google JWT 用 - 和 _ 代替 + 和 /）
  var base64 = token.split('.')[1]
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  // 補齊 padding
  while (base64.length % 4) base64 += '=';
  var json = decodeURIComponent(
    atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')
  );
  return JSON.parse(json);
}

function handleGoogleLogin(response) {
  // 解析 JWT token
  var token = response.credential;
  var payload = parseJwt(token);
  var email = (payload.email || '').toLowerCase();

  if (ALLOWED_EMAILS.indexOf(email) !== -1) {
    saveSession(email);
    document.querySelectorAll('.view').forEach(function(v) {
      v.classList.remove('active');
    });
    document.getElementById('view-internal').classList.add('active');
    var emailEl = document.getElementById('logged-email');
    if (emailEl) emailEl.textContent = email;
  } else {
    document.getElementById('google-login-error').style.display = 'block';
    document.getElementById('google-login-error').textContent =
      '此帳號（' + email + '）無存取權限，請聯繫北輔中心管理員。';
  }
}

// ── 初始化 ────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
  // 判斷 hash 自動進入內部頁面
  if (window.location.hash === '#internal') {
    if (isSessionValid()) {
      showView('internal');
    } else {
      showGoogleLogin();
    }
    return;
  }
  // 預設顯示對外頁
  showView('public');
});
