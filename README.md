<div align="center">

```
 █████╗ ██╗  ██╗██╗ ██████╗ ███╗   ███╗     ██████╗ █████╗ ██████╗ ██╗████████╗ █████╗ ██╗     
██╔══██╗╚██╗██╔╝██║██╔═══██╗████╗ ████║    ██╔════╝██╔══██╗██╔══██╗██║╚══██╔══╝██╔══██╗██║     
███████║ ╚███╔╝ ██║██║   ██║██╔████╔██║    ██║     ███████║██████╔╝██║   ██║   ███████║██║     
██╔══██║ ██╔██╗ ██║██║   ██║██║╚██╔╝██║    ██║     ██╔══██║██╔═══╝ ██║   ██║   ██╔══██║██║     
██║  ██║██╔╝ ██╗██║╚██████╔╝██║ ╚═╝ ██║    ╚██████╗██║  ██║██║     ██║   ██║   ██║  ██║███████╗
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝     ╚═╝     ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
```

### Axiom Capital Management Ltd. — Regulatory Compliance Portal

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Material UI](https://img.shields.io/badge/Material_UI-v5-0081CB?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://complaince-system.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

> A production-quality **Enterprise Compliance Management System** built with React 18 + Material UI v5.  
> Covers 8 SEBI / PMLA / PoSH / KYE mandated forms for Indian Asset Management Companies — fully interactive, recruiter-ready.

**[Live Demo →](https://complaince-system.vercel.app)**

</div>

---

## What Is This?

Employees at SEBI-regulated financial firms (AMCs, brokers, portfolio managers) are legally required to submit annual compliance declarations. This project **digitises that entire workflow** for a fictional AMC — Axiom Capital Management Ltd.

It covers:
- Indian fiscal-year lifecycle (April 1 – March 31)
- **Lock-until-next-FY** enforcement — once submitted, a form is read-only until April 1 of the following year
- 8 SEBI / PMLA / PoSH / HR mandated forms with real-world policy text
- Admin reports view with per-form submission details

This is a **frontend-only demo** with full UI/UX fidelity, localStorage persistence, React Context state, and a responsive MUI v5 layout.

---

## Live Demo

**[complaince-system.vercel.app](https://complaince-system.vercel.app)**

Opens directly on the **Dashboard** (no login required). Use the sidebar to navigate to any of the 8 forms. Submit a form and watch the fiscal-year lock kick in with the unlock date shown.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/regvedpande/ComplainceSystem)

> No environment variables required — 100% client-side.

### Local Development

```bash
git clone https://github.com/regvedpande/ComplainceSystem.git
cd ComplainceSystem
npm install
npm run dev
# → http://localhost:5173
```

---

## Features

### Dashboard
- **4 stat cards** — Total Forms, Submitted (locked), Pending, Re-submittable
- **Compliance progress bar** — percentage of forms submitted this FY
- **8 form cards** — each showing live status chip, due date, and a Fill / Re-Submit / Locked button
- **Recent activity feed** — sorted by submission timestamp

### 8 Compliance Forms

| # | Form | Regulation | Due Date |
|---|------|-----------|----------|
| 1 | **Asset & Liability Declaration** | SEBI (Employees' Securities Transactions) Regulations | Apr 30 |
| 2 | **Conflict of Interest Disclosure** | SEBI Code of Conduct | Apr 15 |
| 3 | **Insider Trading Self-Certification** | SEBI (PIT) Regulations, 2015 | Apr 10 |
| 4 | **AML Self-Declaration** | PMLA 2002 / SEBI AML Guidelines | Apr 15 |
| 5 | **PoSH Policy Acknowledgment** | Sexual Harassment of Women at Workplace Act, 2013 | Apr 30 |
| 6 | **KYE Annual Declaration** | SEBI / HR Policy — Know Your Employee | Apr 30 |
| 7 | **Code of Conduct Acknowledgment** | SEBI (Mutual Funds) Regulations / Company Policy | Apr 10 |
| 8 | **Gift & Hospitality Register** | SEBI Code of Conduct / Anti-Bribery Policy | Mar 31 |

### Form Architecture
Every form is wrapped in a shared `FormWrapper` component providing:
- Gradient header with form icon, due date chip, and status chip
- **April 1 fiscal-year lock** — submitted forms show the next re-submission date and become fully read-only
- Sticky bottom action bar with Save Draft and Submit
- Validation with MUI error states and helper text

### Reports Page
- Per-form submission detail cards
- Key metadata: submitted by, employee code, department, fiscal year, timestamp
- Status indicators for all 8 forms

### UX / Layout
- **Permanent sidebar** on desktop (256 px), slide-out drawer on mobile
- Live status chips (Due / Done / Redo) per form in the sidebar
- Fully responsive — MUI Grid + Drawer breakpoints
- Card hover lift animations, react-hot-toast notifications
- Deep Indigo + Teal colour palette

---

## Fiscal Year Lock Logic

Indian financial year runs **April 1 – March 31**.

```
Submit on: 2025-04-10  →  Locked until: 2026-04-01
Submit on: 2025-01-15  →  Locked until: 2025-04-01
```

Implemented in `AppContext.jsx`:

```js
export function getNextUnlockDate(submittedAt) {
  const submitted = new Date(submittedAt)
  const april1SameYear = new Date(submitted.getFullYear(), 3, 1)
  return submitted < april1SameYear
    ? april1SameYear
    : new Date(submitted.getFullYear() + 1, 3, 1)
}

// formStatus returns:
// 'submitted-locked'   — submitted and still in same FY
// 'submitted-unlocked' — new FY started, can re-submit
// 'pending'            — not yet submitted
```

---

## Tech Stack

| Technology | Version | Role |
|-----------|---------|------|
| **React** | 18 | UI framework, hooks |
| **Material UI** | v5 | Component library, theming, icons |
| **Vite** | 5 | Build tool & dev server |
| **React Router DOM** | v6 | Nested routes, `<Outlet>`, `useNavigate` |
| **react-hot-toast** | 2 | Toast notifications |
| **Emotion** | 11 | CSS-in-JS (MUI peer dependency) |

---

## Project Structure

```
ComplainceSystem/
├── index.html                     ← Vite entry, Inter font
├── vite.config.js
├── vercel.json                    ← SPA rewrites → /index.html
├── package.json
└── src/
    ├── main.jsx                   ← ReactDOM.createRoot + AppProvider
    ├── App.jsx                    ← ThemeProvider + BrowserRouter + Routes
    ├── theme.js                   ← MUI custom theme (Deep Indigo + Teal)
    │
    ├── context/
    │   └── AppContext.jsx         ← Global state: DEMO_USER, submissions,
    │                                 submitForm, formStatus, fiscal-year logic
    │
    ├── components/
    │   ├── FormWrapper.jsx        ← Shared form shell (gradient header, sticky bar, lock)
    │   └── Layout/
    │       ├── Navbar.jsx         ← AppBar: logo, notifications bell, user avatar
    │       └── Layout.jsx         ← Permanent drawer + ALL_FORMS export + Outlet
    │
    ├── pages/
    │   ├── Dashboard.jsx          ← Stat cards + progress bar + form grid + activity feed
    │   └── Reports.jsx            ← Submission details per form
    │
    └── forms/
        ├── AssetLiability.jsx     ← Dynamic rows: properties, investments, liabilities
        ├── ConflictOfInterest.jsx ← Financial interests, outside employment, vendor disclosure
        ├── InsiderTrading.jsx     ← UPSI acknowledgments, trade disclosure, pre-clearance
        ├── AMLDeclaration.jsx     ← 5 PMLA compliance questions + source-of-funds
        ├── POSHAcknowledgment.jsx ← PoSH Act 2013 policy acknowledgment
        ├── KYEDeclaration.jsx     ← Personal info, address, emergency contact, nominees
        ├── CodeOfConduct.jsx      ← 6 ethics sections with progress bar
        └── GiftHospitality.jsx    ← Gift register with ₹2,000 threshold logic
```

---

## Architecture

```
AppProvider (React Context + localStorage)
  └── BrowserRouter
        └── Layout  (Navbar + Permanent Sidebar)
              └── <Outlet>
                    ├── /dashboard                  → Dashboard
                    ├── /reports                    → Reports
                    ├── /form/asset-liability        → AssetLiability
                    ├── /form/conflict-of-interest   → ConflictOfInterest
                    ├── /form/insider-trading        → InsiderTrading
                    ├── /form/aml-declaration        → AMLDeclaration
                    ├── /form/posh-acknowledgment    → POSHAcknowledgment
                    ├── /form/kye-declaration        → KYEDeclaration
                    ├── /form/code-of-conduct        → CodeOfConduct
                    └── /form/gift-hospitality       → GiftHospitality
```

### Context API

| Export | Type | Purpose |
|--------|------|---------|
| `COMPANY` | Object | Centralised branding — name, short, code, tagline |
| `DEMO_USER` | Object | Pre-loaded employee: Regved Pande, EMP001, Compliance, M5 |
| `user` | State | Active employee details |
| `submissions` | State | `{ formKey: submissionData \| null }` for all 8 forms |
| `submitForm(key, data)` | Function | Saves submission with timestamp + employee metadata |
| `formStatus(key)` | Function | `'pending' \| 'submitted-locked' \| 'submitted-unlocked'` |
| `getNextUnlockDate(ts)` | Function | Returns April 1 of next applicable FY |
| `getFiscalYear()` | Function | Returns current FY string e.g. `"FY 2025–26"` |
| `logout()` | Function | Resets user + clears submissions + localStorage |

---

## Theme

```
Primary:       #1a237e  (Deep Indigo)
Secondary:     #00897b  (Teal)
Background:    #f0f2f8  (Light blue-grey)
Cards:         #ffffff  with subtle 1px border
Border radius: 10px (cards/papers) · 8px (base) · 0px (drawer)
Typography:    Inter → Roboto → Helvetica (fallback chain)
Shadows:       Soft multi-level (1px → 32px spread)
```

---

## What This Demonstrates

- **React 18** — `useState`, `useEffect`, `useContext`, controlled forms, conditional rendering, dynamic field arrays
- **Material UI v5** — Custom theming, responsive Grid, permanent Drawer, Dialog, LinearProgress, Chip, Alert, TextField, Select
- **React Router v6** — Nested routes, `<Outlet>`, `useNavigate`, `useLocation`
- **State architecture** — React Context as a global store with localStorage hydration and fiscal-year business logic
- **Indian regulatory domain knowledge** — SEBI PIT Regulations, PMLA 2002, PoSH Act 2013, KYE norms — real policy text in forms
- **Enterprise UX** — Sidebar status chips, fiscal lock enforcement, sticky submit bars, toast feedback, responsive mobile layout

---

## Contributing

```bash
# Fork and clone
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
# Open a Pull Request
```

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built by [Regved Pande](https://github.com/regvedpande)**

[![GitHub](https://img.shields.io/badge/GitHub-regvedpande-181717?style=flat-square&logo=github)](https://github.com/regvedpande)

*Demonstrating enterprise React patterns, SEBI-domain compliance workflows, fiscal-year state logic, and Material UI v5 — the kind of system a compliance team at an Indian AMC would actually use.*

</div>
