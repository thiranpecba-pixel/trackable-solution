# Trackable Solution — Complete Setup Guide
## Ceylon Business Appliances
---

## What you're setting up (all 100% FREE)

| Service | Purpose | Cost |
|---|---|---|
| Firebase (Spark Plan) | Database + Login | Free forever |
| EmailJS (Free Tier) | Email notifications | Free (200/month) |
| Cloudflare Pages | Web hosting | Free forever |
| GitHub | File storage & deployment | Free |

---

## STEP 1 — Firebase Setup (Database & Login)

### 1.1 Create a Firebase project
1. Go to **https://console.firebase.google.com**
2. Click **"Add project"**
3. Name it: `trackable-solution-cba`
4. Disable Google Analytics (not needed) → Click **Create project**

### 1.2 Enable Email/Password Authentication
1. Left menu → **Build → Authentication**
2. Click **"Get started"**
3. Under **Sign-in method**, click **Email/Password**
4. Toggle **Enable** → Click **Save**

### 1.3 Create Firestore Database
1. Left menu → **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** → Next
4. Select a region close to Sri Lanka: **`asia-south1 (Mumbai)`** → Click **Enable**

### 1.4 Set Firestore Security Rules
1. In Firestore → click the **"Rules"** tab
2. Delete all existing content
3. Copy the entire contents of `firestore.rules` (included in this package)
4. Paste it in → Click **Publish**

