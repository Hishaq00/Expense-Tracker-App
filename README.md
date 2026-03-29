# 💸 ExpenseTracker

A modern, feature-rich **family expense tracking** web application built with React, Firebase, and TailwindCSS. Track your spending, manage family member — all in one place.

---

## ✨ Features

- 🔐 **Authentication** — Email/password sign-up & login with Firebase Auth
- 👁️ **Password Visibility Toggle** — Show/hide password on login and signup screens
- 🎭 **Role-based Access** — Separate `Parent`, `Child`, and `Admin` roles
- 📊 **Dashboard** — Visual charts and spending summaries using Recharts
- 💳 **Expense Management** — Add, edit, and delete expenses with categories
- 👨‍👩‍👧 **Family Management** — Parents can add child accounts and monitor their spending
- 🛡️ **Admin Panel** — Manage all users, freeze/unfreeze accounts
- 🎬 **Splash Screen & Onboarding** — Smooth first-run experience with animated onboarding
- 📱 **Responsive Design** — Works seamlessly on desktop and mobile
- ⚡ **Animations** — Fluid UI transitions using Framer Motion

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | TailwindCSS 4 |
| Animations | Motion (Framer Motion) |
| Backend / DB | Firebase Firestore |
| Auth | Firebase Authentication |
| Charts | Recharts |
| Icons | Lucide React |
| Date Utils | date-fns |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [Firebase](https://console.firebase.google.com/) project with Firestore and Authentication enabled
- A [Gemini API key](https://aistudio.google.com/) (optional — for AI insights)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd expense-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**

   Update `firebase-applet-config.json` with your Firebase project credentials:
   ```json
   {
     "authDomain": "YOUR_PROJECT.firebaseapp.com",
     "projectId": "YOUR_PROJECT_ID",
     "storageBucket": "YOUR_PROJECT.appspot.com",
     "messagingSenderId": "YOUR_SENDER_ID",
     "appId": "YOUR_APP_ID",
     "firestoreDatabaseId": "(default)"
   }
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at **http://localhost:3000**

---

## 📁 Project Structure

```
expense-tracker/
├── src/
│   ├── components/         # UI Components
│   │   ├── Login.tsx           # Login screen with password toggle
│   │   ├── Signup.tsx          # Signup screen with password toggle
│   │   ├── Dashboard.tsx       # Main dashboard with charts
│   │   ├── ExpenseList.tsx     # Expense list with edit/delete
│   │   ├── ExpenseForm.tsx     # Add/Edit expense modal
│   │   ├── AddChildForm.tsx    # Parent: add child account
│   │   ├── AdminUserList.tsx   # Admin: manage all users
│   │   ├── Layout.tsx          # App shell with navbar
│   │   ├── SplashScreen.tsx    # Animated splash screen
│   │   ├── Onboarding.tsx      # First-run onboarding flow
│   │   └── ErrorBoundary.tsx   # Global error handler
│   ├── providers/          # React Context Providers
│   │   ├── AuthProvider.tsx    # Firebase auth state
│   │   └── ExpenseProvider.tsx # Expense data state
│   ├── services/           # Firebase service layer
│   │   ├── expenseService.ts   # CRUD for expenses
│   │   └── userService.ts      # User profile management
│   ├── lib/
│   │   ├── firebase.ts         # Firebase initialization
│   │   └── utils.ts            # Utility helpers
│   ├── types.ts            # Shared TypeScript types
│   ├── App.tsx             # Root application component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── firebase-applet-config.json # Firebase project config
├── firestore.rules             # Firestore security rules
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

---

## 🔒 User Roles

| Role | Capabilities |
|---|---|
| **Parent** | Add/manage own expenses, add child accounts, view family spending |
| **Child** | View and add own expenses (limited access) |
| **Admin** | Full access — view all users, freeze/unfreeze accounts, manage platform |

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production (`dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | TypeScript type checking |
| `npm run clean` | Remove the `dist/` folder |

---

## 🔐 Firestore Security Rules

Firestore security rules are defined in `firestore.rules`. Make sure to deploy them to your Firebase project:

```bash
firebase deploy --only firestore:rules
```

---

## 📄 License

This project is for personal/educational use. Feel free to fork and adapt it for your own projects.
