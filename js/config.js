// ══════════════════════════════════════════
// Trackable Solution — Firebase Config & Utils
// Ceylon Business Appliances
// ══════════════════════════════════════════

// ════════════════════════════════════════════
// 🔧 REPLACE THESE WITH YOUR FIREBASE CONFIG
// Firebase Console → Project Settings → Your apps → Web app
// ════════════════════════════════════════════
export const firebaseConfig = {
  apiKey: "AIzaSyAFBJ9_Q--KUyBltOa0Rn3rbck6mg22PLk",
  authDomain: "trackable-progress.firebaseapp.com",
  projectId: "trackable-progress",
  storageBucket: "trackable-progress.firebasestorage.app",
  messagingSenderId: "961877401670",
  appId: "1:961877401670:web:ff3ad97b1dcf7906572a47"
};

// ════════════════════════════════════════════
// 🔧 REPLACE THESE WITH YOUR EMAILJS KEYS
// From: emailjs.com → Dashboard → Account → API Keys & Email Services
// ════════════════════════════════════════════
export const emailjsConfig = {
  publicKey: "M0fN-ZhFBMo2K-psq",    // Account → General → Public Key
  serviceId: "service_z6bjou4",    // Email Services → your service ID
  templateId: "template_s023zsn"  // Email Templates → your template ID
};

// ════════════════════════════════════════════
// 🔧 IT DEVELOPER EMAIL ADDRESSES
// All IT developers who should be notified of new feedback
// ════════════════════════════════════════════
export const IT_DEVELOPER_EMAILS = [
  "thiranperera29@gmail.com",  // Replace with actual IT dev emails
  "developer2@ceylonba.com"
];

// ════════════════════════════════════════════
// App constants
// ════════════════════════════════════════════
export const DEPARTMENTS = [
  'Sales', 'Finance', 'HR', 'Warehouse',
  'IT', 'Admin', 'Customer Service', 'Logistics', 'Marketing'
];

export const FEEDBACK_TYPES = {
  doubt: { label: 'Doubt', color: 'badge-doubt' },
  suggestion: { label: 'Suggestion', color: 'badge-suggestion' },
  bug: { label: 'Bug', color: 'badge-bug' }
};

export const STATUS = {
  pending: { label: 'Pending', color: 'badge-pending' },
  'in-progress': { label: 'In progress', color: 'badge-progress' },
  resolved: { label: 'Resolved', color: 'badge-resolved' }
};

// ════════════════════════════════════════════
// Helper utilities
// ════════════════════════════════════════════
export function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function timeAgo(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function badge(type, map) {
  const item = map[type] || { label: type, color: 'badge-doubt' };
  return `<span class="badge ${item.color}">${item.label}</span>`;
}

export function deptColor(dept) {
  const colors = ['#2ea84f','#388bfd','#d29922','#bc8cff','#f85149','#58a6ff','#79c0ff','#56d364','#ffa657'];
  const idx = [...dept].reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return colors[idx];
}

export function initials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

// Redirect if not authenticated
export function requireAuth(auth, db, allowedRoles, redirectTo = '../index.html') {
  return new Promise((resolve) => {
    const { onAuthStateChanged } = window.__firebase_auth__;
    const { doc, getDoc } = window.__firebase_db__;
    onAuthStateChanged(auth, async (user) => {
      if (!user) { window.location.href = redirectTo; return; }
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (!snap.exists()) { window.location.href = redirectTo; return; }
      const data = snap.data();
      if (allowedRoles && !allowedRoles.includes(data.role)) {
        window.location.href = redirectTo; return;
      }
      resolve({ user, userData: data });
    });
  });
}