### 1.5 Register your Web App & Get Config
1. Left menu → Click the **gear icon ⚙** → **Project settings**
2. Scroll down to **"Your apps"**
3. Click the **Web icon `</>`**
4. App nickname: `trackable-web` → Click **Register app**
5. You'll see a `firebaseConfig` object like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "trackable-solution-cba.firebaseapp.com",
     projectId: "trackable-solution-cba",
     ...
   };
   ```
6. **Copy this entire config** — you'll need it in Step 4.

---

## STEP 2 — EmailJS Setup (IT Team Notifications)

### 2.1 Create an EmailJS account
1. Go to **https://www.emailjs.com**
2. Click **"Sign Up Free"**
3. Use your work email

### 2.2 Connect Gmail (or any email)
1. Left menu → **Email Services** → **Add New Service**
2. Select **Gmail** (or Outlook/Yahoo)
3. Click **Connect Account** → Authorize with your company Gmail
4. **Note down the Service ID** (e.g. `service_abc123`)

### 2.3 Create the notification email template
1. Left menu → **Email Templates** → **Create New Template**
2. Set these fields:

   **Subject:**
   ```
   [{{type}}] New feedback from {{dept}} — {{worker_name}}
   ```

   **Body (HTML or text):**
   ```
   New feedback has been submitted on Trackable Solution.

   Department: {{dept}}
   Worker: {{worker_name}}
   Type: {{type}}
   Priority: {{priority}}

   Description:
   {{description}}

   ---
   Please log in and respond:
   {{dashboard_url}}

   Submitted by: {{submitted_by}}
   Feedback ID: {{feedback_id}}
   ```

   **To Email field:** `{{to_email}}`
   
3. Click **Save**
4. **Note down the Template ID** (e.g. `template_xyz456`)

### 2.4 Get your Public Key
1. Top right → Click your account name → **Account**
2. Under **"API Keys"** → Copy your **Public Key** (e.g. `user_abcDEF...`)

---

## STEP 3 — Update the config file

Open `js/config.js` in a text editor and replace the placeholder values:

```javascript
// Firebase config (from Step 1.5)
export const firebaseConfig = {
  apiKey: "AIzaSy...",             // ← paste your values here
  authDomain: "trackable-solution-cba.firebaseapp.com",
  projectId: "trackable-solution-cba",
  storageBucket: "trackable-solution-cba.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// EmailJS config (from Step 2)
export const emailjsConfig = {
  publicKey: "user_abcDEF...",         // ← from Step 2.4
  serviceId: "service_abc123",          // ← from Step 2.2
  templateId: "template_xyz456"         // ← from Step 2.3
};

// IT Developer emails — everyone who should get notified
export const IT_DEVELOPER_EMAILS = [
  "itdev1@ceylonba.com",    // ← replace with real IT dev emails
  "itdev2@ceylonba.com"
];
```

Also update `index.html` with the same firebaseConfig (find `YOUR_API_KEY` etc.).
And `pages/dashboard.html` — find the same placeholder in the script section.

---

## STEP 4 — Create your first user accounts in Firebase

Before deploying, create the coordinator account manually:

1. Firebase Console → **Authentication** → **Users** tab
2. Click **"Add user"**
3. Enter your email and a password → Click **Add user**
4. Copy the **User UID** shown (e.g. `abc123xyz`)
5. Go to **Firestore Database** → Click **"+ Start collection"**
   - Collection ID: `users`
   - Document ID: *(paste your User UID)*
   - Add these fields:
     - `name` (string): `Your Full Name`
     - `email` (string): `your@email.com`
     - `role` (string): `coordinator`
6. Click **Save**

After deploying, you can create IT Developer and Management accounts from within the app (Coordinator → Manage Users tab).

---

## STEP 5 — Deploy to Cloudflare Pages

### 5.1 Upload to GitHub
1. Go to **https://github.com** → Create free account if needed
2. Click **New repository** → Name: `trackable-solution` → Public → Create
3. Upload all files from the `trackable-solution/` folder to this repository
   (drag & drop in the GitHub web interface, or use GitHub Desktop)

### 5.2 Connect to Cloudflare Pages
1. Go to **https://pages.cloudflare.com** → Create free account
2. Click **"Create a project"** → **"Connect to Git"**
3. Connect your GitHub account → Select `trackable-solution` repo
4. **Build settings:**
   - Framework preset: `None`
   - Build command: *(leave empty)*
   - Build output directory: `/` (root)
5. Click **"Save and Deploy"**
6. Wait ~2 minutes → Cloudflare gives you a URL like `trackable-solution.pages.dev`

---

## STEP 6 — Seed Timeline Phases

Log in as Coordinator → Go to **Timeline** tab → Click **"+ Add phase"** to add your project phases:

| Phase | Date | Status |
|---|---|---|
| Kickoff & access setup | Mar 15 – Mar 22, 2025 | Done |
| Trial week 1 | Mar 23 – Mar 30, 2025 | Done |
| Trial week 2 | Mar 31 – Apr 6, 2025 | Done |
| Trial weeks 3 & 4 | Apr 7 – Apr 20, 2025 | In progress |
| IT review & staging | Apr 21 – Apr 30, 2025 | Planned |
| UAT & sign-off | May 1 – May 10, 2025 | Planned |
| Final launch | May 15, 2025 | Planned |

---

## User roles summary

| Role | Can do |
|---|---|
| **Coordinator** (you) | Add feedback, change status, manage users, manage timeline, download reports |
| **IT Developer** | View all feedback, write replies, update status to resolved |
| **Management** | Read-only: see overview, department progress, timeline, download reports |

---

## Project file structure

```
trackable-solution/
├── index.html              ← Login page
├── css/
│   └── main.css            ← Shared styles
├── js/
│   └── config.js           ← 🔧 YOUR CONFIG GOES HERE
├── pages/
│   ├── dashboard.html      ← Coordinator dashboard
│   ├── developer.html      ← IT Developer view
│   └── management.html     ← Management view
├── firestore.rules         ← Paste into Firebase Rules
└── SETUP.md                ← This guide
```

---

## Troubleshooting

**"Cannot log in"**
→ Check that the user exists in Firebase Auth AND has a document in `users` collection with correct role.

**"Email not sending"**
→ Check EmailJS Service ID, Template ID, and Public Key in `js/config.js`. Make sure the Gmail service is still connected in EmailJS dashboard.

**"Permission denied" error**
→ Check that you published the Firestore rules from `firestore.rules`.

**"Page not found" on Cloudflare**
→ Make sure all files were uploaded. Check that `index.html` is at the root level.

---

## Need help?
Contact: Your IT development team or refer to:
- Firebase docs: https://firebase.google.com/docs
- EmailJS docs: https://www.emailjs.com/docs
- Cloudflare Pages docs: https://developers.cloudflare.com/pages
