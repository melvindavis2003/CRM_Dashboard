/**
 * CinePulse Admin - UI Application Controller
 * Handles views, seat matrix, checkout, customer CRM drawer, modals, Chart.js analytics & search.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const AppState = {
    currentView: "overview",
    selectedShowtimeId: null,
    selectedSeats: [], // Array of seat IDs e.g. ["B4", "B5"]
    activeCustomerDrawerId: null,
    globalSearchQuery: "",
    charts: {
      totalSales: null,
      closedRevenue: null
    },
    notifications: []
  };

  const Store = window.CinePulse.Store;

  // --- INITIALIZATION ---
  function initApp() {
    setupNavigation();
    setupTopBar();
    setupQuickActions();
    setupModals();
    setupGlobalSearch();

    // Default select first available showtime
    const showtimes = Store.getShowtimes();
    if (showtimes.length > 0) {
      AppState.selectedShowtimeId = showtimes[0].id;
    }

    // Render initial view
    switchView("overview");
    lucide.createIcons();
  }

  // --- VIEW ROUTER ---
  function switchView(viewName) {
    // Aliases normalization
    let targetView = viewName;
    if (viewName === "reservations") targetView = "bookings";
    if (viewName === "crm") targetView = "customers";

    AppState.currentView = targetView;

    // Update navigation active states
    document.querySelectorAll(".nav-link").forEach(link => {
      const linkView = link.dataset.view;
      const isMatch = linkView === targetView || 
        (linkView === "bookings" && targetView === "reservations") ||
        (linkView === "customers" && targetView === "crm");
      if (isMatch) {
        link.classList.add("bg-[#24242a]", "text-white");
        link.classList.remove("text-[#85858f]", "hover:bg-[#1c1c21]");
      } else {
        link.classList.remove("bg-[#24242a]", "text-white");
        link.classList.add("text-[#85858f]", "hover:text-white", "hover:bg-[#1c1c21]");
      }
    });

    // Toggle view containers
    document.querySelectorAll(".view-container").forEach(el => {
      el.classList.add("hidden");
    });

    const activeContainer = document.getElementById(`view-${targetView}`);
    if (activeContainer) {
      activeContainer.classList.remove("hidden");
    }

    // Update Header Breadcrumbs & Titles
    const titleMap = {
      overview: { title: "Dashboard", subtitle: "Statistics, revenue chart, ticket sales, recent bookings & popular movies" },
      movies: { title: "Movie Management", subtitle: "Movie posters, titles, genres, duration, release dates & actions" },
      showtimes: { title: "Showtime Management", subtitle: "Select movies, theatres, screens, dates, times, and ticket prices" },
      bookings: { title: "Booking Management", subtitle: "Booking ID, customer name, movie, seats, amount, payment status & cancellation" },
      reservations: { title: "Booking Management", subtitle: "Booking ID, customer name, movie, seats, amount, payment status & cancellation" },
      theatres: { title: "Theatre & Screen Management", subtitle: "Theatre locations, screen names, seating capacity & screen availability" },
      customers: { title: "Customer Management", subtitle: "Customer list, contact details, booking history & account status" },
      crm: { title: "Customer Management", subtitle: "Customer list, contact details, booking history & account status" },
      settings: { title: "Profile & Settings", subtitle: "Admin profile, account details, password change & notification preferences" },
      boxoffice: { title: "Live Box Office & Seat Matrix", subtitle: "Real-time interactive auditorium seat map & digital pass issuance" }
    };

    const titleEl = document.getElementById("topbar-view-title");
    const subtitleEl = document.getElementById("topbar-view-subtitle");
    if (titleEl && titleMap[targetView]) {
      titleEl.innerHTML = `${titleMap[targetView].title} <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>`;
    }
    if (subtitleEl && titleMap[targetView]) {
      subtitleEl.textContent = titleMap[targetView].subtitle;
    }

    updateHeaderPills();

    // Render corresponding view data
    switch (targetView) {
      case "overview":
        renderOverview();
        break;
      case "movies":
        renderMoviesCatalog();
        break;
      case "showtimes":
        renderShowtimesSchedule();
        break;
      case "bookings":
      case "reservations":
        renderReservationsLedger();
        break;
      case "theatres":
        renderTheatresAndScreens();
        break;
      case "customers":
      case "crm":
        renderCustomerCRM();
        break;
      case "settings":
        renderSettingsView();
        break;
      case "boxoffice":
        renderBoxOffice();
        break;
    }

    // Refresh icons
    setTimeout(() => lucide.createIcons(), 50);
  }

  // Expose global actions
  window.switchView = switchView;
  window.openAddMovieModal = () => openAddMovieModal();
  window.openEditMovieModal = (id) => openEditMovieModal(id);
  window.openAddShowtimeModal = (id) => openAddShowtimeModal(id);
  window.openAddScreenModal = () => openAddScreenModal();
  window.openEditScreenModal = (id) => openEditScreenModal(id);
  window.openCustomerProfileDrawer = (id) => openCustomerProfileDrawer(id);
  window.showTicketStubModal = (id) => showTicketStubModal(id);
  window.openRefundModal = (id) => openRefundModal(id);

  function updateHeaderPills() {
    const summary = Store.getAnalyticsSummary();
    const settings = Store.getSettings();
    const revPill = document.getElementById("header-revenue-pill");
    if (revPill) {
      revPill.textContent = `${settings.currency}${summary.todayRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  // --- NAVIGATION SETUP ---
  function setupNavigation() {
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        if (view) switchView(view);
      });
    });

    // Sidebar Toggle
    const sidebar = document.getElementById("main-sidebar");
    const toggleBtn = document.getElementById("sidebar-toggle-btn");
    const logoText = document.querySelectorAll(".sidebar-text");
    
    let isCollapsed = false;
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
          sidebar.classList.remove("w-60");
          sidebar.classList.add("w-20");
          logoText.forEach(t => t.classList.add("hidden"));
        } else {
          sidebar.classList.remove("w-20");
          sidebar.classList.add("w-60");
          logoText.forEach(t => t.classList.remove("hidden"));
        }
      });
    }
  }

  // --- TOP BAR SETUP ---
  function setupTopBar() {
    // Theme Toggle (Light / Dark Mode)
    setupThemeToggle();

    // Quick New Walk-in Booking Button
    const walkInBtn = document.getElementById("btn-quick-walkin");
    if (walkInBtn) {
      walkInBtn.addEventListener("click", () => {
        switchView("boxoffice");
      });
    }

    // Notification Dropdown Toggle
    const notifBtn = document.getElementById("btn-notifications");
    const notifDropdown = document.getElementById("notifications-dropdown");
    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle("hidden");
        renderNotificationsDropdown();
      });
      document.addEventListener("click", () => {
        if (!notifDropdown.classList.contains("hidden")) {
          notifDropdown.classList.add("hidden");
        }
      });
    }
  }

  function setupThemeToggle() {
    const themeBtn = document.getElementById("theme-toggle-btn");
    const html = document.documentElement;

    // Check saved preference or default to dark
    const savedTheme = localStorage.getItem("novacrm_theme") || "dark";
    applyTheme(savedTheme, false);

    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const isDark = html.classList.contains("dark");
        const nextTheme = isDark ? "light" : "dark";
        applyTheme(nextTheme, true);
      });
    }
  }

  function applyTheme(theme, showToastNotification = true) {
    const html = document.documentElement;
    const themeBtn = document.getElementById("theme-toggle-btn");

    if (theme === "light") {
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem("novacrm_theme", "light");
      if (themeBtn) {
        themeBtn.innerHTML = `<i data-lucide="moon" class="w-4 h-4 text-[#121316]"></i>`;
        themeBtn.setAttribute("title", "Switch to Dark Mode");
      }
      if (showToastNotification) {
        showToast("Switched to Minimalist Light Mode", "info");
      }
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
      localStorage.setItem("novacrm_theme", "dark");
      if (themeBtn) {
        themeBtn.innerHTML = `<i data-lucide="sun" class="w-4 h-4 text-white"></i>`;
        themeBtn.setAttribute("title", "Switch to Light Mode");
      }
      if (showToastNotification) {
        showToast("Switched to Matte Obsidian Dark Mode", "info");
      }
    }

    lucide.createIcons();

    // Re-render overview charts for new theme
    if (AppState.currentView === "overview" && AppState.charts.totalSales) {
      renderOverviewCharts();
    }
  }

  function renderNotificationsDropdown() {
    const container = document.getElementById("notifications-list");
    if (!container) return;
    const logs = Store.getActivityLogs().slice(0, 5);
    container.innerHTML = logs.map(log => `
      <div class="p-3 border-b border-slate-800/80 hover:bg-slate-800/40 transition">
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="font-semibold text-amber-400">${escapeHtml(log.title)}</span>
          <span class="text-slate-500">${escapeHtml(log.timestamp)}</span>
        </div>
        <p class="text-xs text-slate-300 leading-snug">${escapeHtml(log.description)}</p>
      </div>
    `).join("") || `<div class="p-4 text-xs text-slate-500 text-center">No notifications</div>`;
  }

  // --- QUICK ACTIONS ---
  function setupQuickActions() {
    const addMovieBtn = document.getElementById("quick-add-movie-btn");
    if (addMovieBtn) {
      addMovieBtn.addEventListener("click", () => openAddMovieModal());
    }

    const addShowtimeBtn = document.getElementById("quick-add-showtime-btn");
    if (addShowtimeBtn) {
      addShowtimeBtn.addEventListener("click", () => openAddShowtimeModal());
    }

    const addCustomerBtn = document.getElementById("quick-add-customer-btn");
    if (addCustomerBtn) {
      addCustomerBtn.addEventListener("click", () => openAddCustomerModal());
    }
  }

  // --- GLOBAL SEARCH (OMNIBAR) ---
  function setupGlobalSearch() {
    const searchInput = document.getElementById("global-search-input");
    const resultsContainer = document.getElementById("global-search-results");

    if (!searchInput || !resultsContainer) return;

    // Keyboard shortcut Ctrl+K or Cmd+K
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInput.focus();
      }
    });

    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        resultsContainer.classList.add("hidden");
        return;
      }

      const customers = Store.getCustomers().filter(c => 
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
      ).slice(0, 4);

      const reservations = Store.getReservations().filter(r => 
        r.id.toLowerCase().includes(q) || r.seats.some(s => s.toLowerCase().includes(q))
      ).slice(0, 4);

      const movies = Store.getMovies().filter(m => 
        m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q)
      ).slice(0, 3);

      if (customers.length === 0 && reservations.length === 0 && movies.length === 0) {
        resultsContainer.innerHTML = `
          <div class="p-4 text-xs text-slate-500 text-center">No matching records found for "${escapeHtml(q)}"</div>
        `;
        resultsContainer.classList.remove("hidden");
        return;
      }

      let html = `<div class="max-h-96 overflow-y-auto divide-y divide-slate-800 text-xs">`;

      if (customers.length > 0) {
        html += `<div class="p-2 bg-slate-900/60 text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Customers (${customers.length})</div>`;
        customers.forEach(c => {
          html += `
            <div class="p-2.5 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition search-item-cust" data-id="${c.id}">
              <div>
                <p class="font-semibold text-slate-100">${escapeHtml(c.name)} <span class="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400">${c.tier}</span></p>
                <p class="text-[11px] text-slate-400">${escapeHtml(c.email)} • ${escapeHtml(c.phone)}</p>
              </div>
              <span class="text-slate-500 text-[10px]">LTV: $${c.totalSpent.toFixed(2)}</span>
            </div>
          `;
        });
      }

      if (reservations.length > 0) {
        html += `<div class="p-2 bg-slate-900/60 text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Bookings & Tickets (${reservations.length})</div>`;
        reservations.forEach(r => {
          const cust = Store.getCustomerById(r.customerId);
          html += `
            <div class="p-2.5 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition search-item-res" data-id="${r.id}">
              <div>
                <p class="font-semibold text-amber-400">${r.id} <span class="ml-1 text-[10px] text-slate-300">Seats: ${r.seats.join(", ")}</span></p>
                <p class="text-[11px] text-slate-400">${cust ? escapeHtml(cust.name) : 'Guest'} • $${r.totalAmount.toFixed(2)}</p>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded ${r.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}">${r.status}</span>
            </div>
          `;
        });
      }

      if (movies.length > 0) {
        html += `<div class="p-2 bg-slate-900/60 text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Movies in Rotation (${movies.length})</div>`;
        movies.forEach(m => {
          html += `
            <div class="p-2.5 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition search-item-mov" data-id="${m.id}">
              <div class="flex items-center gap-2">
                <img src="${m.poster}" class="w-7 h-9 rounded object-cover" />
                <div>
                  <p class="font-semibold text-slate-100">${escapeHtml(m.title)}</p>
                  <p class="text-[11px] text-slate-400">${escapeHtml(m.genre)} • ${m.duration}m</p>
                </div>
              </div>
              <span class="text-[10px] text-amber-400">$${m.basePrice.toFixed(2)}</span>
            </div>
          `;
        });
      }

      html += `</div>`;
      resultsContainer.innerHTML = html;
      resultsContainer.classList.remove("hidden");

      // Bind search click handlers
      resultsContainer.querySelectorAll(".search-item-cust").forEach(el => {
        el.addEventListener("click", () => {
          const id = el.dataset.id;
          resultsContainer.classList.add("hidden");
          searchInput.value = "";
          openCustomerProfileDrawer(id);
        });
      });

      resultsContainer.querySelectorAll(".search-item-res").forEach(el => {
        el.addEventListener("click", () => {
          const id = el.dataset.id;
          resultsContainer.classList.add("hidden");
          searchInput.value = "";
          showTicketStubModal(id);
        });
      });

      resultsContainer.querySelectorAll(".search-item-mov").forEach(el => {
        el.addEventListener("click", () => {
          resultsContainer.classList.add("hidden");
          searchInput.value = "";
          switchView("movies");
        });
      });
    });

    // Close results on outer click
    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
        resultsContainer.classList.add("hidden");
      }
    });
  }

  // ==========================================================================
  // ==========================================================================
  // MODULE B: NOVACRM EXECUTIVE ANALYTICS & CRM (PHOTOS 1 & 2)
  // ==========================================================================
  function renderOverview() {
    // 1. KPI Cards (Matching Photo 1 & Photo 2 values)
    const kpiTickets = document.getElementById("kpi-today-tickets");
    const kpiRevenue = document.getElementById("kpi-today-revenue");
    const kpiDealsWon = document.getElementById("kpi-deals-won");
    const kpiOccupancy = document.getElementById("kpi-today-occupancy");

    if (kpiTickets) kpiTickets.textContent = "86";
    if (kpiRevenue) kpiRevenue.textContent = "$412,800";
    if (kpiDealsWon) kpiDealsWon.textContent = "18";
    if (kpiOccupancy) kpiOccupancy.textContent = "34%";

    // 2. Charts Initialization (Photo 1 & Photo 2)
    renderOverviewCharts();

    // 3. Telemetry Widgets: Recent Bookings & Popular Movies
    renderOverviewRecentBookings();
    renderOverviewPopularMovies();

    // 4. Render 357 Contact / CRM table
    renderOverviewContactsTable();

    // 5. Bind view toggle and table filters
    setupOverviewInteractions();
  }

  function renderOverviewRecentBookings() {
    const container = document.getElementById("overview-recent-bookings-list");
    if (!container) return;
    const recents = Store.getRecentBookings(4);
    if (recents.length === 0) {
      container.innerHTML = `<div class="p-6 text-center text-xs text-[#85858f]">No bookings recorded yet.</div>`;
      return;
    }
    container.innerHTML = recents.map(r => `
      <div class="p-3 rounded-xl bg-[#222227] hover:bg-[#282830] border border-[rgba(255,255,255,0.04)] flex items-center justify-between transition text-xs">
        <div class="flex items-center gap-3">
          <img src="${r.customerAvatar}" class="w-8 h-8 rounded-full object-cover border border-[rgba(255,255,255,0.1)]" alt="${escapeHtml(r.customerName)}" />
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-semibold text-white">${escapeHtml(r.customerName)}</span>
              <span class="font-mono text-[10px] text-novaOrange">#${escapeHtml(r.id)}</span>
            </div>
            <p class="text-[11px] text-[#85858f] mt-0.5 truncate max-w-[200px]">${escapeHtml(r.movieTitle)} • Seats: <span class="font-mono text-white">${r.seats.join(", ")}</span></p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <span class="font-mono font-bold text-white text-xs">$${r.totalAmount.toFixed(2)}</span>
            <span class="block text-[10px] ${r.paymentStatus === 'Refunded' ? 'text-rose-400' : 'text-[#4ade80]'} font-medium">${r.paymentStatus}</span>
          </div>
          <button onclick="showTicketStubModal('${r.id}')" class="p-1.5 rounded-lg bg-[#1c1c21] hover:bg-[#2e2e38] text-[#85858f] hover:text-white transition" title="View Digital Ticket Stub">
            <i data-lucide="ticket" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `).join("");
    lucide.createIcons();
  }

  function renderOverviewPopularMovies() {
    const container = document.getElementById("overview-popular-movies-list");
    if (!container) return;
    const popular = Store.getPopularMovies(4);
    container.innerHTML = popular.map(m => `
      <div class="p-3 rounded-xl bg-[#222227] hover:bg-[#282830] border border-[rgba(255,255,255,0.04)] flex items-center justify-between transition text-xs">
        <div class="flex items-center gap-3">
          <img src="${m.poster}" class="w-9 h-12 rounded-lg object-cover shadow-sm bg-[#18191d]" alt="${escapeHtml(m.title)}" />
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-white">${escapeHtml(m.title)}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-[#ff5d2a]/15 text-novaOrange font-semibold">${m.genre.split('/')[0].trim()}</span>
            </div>
            <div class="flex items-center gap-2 text-[11px] text-[#85858f] mt-1">
              <span>${m.ticketsSold.toLocaleString()} tickets sold</span>
              <span>•</span>
              <span class="font-mono text-white font-medium">$${m.revenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div class="w-24 text-right">
          <div class="flex justify-between text-[10px] mb-1 font-mono">
            <span class="text-[#85858f]">Occupancy</span>
            <span class="text-white font-bold">${m.occupancy}%</span>
          </div>
          <div class="w-full h-2 bg-[#17181c] rounded-full overflow-hidden p-0.5">
            <div class="h-full bg-novaOrange rounded-full" style="width: ${m.occupancy}%"></div>
          </div>
        </div>
      </div>
    `).join("");
    lucide.createIcons();
  }

  function renderOverviewCharts() {
    const isLight = !document.documentElement.classList.contains("dark");
    const tickColor = isLight ? "#6b6e7d" : "#6b6c77";
    const gridColor = isLight ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.03)";
    const tooltipBg = isLight ? "#ffffff" : "#18191d";
    const tooltipTitle = isLight ? "#5d6070" : "#85858f";
    const tooltipBody = isLight ? "#121316" : "#ffffff";
    const tooltipBorder = isLight ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.08)";

    // 1. Photo 1: Total Sales Line Chart
    const ctxTotalSales = document.getElementById("chart-total-sales");
    if (ctxTotalSales) {
      if (AppState.charts.totalSales) {
        AppState.charts.totalSales.destroy();
      }

      AppState.charts.totalSales = new Chart(ctxTotalSales, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [{
            label: "Sales ($)",
            data: [190, 310, 260, 110, 220, 225, 195],
            borderColor: "#ff5d2a",
            borderWidth: 2,
            backgroundColor: "transparent",
            pointBackgroundColor: "#ff5d2a",
            pointBorderColor: isLight ? "#ffffff" : "#ffffff",
            pointBorderWidth: 1.5,
            pointRadius: 4.5,
            pointHoverRadius: 7,
            tension: 0, // Straight segments exactly like Photo 1
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: tooltipBg,
              titleColor: tooltipTitle,
              bodyColor: tooltipBody,
              borderColor: tooltipBorder,
              borderWidth: 1,
              padding: 10,
              displayColors: false,
              callbacks: {
                title: (items) => items[0].label + " Ticket Sales",
                label: (ctx) => `$${(ctx.parsed.y * 70).toLocaleString('en-US')}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                color: tickColor,
                font: { size: 10, family: 'inherit' }
              },
              border: { display: false }
            },
            y: {
              min: 0,
              max: 400,
              ticks: {
                stepSize: 100,
                color: tickColor,
                font: { size: 10, family: 'inherit' },
                callback: (v) => v === 0 ? "0" : v
              },
              grid: {
                color: gridColor,
                drawBorder: false
              },
              border: { display: false }
            }
          }
        }
      });
    }

    // 2. Photo 2: Closed Revenue Bell Wave Chart
    const ctxClosed = document.getElementById("chart-closed-revenue");
    if (ctxClosed) {
      if (AppState.charts.closedRevenue) {
        AppState.charts.closedRevenue.destroy();
      }

      const gradient = ctxClosed.getContext("2d").createLinearGradient(0, 0, 0, 190);
      gradient.addColorStop(0, "rgba(255, 93, 42, 0.55)");
      gradient.addColorStop(0.65, "rgba(255, 93, 42, 0.15)");
      gradient.addColorStop(1, "rgba(255, 93, 42, 0.00)");

      AppState.charts.closedRevenue = new Chart(ctxClosed, {
        type: "line",
        data: {
          labels: ["", "", "Peak", "", "", "", ""],
          datasets: [{
            label: "Closed Revenue",
            data: [25, 48, 68, 52, 38, 48, 72],
            borderColor: "#ff5d2a",
            borderWidth: 2.5,
            fill: true,
            backgroundColor: gradient,
            tension: 0.45, // Smooth wave exactly like Photo 2
            pointRadius: (ctx) => ctx.dataIndex === 2 ? 5 : 0,
            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#ff5d2a",
            pointBorderWidth: 3,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#18191d",
              titleColor: "#85858f",
              bodyColor: "#ffffff",
              borderColor: "rgba(255, 255, 255, 0.08)",
              borderWidth: 1,
              callbacks: {
                label: (ctx) => `Closed: ${ctx.parsed.y}%`
              }
            }
          },
          scales: {
            x: { display: false },
            y: { display: false, min: 0, max: 80 }
          }
        }
      });
    }
  }

  // Demo Contact Records (Faithfully matching Photo 1)
  const demoPhotoContacts = [
    {
      id: "cust-photo-1",
      date: "24/06/2024",
      name: "Theresa Webb",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80",
      email: "theresa.henry@gawe.com",
      company: "Louis Vuitton",
      role: "vip",
      platform: "Email",
      platformColor: "pill-purple"
    },
    {
      id: "cust-photo-2",
      date: "24/06/2024",
      name: "Jacob Jones",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80",
      email: "jacob.henry@gawe.com",
      company: "Pizza Hut",
      role: "corporate",
      platform: "Email",
      platformColor: "pill-purple"
    },
    {
      id: "cust-1",
      date: "23/06/2024",
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80",
      email: "elena.rostova@nexus.com",
      company: "Sony Pictures",
      role: "vip",
      platform: "WhatsApp",
      platformColor: "pill-teal"
    },
    {
      id: "cust-2",
      date: "22/06/2024",
      name: "Marcus Sterling",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80",
      email: "m.sterling@fintech.io",
      company: "Warner Bros",
      role: "corporate",
      platform: "Chat",
      platformColor: "pill-yellow"
    },
    {
      id: "cust-3",
      date: "21/06/2024",
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&auto=format&fit=crop&q=80",
      email: "sarah.j@creativemedia.org",
      company: "Paramount Pictures",
      role: "vip",
      platform: "Email",
      platformColor: "pill-purple"
    },
    {
      id: "cust-5",
      date: "20/06/2024",
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&auto=format&fit=crop&q=80",
      email: "priya.sharma@horizon.dev",
      company: "Universal Studio",
      role: "member",
      platform: "WhatsApp",
      platformColor: "pill-teal"
    },
    {
      id: "cust-8",
      date: "19/06/2024",
      name: "Julian Vance",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&fit=crop&q=80",
      email: "julian.vance@soundlab.net",
      company: "Dolby Laboratories",
      role: "vip",
      platform: "Chat",
      platformColor: "pill-yellow"
    }
  ];

  function renderOverviewContactsTable() {
    const tbody = document.getElementById("overview-contacts-tbody");
    if (!tbody) return;

    const query = (document.getElementById("table-search-input")?.value || "").toLowerCase().trim();
    const roleFilter = document.getElementById("table-role-filter")?.value || "all";

    // Combine photo contacts with any newly added customers in Store
    const allCustomers = Store.getCustomers();
    const combined = [...demoPhotoContacts];
    allCustomers.forEach(c => {
      if (!combined.some(item => item.id === c.id || item.email === c.email)) {
        combined.push({
          id: c.id,
          date: c.joinDate ? c.joinDate.split("-").reverse().join("/") : "18/06/2024",
          name: c.name,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80",
          email: c.email,
          company: c.preferredGenres && c.preferredGenres[0] ? `${c.preferredGenres[0]} Cinema Club` : "A24 Films",
          role: c.tier.toLowerCase() === "platinum" || c.tier.toLowerCase() === "gold" ? "vip" : "member",
          platform: "Email",
          platformColor: "pill-purple"
        });
      }
    });

    const filtered = combined.filter(c => {
      const matchesQuery = !query || 
        c.name.toLowerCase().includes(query) || 
        c.email.toLowerCase().includes(query) || 
        c.company.toLowerCase().includes(query);
      
      const matchesRole = roleFilter === "all" || c.role === roleFilter;
      return matchesQuery && matchesRole;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="py-8 text-center text-[#6b6c77] text-xs">
            No contacts found matching search criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(c => `
      <tr class="hover:bg-[#202026] transition group">
        <td class="py-3 px-4 font-mono text-[11px] text-[#85858f] whitespace-nowrap">${escapeHtml(c.date)}</td>
        <td class="py-3 px-4 whitespace-nowrap">
          <div class="flex items-center gap-2.5">
            <img src="${c.avatar}" class="w-6 h-6 rounded-full object-cover border border-[rgba(255,255,255,0.08)]" alt="${escapeHtml(c.name)}" />
            <span class="font-medium text-white text-xs">${escapeHtml(c.name)}</span>
          </div>
        </td>
        <td class="py-3 px-4 font-mono text-[11px] text-[#85858f] whitespace-nowrap">${escapeHtml(c.email)}</td>
        <td class="py-3 px-4 text-xs text-[#a0a0ab] whitespace-nowrap">${escapeHtml(c.company)}</td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="pill-badge ${c.platformColor}">${escapeHtml(c.platform)}</span>
        </td>
        <td class="py-3 px-4 text-right whitespace-nowrap">
          <button class="btn-see-contact-detail text-white hover:text-novaOrange text-xs font-medium transition inline-flex items-center gap-1" data-id="${c.id}" data-name="${escapeHtml(c.name)}">
            <span>See Detail</span>
            <span>&rarr;</span>
          </button>
        </td>
      </tr>
    `).join("");

    // Bind See Detail buttons to open customer drawer
    tbody.querySelectorAll(".btn-see-contact-detail").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const cust = Store.getCustomerById(id) || Store.getCustomers()[0];
        if (cust) {
          openCustomerProfileDrawer(cust.id);
        } else {
          showToast(`Viewing profile for ${btn.dataset.name}`);
        }
      });
    });
  }

  let overviewInteractionsSetup = false;
  function setupOverviewInteractions() {
    if (overviewInteractionsSetup) return;
    overviewInteractionsSetup = true;

    // Toggle Photo 1 vs Photo 2
    const btnP1 = document.getElementById("btn-toggle-view-photo1");
    const btnP2 = document.getElementById("btn-toggle-view-photo2");
    const viewP1 = document.getElementById("middle-view-photo1");
    const viewP2 = document.getElementById("middle-view-photo2");

    if (btnP1 && btnP2 && viewP1 && viewP2) {
      btnP1.addEventListener("click", () => {
        viewP1.classList.remove("hidden");
        viewP2.classList.add("hidden");
        btnP1.className = "px-4 py-1.5 rounded-full text-xs font-semibold bg-[#26262d] text-white transition shadow-sm";
        btnP2.className = "px-4 py-1.5 rounded-full text-xs font-semibold text-[#85858f] hover:text-white transition";
        if (AppState.charts.totalSales) AppState.charts.totalSales.resize();
      });

      btnP2.addEventListener("click", () => {
        viewP2.classList.remove("hidden");
        viewP1.classList.add("hidden");
        btnP2.className = "px-4 py-1.5 rounded-full text-xs font-semibold bg-[#26262d] text-white transition shadow-sm";
        btnP1.className = "px-4 py-1.5 rounded-full text-xs font-semibold text-[#85858f] hover:text-white transition";
        if (AppState.charts.closedRevenue) {
          AppState.charts.closedRevenue.resize();
        } else {
          renderOverviewCharts();
        }
      });
    }

    // Quick Actions accordion in sidebar
    const quickToggle = document.getElementById("quick-actions-toggle");
    const quickMenu = document.getElementById("quick-actions-menu");
    if (quickToggle && quickMenu) {
      quickToggle.addEventListener("click", () => {
        quickMenu.classList.toggle("hidden");
        const chevron = quickToggle.querySelector("i");
        if (chevron) {
          chevron.classList.toggle("rotate-180");
        }
      });
    }

    const quickWalkin = document.getElementById("quick-walkin-booking-btn");
    if (quickWalkin) {
      quickWalkin.addEventListener("click", () => switchView("boxoffice"));
    }

    // Channel pills in Sales Activity gauge
    document.querySelectorAll("[data-channel]").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll("[data-channel]").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        showToast(`Filtered channel: ${pill.textContent.trim()}`);
      });
    });

    // Table search and filters
    const searchInput = document.getElementById("table-search-input");
    const roleFilter = document.getElementById("table-role-filter");
    const dateFilter = document.getElementById("table-date-filter");
    const exportBtn = document.getElementById("btn-export-table-data");

    if (searchInput) {
      searchInput.addEventListener("input", () => renderOverviewContactsTable());
    }
    if (roleFilter) {
      roleFilter.addEventListener("change", () => renderOverviewContactsTable());
    }
    if (dateFilter) {
      dateFilter.addEventListener("change", () => {
        showToast(`Filtered for ${dateFilter.options[dateFilter.selectedIndex].text}`);
        renderOverviewContactsTable();
      });
    }
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        exportContactsCSV();
      });
    }
  }

  function exportContactsCSV() {
    const combined = [...demoPhotoContacts];
    let csv = "Date,Name,Email,Company,Platform\n";
    combined.forEach(c => {
      csv += `"${c.date}","${c.name}","${c.email}","${c.company}","${c.platform}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NovaCRM_Contacts_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Contacts exported to CSV successfully", "success");
  }

  function renderTodayUpcomingScreenings() {
    const container = document.getElementById("today-screenings-list");
    if (!container) return;

    const today = new Date().toISOString().split("T")[0];
    const showtimes = Store.getShowtimes()
      .filter(st => st.date === today && st.status !== "Cancelled")
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (showtimes.length === 0) {
      container.innerHTML = `
        <div class="p-6 text-center text-slate-500 text-xs">No screenings scheduled for today.</div>
      `;
      return;
    }

    container.innerHTML = showtimes.map(st => {
      const movie = Store.getMovieById(st.movieId);
      const screen = Store.getScreenById(st.screenId);
      const bookedCount = st.bookedSeats.length;
      const totalSeats = screen ? screen.totalSeats : 80;
      const pct = Math.round((bookedCount / totalSeats) * 100);

      return `
        <div class="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition">
          <div class="flex items-center gap-3">
            <img src="${movie ? movie.poster : ''}" class="w-10 h-14 rounded-lg object-cover shadow-sm flex-shrink-0" />
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-semibold text-slate-100 text-sm">${movie ? escapeHtml(movie.title) : 'Movie'}</h4>
                <span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">${movie ? movie.rating : 'PG-13'}</span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">${screen ? screen.name : 'Screen'} • <span class="text-amber-400 font-medium">${st.startTime} - ${st.endTime}</span></p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <span class="text-xs font-semibold text-slate-200">${bookedCount} / ${totalSeats}</span>
              <div class="w-20 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" style="width: ${pct}%"></div>
              </div>
              <span class="text-[10px] text-slate-400">${pct}% occupied</span>
            </div>
            <button class="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-medium transition flex items-center gap-1 btn-jump-seatmap" data-id="${st.id}">
              <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i>
              <span>Seats</span>
            </button>
          </div>
        </div>
      `;
    }).join("");

    container.querySelectorAll(".btn-jump-seatmap").forEach(btn => {
      btn.addEventListener("click", () => {
        AppState.selectedShowtimeId = btn.dataset.id;
        switchView("boxoffice");
      });
    });
  }

  function renderLiveActivityFeed() {
    const container = document.getElementById("live-activity-feed");
    if (!container) return;

    const logs = Store.getActivityLogs().slice(0, 8);
    const getIconInfo = (type) => {
      switch (type) {
        case "booking": return { icon: "ticket", bg: "bg-emerald-500/20", color: "text-emerald-400" };
        case "refund": return { icon: "rotate-ccw", bg: "bg-rose-500/20", color: "text-rose-400" };
        case "customer": return { icon: "user-check", bg: "bg-amber-500/20", color: "text-amber-400" };
        case "showtime": return { icon: "calendar-plus", bg: "bg-cyan-500/20", color: "text-cyan-400" };
        default: return { icon: "info", bg: "bg-slate-800", color: "text-slate-300" };
      }
    };

    container.innerHTML = logs.map(log => {
      const icon = getIconInfo(log.type);
      return `
        <div class="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-900/40 transition">
          <div class="w-8 h-8 rounded-lg ${icon.bg} ${icon.color} flex items-center justify-center flex-shrink-0 mt-0.5">
            <i data-lucide="${icon.icon}" class="w-4 h-4"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-slate-200">${escapeHtml(log.title)}</span>
              <span class="text-slate-500 text-[11px]">${escapeHtml(log.timestamp)}</span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5 leading-relaxed truncate">${escapeHtml(log.description)}</p>
          </div>
        </div>
      `;
    }).join("");
  }

  // ==========================================================================
  // ==========================================================================
  // MODULE C: MOVIE MANAGEMENT (PAGE 2)
  // ==========================================================================
  let movieViewMode = "grid"; // 'grid' or 'table'
  let movieSearchFilter = "";
  let movieStatusFilter = "all";

  function renderMoviesCatalog() {
    const container = document.getElementById("movies-catalog-container");
    if (!container) return;

    let movies = Store.getMovies();
    if (movieSearchFilter) {
      const q = movieSearchFilter.toLowerCase();
      movies = movies.filter(m => 
        m.title.toLowerCase().includes(q) || 
        m.genre.toLowerCase().includes(q) ||
        (m.director && m.director.toLowerCase().includes(q))
      );
    }

    if (movieStatusFilter && movieStatusFilter !== "all") {
      movies = movies.filter(m => m.status === movieStatusFilter);
    }

    if (movies.length === 0) {
      container.innerHTML = `
        <div class="p-12 text-center text-[#85858f] text-xs nova-card">
          <i data-lucide="film" class="w-8 h-8 text-[#6b6c77] mx-auto mb-2 opacity-50"></i>
          <p>No films match your search or status filter.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    if (movieViewMode === "grid") {
      container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${movies.map(m => `
            <div class="nova-card rounded-2xl overflow-hidden flex flex-col group hover:border-[rgba(255,93,42,0.4)] transition">
              <div class="relative h-64 overflow-hidden bg-[#18191d]">
                <img src="${m.poster}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="${escapeHtml(m.title)}" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#101114] via-transparent to-transparent"></div>
                
                <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${m.status === 'Active' ? 'bg-[#22c55e]/90 text-black' : m.status === 'Coming Soon' ? 'bg-amber-400 text-black' : 'bg-[#222227] text-[#85858f] border border-[rgba(255,255,255,0.06)]'}">
                    ${m.status}
                  </span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#101114]/80 text-novaOrange backdrop-blur-sm border border-[rgba(255,255,255,0.08)]">
                    ${m.rating}
                  </span>
                </div>

                <div class="absolute bottom-2.5 left-3 right-3">
                  <h3 class="font-bold text-white text-base leading-tight drop-shadow-md truncate">${escapeHtml(m.title)}</h3>
                  <p class="text-xs text-[#a0a0ab] mt-0.5">${escapeHtml(m.genre)}</p>
                </div>
              </div>

              <div class="p-4 flex-1 flex flex-col justify-between bg-[#1c1c21] space-y-3">
                <div class="grid grid-cols-3 gap-2 text-xs pb-3 border-b border-[rgba(255,255,255,0.05)]">
                  <div>
                    <span class="text-[10px] uppercase text-[#6b6c77] block">Duration</span>
                    <p class="font-semibold text-white mt-0.5">${m.duration}m</p>
                  </div>
                  <div>
                    <span class="text-[10px] uppercase text-[#6b6c77] block">Release</span>
                    <p class="font-semibold text-white mt-0.5 truncate">${m.releaseDate || 'In Rotation'}</p>
                  </div>
                  <div>
                    <span class="text-[10px] uppercase text-[#6b6c77] block">Base Ticket</span>
                    <p class="font-semibold text-novaOrange mt-0.5 font-mono">$${m.basePrice.toFixed(2)}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 pt-1">
                  <button class="flex-1 py-1.5 px-2 rounded-xl bg-novaOrange hover:bg-novaOrange-hover text-white text-xs font-semibold transition flex items-center justify-center gap-1 btn-movie-add-showtime shadow-sm" data-id="${m.id}">
                    <i data-lucide="calendar-plus" class="w-3.5 h-3.5"></i>
                    <span>Schedule</span>
                  </button>
                  <button class="p-2 rounded-xl bg-[#222227] hover:bg-[#2c2c34] text-[#85858f] hover:text-white text-xs transition btn-edit-movie" data-id="${m.id}" title="Edit Movie">
                    <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                  </button>
                  <button class="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition btn-delete-movie" data-id="${m.id}" title="Delete Movie">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    } else {
      // Table view
      container.innerHTML = `
        <div class="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#1c1c21]">
          <table class="w-full text-left text-xs text-[#85858f]">
            <thead class="bg-[#242429] text-[#6b6c77] font-semibold border-b border-[rgba(255,255,255,0.04)] uppercase text-[10px] tracking-wider">
              <tr>
                <th class="py-3 px-4">Movie Poster & Title</th>
                <th class="py-3 px-4">Genre</th>
                <th class="py-3 px-4">Duration</th>
                <th class="py-3 px-4">Release Date</th>
                <th class="py-3 px-4">Age Rating</th>
                <th class="py-3 px-4">Base Ticket</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[rgba(255,255,255,0.04)]">
              ${movies.map(m => `
                <tr class="hover:bg-[#222227] transition">
                  <td class="py-3 px-4 font-semibold text-white flex items-center gap-3">
                    <img src="${m.poster}" class="w-8 h-11 rounded-lg object-cover shadow-sm bg-[#18191d]" alt="${escapeHtml(m.title)}" />
                    <div>
                      <span>${escapeHtml(m.title)}</span>
                      <p class="text-[10px] text-[#6b6c77] font-normal">${m.director || 'Studio Production'}</p>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-white">${escapeHtml(m.genre)}</td>
                  <td class="py-3 px-4">${m.duration} min</td>
                  <td class="py-3 px-4 font-mono text-[11px] text-[#a0a0ab]">${m.releaseDate || 'Current Season'}</td>
                  <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-full bg-[#222227] text-white border border-[rgba(255,255,255,0.08)] text-[10px]">${m.rating}</span></td>
                  <td class="py-3 px-4 font-mono font-bold text-novaOrange">$${m.basePrice.toFixed(2)}</td>
                  <td class="py-3 px-4">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${m.status === 'Active' ? 'bg-[#22c55e]/20 text-[#4ade80]' : m.status === 'Coming Soon' ? 'bg-amber-400/20 text-amber-300' : 'bg-[#222227] text-[#85858f]'}">${m.status}</span>
                  </td>
                  <td class="py-3 px-4 text-right whitespace-nowrap">
                    <button class="px-2.5 py-1 rounded-lg bg-novaOrange/15 hover:bg-novaOrange text-white text-xs font-semibold mr-1.5 btn-movie-add-showtime transition" data-id="${m.id}">Schedule</button>
                    <button class="p-1.5 rounded-lg bg-[#222227] hover:bg-[#2c2c34] text-[#85858f] hover:text-white btn-edit-movie transition mr-1" data-id="${m.id}" title="Edit Movie"><i data-lucide="edit-3" class="w-3.5 h-3.5 inline"></i></button>
                    <button class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 btn-delete-movie transition" data-id="${m.id}" title="Delete Movie"><i data-lucide="trash-2" class="w-3.5 h-3.5 inline"></i></button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    // Bind Movie action listeners
    container.querySelectorAll(".btn-movie-add-showtime").forEach(btn => {
      btn.addEventListener("click", () => {
        openAddShowtimeModal(btn.dataset.id);
      });
    });

    container.querySelectorAll(".btn-edit-movie").forEach(btn => {
      btn.addEventListener("click", () => {
        openEditMovieModal(btn.dataset.id);
      });
    });

    container.querySelectorAll(".btn-delete-movie").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const movie = Store.getMovieById(id);
        if (confirm(`Are you sure you want to remove "${movie?.title}" from catalog? Associated showtimes will also be removed.`)) {
          Store.deleteMovie(id);
          showToast("Movie deleted from catalog", "success");
          renderMoviesCatalog();
          if (AppState.currentView === "showtimes") renderShowtimesSchedule();
        }
      });
    });

    lucide.createIcons();
  }

  // Setup Movie Catalog Search and View Toggle controls
  const movieSearchInput = document.getElementById("movie-search-filter");
  if (movieSearchInput) {
    movieSearchInput.addEventListener("input", (e) => {
      movieSearchFilter = e.target.value.trim();
      renderMoviesCatalog();
    });
  }

  const movieStatusSelect = document.getElementById("movie-status-filter");
  if (movieStatusSelect) {
    movieStatusSelect.addEventListener("change", (e) => {
      movieStatusFilter = e.target.value;
      renderMoviesCatalog();
    });
  }

  const btnViewGrid = document.getElementById("btn-movie-view-grid");
  const btnViewTable = document.getElementById("btn-movie-view-table");
  if (btnViewGrid && btnViewTable) {
    btnViewGrid.addEventListener("click", () => {
      movieViewMode = "grid";
      btnViewGrid.classList.add("bg-[#2d2d35]", "text-novaOrange");
      btnViewTable.classList.remove("bg-[#2d2d35]", "text-novaOrange");
      renderMoviesCatalog();
    });
    btnViewTable.addEventListener("click", () => {
      movieViewMode = "table";
      btnViewTable.classList.add("bg-[#2d2d35]", "text-novaOrange");
      btnViewGrid.classList.remove("bg-[#2d2d35]", "text-novaOrange");
      renderMoviesCatalog();
    });
  }

  // ==========================================================================
  // MODULE D: SHOWTIME MANAGEMENT (PAGE 3)
  // ==========================================================================
  let stTheatreFilter = "all";
  let stScreenFilter = "all";
  let stMovieFilter = "all";
  let stDateFilter = "";

  function renderShowtimesSchedule() {
    const container = document.getElementById("showtimes-schedule-container");
    if (!container) return;

    // Populate filter selectors
    const theatreSelect = document.getElementById("st-filter-theatre");
    const screenSelect = document.getElementById("st-filter-screen");
    const movieSelect = document.getElementById("st-filter-movie");

    if (theatreSelect && theatreSelect.children.length <= 1) {
      const theatres = Store.getTheatres();
      theatreSelect.innerHTML = `<option value="all">All Theatres</option>` + 
        theatres.map(th => `<option value="${th.id}">${escapeHtml(th.name)}</option>`).join("");
      theatreSelect.onchange = (e) => {
        stTheatreFilter = e.target.value;
        renderShowtimesSchedule();
      };
    }

    if (screenSelect && screenSelect.children.length <= 1) {
      const screens = Store.getScreens();
      screenSelect.innerHTML = `<option value="all">All Screens</option>` + 
        screens.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join("");
      screenSelect.onchange = (e) => {
        stScreenFilter = e.target.value;
        renderShowtimesSchedule();
      };
    }

    if (movieSelect && movieSelect.children.length <= 1) {
      const movies = Store.getMovies();
      movieSelect.innerHTML = `<option value="all">All Movies</option>` + 
        movies.map(m => `<option value="${m.id}">${escapeHtml(m.title)}</option>`).join("");
      movieSelect.onchange = (e) => {
        stMovieFilter = e.target.value;
        renderShowtimesSchedule();
      };
    }

    const dateInput = document.getElementById("st-filter-date");
    if (dateInput && !dateInput.dataset.bound) {
      dateInput.dataset.bound = "true";
      dateInput.onchange = (e) => {
        stDateFilter = e.target.value;
        renderShowtimesSchedule();
      };
    }

    let showtimes = Store.getShowtimes();

    // Apply multi-filters
    if (stScreenFilter !== "all") {
      showtimes = showtimes.filter(s => s.screenId === stScreenFilter);
    }
    if (stMovieFilter !== "all") {
      showtimes = showtimes.filter(s => s.movieId === stMovieFilter);
    }
    if (stTheatreFilter !== "all") {
      showtimes = showtimes.filter(s => {
        const sc = Store.getScreenById(s.screenId);
        return sc && sc.theatreId === stTheatreFilter;
      });
    }
    if (stDateFilter) {
      showtimes = showtimes.filter(s => s.date === stDateFilter);
    }

    showtimes.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });

    if (showtimes.length === 0) {
      container.innerHTML = `
        <div class="p-10 text-center text-[#85858f] text-xs bg-[#17181c] rounded-xl border border-[rgba(255,255,255,0.04)]">
          <i data-lucide="calendar" class="w-8 h-8 text-[#6b6c77] mx-auto mb-2 opacity-50"></i>
          <p>No showtimes scheduled matching the selected filters.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    container.innerHTML = `
      <div class="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#1c1c21]">
        <table class="w-full text-left text-xs text-[#85858f]">
          <thead class="bg-[#242429] text-[#6b6c77] font-semibold border-b border-[rgba(255,255,255,0.04)] uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-3 px-4">Movie & Poster</th>
              <th class="py-3 px-4">Theatre & Screen</th>
              <th class="py-3 px-4">Date & Slot</th>
              <th class="py-3 px-4">Seat Availability</th>
              <th class="py-3 px-4">Pricing Multiplier</th>
              <th class="py-3 px-4">Calculated Price</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[rgba(255,255,255,0.04)]">
            ${showtimes.map(st => {
              const movie = Store.getMovieById(st.movieId);
              const screen = Store.getScreenById(st.screenId);
              const total = screen ? screen.totalSeats : 80;
              const booked = st.bookedSeats.length;
              const available = total - booked;
              const pct = Math.round((booked / total) * 100);
              const calcPrice = (movie ? movie.basePrice * st.priceMultiplier : 16.50).toFixed(2);

              return `
                <tr class="hover:bg-[#222227] transition">
                  <td class="py-3 px-4 font-semibold text-white">
                    <div class="flex items-center gap-3">
                      <img src="${movie ? movie.poster : ''}" class="w-8 h-11 rounded-lg object-cover shadow-sm bg-[#18191d]" alt="${movie ? escapeHtml(movie.title) : 'Movie'}" />
                      <div>
                        <span>${movie ? escapeHtml(movie.title) : 'Movie'}</span>
                        <p class="text-[10px] text-[#6b6c77] font-normal">${movie ? movie.genre : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <span class="font-semibold text-white block">${screen ? escapeHtml(screen.name) : 'Screen'}</span>
                    <span class="text-[11px] text-novaOrange font-medium">${screen ? (screen.theatreName || 'Downtown Complex') : ''}</span>
                  </td>
                  <td class="py-3 px-4">
                    <span class="font-medium text-white block">${st.date}</span>
                    <span class="text-[11px] font-mono text-novaOrange">${st.startTime} — ${st.endTime}</span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-24 h-2 bg-[#17181c] rounded-full overflow-hidden p-0.5">
                        <div class="h-full bg-novaOrange rounded-full" style="width: ${pct}%"></div>
                      </div>
                      <span class="text-[11px] text-white font-mono">${booked}/${total} (${pct}%)</span>
                    </div>
                    <span class="text-[10px] text-[#4ade80]">${available} seats open</span>
                  </td>
                  <td class="py-3 px-4 font-mono text-white">${st.priceMultiplier}x</td>
                  <td class="py-3 px-4 font-mono font-bold text-novaOrange text-sm">$${calcPrice}</td>
                  <td class="py-3 px-4 text-right whitespace-nowrap">
                    <button class="px-3 py-1.5 rounded-xl bg-novaOrange hover:bg-novaOrange-hover text-white text-xs font-semibold mr-1.5 btn-open-seatmap transition shadow-sm" data-id="${st.id}">
                      Seat Matrix
                    </button>
                    <button class="p-1.5 rounded-xl bg-[#222227] hover:bg-rose-500/20 text-[#85858f] hover:text-rose-400 btn-delete-showtime transition" data-id="${st.id}" title="Cancel Screening">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;

    container.querySelectorAll(".btn-open-seatmap").forEach(btn => {
      btn.addEventListener("click", () => {
        AppState.selectedShowtimeId = btn.dataset.id;
        switchView("boxoffice");
      });
    });

    container.querySelectorAll(".btn-delete-showtime").forEach(btn => {
      btn.addEventListener("click", () => {
        if (confirm("Are you sure you want to cancel and remove this scheduled showtime?")) {
          Store.deleteShowtime(btn.dataset.id);
          showToast("Showtime removed", "success");
          renderShowtimesSchedule();
        }
      });
    });

    lucide.createIcons();
  }

  // ==========================================================================
  // MODULE E: THEATRE & SCREEN MANAGEMENT (PAGE 5)
  // ==========================================================================
  let screenFilterTheatre = "all";
  let screenFilterAvail = "all";

  function renderTheatresAndScreens() {
    // 1. Render Theatre Locations Cards
    const theatreListEl = document.getElementById("theatres-list-container");
    if (theatreListEl) {
      const theatres = Store.getTheatres();
      theatreListEl.innerHTML = theatres.map(th => {
        const screens = Store.getScreens().filter(s => s.theatreId === th.id);
        const totalCap = screens.reduce((acc, s) => acc + (s.totalSeats || 0), 0);
        return `
          <div class="nova-card p-5 flex flex-col justify-between space-y-4">
            <div class="flex items-start justify-between">
              <div>
                <span class="text-[10px] font-bold text-novaOrange uppercase tracking-wider block">Complex Location</span>
                <h3 class="text-base font-bold text-white mt-0.5">${escapeHtml(th.name)}</h3>
                <p class="text-xs text-[#85858f] mt-1">${escapeHtml(th.location)} • ${escapeHtml(th.city)}</p>
              </div>
              <span class="status-pill-active text-[10px] px-2.5 py-1 rounded-full font-semibold">
                ● ${th.status}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#17181c] border border-[rgba(255,255,255,0.04)] text-xs">
              <div>
                <span class="text-[10px] text-[#6b6c77] uppercase block">Auditoriums</span>
                <span class="font-bold text-white font-mono">${screens.length} Screens</span>
              </div>
              <div>
                <span class="text-[10px] text-[#6b6c77] uppercase block">Total Capacity</span>
                <span class="font-bold text-white font-mono">${totalCap} Seats</span>
              </div>
              <div>
                <span class="text-[10px] text-[#6b6c77] uppercase block">Manager</span>
                <span class="font-semibold text-novaOrange truncate block">${escapeHtml(th.manager || 'Marcus Vance')}</span>
              </div>
            </div>

            <div class="flex items-center justify-between text-xs text-[#85858f] pt-1">
              <span>Contact: <strong class="text-white">${escapeHtml(th.phone || '+1 555-019-2834')}</strong></span>
              <button onclick="document.getElementById('screen-filter-theatre').value='${th.id}'; document.getElementById('screen-filter-theatre').dispatchEvent(new Event('change'));" class="text-novaOrange hover:underline font-semibold text-xs">
                Filter Screens &rarr;
              </button>
            </div>
          </div>
        `;
      }).join("");
    }

    // 2. Populate Screen Filters
    const filterTh = document.getElementById("screen-filter-theatre");
    const filterAv = document.getElementById("screen-filter-avail");
    if (filterTh && filterTh.children.length <= 1) {
      filterTh.innerHTML = `<option value="all">All Theatres</option>` + 
        Store.getTheatres().map(th => `<option value="${th.id}">${escapeHtml(th.name)}</option>`).join("");
      filterTh.onchange = (e) => {
        screenFilterTheatre = e.target.value;
        renderTheatresAndScreens();
      };
    }
    if (filterAv && !filterAv.dataset.bound) {
      filterAv.dataset.bound = "true";
      filterAv.onchange = (e) => {
        screenFilterAvail = e.target.value;
        renderTheatresAndScreens();
      };
    }

    // 3. Render Screens Grid / Cards
    const screenGrid = document.getElementById("theatres-screens-container");
    if (!screenGrid) return;

    let screens = Store.getScreens();
    if (screenFilterTheatre !== "all") {
      screens = screens.filter(s => s.theatreId === screenFilterTheatre);
    }
    if (screenFilterAvail !== "all") {
      screens = screens.filter(s => (s.availability || "Available") === screenFilterAvail);
    }

    if (screens.length === 0) {
      screenGrid.innerHTML = `
        <div class="col-span-full p-10 text-center text-[#85858f] text-xs bg-[#17181c] rounded-xl border border-[rgba(255,255,255,0.04)]">
          <p>No screens found matching the selected filter criteria.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    screenGrid.innerHTML = screens.map(s => {
      const avail = s.availability || "Available";
      let statusClass = "status-pill-available";
      if (avail === "Maintenance") statusClass = "status-pill-maintenance";
      if (avail === "Cleaning") statusClass = "status-pill-cleaning";

      const vipCount = (s.tiers && s.tiers.vipRows ? s.tiers.vipRows.length * (s.cols || 10) : 16);
      const accCount = (s.tiers && s.tiers.accessibleRows ? s.tiers.accessibleRows.length * (s.cols || 10) : 8);
      const stdCount = (s.totalSeats || 60) - vipCount - accCount;

      return `
        <div class="nova-card p-5 flex flex-col justify-between space-y-4 hover:border-[rgba(255,255,255,0.12)] transition">
          <div>
            <div class="flex items-start justify-between">
              <div>
                <span class="text-[10px] text-novaOrange font-bold uppercase tracking-wider block">${escapeHtml(s.theatreName || 'Downtown Complex')}</span>
                <h4 class="font-bold text-white text-base mt-0.5">${escapeHtml(s.name)}</h4>
              </div>
              <span class="${statusClass} text-[10px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full ${avail === 'Available' ? 'bg-[#2dd4bf]' : avail === 'Maintenance' ? 'bg-amber-400' : 'bg-indigo-400'}"></span>
                ${avail}
              </span>
            </div>
            <p class="text-xs text-[#a0a0ab] mt-1 flex items-center gap-1.5">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-novaOrange"></i>
              <span>${escapeHtml(s.type || 'Digital 4K')}</span>
            </p>
          </div>

          <!-- Seating Capacity Breakdown -->
          <div class="p-3 rounded-xl bg-[#17181c] border border-[rgba(255,255,255,0.04)] space-y-2 text-xs">
            <div class="flex justify-between items-center text-[#85858f]">
              <span>Total Seating Capacity:</span>
              <strong class="font-mono text-white font-bold text-sm">${s.totalSeats || 60} Seats</strong>
            </div>
            <div class="grid grid-cols-3 gap-1 pt-1.5 border-t border-[rgba(255,255,255,0.04)] text-[10px] text-center font-mono">
              <div class="p-1 rounded bg-[#232238] text-[#818cf8]">VIP: ${vipCount}</div>
              <div class="p-1 rounded bg-[#222227] text-white">Std: ${Math.max(0, stdCount)}</div>
              <div class="p-1 rounded bg-[#172a2e] text-[#2dd4bf]">Acc: ${accCount}</div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.05)] text-xs">
            <div class="flex items-center gap-1">
              <select class="h-7 px-2 rounded-lg bg-[#222227] border border-[rgba(255,255,255,0.06)] text-[11px] text-white select-screen-status" data-id="${s.id}">
                <option value="Available" ${avail === 'Available' ? 'selected' : ''}>Available</option>
                <option value="Maintenance" ${avail === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                <option value="Cleaning" ${avail === 'Cleaning' ? 'selected' : ''}>Cleaning</option>
              </select>
            </div>
            <div class="flex items-center gap-1.5">
              <button class="p-1.5 rounded-lg bg-[#222227] hover:bg-[#2c2c34] text-[#85858f] hover:text-white transition btn-edit-screen" data-id="${s.id}" title="Edit Screen">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
              </button>
              <button class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition btn-delete-screen" data-id="${s.id}" title="Delete Screen">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Bind Quick Status Toggle
    screenGrid.querySelectorAll(".select-screen-status").forEach(sel => {
      sel.addEventListener("change", (e) => {
        const id = sel.dataset.id;
        const newStatus = e.target.value;
        Store.updateScreen(id, { availability: newStatus });
        showToast(`Auditorium status updated to ${newStatus}`, "success");
        renderTheatresAndScreens();
      });
    });

    // Bind Edit Screen
    screenGrid.querySelectorAll(".btn-edit-screen").forEach(btn => {
      btn.addEventListener("click", () => {
        openEditScreenModal(btn.dataset.id);
      });
    });

    // Bind Delete Screen
    screenGrid.querySelectorAll(".btn-delete-screen").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const sc = Store.getScreenById(id);
        if (confirm(`Are you sure you want to delete auditorium "${sc?.name}"?`)) {
          Store.deleteScreen(id);
          showToast("Screen deleted", "success");
          renderTheatresAndScreens();
        }
      });
    });

    // Bind Add Screen button
    const btnAddScreen = document.getElementById("btn-open-screen-modal");
    if (btnAddScreen) {
      btnAddScreen.onclick = () => openAddScreenModal();
    }

    lucide.createIcons();
  }

  // SCREEN MODAL HELPERS
  function openAddScreenModal() {
    const modal = document.getElementById("modal-screen-form");
    const form = document.getElementById("form-screen");
    const title = document.getElementById("modal-screen-title");
    if (!modal || !form) return;

    form.reset();
    document.getElementById("screen-input-id").value = "";
    if (title) title.textContent = "Add New Screen & Auditorium";

    // Populate theatre dropdown
    const thSelect = document.getElementById("screen-input-theatre");
    thSelect.innerHTML = Store.getTheatres().map(th => `
      <option value="${th.id}">${escapeHtml(th.name)} (${escapeHtml(th.city)})</option>
    `).join("");

    modal.classList.remove("hidden");
  }

  function openEditScreenModal(screenId) {
    const screen = Store.getScreenById(screenId);
    if (!screen) return;

    const modal = document.getElementById("modal-screen-form");
    const form = document.getElementById("form-screen");
    const title = document.getElementById("modal-screen-title");
    if (!modal || !form) return;

    document.getElementById("screen-input-id").value = screen.id;
    if (title) title.textContent = `Edit Auditorium: ${screen.name}`;

    // Populate theatre dropdown
    const thSelect = document.getElementById("screen-input-theatre");
    thSelect.innerHTML = Store.getTheatres().map(th => `
      <option value="${th.id}" ${th.id === screen.theatreId ? 'selected' : ''}>${escapeHtml(th.name)}</option>
    `).join("");

    document.getElementById("screen-input-name").value = screen.name;
    document.getElementById("screen-input-type").value = screen.type || "IMAX Laser";
    document.getElementById("screen-input-seats").value = screen.totalSeats || 60;
    document.getElementById("screen-input-availability").value = screen.availability || "Available";

    modal.classList.remove("hidden");
  }

  const formScreen = document.getElementById("form-screen");
  if (formScreen) {
    formScreen.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("screen-input-id").value;
      const thId = document.getElementById("screen-input-theatre").value;
      const th = Store.getTheatreById(thId);

      const screenData = {
        name: document.getElementById("screen-input-name").value.trim(),
        theatreId: thId,
        theatreName: th ? th.name : "Downtown Complex",
        type: document.getElementById("screen-input-type").value,
        totalSeats: parseInt(document.getElementById("screen-input-seats").value) || 60,
        availability: document.getElementById("screen-input-availability").value
      };

      try {
        if (id) {
          Store.updateScreen(id, screenData);
          showToast("Auditorium specification updated", "success");
        } else {
          Store.addScreen(screenData);
          showToast("New screen added successfully", "success");
        }
        document.getElementById("modal-screen-form").classList.add("hidden");
        renderTheatresAndScreens();
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // ==========================================================================
  // MODULE D: BOX OFFICE & REAL-TIME SEAT MATRIX (THE CORE EXPERIENCE)
  // ==========================================================================
  function renderBoxOffice() {
    renderShowtimeSelector();
    renderSeatMatrixGrid();
    renderBookingDrawer();
  }

  function renderShowtimeSelector() {
    const selector = document.getElementById("boxoffice-showtime-select");
    if (!selector) return;

    const showtimes = Store.getShowtimes();
    selector.innerHTML = showtimes.map(st => {
      const movie = Store.getMovieById(st.movieId);
      const screen = Store.getScreenById(st.screenId);
      const isSelected = st.id === AppState.selectedShowtimeId ? "selected" : "";
      return `
        <option value="${st.id}" ${isSelected}>
          ${movie ? movie.title : 'Movie'} — ${screen ? screen.name : 'Screen'} (${st.date} @ ${st.startTime})
        </option>
      `;
    }).join("");

    selector.onchange = (e) => {
      AppState.selectedShowtimeId = e.target.value;
      AppState.selectedSeats = []; // Reset selected seats when switching showtimes
      renderSeatMatrixGrid();
      renderBookingDrawer();
    };

    // Update Banner Info for Active Showtime
    const currentSt = Store.getShowtimeById(AppState.selectedShowtimeId);
    if (currentSt) {
      const movie = Store.getMovieById(currentSt.movieId);
      const screen = Store.getScreenById(currentSt.screenId);
      
      const titleEl = document.getElementById("bo-movie-title");
      const metaEl = document.getElementById("bo-movie-meta");
      const posterEl = document.getElementById("bo-movie-poster");

      if (titleEl && movie) titleEl.textContent = movie.title;
      if (metaEl && movie && screen) {
        metaEl.textContent = `${screen.name} • ${currentSt.date} @ ${currentSt.startTime} - ${currentSt.endTime} • Base: $${(movie.basePrice * currentSt.priceMultiplier).toFixed(2)}`;
      }
      if (posterEl && movie) posterEl.src = movie.poster;
    }
  }

  function renderSeatMatrixGrid() {
    const gridContainer = document.getElementById("seat-matrix-container");
    if (!gridContainer) return;

    const showtime = Store.getShowtimeById(AppState.selectedShowtimeId);
    if (!showtime) {
      gridContainer.innerHTML = `<div class="p-8 text-center text-slate-500">Please select a valid showtime above.</div>`;
      return;
    }

    const screen = Store.getScreenById(showtime.screenId);
    if (!screen) return;

    // Rows e.g. A to H (8 rows)
    const rowLetters = ["A", "B", "C", "D", "E", "F", "G", "H"].slice(0, screen.rows);
    const colsCount = screen.cols; // 10

    let html = `
      <div class="flex flex-col items-center gap-2 select-none">
    `;

    rowLetters.forEach(row => {
      html += `<div class="flex items-center gap-1.5 sm:gap-2">`;
      // Row Label
      html += `<span class="w-5 text-right font-bold text-xs text-slate-500 mr-1">${row}</span>`;

      // Determine Tier of this Row
      let tierType = "standard";
      if (screen.tiers.vipRows.includes(row)) tierType = "vip";
      else if (screen.tiers.accessibleRows.includes(row)) tierType = "accessible";

      for (let col = 1; col <= colsCount; col++) {
        // Gap for center aisle between seat 5 and 6
        if (col === 6) {
          html += `<div class="w-4 sm:w-6"></div>`;
        }

        const seatId = `${row}${col}`;
        const isBooked = showtime.bookedSeats.includes(seatId);
        const isSelected = AppState.selectedSeats.includes(seatId);

        let seatClass = "";
        let tooltipText = `${seatId} - Available`;

        if (isBooked) {
          seatClass = "seat-booked";
          // Find customer name if exists in reservations
          const res = Store.getReservations().find(r => r.showtimeId === showtime.id && r.seats.includes(seatId));
          const cust = res ? Store.getCustomerById(res.customerId) : null;
          tooltipText = `${seatId} - Booked by ${cust ? cust.name : 'Reserved'}`;
        } else if (isSelected) {
          seatClass = "seat-selected";
          tooltipText = `${seatId} - Selected for booking`;
        } else {
          if (tierType === "vip") seatClass = "seat-available-vip";
          else if (tierType === "accessible") seatClass = "seat-available-accessible";
          else seatClass = "seat-available-standard";
        }

        html += `
          <button 
            type="button" 
            class="seat-btn ${seatClass}" 
            data-seat-id="${seatId}" 
            data-tier="${tierType}"
            title="${tooltipText}"
            ${isBooked ? 'disabled' : ''}
          >
            ${col}
          </button>
        `;
      }

      html += `<span class="w-5 text-left font-bold text-xs text-slate-500 ml-1">${row}</span>`;
      html += `</div>`;
    });

    html += `</div>`;
    gridContainer.innerHTML = html;

    // Attach click handlers to seats
    gridContainer.querySelectorAll(".seat-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const seatId = btn.dataset.seatId;
        toggleSeatSelection(seatId);
      });
    });

    // Update Seat Stats in Header
    const bookedCount = showtime.bookedSeats.length;
    const selectedCount = AppState.selectedSeats.length;
    const availableCount = screen.totalSeats - bookedCount - selectedCount;

    const countAvail = document.getElementById("matrix-count-available");
    const countBooked = document.getElementById("matrix-count-booked");
    const countSelected = document.getElementById("matrix-count-selected");

    if (countAvail) countAvail.textContent = Math.max(0, availableCount);
    if (countBooked) countBooked.textContent = bookedCount;
    if (countSelected) countSelected.textContent = selectedCount;
  }

  function toggleSeatSelection(seatId) {
    const idx = AppState.selectedSeats.indexOf(seatId);
    if (idx > -1) {
      AppState.selectedSeats.splice(idx, 1);
    } else {
      AppState.selectedSeats.push(seatId);
    }
    renderSeatMatrixGrid();
    renderBookingDrawer();
  }

  function renderBookingDrawer() {
    const container = document.getElementById("selected-seats-list");
    const subtotalEl = document.getElementById("drawer-subtotal");
    const feeEl = document.getElementById("drawer-fee");
    const taxEl = document.getElementById("drawer-tax");
    const totalEl = document.getElementById("drawer-total");
    const confirmBtn = document.getElementById("btn-confirm-booking");

    if (!container) return;

    const showtime = Store.getShowtimeById(AppState.selectedShowtimeId);
    const screen = showtime ? Store.getScreenById(showtime.screenId) : null;
    const movie = showtime ? Store.getMovieById(showtime.movieId) : null;
    const settings = Store.getSettings();

    if (AppState.selectedSeats.length === 0) {
      container.innerHTML = `
        <div class="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
          <i data-lucide="mouse-pointer-click" class="w-6 h-6 mx-auto mb-2 opacity-40"></i>
          Click seats on the auditorium map to start booking.
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = `${settings.currency}0.00`;
      if (feeEl) feeEl.textContent = `${settings.currency}0.00`;
      if (taxEl) taxEl.textContent = `${settings.currency}0.00`;
      if (totalEl) totalEl.textContent = `${settings.currency}0.00`;
      if (confirmBtn) confirmBtn.disabled = true;
      lucide.createIcons();
      return;
    }

    if (confirmBtn) confirmBtn.disabled = false;

    // Calculate Pricing
    let subtotal = 0;
    const seatsDetail = AppState.selectedSeats.map(seatId => {
      const row = seatId.charAt(0);
      let tier = "Standard";
      let price = movie ? movie.basePrice : 15.00;

      if (screen) {
        if (screen.tiers.vipRows.includes(row)) {
          tier = "VIP Recliner";
          price = screen.pricing.vip;
        } else if (screen.tiers.accessibleRows.includes(row)) {
          tier = "Accessible";
          price = screen.pricing.accessible;
        } else {
          price = screen.pricing.standard;
        }
      }

      price = price * (showtime ? showtime.priceMultiplier : 1.0);
      subtotal += price;

      return { seatId, tier, price };
    });

    const fee = settings.bookingFee * AppState.selectedSeats.length;
    const tax = +(subtotal * (settings.taxRate / 100)).toFixed(2);
    const total = +(subtotal + fee + tax).toFixed(2);

    container.innerHTML = seatsDetail.map(s => `
      <div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">${s.seatId}</span>
          <div>
            <span class="text-xs font-semibold text-slate-200">${s.tier}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono font-semibold text-amber-400">${settings.currency}${s.price.toFixed(2)}</span>
          <button class="text-slate-500 hover:text-rose-400 p-0.5 rounded transition btn-remove-seat" data-seat="${s.seatId}">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `).join("");

    container.querySelectorAll(".btn-remove-seat").forEach(btn => {
      btn.addEventListener("click", () => {
        toggleSeatSelection(btn.dataset.seat);
      });
    });

    if (subtotalEl) subtotalEl.textContent = `${settings.currency}${subtotal.toFixed(2)}`;
    if (feeEl) feeEl.textContent = `${settings.currency}${fee.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `${settings.currency}${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `${settings.currency}${total.toFixed(2)}`;

    lucide.createIcons();
  }

  // Populate Customer Dropdown in Booking Drawer
  function populateDrawerCustomers() {
    const custSelect = document.getElementById("drawer-customer-select");
    if (!custSelect) return;

    const customers = Store.getCustomers();
    custSelect.innerHTML = customers.map(c => `
      <option value="${c.id}" ${c.id === 'cust-16' ? 'selected' : ''}>
        ${escapeHtml(c.name)} (${c.tier} — ${c.points} pts)
      </option>
    `).join("");
  }
  populateDrawerCustomers();

  // Booking Confirmation Handler
  const confirmBookingBtn = document.getElementById("btn-confirm-booking");
  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener("click", () => {
      if (AppState.selectedSeats.length === 0) return;

      const showtimeId = AppState.selectedShowtimeId;
      const showtime = Store.getShowtimeById(showtimeId);
      const screen = Store.getScreenById(showtime.screenId);
      const movie = Store.getMovieById(showtime.movieId);
      const settings = Store.getSettings();

      const custSelect = document.getElementById("drawer-customer-select");
      const customerId = custSelect ? custSelect.value : "cust-16";

      const payMethodSelect = document.getElementById("drawer-payment-method");
      const paymentMethod = payMethodSelect ? payMethodSelect.value : "Credit Card";

      // Pricing math
      let subtotal = 0;
      AppState.selectedSeats.forEach(seatId => {
        const row = seatId.charAt(0);
        let p = screen.pricing.standard;
        if (screen.tiers.vipRows.includes(row)) p = screen.pricing.vip;
        else if (screen.tiers.accessibleRows.includes(row)) p = screen.pricing.accessible;
        subtotal += p * showtime.priceMultiplier;
      });

      const fee = settings.bookingFee * AppState.selectedSeats.length;
      const tax = +(subtotal * (settings.taxRate / 100)).toFixed(2);
      const totalAmount = +(subtotal + fee + tax).toFixed(2);

      try {
        const reservation = Store.createReservation({
          customerId,
          showtimeId,
          seats: [...AppState.selectedSeats],
          seatTier: screen.type,
          subtotal,
          fee,
          tax,
          totalAmount,
          paymentMethod
        });

        showToast(`Booking ${reservation.id} confirmed!`, "success");

        // Clear active selection
        AppState.selectedSeats = [];
        renderSeatMatrixGrid();
        renderBookingDrawer();
        updateHeaderPills();

        // Launch Digital Ticket Stub Modal
        showTicketStubModal(reservation.id);

      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // ==========================================================================
  // DIGITAL TICKET STUB MODAL & PRINTING
  // ==========================================================================
  function showTicketStubModal(reservationId) {
    const reservation = Store.getReservationById(reservationId);
    if (!reservation) return;

    const showtime = Store.getShowtimeById(reservation.showtimeId);
    const movie = showtime ? Store.getMovieById(showtime.movieId) : null;
    const screen = showtime ? Store.getScreenById(showtime.screenId) : null;
    const customer = Store.getCustomerById(reservation.customerId);
    const settings = Store.getSettings();

    const modal = document.getElementById("ticket-stub-modal");
    const container = document.getElementById("ticket-stub-content");

    if (!modal || !container) return;

    container.innerHTML = `
      <div id="ticket-print-target" class="ticket-stub-card relative p-6 bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl max-w-sm mx-auto">
        <div class="ticket-notch-left"></div>
        <div class="ticket-notch-right"></div>
        <div class="ticket-perforation-line"></div>

        <!-- Cinema Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">CP</div>
            <span class="font-bold text-xs uppercase tracking-wider text-slate-200">${escapeHtml(settings.cinemaName)}</span>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            ${reservation.id}
          </span>
        </div>

        <!-- Movie & Screen Details -->
        <div class="py-4 flex gap-3">
          <img src="${movie ? movie.poster : ''}" class="w-14 h-20 rounded-lg object-cover flex-shrink-0 shadow-md" />
          <div class="flex-1">
            <h3 class="font-bold text-white text-base leading-snug">${movie ? escapeHtml(movie.title) : 'Movie'}</h3>
            <p class="text-xs text-amber-400 font-medium mt-0.5">${screen ? screen.name : 'Auditorium'}</p>
            <p class="text-[11px] text-slate-400 mt-1">${showtime ? showtime.date : ''} • <span class="text-slate-200 font-bold">${showtime ? showtime.startTime : ''}</span></p>
          </div>
        </div>

        <!-- Seats Grid Pill -->
        <div class="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 mb-4">
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-slate-400">Allocated Seats:</span>
            <span class="font-mono font-bold text-amber-400 text-sm">${reservation.seats.join(", ")}</span>
          </div>
          <div class="flex items-center justify-between text-[11px] mt-1 pt-1 border-t border-slate-800">
            <span class="text-slate-400">Patron:</span>
            <span class="font-medium text-slate-200">${customer ? escapeHtml(customer.name) : 'Guest'} (${reservation.paymentMethod})</span>
          </div>
        </div>

        <!-- Lower Tear-Off Stub (Below Perforation) -->
        <div class="pt-8">
          <div class="flex items-center justify-between mb-3">
            <div>
              <span class="text-[10px] uppercase text-slate-400 block">Total Amount Paid</span>
              <span class="font-mono font-bold text-emerald-400 text-base">${settings.currency}${reservation.totalAmount.toFixed(2)}</span>
            </div>
            <div class="w-12 h-12 bg-white rounded p-1 flex items-center justify-center">
              <!-- Simulated QR Code SVG -->
              <svg viewBox="0 0 24 24" class="w-full h-full text-slate-900 fill-current">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h4v4h-4v-4zm-4-4h4v4h-4v-4zm8-4h4v4h-4v-4zm-4 0h4v4h-4v-4z"/>
              </svg>
            </div>
          </div>

          <!-- Barcode simulation -->
          <div class="simulated-barcode rounded opacity-75"></div>
          <p class="font-mono text-[9px] text-center text-slate-500 tracking-widest mt-1.5 uppercase">VALID ONLY FOR SPECIFIED SCREENING • NO COUNTERFEIT</p>
        </div>
      </div>
    `;

    modal.classList.remove("hidden");
    lucide.createIcons();
  }

  // Ticket modal print button
  const btnPrintTicket = document.getElementById("btn-print-ticket");
  if (btnPrintTicket) {
    btnPrintTicket.addEventListener("click", () => {
      window.print();
    });
  }

  const btnCloseTicket = document.getElementById("btn-close-ticket-modal");
  if (btnCloseTicket) {
    btnCloseTicket.addEventListener("click", () => {
      document.getElementById("ticket-stub-modal").classList.add("hidden");
    });
  }

  // ==========================================================================
  // MODULE F: CUSTOMER MANAGEMENT (PAGE 6)
  // ==========================================================================
  let customerTierFilter = "all";
  let customerStatusFilter = "all";
  let customerSearchQuery = "";

  function renderCustomerCRM() {
    const tableBody = document.getElementById("customer-crm-tbody");
    if (!tableBody) return;

    let customers = Store.getCustomers();

    if (customerTierFilter !== "all") {
      customers = customers.filter(c => c.tier.toLowerCase() === customerTierFilter.toLowerCase());
    }

    if (customerStatusFilter !== "all") {
      customers = customers.filter(c => (c.accountStatus || "Active") === customerStatusFilter);
    }

    if (customerSearchQuery) {
      const q = customerSearchQuery.toLowerCase();
      customers = customers.filter(c => 
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
      );
    }

    const getTierBadge = (tier) => {
      switch (tier.toLowerCase()) {
        case "platinum": return "pill-purple";
        case "gold": return "pill-yellow";
        case "silver": return "pill-dark";
        default: return "pill-orange";
      }
    };

    const getStatusBadge = (status) => {
      switch (status) {
        case "VIP Member": return "status-pill-vip";
        case "Suspended": return "status-pill-suspended";
        default: return "status-pill-active";
      }
    };

    if (customers.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" class="py-12 text-center text-[#85858f] text-xs">
            No customers match the active filters or search terms.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = customers.map(c => {
      const status = c.accountStatus || "Active";
      return `
        <tr class="hover:bg-[#222227] transition">
          <td class="py-3.5 px-4 whitespace-nowrap">
            <div class="flex items-center gap-3">
              <img src="${c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80'}" class="w-8 h-8 rounded-full object-cover border border-[rgba(255,255,255,0.08)]" alt="${escapeHtml(c.name)}" />
              <div>
                <p class="font-semibold text-white text-xs">${escapeHtml(c.name)}</p>
                <span class="text-[10px] text-[#6b6c77]">Joined ${c.joinDate || '2024'}</span>
              </div>
            </div>
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            <p class="font-mono text-xs text-[#a0a0ab]">${escapeHtml(c.email)}</p>
            <p class="text-[11px] text-[#6b6c77]">${escapeHtml(c.phone)}</p>
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            <span class="pill-badge ${getTierBadge(c.tier)}">
              ${c.tier}
            </span>
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            <span class="${getStatusBadge(status)} text-[10px] px-2.5 py-1 rounded-full font-semibold">
              ● ${status}
            </span>
          </td>
          <td class="py-3.5 px-4 font-semibold text-white whitespace-nowrap">${c.visitCount} visits</td>
          <td class="py-3.5 px-4 font-mono font-bold text-novaOrange whitespace-nowrap">$${c.totalSpent.toFixed(2)}</td>
          <td class="py-3.5 px-4 font-mono text-white whitespace-nowrap">${c.points.toLocaleString()} pts</td>
          <td class="py-3.5 px-4 text-[#85858f] text-xs whitespace-nowrap">${c.lastVisit || 'N/A'}</td>
          <td class="py-3.5 px-4 text-right whitespace-nowrap">
            <div class="flex items-center justify-end gap-1.5">
              <select class="h-7 px-2 rounded-lg bg-[#222227] border border-[rgba(255,255,255,0.06)] text-[11px] text-[#85858f] select-cust-status" data-id="${c.id}" title="Change Account Status">
                <option value="Active" ${status === 'Active' ? 'selected' : ''}>Active</option>
                <option value="VIP Member" ${status === 'VIP Member' ? 'selected' : ''}>VIP Member</option>
                <option value="Suspended" ${status === 'Suspended' ? 'selected' : ''}>Suspended</option>
              </select>
              <button class="px-2.5 py-1.5 rounded-lg bg-[#222227] hover:bg-[#2c2c34] text-white text-xs font-medium transition btn-inspect-customer" data-id="${c.id}">
                Profile
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    // Attach row inspection handlers
    tableBody.querySelectorAll(".btn-inspect-customer").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openCustomerProfileDrawer(btn.dataset.id);
      });
    });

    // Attach status toggle handlers
    tableBody.querySelectorAll(".select-cust-status").forEach(sel => {
      sel.addEventListener("change", (e) => {
        const id = sel.dataset.id;
        const newStatus = e.target.value;
        Store.updateCustomerStatus(id, newStatus);
        showToast(`Account status updated to ${newStatus}`, "success");
        renderCustomerCRM();
      });
    });

    lucide.createIcons();
  }

  // CRM Search & Filters
  const crmSearchInput = document.getElementById("crm-search-filter");
  if (crmSearchInput) {
    crmSearchInput.addEventListener("input", (e) => {
      customerSearchQuery = e.target.value.trim();
      renderCustomerCRM();
    });
  }

  const crmStatusSelect = document.getElementById("customer-status-filter");
  if (crmStatusSelect) {
    crmStatusSelect.addEventListener("change", (e) => {
      customerStatusFilter = e.target.value;
      renderCustomerCRM();
    });
  }

  document.querySelectorAll(".tab-tier-filter").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-tier-filter").forEach(t => t.classList.remove("active", "bg-[#26262d]", "text-white"));
      tab.classList.add("active", "bg-[#26262d]", "text-white");
      customerTierFilter = tab.dataset.tier;
      renderCustomerCRM();
    });
  });

  // CUSTOMER SLIDE-OVER DRAWER
  function openCustomerProfileDrawer(customerId) {
    const customer = Store.getCustomerById(customerId);
    if (!customer) return;

    AppState.activeCustomerDrawerId = customerId;
    const drawer = document.getElementById("customer-drawer");
    const container = document.getElementById("customer-drawer-content");

    if (!drawer || !container) return;

    const reservations = Store.getReservations().filter(r => r.customerId === customerId);

    container.innerHTML = `
      <div class="p-6 border-b border-[rgba(255,255,255,0.06)] bg-[#18191e]">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <img src="${customer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'}" class="w-12 h-12 rounded-2xl object-cover border-2 border-novaOrange shadow-lg" alt="${escapeHtml(customer.name)}" />
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-white text-lg">${escapeHtml(customer.name)}</h3>
                <span class="pill-badge pill-orange text-[10px]">${customer.tier}</span>
              </div>
              <p class="text-xs text-[#85858f] mt-0.5">${escapeHtml(customer.email)} • ${escapeHtml(customer.phone)}</p>
            </div>
          </div>
          <button id="btn-close-cust-drawer" class="p-1.5 rounded-lg hover:bg-[#222227] text-[#85858f] hover:text-white transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Customer Stats KPI Grid -->
        <div class="grid grid-cols-4 gap-2 mt-5">
          <div class="p-2.5 rounded-xl bg-[#222227] border border-[rgba(255,255,255,0.04)] text-center">
            <span class="text-[10px] uppercase text-[#6b6c77] font-semibold">Total Spent</span>
            <p class="font-bold font-mono text-novaOrange text-sm mt-0.5">$${customer.totalSpent.toFixed(2)}</p>
          </div>
          <div class="p-2.5 rounded-xl bg-[#222227] border border-[rgba(255,255,255,0.04)] text-center">
            <span class="text-[10px] uppercase text-[#6b6c77] font-semibold">Visits</span>
            <p class="font-bold text-white text-sm mt-0.5">${customer.visitCount}</p>
          </div>
          <div class="p-2.5 rounded-xl bg-[#222227] border border-[rgba(255,255,255,0.04)] text-center">
            <span class="text-[10px] uppercase text-[#6b6c77] font-semibold">Points</span>
            <p class="font-bold font-mono text-[#2dd4bf] text-sm mt-0.5">${customer.points}</p>
          </div>
          <div class="p-2.5 rounded-xl bg-[#222227] border border-[rgba(255,255,255,0.04)] text-center">
            <span class="text-[10px] uppercase text-[#6b6c77] font-semibold">Status</span>
            <p class="font-semibold text-xs mt-1 text-[#4ade80]">${customer.accountStatus || 'Active'}</p>
          </div>
        </div>
      </div>

      <!-- Staff Notes & Preferences -->
      <div class="p-6 space-y-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <label class="block text-xs font-semibold text-[#85858f] mb-1.5">Box Office Staff Notes</label>
          <textarea id="drawer-cust-notes" rows="2" class="w-full text-xs p-2.5 rounded-xl bg-[#222227] border border-[rgba(255,255,255,0.06)] focus:border-novaOrange focus:outline-none text-white">${escapeHtml(customer.notes || '')}</textarea>
          <div class="flex justify-end mt-1.5">
            <button id="btn-save-cust-notes" class="px-3 py-1.5 rounded-lg bg-novaOrange hover:bg-novaOrange-hover text-white text-xs font-semibold transition">Save Notes</button>
          </div>
        </div>

        <div>
          <span class="block text-xs font-semibold text-[#85858f] mb-1.5">Preferred Genres</span>
          <div class="flex flex-wrap gap-1.5">
            ${(customer.preferredGenres || ['Sci-Fi', 'Drama']).map(g => `
              <span class="px-2 py-0.5 rounded-full text-[10px] bg-[#222227] text-white border border-[rgba(255,255,255,0.06)]">${escapeHtml(g)}</span>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Reservation History Ledger for this customer -->
      <div class="p-6">
        <h4 class="font-bold text-sm text-white mb-3 flex items-center justify-between">
          <span>Booking History (${reservations.length})</span>
          <span class="text-xs text-[#85858f] font-normal">Click to reprint pass</span>
        </h4>
        <div class="space-y-2.5 max-h-72 overflow-y-auto">
          ${reservations.length > 0 ? reservations.map(r => {
            const st = Store.getShowtimeById(r.showtimeId);
            const mov = st ? Store.getMovieById(st.movieId) : null;
            return `
              <div class="p-3 rounded-xl bg-[#222227] border border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-xs text-novaOrange font-mono">${r.id}</span>
                    <span class="text-xs font-medium text-white">${mov ? escapeHtml(mov.title) : 'Movie'}</span>
                  </div>
                  <p class="text-[11px] text-[#85858f] mt-0.5">Seats: <span class="font-semibold text-white">${r.seats.join(", ")}</span> • $${r.totalAmount.toFixed(2)}</p>
                  <span class="text-[10px] text-[#6b6c77]">${r.createdAt}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${r.status === 'Confirmed' ? 'bg-[#22c55e]/20 text-[#4ade80]' : 'bg-rose-500/20 text-rose-400'}">${r.status}</span>
                  <button class="p-1.5 rounded-lg bg-[#1c1c21] hover:bg-[#2e2e38] text-[#85858f] hover:text-white btn-view-hist-ticket transition" data-id="${r.id}" title="View Ticket">
                    <i data-lucide="ticket" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>
            `;
          }).join("") : `<div class="text-xs text-[#85858f] text-center py-4">No reservations on file.</div>`}
        </div>
      </div>
    `;

    drawer.classList.remove("hidden");
    lucide.createIcons();

    // Close button
    document.getElementById("btn-close-cust-drawer")?.addEventListener("click", () => {
      drawer.classList.add("hidden");
    });

    // Save notes button
    document.getElementById("btn-save-cust-notes")?.addEventListener("click", () => {
      const notesVal = document.getElementById("drawer-cust-notes").value;
      Store.updateCustomer(customerId, { notes: notesVal });
      showToast("Customer notes updated", "success");
    });

    // View history ticket stub
    container.querySelectorAll(".btn-view-hist-ticket").forEach(btn => {
      btn.addEventListener("click", () => {
        showTicketStubModal(btn.dataset.id);
      });
    });
  }

  // ==========================================================================
  // MODULE G: BOOKING MANAGEMENT (PAGE 4)
  // ==========================================================================
  let reservationStatusFilter = "all";
  let reservationSearchQuery = "";

  function renderReservationsLedger() {
    const tableBody = document.getElementById("reservations-ledger-tbody");
    if (!tableBody) return;

    let reservations = Store.getReservations();

    if (reservationStatusFilter !== "all") {
      reservations = reservations.filter(r => 
        reservationStatusFilter === "confirmed" ? r.status === "Confirmed" : r.status.includes("Refunded")
      );
    }

    if (reservationSearchQuery) {
      const q = reservationSearchQuery.toLowerCase();
      reservations = reservations.filter(r => {
        const cust = Store.getCustomerById(r.customerId);
        const st = Store.getShowtimeById(r.showtimeId);
        const mov = st ? Store.getMovieById(st.movieId) : null;
        return (
          r.id.toLowerCase().includes(q) ||
          (cust && cust.name.toLowerCase().includes(q)) ||
          (mov && mov.title.toLowerCase().includes(q)) ||
          r.seats.some(s => s.toLowerCase().includes(q))
        );
      });
    }

    if (reservations.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" class="py-12 text-center text-[#85858f] text-xs">
            No bookings found matching the current search or status filter.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = reservations.map(r => {
      const customer = Store.getCustomerById(r.customerId);
      const showtime = Store.getShowtimeById(r.showtimeId);
      const movie = showtime ? Store.getMovieById(showtime.movieId) : null;
      const screen = showtime ? Store.getScreenById(showtime.screenId) : null;
      const isRefunded = r.status.includes("Refunded");

      return `
        <tr class="hover:bg-[#222227] transition">
          <td class="py-3 px-4 font-mono font-bold text-novaOrange">${r.id}</td>
          <td class="py-3 px-4 font-semibold text-white">
            <div class="flex items-center gap-2">
              <span>${customer ? escapeHtml(customer.name) : 'Guest Patron'}</span>
              <span class="pill-badge pill-orange text-[9px]">${customer ? customer.tier : 'Bronze'}</span>
            </div>
            <p class="text-[10px] text-[#6b6c77] font-normal">${customer ? customer.email : ''}</p>
          </td>
          <td class="py-3 px-4 font-semibold text-white">
            <div class="flex items-center gap-2">
              <img src="${movie ? movie.poster : ''}" class="w-6 h-8 rounded object-cover bg-[#18191d]" alt="" />
              <span>${movie ? escapeHtml(movie.title) : 'Movie'}</span>
            </div>
          </td>
          <td class="py-3 px-4 text-xs">
            <span class="text-white block font-medium">${screen ? screen.name : 'Screen'}</span>
            <p class="text-[10px] text-[#6b6c77]">${showtime ? showtime.date + ' @ ' + showtime.startTime : ''}</p>
          </td>
          <td class="py-3 px-4 font-mono font-semibold text-white">
            ${r.seats.map(s => `<span class="px-1.5 py-0.5 rounded bg-novaOrange/15 text-novaOrange text-[10px] mr-1">${s}</span>`).join("")}
          </td>
          <td class="py-3 px-4 font-mono font-bold text-white">$${r.totalAmount.toFixed(2)}</td>
          <td class="py-3 px-4 text-xs text-[#a0a0ab]">${r.paymentMethod}</td>
          <td class="py-3 px-4">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${isRefunded ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/30'}">
              ${r.status}
            </span>
          </td>
          <td class="py-3 px-4 text-right whitespace-nowrap">
            <button class="px-2.5 py-1 rounded-lg bg-[#222227] hover:bg-[#2c2c34] text-white text-xs font-medium mr-1.5 btn-ledger-ticket transition" data-id="${r.id}" title="View Digital Pass">
              Pass
            </button>
            <button 
              class="px-2.5 py-1 rounded-lg ${isRefunded ? 'bg-[#222227] text-[#6b6c77] cursor-not-allowed' : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'} text-xs font-medium btn-ledger-refund transition" 
              data-id="${r.id}"
              ${isRefunded ? 'disabled' : ''}
              title="${isRefunded ? 'Already Refunded' : 'Cancel Booking & Release Seats'}"
            >
              ${isRefunded ? 'Refunded' : 'Cancel'}
            </button>
          </td>
        </tr>
      `;
    }).join("");

    // Ledger actions
    tableBody.querySelectorAll(".btn-ledger-ticket").forEach(btn => {
      btn.addEventListener("click", () => {
        showTicketStubModal(btn.dataset.id);
      });
    });

    tableBody.querySelectorAll(".btn-ledger-refund").forEach(btn => {
      btn.addEventListener("click", () => {
        openRefundModal(btn.dataset.id);
      });
    });
  }

  // Reservations Search & Filter
  const resSearchInput = document.getElementById("reservation-search-filter");
  if (resSearchInput) {
    resSearchInput.addEventListener("input", (e) => {
      reservationSearchQuery = e.target.value.trim();
      renderReservationsLedger();
    });
  }

  document.querySelectorAll(".tab-res-filter").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-res-filter").forEach(t => t.classList.remove("active", "bg-[#26262d]", "text-white"));
      tab.classList.add("active", "bg-[#26262d]", "text-white");
      reservationStatusFilter = tab.dataset.status;
      renderReservationsLedger();
    });
  });

  // REFUND ACTION MODAL
  function openRefundModal(reservationId) {
    const reservation = Store.getReservationById(reservationId);
    if (!reservation) return;

    const modal = document.getElementById("refund-confirmation-modal");
    const detailsContainer = document.getElementById("refund-modal-details");
    const confirmBtn = document.getElementById("btn-confirm-refund-action");

    if (!modal || !detailsContainer) return;

    const showtime = Store.getShowtimeById(reservation.showtimeId);
    const movie = showtime ? Store.getMovieById(showtime.movieId) : null;
    const screen = showtime ? Store.getScreenById(showtime.screenId) : null;

    detailsContainer.innerHTML = `
      <div class="p-4 rounded-xl bg-[#17181c] border border-[rgba(255,255,255,0.06)] space-y-2.5 text-xs">
        <div class="flex justify-between">
          <span class="text-[#85858f]">Booking Reference:</span>
          <span class="font-mono font-bold text-novaOrange">${reservation.id}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-[#85858f]">Movie & Screen:</span>
          <span class="font-semibold text-white">${movie ? movie.title : ''} (${screen ? screen.name : ''})</span>
        </div>
        <div class="flex justify-between">
          <span class="text-[#85858f]">Seats to Release:</span>
          <span class="font-mono font-bold text-rose-400">${reservation.seats.join(", ")}</span>
        </div>
        <div class="flex justify-between border-t border-[rgba(255,255,255,0.06)] pt-2">
          <span class="text-[#85858f]">Refund Amount:</span>
          <span class="font-mono font-bold text-[#4ade80] text-sm">$${reservation.totalAmount.toFixed(2)}</span>
        </div>
      </div>
      <p class="text-[11px] text-amber-300/80 leading-relaxed mt-3">
        ⚠️ Warning: Confirming this action will immediately release seats <strong>[${reservation.seats.join(", ")}]</strong> back into open inventory and adjust daily revenue telemetry.
      </p>
    `;

    modal.classList.remove("hidden");

    confirmBtn.onclick = () => {
      try {
        Store.refundReservation(reservationId, "Patron cancellation at desk");
        showToast(`Refund for ${reservation.id} completed. Seats released.`, "success");
        modal.classList.add("hidden");
        renderReservationsLedger();
        updateHeaderPills();
        if (AppState.currentView === "boxoffice") renderBoxOffice();
        if (AppState.currentView === "overview") renderOverview();
      } catch (err) {
        showToast(err.message, "error");
      }
    };
  }

  const btnCloseRefundModal = document.getElementById("btn-close-refund-modal");
  if (btnCloseRefundModal) {
    btnCloseRefundModal.addEventListener("click", () => {
      document.getElementById("refund-confirmation-modal").classList.add("hidden");
    });
  }

  // ==========================================================================
  // MODULE H: PROFILE & SETTINGS (PAGE 7)
  // ==========================================================================
  function renderSettingsView() {
    const settings = Store.getSettings();
    const admin = settings.adminProfile || {
      name: "Marcus Vance",
      email: "marcus.vance@cinepulse.io",
      phone: "+1 (555) 019-2834",
      role: "Lead Operations & Sales Manager",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      department: "Box Office Telemetry & Sales",
      theatreComplex: "CinePulse Downtown Complex Alpha"
    };

    // 1. Populate Admin Profile Panel
    const adminName = document.getElementById("setting-admin-name");
    const adminEmail = document.getElementById("setting-admin-email");
    const adminPhone = document.getElementById("setting-admin-phone");
    const adminRole = document.getElementById("setting-admin-role");
    const adminComplex = document.getElementById("setting-admin-complex");
    const adminDept = document.getElementById("setting-admin-dept");
    const adminAvatar = document.getElementById("setting-admin-avatar");
    const avatarPreview = document.getElementById("admin-profile-avatar-preview");
    const nameHeading = document.getElementById("admin-profile-name-heading");
    const roleHeading = document.getElementById("admin-profile-role-heading");

    if (adminName) adminName.value = admin.name || "";
    if (adminEmail) adminEmail.value = admin.email || "";
    if (adminPhone) adminPhone.value = admin.phone || "";
    if (adminRole) adminRole.value = admin.role || "";
    if (adminComplex) adminComplex.value = admin.theatreComplex || "";
    if (adminDept) adminDept.value = admin.department || "";
    if (adminAvatar) adminAvatar.value = admin.avatar || "";
    if (avatarPreview && admin.avatar) avatarPreview.src = admin.avatar;
    if (nameHeading) nameHeading.textContent = admin.name || "Marcus Vance";
    if (roleHeading) roleHeading.textContent = admin.role || "Lead Operations Manager";

    // 2. Populate Notification Toggles
    const notifs = settings.notifications || {};
    const tHigh = document.getElementById("notif-toggle-highvalue");
    const tLow = document.getElementById("notif-toggle-lowcapacity");
    const tRef = document.getElementById("notif-toggle-refunds");
    const tDig = document.getElementById("notif-toggle-digest");
    const tChim = document.getElementById("notif-toggle-chimes");

    if (tHigh) tHigh.checked = notifs.highValueAlerts !== false;
    if (tLow) tLow.checked = notifs.lowCapacityAlerts !== false;
    if (tRef) tRef.checked = notifs.refundAlerts !== false;
    if (tDig) tDig.checked = notifs.dailyDigest === true;
    if (tChim) tChim.checked = notifs.soundChimes !== false;

    // 3. Populate Cinema Operational Parameters
    const nameInput = document.getElementById("setting-cinema-name");
    const locInput = document.getElementById("setting-cinema-location");
    const currInput = document.getElementById("setting-currency");
    const taxInput = document.getElementById("setting-tax-rate");
    const feeInput = document.getElementById("setting-booking-fee");
    const staffInput = document.getElementById("setting-active-staff");

    if (nameInput) nameInput.value = settings.cinemaName;
    if (locInput) locInput.value = settings.location;
    if (currInput) currInput.value = settings.currency;
    if (taxInput) taxInput.value = settings.taxRate;
    if (feeInput) feeInput.value = settings.bookingFee;
    if (staffInput) staffInput.value = settings.activeStaff;

    // Diagnostics
    const bytesUsed = new Blob([localStorage.getItem(DB_KEY) || ""]).size;
    const diagBytes = document.getElementById("diag-storage-size");
    const diagRecords = document.getElementById("diag-total-records");

    if (diagBytes) diagBytes.textContent = `${(bytesUsed / 1024).toFixed(1)} KB`;
    if (diagRecords) {
      const totalRecs = Store.getMovies().length + Store.getShowtimes().length + Store.getCustomers().length + Store.getReservations().length;
      diagRecords.textContent = `${totalRecs} active records`;
    }

    setupSettingsSubTabs();
  }

  function setupSettingsSubTabs() {
    document.querySelectorAll(".tab-settings-nav").forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll(".tab-settings-nav").forEach(t => {
          t.classList.remove("bg-[#24242a]", "text-white");
          t.classList.add("text-[#85858f]");
        });
        tab.classList.add("bg-[#24242a]", "text-white");
        tab.classList.remove("text-[#85858f]");

        const panelKey = tab.dataset.panel;
        document.querySelectorAll(".settings-subpanel").forEach(p => p.classList.add("hidden"));
        const activeP = document.getElementById(`settings-panel-${panelKey}`);
        if (activeP) activeP.classList.remove("hidden");
        lucide.createIcons();
      };
    });
  }

  // Save Admin Profile Handler
  const formAdminProfile = document.getElementById("form-admin-profile");
  if (formAdminProfile) {
    formAdminProfile.addEventListener("submit", (e) => {
      e.preventDefault();
      const updatedProfile = {
        name: document.getElementById("setting-admin-name").value.trim(),
        email: document.getElementById("setting-admin-email").value.trim(),
        phone: document.getElementById("setting-admin-phone").value.trim(),
        role: document.getElementById("setting-admin-role").value.trim(),
        theatreComplex: document.getElementById("setting-admin-complex").value.trim(),
        department: document.getElementById("setting-admin-dept").value.trim(),
        avatar: document.getElementById("setting-admin-avatar").value.trim()
      };
      Store.updateAdminProfile(updatedProfile);
      showToast("Administrator profile updated successfully", "success");
      renderSettingsView();
    });
  }

  // Save Password Handler
  const formAdminPassword = document.getElementById("form-admin-password");
  if (formAdminPassword) {
    formAdminPassword.addEventListener("submit", (e) => {
      e.preventDefault();
      const oldPass = document.getElementById("setting-old-password").value;
      const newPass = document.getElementById("setting-new-password").value;
      const confPass = document.getElementById("setting-confirm-password").value;

      if (newPass !== confPass) {
        showToast("New passwords do not match. Please verify.", "error");
        return;
      }

      try {
        Store.changeAdminPassword(oldPass, newPass);
        showToast("Admin account password successfully rotated", "success");
        formAdminPassword.reset();
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // Save Notification Preferences
  const btnSaveNotifications = document.getElementById("btn-save-notifications");
  if (btnSaveNotifications) {
    btnSaveNotifications.addEventListener("click", () => {
      const prefs = {
        highValueAlerts: document.getElementById("notif-toggle-highvalue").checked,
        lowCapacityAlerts: document.getElementById("notif-toggle-lowcapacity").checked,
        refundAlerts: document.getElementById("notif-toggle-refunds").checked,
        dailyDigest: document.getElementById("notif-toggle-digest").checked,
        soundChimes: document.getElementById("notif-toggle-chimes").checked
      };
      Store.updateNotificationPreferences(prefs);
      showToast("Operational notification preferences saved", "success");
    });
  }

  // Reset to Demo Data
  const btnResetDemo = document.getElementById("btn-reset-demo-data");
  if (btnResetDemo) {
    btnResetDemo.addEventListener("click", () => {
      if (confirm("Reset CinePulse to default factory demo dataset? All recent modifications will be restored to standard state.")) {
        Store.resetToDemo();
        showToast("Database reset to factory demo records", "success");
        switchView("overview");
      }
    });
  }

  // ==========================================================================
  // MODALS MANAGEMENT: ADD MOVIE, ADD SHOWTIME, ADD CUSTOMER
  // ==========================================================================
  function setupModals() {
    // Setup generic modal dismiss buttons
    document.querySelectorAll(".modal-dismiss-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        btn.closest(".modal-wrapper").classList.add("hidden");
      });
    });
  }

  // ADD / EDIT MOVIE MODAL
  function openAddMovieModal() {
    const modal = document.getElementById("modal-movie-form");
    const titleEl = document.getElementById("modal-movie-title");
    const form = document.getElementById("form-movie");
    if (!modal || !form) return;

    titleEl.textContent = "Add New Movie to Catalog";
    form.reset();
    form.dataset.mode = "create";
    document.getElementById("movie-input-id").value = "";
    document.getElementById("movie-input-releasedate").value = new Date().toISOString().split("T")[0];
    modal.classList.remove("hidden");
  }

  function openEditMovieModal(movieId) {
    const movie = Store.getMovieById(movieId);
    if (!movie) return;

    const modal = document.getElementById("modal-movie-form");
    const titleEl = document.getElementById("modal-movie-title");
    const form = document.getElementById("form-movie");

    titleEl.textContent = `Edit Movie: ${movie.title}`;
    form.dataset.mode = "edit";
    form.dataset.id = movieId;

    document.getElementById("movie-input-id").value = movieId;
    document.getElementById("movie-input-title").value = movie.title;
    document.getElementById("movie-input-genre").value = movie.genre;
    document.getElementById("movie-input-duration").value = movie.duration;
    document.getElementById("movie-input-rating").value = movie.rating;
    document.getElementById("movie-input-price").value = movie.basePrice;
    document.getElementById("movie-input-poster").value = movie.poster;
    document.getElementById("movie-input-director").value = movie.director || "";
    document.getElementById("movie-input-releasedate").value = movie.releaseDate || new Date().toISOString().split("T")[0];
    document.getElementById("movie-input-status").value = movie.status;
    document.getElementById("movie-input-synopsis").value = movie.synopsis || "";

    modal.classList.remove("hidden");
  }

  const formMovie = document.getElementById("form-movie");
  if (formMovie) {
    formMovie.addEventListener("submit", (e) => {
      e.preventDefault();
      const movieData = {
        title: document.getElementById("movie-input-title").value.trim(),
        genre: document.getElementById("movie-input-genre").value.trim(),
        duration: parseInt(document.getElementById("movie-input-duration").value, 10) || 120,
        rating: document.getElementById("movie-input-rating").value,
        basePrice: parseFloat(document.getElementById("movie-input-price").value) || 16.50,
        poster: document.getElementById("movie-input-poster").value.trim() || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&auto=format&fit=crop&q=80",
        director: document.getElementById("movie-input-director").value.trim() || "Studio Director",
        releaseDate: document.getElementById("movie-input-releasedate").value || new Date().toISOString().split("T")[0],
        status: document.getElementById("movie-input-status").value,
        synopsis: document.getElementById("movie-input-synopsis").value.trim()
      };

      if (formMovie.dataset.mode === "edit") {
        Store.updateMovie(formMovie.dataset.id, movieData);
        showToast("Movie updated", "success");
      } else {
        Store.addMovie(movieData);
        showToast("New movie added", "success");
      }

      document.getElementById("modal-movie-form").classList.add("hidden");
      renderMoviesCatalog();
    });
  }

  // ADD SHOWTIME MODAL WITH REAL-TIME CONFLICT DETECTOR
  function openAddShowtimeModal(preselectedMovieId = null) {
    const modal = document.getElementById("modal-showtime-form");
    const form = document.getElementById("form-showtime");
    if (!modal || !form) return;

    form.reset();
    document.getElementById("st-conflict-alert").classList.add("hidden");

    // Populate Movies dropdown
    const movieSelect = document.getElementById("st-input-movie");
    movieSelect.innerHTML = Store.getMovies().map(m => `
      <option value="${m.id}" ${preselectedMovieId === m.id ? 'selected' : ''}>
        ${escapeHtml(m.title)} (${m.duration} mins - ${m.rating})
      </option>
    `).join("");

    // Populate Screens dropdown
    const screenSelect = document.getElementById("st-input-screen");
    screenSelect.innerHTML = Store.getScreens().map(s => `
      <option value="${s.id}">
        ${escapeHtml(s.name)} (${s.totalSeats} seats)
      </option>
    `).join("");

    // Set default date to today
    document.getElementById("st-input-date").value = new Date().toISOString().split("T")[0];
    document.getElementById("st-input-start").value = "18:00";
    calculateShowtimeEndTime();

    modal.classList.remove("hidden");
  }

  function calculateShowtimeEndTime() {
    const movieId = document.getElementById("st-input-movie").value;
    const startTime = document.getElementById("st-input-start").value;
    if (!movieId || !startTime) return;

    const movie = Store.getMovieById(movieId);
    if (!movie) return;

    const [h, m] = startTime.split(":").map(Number);
    const totalMinutes = h * 60 + m + movie.duration;
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    const formattedEnd = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    document.getElementById("st-input-end").value = formattedEnd;

    // Check conflict live
    checkConflictLive();
  }

  document.getElementById("st-input-movie")?.addEventListener("change", calculateShowtimeEndTime);
  document.getElementById("st-input-start")?.addEventListener("input", calculateShowtimeEndTime);
  document.getElementById("st-input-screen")?.addEventListener("change", checkConflictLive);
  document.getElementById("st-input-date")?.addEventListener("change", checkConflictLive);

  function checkConflictLive() {
    const screenId = document.getElementById("st-input-screen").value;
    const date = document.getElementById("st-input-date").value;
    const start = document.getElementById("st-input-start").value;
    const end = document.getElementById("st-input-end").value;
    const alertBox = document.getElementById("st-conflict-alert");

    if (!screenId || !date || !start || !end) return;

    const conflict = Store.checkShowtimeConflict(screenId, date, start, end);
    if (conflict.conflict) {
      alertBox.textContent = `⚠️ Scheduling Conflict: ${conflict.message}`;
      alertBox.classList.remove("hidden");
    } else {
      alertBox.classList.add("hidden");
    }
  }

  const formShowtime = document.getElementById("form-showtime");
  if (formShowtime) {
    formShowtime.addEventListener("submit", (e) => {
      e.preventDefault();
      const stData = {
        movieId: document.getElementById("st-input-movie").value,
        screenId: document.getElementById("st-input-screen").value,
        date: document.getElementById("st-input-date").value,
        startTime: document.getElementById("st-input-start").value,
        endTime: document.getElementById("st-input-end").value,
        priceMultiplier: parseFloat(document.getElementById("st-input-multiplier").value) || 1.0
      };

      try {
        Store.addShowtime(stData);
        showToast("Showtime successfully scheduled!", "success");
        document.getElementById("modal-showtime-form").classList.add("hidden");
        renderShowtimesSchedule();
        if (AppState.currentView === "overview") renderOverview();
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // ADD CUSTOMER MODAL
  function openAddCustomerModal() {
    const modal = document.getElementById("modal-customer-form");
    const form = document.getElementById("form-customer");
    if (!modal || !form) return;
    form.reset();
    modal.classList.remove("hidden");
  }

  const formCustomer = document.getElementById("form-customer");
  if (formCustomer) {
    formCustomer.addEventListener("submit", (e) => {
      e.preventDefault();
      const custData = {
        name: document.getElementById("cust-input-name").value,
        email: document.getElementById("cust-input-email").value,
        phone: document.getElementById("cust-input-phone").value,
        tier: document.getElementById("cust-input-tier").value,
        notes: document.getElementById("cust-input-notes").value
      };

      try {
        Store.addCustomer(custData);
        showToast(`Customer ${custData.name} enrolled (+50 welcome pts)`, "success");
        document.getElementById("modal-customer-form").classList.add("hidden");
        renderCustomerCRM();
        populateDrawerCustomers();
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // ==========================================================================
  // TOAST NOTIFICATION UTILITY
  // ==========================================================================
  function showToast(message, type = "info") {
    const container = document.getElementById("toast-notifications-container");
    if (!container) return;

    const toast = document.createElement("div");
    let bg = "bg-slate-900 border-slate-700 text-slate-100";
    let icon = "info";

    if (type === "success") {
      bg = "bg-emerald-950/90 border-emerald-500/50 text-emerald-100";
      icon = "check-circle";
    } else if (type === "error") {
      bg = "bg-rose-950/90 border-rose-500/50 text-rose-100";
      icon = "alert-circle";
    }

    toast.className = `flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md text-xs font-semibold ${bg} slide-in-right`;
    toast.innerHTML = `
      <i data-lucide="${icon}" class="w-4 h-4 flex-shrink-0"></i>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Start Application
  initApp();
});
