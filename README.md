<div align="center">

```
███████╗██████╗ ███████╗     ██████╗ ██████╗ ███╗   ███╗██████╗ ██╗     ██╗ █████╗ ███╗   ██╗ ██████╗███████╗
██╔════╝██╔══██╗██╔════╝    ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██║     ██║██╔══██╗████╗  ██║██╔════╝██╔════╝
█████╗  ██║  ██║█████╗      ██║     ██║   ██║██╔████╔██║██████╔╝██║     ██║███████║██╔██╗ ██║██║     █████╗
██╔══╝  ██║  ██║██╔══╝      ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║     ██║██╔══██║██║╚██╗██║██║     ██╔══╝
███████╗██████╔╝██║         ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ███████╗██║██║  ██║██║ ╚████║╚██████╗███████╗
╚══════╝╚═════╝ ╚═╝          ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝
```

### UTI Asset Management Company — Regulatory Compliance Portal

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Material UI](https://img.shields.io/badge/Material_UI-v5.14-0081CB?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com)
[![Vite](https://img.shields.io/badge/Vite-4.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

> A production-quality, end-to-end **Enterprise Compliance Management System** demo built with React 18 + Material UI v5.  
> Inspired by real-world AMC compliance portals — fully interactive, recruiter-ready.

</div>

---

## What Is This?

In regulated financial companies like UTI Asset Management, employees are legally required to submit compliance declarations every quarter or annually — things like:

- *"I don't own shares in any competitor"*
- *"I received no gift worth over ₹1,000"*
- *"My brother does NOT work at a vendor"*

This project **digitises that entire workflow** — replacing paper forms with a slick, authenticated web portal. It covers the full lifecycle from login → form submission → admin reporting.

This is a **frontend demo** with full UI/UX fidelity, localStorage persistence, protected routing, validation, and an admin reports view — the kind of system a compliance team at an AMC would actually use.

---

## Deploy & Live Demo

### One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/regvedpande/ComplainceSystem)

> **No environment variables required** — this is a fully client-side app.

### Manual Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from the project directory
cd compliance-system
vercel --prod
```

Vercel auto-detects the config from `vercel.json`:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **SPA routing:** All paths rewrite to `/index.html` (React Router works on refresh/direct link)

### Local Development

```bash
git clone https://github.com/regvedpande/ComplainceSystem.git
cd ComplainceSystem
npm install
npm run dev
# → Open http://localhost:5173
```
> On the login page, enter any name, pick a department & band, and click **Login to Portal**.

---

## Screenshots

| Login Page | Dashboard |
|:---:|:---:|
| *Gradient background, shield branding, SSL chip, form validation* | *Stats cards, progress bar, 8 form tiles with live status chips* |

| Form — Anti-Fraud | Admin Reports |
|:---:|:---:|
| *Multi-section form, conditional fields, sticky submit bar* | *Filterable table, 12 mock submissions, view-details dialog* |

---

## Features

### Employee Portal
- **Authenticated Login** — Employee enters name, code, department, designation, band; simulates session management
- **Live Dashboard** — Real-time stat cards (Total / Submitted / Pending / Not Due), gradient progress bar, 8 form cards with status chips, recent activity feed
- **8 Compliance Forms** — Each with proper validation, conditional fields, declaration checkboxes, digital signature, and due dates
- **Read-Only After Submission** — Submitted forms show a success banner and lock the form
- **Save Draft** — Mock draft save with toast notification
- **"Not Due" State** — Some forms are greyed out and disabled until compliance team activates them

### Layout & UX
- **Persistent Sidebar** — Collapsible form list with live Pending / Submitted / Not Due chips per form
- **Responsive Navbar** — Notifications bell with badge, user avatar menu, logout, mobile hamburger
- **Fully Responsive** — Mobile, tablet, and desktop layouts via MUI Grid + Drawer
- **Smooth Transitions** — Card hover lift, loading spinners, toast notifications

### Admin Reports
- **Reports Dashboard** — Total submissions, unique employees, pending actions stat cards
- **5-Column Filters** — Period, Department, Form Type, Status, and Search by name/code
- **Sortable Table** — Alternating row colours, sticky header, 12+ mock records + real user submissions
- **View Details Dialog** — Full submission breakdown in a modal
- **Export to Excel** — Mock export with toast confirmation

### Technical
- **localStorage Persistence** — State survives browser refresh; user and all submissions are cached
- **Protected Routes** — Unauthenticated users are redirected to login
- **Global State** — React Context with `formStatus()`, `submitForm()`, `logout()` APIs
- **Form Validation** — MUI error states with helper text on every required field

---

## Tech Stack

| Technology | Version | Role |
|-----------|---------|------|
| **React** | 18.2 | UI framework |
| **Material UI** | 5.14 | Component library, theming, icons |
| **Vite** | 4.4 | Build tool & dev server (lightning fast HMR) |
| **React Router DOM** | 6.15 | Client-side routing with protected routes |
| **react-hot-toast** | 2.4 | Toast notifications |
| **Emotion** | 11.11 | CSS-in-JS (MUI peer dependency) |

---

## Quick Start

```bash
# 1 — Clone
git clone https://github.com/regvedpande/compliance-system.git
cd compliance-system

# 2 — Install dependencies
npm install

# 3 — Start dev server
npm run dev

# 4 — Open in browser
open http://localhost:5173

# Production build
npm run build && npm run preview
```

---

## Project Structure

```
compliance-system/
├── index.html                       ← Vite entry (Inter font, root div)
├── vite.config.js                   ← Vite + React plugin
├── package.json
├── .gitignore
└── src/
    ├── main.jsx                     ← ReactDOM.createRoot
    ├── App.jsx                      ← ThemeProvider + Router + Toaster
    ├── theme.js                     ← MUI custom theme (deep indigo + teal)
    │
    ├── context/
    │   └── AppContext.jsx           ← Global state: user, submissions, formStatus
    │
    ├── utils/
    │   └── dateUtils.js             ← Date formatting helpers
    │
    ├── components/
    │   ├── FormWrapper.jsx          ← Shared form shell (gradient header, sticky bar)
    │   └── Layout/
    │       ├── Navbar.jsx           ← AppBar: logo, notifications, user avatar, logout
    │       └── Layout.jsx           ← Permanent drawer + Outlet for page content
    │
    ├── pages/
    │   ├── Login.jsx                ← Gradient login with validation
    │   ├── Dashboard.jsx            ← Stats + form grid + activity feed
    │   └── Reports.jsx              ← Admin table with filters + detail dialog
    │
    └── forms/
        ├── AntiFraud.jsx            ← Form 1
        ├── ConflictOfInterest.jsx   ← Form 2
        ├── NonDisclosure.jsx        ← Form 3
        ├── HRDeclaration.jsx        ← Form 4
        ├── GiftReward.jsx           ← Form 5
        ├── PropertyDeclaration.jsx  ← Form 6
        ├── CodeOfConduct.jsx        ← Form 7
        └── RelativeEmployment.jsx   ← Form 8
```

---

## Compliance Forms

| # | Form Name | Key Areas Covered | Default Status |
|---|-----------|-------------------|----------------|
| 1 | **Anti-Fraud Declaration** | Fraud awareness, unusual transactions, asset misuse, data security | Pending |
| 2 | **Conflict of Interest** | Financial interests in competitors, outside employment, vendor relationships | Pending |
| 3 | **Non-Disclosure Agreement** | Client data, trading strategies, employee data, IT credentials, regulatory info | Pending |
| 4 | **HR Annual Declaration** | Personal details, emergency contact, nominees, bank information | Pending |
| 5 | **Gift & Reward Declaration** | Gifts/hospitality > ₹1,000, giver identity, value, action taken | Not Due |
| 6 | **Property Declaration** | Immovable assets, vehicle, investments, jewellery/valuables | Pending |
| 7 | **Code of Conduct** | Workplace ethics, info security, social media, anti-bribery, whistleblower | Pending |
| 8 | **Relative Employment** | Family members in financial services, conflict of interest assessment | Not Due |

---

## Architecture

```
AppProvider (React Context + localStorage)
  └── BrowserRouter
        ├── /               → Login  (public)
        └── ProtectedRoute
              └── Layout    (requires authenticated user)
                    ├── Navbar       ← fixed top bar
                    ├── Sidebar      ← permanent drawer (desktop) / modal (mobile)
                    └── <Outlet>
                          ├── /dashboard              → Dashboard
                          ├── /reports                → Admin Reports
                          ├── /form/anti-fraud        → AntiFraud
                          ├── /form/conflict-of-interest
                          ├── /form/non-disclosure
                          ├── /form/hr-declaration
                          ├── /form/gift-reward
                          ├── /form/property-declaration
                          ├── /form/code-of-conduct
                          └── /form/relative-employment
```

### State Management

| API | Type | Purpose |
|-----|------|---------|
| `user` | Object | Logged-in employee details |
| `setUser(u)` | Function | Login / update user |
| `submissions` | Object | Map of formKey → submission data |
| `submitForm(key, data)` | Function | Save submission with timestamp |
| `formStatus(key)` | Function | Returns `'submitted' \| 'pending' \| 'not-due'` |
| `logout()` | Function | Clear user + submissions + localStorage |

### Form Architecture

Every one of the 8 forms is wrapped in `FormWrapper`, which provides:

```
FormWrapper
  ├── Gradient header card (title, icon, due date, status chip)
  ├── Success alert (read-only mode after submission)
  ├── Info alert (disabled state for "not due" forms)
  ├── children (form-specific fields)
  └── Fixed bottom bar (Save Draft | Submit Form)
```

---

## Theme

```
Primary:      #1a237e  (Deep Indigo)
Secondary:    #00897b  (Teal)
Background:   #f5f7fa  (Light blue-grey)
Cards:        #ffffff  with subtle shadow
Border radius: 12px (cards) / 8px (buttons) / 4px (inputs)
Typography:   Inter (headings + body) / Roboto (fallback)
```

---

## What This Project Demonstrates

This project was built to demonstrate proficiency in:

- **React 18** — hooks (`useState`, `useEffect`, `useContext`), controlled forms, conditional rendering
- **Material UI v5** — theming, Grid v2, responsive layout, Drawer, Dialog, Table, Chips, Alerts
- **React Router v6** — nested routes, `<Outlet>`, `useNavigate`, `useLocation`, protected routes
- **State architecture** — React Context as a lightweight global store with localStorage hydration
- **Form design** — validation, error states, dynamic field arrays, read-only views, loading states
- **Responsive design** — mobile-first with MUI breakpoints and a collapsible sidebar
- **Enterprise UX patterns** — sidebar navigation with status indicators, admin report tables, notification badges, user menus

The system architecture mirrors the real-world EDF project's 3-tier design (Browser ↔ API Server ↔ Database), with the browser tier fully implemented and the backend mocked via React Context.

---

## Contributing

1. Fork this repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built by [Regved Pande](https://github.com/regvedpande)**

[![GitHub](https://img.shields.io/badge/GitHub-regvedpande-181717?style=flat-square&logo=github)](https://github.com/regvedpande)

*Showcasing enterprise-grade React + Material UI architecture, form state management, protected routing, and admin reporting — patterns used in real-world financial compliance portals.*

</div>
