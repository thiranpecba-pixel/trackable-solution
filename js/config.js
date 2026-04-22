// ══════════════════════════════════════════
// Trackable Solution — Firebase Config & Utils
// Ceylon Business Appliances
// ══════════════════════════════════════════

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
// ════════════════════════════════════════════
export const emailjsConfig = {
  publicKey: "M0fN-ZhFBMo2K-psq",
  serviceId: "service_z6bjou4",
  templateId: "template_s023zsn"
};

// ════════════════════════════════════════════
// 🔧 IT DEVELOPER EMAIL ADDRESSES
// ════════════════════════════════════════════
export const IT_DEVELOPER_EMAILS = [
  "thiranperera29@gmail.com",
  "chathura.hewage11@gmail.com",
  "amila.d@cba.lk"
];

// ════════════════════════════════════════════
// App constants
// ════════════════════════════════════════════
export const DEPARTMENTS = [];

export const FEEDBACK_TYPES = {
  doubt:      { label: 'Doubt',      color: 'badge-doubt'      },
  suggestion: { label: 'Suggestion', color: 'badge-suggestion' },
  bug:        { label: 'Bug',        color: 'badge-bug'        }
};

export const STATUS = {
  pending:     { label: 'Pending',     color: 'badge-pending'  },
  'in-progress': { label: 'In progress', color: 'badge-progress' },
  resolved:    { label: 'Resolved',   color: 'badge-resolved' }
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

// ════════════════════════════════════════════
// requireAuth — call this at the top of each protected page
//
// Usage in your page scripts:
//
//   import { ..., onAuthStateChanged, signOut } from "firebase/auth";
//   import { ..., doc, getDoc } from "firebase/firestore";
//   import { firebaseConfig, requireAuth } from "../js/config.js";
//
//   requireAuth(
//     auth, db,
//     onAuthStateChanged, signOut,
//     doc, getDoc,
//     ['coordinator'],          // allowed roles
//     '../index.html'           // redirect target (optional)
//   ).then(({ user, userData }) => {
//     // page is authenticated — start your logic here
//   });
// ════════════════════════════════════════════
export function requireAuth(
  auth,
  db,
  onAuthStateChanged,
  signOut,
  docFn,
  getDocFn,
  allowedRoles = [],
  redirectTo = '../portal.html'
) {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {

      // 1. Not logged in at all
      if (!user) {
        window.location.href = redirectTo;
        return;
      }

      // 2. Firestore document doesn't exist yet (user created in Auth but
      //    the /users/{uid} doc hasn't been written — causes the bug-log loop)
      const snap = await getDocFn(docFn(db, 'users', user.uid));
      if (!snap.exists()) {
        await signOut(auth);          // sign out the incomplete user
        window.location.href = redirectTo;
        return;
      }

      const userData = snap.data();

      // 3. User exists but doesn't have an allowed role
      if (allowedRoles.length && !allowedRoles.includes(userData.role)) {
        window.location.href = redirectTo;
        return;
      }

      // 4. All checks passed
      resolve({ user, userData });
    });
  });
}
