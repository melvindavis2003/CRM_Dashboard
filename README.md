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
NovaCRM Cinema Enterprise Platform
├── 1. Dashboard (KPI Cards, Dual-Mode Revenue Chart, Ticket Sales, Recent Bookings, Popular Movies)
├── 2. Movie Management (Posters, Titles, Genres, Durations, Release Dates, Add/Edit/Delete Actions)
├── 3. Showtime Management (Movie/Theatre/Screen/Date/Time Selector, Pricing, Collision Engine)
├── 4. Booking Management (Booking ID, Customer Name, Movie, Seats, Amount, Payment, Cancellation)
├── 5. Theatre & Screen Management (Locations, Screen Names, Seating Capacities, Availability Badges)
├── 6. Customer Management (Customer List, Contact Details, Booking History, Account Statuses)
├── 7. Profile & Settings (Marcus Vance Profile, Security Password Rotation, Notification Switches)
└── 8. Live Box Office & Seat Matrix (Interactive Real-time Seat Picker & Printable Ticket Pass)
```

### 1. Dashboard
- **Executive KPI Cards**: Real-time telemetry for Active Screenings & Deals (86), Pipeline Value ($412,800), Deals Won (18), and Conversion Rate (34%).
- **Interactive Revenue Charts**: 
  - **Photo 1 View**: 7-day straight-segment line chart with node markers ($15,039) and Sales Activity semi-circular gauge.
  - **Photo 2 View**: 30-day closed revenue bell-curve area chart, vertical capsule deal source bars, and sales rep performance meters.
- **Recent Bookings Telemetry**: Dynamic live feed of incoming reservations (`#overview-recent-bookings-list`).
- **Popular Movies Telemetry**: Box office occupancy and sales volume leaderboard (`#overview-popular-movies-list`).

### 2. Movie Management
- **Feature Film Rotation**: Visual movie catalog with posters, titles, genres, runtimes, release dates, age ratings (PG-13, R, PG, G, NC-17), and base ticket prices.
- **Search & Filter**: Real-time filtering by keyword and status (`Active Rotation`, `Coming Soon`, `Archived`).
- **View Toggle**: Switch between responsive 3-column Poster Grid and dense Tabular Ledger.
- **CRUD Operations**: Complete modal forms to Add new movies, Edit existing film details, and safely Delete archived titles.

### 3. Showtime Management
- **Screening Scheduler**: Schedule showtimes by selecting Movie, Theatre Location, Auditorium Screen, Screening Date, and Start Time.
- **Collision-Free Conflict Engine**: Automatically enforces duration buffers + 20-minute turnaround cleaning times to prevent auditorium scheduling clashes.
- **Dynamic Pricing Multipliers**: Standard Base (1.0x), Evening Peak (1.1x), IMAX Laser (1.15x), and VIP Weekend (1.2x).
- **Seat Matrix Direct Link**: One-click jump into any showtime's live seat matrix.

### 4. Booking Management
- **Transaction Ledger**: Complete audit log with Booking ID, Customer Name & Loyalty Tier, Movie, Auditorium & Slot, Seat Numbers, Total Amount Paid, and Payment Method.
- **Booking Statuses**: Real-time badge indicators for `Confirmed` vs `Cancelled / Refunded`.
- **Digital Pass Modal**: Instant preview and physical printing of formatted cinema ticket passes with barcodes and security notches.
- **Desk Cancellation & Refund Desk**: One-click cancellation with immediate release of reserved seats back to available inventory.

### 5. Theatre & Screen Management
- **Theatre Locations Overview**: Multi-complex cards for Downtown Complex and Uptown Luxe Promenade.
- **Auditoriums & Seating Capacity**: Detailed breakdown of VIP Recliners, Standard Seats, Accessible Seats, and Total Capacity.
- **Live Availability Badges**: `Available`, `Maintenance`, and `Cleaning` with quick-status dropdown selector.
- **Screen Creator**: Add new screens or reconfigure sound & projection specs (IMAX Laser, Dolby Atmos, Luxe Recliner, Standard 4K).

### 6. Customer Management
- **Patron Directory**: Complete customer profiles with Name, Email, Phone, Loyalty Tier (Platinum, Gold, Silver, Bronze), and Account Status (`Active`, `VIP Member`, `Suspended`).
- **Status Selector**: Quick account status updates directly from table rows.
- **Slide-Over Profile Drawer**: Inspect customer visit counters, lifetime spend, reward points, staff notes, preferred genres, and individual booking history.

### 7. Profile & Settings
- **Administrator Profile**: Dedicated profile for Marcus Vance (Full Name, Email, Phone, Role, Complex, Department, Avatar).
- **Security & Password Rotation**: Protected password change workflow with confirmation validation.
- **Operational Notification Preferences**: Interactive luxury toggle switches for High-Value Booking Alerts, Low Seat Capacity Warnings, Refund Alerts, Daily Digest, and Audio Chimes.
- **Cinema Configuration & Database Backup**: Custom tax rates, booking fees, JSON export backup, and restore utilities.

### 8. Live Box Office & Real-Time Seat Matrix
- **Curved Soundstage Screen**: Realistic curved projection beam canvas.
- **Interactive Seat Map**: Color-coded VIP Recliners ($22), Standard Seats ($16.50), Accessible Seats ($15), Selected Seats, and Occupied Seats.
- **POS Checkout**: Cart summary, customer loyalty assignment, tax calculations, and instant ticket pass generation.
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
