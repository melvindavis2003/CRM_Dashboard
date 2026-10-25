<div align="center">

# NovaCRM — Cinema Operations & Customer CRM Dashboard

**A luxury, minimalist cinema telemetry and customer CRM platform engineered with pure HTML5, vanilla JavaScript, modular CSS design tokens, and Chart.js.**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-ff5d2a?style=for-the-badge&logo=github)](https://melvindavis2003.github.io/Group_Project_Luminar_2/)
[![Version](https://img.shields.io/badge/Version-2.4.0-1c1c21?style=for-the-badge)](https://github.com/melvindavis2003/Group_Project_Luminar_2)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

### 🌐 [Click to Launch Live Cloud Demo](https://melvindavis2003.github.io/Group_Project_Luminar_2/)
*Hosted live on GitHub Cloud. Zero installation, zero build steps.*

<br/>

---

</div>

## ✦ Design Philosophy

NovaCRM is inspired by the **clean, minimal, and premium aesthetic of Apple hardware commercials**. It abandons cluttered enterprise UI patterns in favor of:

- **Squircle Container Geometry**: 20px rounded card containers with subtle hairline borders (`rgba(255, 255, 255, 0.05)`).
- **Curated Color Hierarchy**: Deep obsidian black (`#101114`), cards (`#1c1c21`), and signature coral orange (`#ff5d2a`) paired with mint, lavender, and amber accents.
- **Dual-Theme Architecture**: Seamless instant switching between **Matte Obsidian Dark Mode** and **Porcelain Light Mode** with persistent `localStorage` memory and theme-aware SVG and chart rendering.
- **Micro-Interactions**: Pill badges, straight-segment charts with node markers, and smooth drawer transitions.

---

## ⚡ Live Cloud Deployment

| Environment | Provider | Link |
| :--- | :--- | :--- |
| **Production Cloud** | **GitHub Pages** | **[melvindavis2003.github.io/Group_Project_Luminar_2](https://melvindavis2003.github.io/Group_Project_Luminar_2/)** |
| **Source Repository** | **GitHub** | **[github.com/melvindavis2003/Group_Project_Luminar_2](https://github.com/melvindavis2003/Group_Project_Luminar_2)** |

---

## 🚀 Key Modules & System Architecture

```
NovaCRM Dashboard
├── 1. Operations Command Center (Dual-Mode Telemetry & KPI Cards)
├── 2. 357 Contact Directory & Lead CRM (CSV Export Engine)
├── 3. Movie Catalog & Showtime Scheduler (Conflict Detection)
├── 4. Live Box Office & Seat Matrix (Printable Barcode Ticket Stubs)
├── 5. Customer CRM & Loyalty Drawer (VIP Tiers & Visit Telemetry)
├── 6. Reservations Ledger & Refund Desk (Instant Seat Release)
└── 7. System Settings & LocalStorage Backup (JSON Export/Import)
```

### 1. Operations Command Center (Dual-View Telemetry)
- **Top 4 KPI Metric Cards**:
  - **Active Deals**: `86` (`↗ 37%` orange pill badge).
  - **Pipeline Value**: `$412,800` (`↗ Potential revenue` green pill badge).
  - **Deals Won (This Month)**: `18` (`↘ vs last month` yellow pill badge, `+22%` growth).
  - **Conversion Rate**: `34%` with custom red trend curve sparkline.
- **Interactive Dual-View Segmented Switcher**:
  - **Photo 1 View**:
    - **Total Sales**: 7-day straight-segment line graph (Mon–Sun) with glowing orange node markers and green badge (`$15,039`).
    - **Sales Activity**: 180° semi-circular gauge chart (30% Yellow, 60% Mint, 10% Purple) with interactive channel filters (`WhatsApp`, `Chat`, `Email`).
  - **Photo 2 View**:
    - **Closed Revenue in 30 Days**: Smooth bell-curve area wave chart with glowing orange gradient and `Won 68%` apex marker.
    - **Top Deal Sources**: 3 vertical rounded capsule bars (Website 100%, Ads 160%, Referrals 140%) with Y-axis percentage guides.
    - **Sales Rep Performance**: Progress meters for Sarah (`$54,200`), John (`$38,600`), and Marcus (`$45,100`).

### 2. 357 Contact Directory & Lead Ticker
- **Live Search & Filter**: Instant candidate search across Name, Email, and Company.
- **Role Segmentation**: Filter between All Roles, VIP Patrons, Corporate Clients, and Loyalty Members.
- **One-Click CSV Export**: Downloads cleanly formatted `.csv` reports for accounting.
- **Lead Ticker**: Bottom marquee featuring high-value bookings (*Pixel Studio* — `$4,500`).
- **Profile Connection**: Clicking `See Detail →` on any contact slides open their full cinema CRM history.

### 3. Movie Catalog & Showtime Scheduler
- **Film Rotation Management**: View active films, duration, director, rating (PG-13, R), and base admission prices.
- **Conflict Engine**: Prevents double-booking screenings in the same screen auditorium slot with real-time collision alerts.
- **Screen Filtering**: Switch between Screen 1 (IMAX Laser), Screen 2 (Dolby Atmos), and Screen 3 (Luxe Recliners).

### 4. Live Box Office & Real-Time Seat Matrix
- **Curved Soundstage Projection Screen**: Visual curved cinema screen with ambient light beam effects.
- **Interactive Seat Matrix**:
  - **VIP Recliners** (Rows A-B): `$22.00`
  - **Standard Premium** (Rows C-G): `$16.50`
  - **Accessible Rows** (Row H): `$15.00`
- **Instant Booking Engine**: Multi-seat selection, tax and booking fee breakdown, and POS payment method selector.
- **Digital Ticket Stubs**: Generates printable cinema ticket stubs with simulated linear barcodes and notch punchouts.

### 5. Customer CRM & Loyalty Engine
- **VIP Tier System**: Bronze, Silver, Gold, and Platinum tiers.
- **Telemetry**: Tracks lifetime spend, reward points, visit counters, preferred genres, and personalized seating notes.

### 6. Reservations Ledger & Refund Desk
- **Audited Transaction History**: Searchable bookings ledger with customer details, assigned seats, and timestamps.
- **Instant Seat Release**: Issue full refunds with one click; immediately releases reserved seats back to the live seat matrix.

### 7. Dual Theme Engine (Dark & Light)
- **Matte Obsidian Dark Mode**: Inspired by minimal developer tools and luxury OLED hardware interfaces.
- **Porcelain Light Mode**: Ultra-clean, high-contrast alabaster cards with hairline borders and adaptive chart scales.
- **Automatic Persistence**: Saved to `localStorage.getItem('novacrm_theme')` across browser restarts.

---

## 🎨 Design Tokens & Palette

| Token | Dark Mode | Light Mode | Purpose |
| :--- | :--- | :--- | :--- |
| `--bg-app` | `#101114` | `#f4f5f8` | Primary Application Canvas |
| `--bg-sidebar` | `#151619` | `#ffffff` | Navigation Sidebar |
| `--bg-card` | `#1c1c21` | `#ffffff` | Squircle Card Containers |
| `--nova-orange` | `#ff5d2a` | `#ff5d2a` | Signature Nova Coral Brand Accent |
| `--accent-green` | `#22c55e` | `#16a34a` | Positive Growth Badges |
| `--accent-teal` | `#2dd4bf` | `#0d9488` | WhatsApp Channel / Active Indicators |
| `--accent-purple` | `#818cf8` | `#6366f1` | Email Channel / VIP Badges |
| `--accent-yellow` | `#fbbf24` | `#d97706` | Chat Channel / Warning Badges |

---

## ⌨️ Keyboard Shortcuts & Quick Actions

- <kbd>Ctrl</kbd> + <kbd>K</kbd> or <kbd>Cmd</kbd> + <kbd>K</kbd> — Open Global Omni-Search (Search customers, reservations, or movies).
- **Sun / Moon Icon (Top Right)** — Instant toggle between Dark Mode and Light Mode.
- **Sidebar `≡ Hide`** — Collapse or expand sidebar to maximize screen workspace.
- **Quick Actions Menu** — Fast-track modals to add movies, schedule showtimes, or enroll customers.

---

## 📂 Repository Structure

```
Group_Project_Luminar_2/
├── .gitignore          # Git exclusion rules
├── README.md           # Comprehensive project documentation
├── index.html          # Semantic HTML5 architecture & UI views
├── css/
│   └── style.css       # Matte Dark & Porcelain Light CSS design tokens
└── js/
    ├── store.js        # LocalStorage state engine & mock data seed
    └── app.js          # Chart.js, UI router, seat matrix & modal controllers
```

---

## 💻 Local Setup & Development

No Node.js compilation, bundling, or external build steps are required. 

### Option 1: Direct Browser Access
Simply double-click `index.html` or drag it into any web browser.

### Option 2: Local HTTP Server

**Using Python:**
```bash
python -m http.server 8080
```

**Using Node.js:**
```bash
npx serve .
```

Navigate to `http://localhost:8080` in your browser.

---

## 👤 Author & Credits

- **Repository**: [melvindavis2003/Group_Project_Luminar_2](https://github.com/melvindavis2003/Group_Project_Luminar_2)
- **Live Demo**: [https://melvindavis2003.github.io/Group_Project_Luminar_2/](https://melvindavis2003.github.io/Group_Project_Luminar_2/)
- **License**: MIT License
