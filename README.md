# NovaCRM — Cinema Operations & Customer CRM Dashboard

A luxury, minimalist cinema operations and customer CRM dashboard inspired by NovaCRM aesthetics. Engineered with pure HTML5, vanilla CSS design tokens, Tailwind CSS utility layers, Lucide Icons, and Chart.js.

![NovaCRM Dashboard Preview](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80)

## Features

### 1. Minimalist NovaCRM Aesthetics
- **Dual Theme Engine**: Seamless toggle between **Matte Obsidian Dark Mode** and **Porcelain Light Mode** with persistent `localStorage` memory and theme-aware charts.
- **Squircle Container Geometry**: 20px radius cards with subtle hairline borders and ambient hover depth.
- **Micro-interactions**: Pill badge chips, smooth collapsible sidebar, and interactive state indicators.

### 2. Executive Analytics & Telemetry (Photos 1 & 2 Dual View)
- **Top 4 KPI Metrics**: Active Deals (86, +37%), Pipeline Value ($412,800), Deals Won (18), and Conversion Rate (34% with red sparkline curve).
- **Segmented Toggle**:
  - **Photo 1 View**: Total Sales 7-day line graph with node highlights and Sales Activity 180° semi-donut gauge (Yellow, Teal, Purple) with channel filters (`WhatsApp`, `Chat`, `Email`).
  - **Photo 2 View**: Closed revenue 30-day bell wave curve with 68% peak indicator, Top Deal Sources vertical capsule bars, and Sales Rep performance trackers.

### 3. Contact & Candidate CRM Table
- **357 Contact Directory**: Live search filtering by name, email, or company.
- **Role & Date Filters**: Segment by VIP patrons, Corporate clients, or Loyalty members.
- **Instant CSV Export**: One-click download of filtered directory data into CSV format.
- **Slide-out Customer Drawer**: Detailed guest profiles, loyalty tiers, lifetime spend, and visit logs.

### 4. Comprehensive Cinema Management
- **Movie Catalog & Showtime Scheduler**: Conflict-free auditorium scheduling engine.
- **Live Box Office & Seat Matrix**: Real-time seat allocation (VIP, Standard, Accessible) with instant printable digital ticket generation.
- **Audited Ledger & Refund Desk**: Transaction history with automated seat release.
- **Configuration & Backup**: Cinema parameters, tax configurations, and full JSON database export/import.

## Quick Start

Open `index.html` directly in any modern web browser or serve via a local HTTP server:

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

Navigate to `http://localhost:8080` in your browser.
