/**
 * CinePulse Admin - State Management & Data Store
 * Fully self-contained local storage persistence engine with rich mock seeding.
 */

const DB_KEY = "CINEPULSE_CRM_DB_V2";

// Default Initial Mock Data
const INITIAL_DEMO_DATA = {
  settings: {
    cinemaName: "CinePulse Grand Cinema & IMAX",
    location: "Screen Complex Alpha, Downtown",
    currency: "$",
    taxRate: 8.5,
    bookingFee: 1.50,
    shiftName: "Evening Peak Shift",
    activeStaff: "Marcus Vance (Box Office Lead)",
    adminProfile: {
      name: "Marcus Vance",
      email: "marcus.vance@cinepulse.io",
      phone: "+1 (555) 019-2834",
      role: "Lead Operations & Sales Manager",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      department: "Box Office Telemetry & Sales",
      theatreComplex: "CinePulse Downtown Complex Alpha"
    },
    notifications: {
      highValueAlerts: true,
      lowCapacityAlerts: true,
      refundAlerts: true,
      dailyDigest: false,
      soundChimes: true
    }
  },
  theatres: [
    {
      id: "th-1",
      name: "CinePulse Downtown Complex",
      location: "742 Evergreen Blvd, Downtown District",
      city: "Metro City",
      totalScreens: 2,
      status: "Active",
      phone: "+1 (555) 234-5678",
      manager: "Marcus Vance"
    },
    {
      id: "th-2",
      name: "CinePulse Uptown Luxe Promenade",
      location: "88 Ocean Drive, West Promenade",
      city: "Uptown",
      totalScreens: 1,
      status: "Active",
      phone: "+1 (555) 876-5432",
      manager: "Elena Rostova"
    }
  ],
  screens: [
    {
      id: "scr-1",
      theatreId: "th-1",
      theatreName: "CinePulse Downtown Complex",
      name: "Screen 1 - IMAX Laser 4K",
      type: "IMAX Laser",
      availability: "Available",
      totalSeats: 80,
      rows: 8, // A to H
      cols: 10, // 1 to 10
      pricing: { vip: 22.00, standard: 16.50, accessible: 15.00 },
      tiers: {
        vipRows: ["A", "B"],
        standardRows: ["C", "D", "E", "F", "G"],
        accessibleRows: ["H"]
      }
    },
    {
      id: "scr-2",
      theatreId: "th-1",
      theatreName: "CinePulse Downtown Complex",
      name: "Screen 2 - Dolby Atmos Prime",
      type: "Dolby Atmos",
      availability: "Available",
      totalSeats: 60,
      rows: 6, // A to F
      cols: 10,
      pricing: { vip: 20.00, standard: 15.50, accessible: 14.00 },
      tiers: {
        vipRows: ["A", "B"],
        standardRows: ["C", "D", "E"],
        accessibleRows: ["F"]
      }
    },
    {
      id: "scr-3",
      theatreId: "th-2",
      theatreName: "CinePulse Uptown Luxe Promenade",
      name: "Screen 3 - Luxe Recliner Studio",
      type: "VIP Lounge",
      availability: "Maintenance",
      totalSeats: 40,
      rows: 4, // A to D
      cols: 10,
      pricing: { vip: 25.00, standard: 22.00, accessible: 20.00 },
      tiers: {
        vipRows: ["A", "B", "C", "D"],
        standardRows: [],
        accessibleRows: []
      }
    }
  ],
  movies: [
    {
      id: "mov-1",
      title: "Oppenheimer",
      genre: "Biography / Drama",
      duration: 180,
      rating: "R",
      director: "Christopher Nolan",
      poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
      status: "Active",
      basePrice: 16.50,
      synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb."
    },
    {
      id: "mov-2",
      title: "Dune: Part Two",
      genre: "Sci-Fi / Adventure",
      duration: 166,
      rating: "PG-13",
      director: "Denis Villeneuve",
      poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
      status: "Active",
      basePrice: 17.00,
      synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family."
    },
    {
      id: "mov-3",
      title: "Spider-Man: Across the Spider-Verse",
      genre: "Animation / Action",
      duration: 140,
      rating: "PG",
      director: "Joaquim Dos Santos",
      poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80",
      status: "Active",
      basePrice: 15.00,
      synopsis: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence."
    },
    {
      id: "mov-4",
      title: "Interstellar (10th Anniv. IMAX)",
      genre: "Sci-Fi / Drama",
      duration: 169,
      rating: "PG-13",
      director: "Christopher Nolan",
      poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
      status: "Active",
      basePrice: 18.00,
      synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
    },
    {
      id: "mov-5",
      title: "Past Lives",
      genre: "Romance / Drama",
      duration: 106,
      rating: "PG-13",
      director: "Celine Song",
      poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      status: "Active",
      basePrice: 14.50,
      synopsis: "Nora and Hae Sung, two deeply connected childhood friends, are reunited in New York for one fateful week."
    },
    {
      id: "mov-6",
      title: "Blade Runner 2049",
      genre: "Cyberpunk / Sci-Fi",
      duration: 164,
      rating: "R",
      director: "Denis Villeneuve",
      poster: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80",
      status: "Active",
      basePrice: 15.50,
      synopsis: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard."
    },
    {
      id: "mov-7",
      title: "Gladiator II",
      genre: "Action / Epic",
      duration: 148,
      rating: "R",
      director: "Ridley Scott",
      poster: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=600&auto=format&fit=crop&q=80",
      status: "Coming Soon",
      basePrice: 16.50,
      synopsis: "Years after witnessing the death of Maximus, Lucius must enter the Colosseum after his home is conquered by tyrannical emperors."
    }
  ],
  customers: [
    {
      id: "cust-1",
      name: "Elena Rostova",
      email: "elena.rostova@nexus.com",
      phone: "+1 (555) 392-1084",
      tier: "Platinum",
      totalSpent: 624.50,
      points: 1240,
      visitCount: 18,
      preferredGenres: ["Sci-Fi", "Drama"],
      notes: "Prefers row B center recliners. Regular at Thursday evening IMAX screenings.",
      lastVisit: "2026-10-22",
      joinDate: "2024-03-15"
    },
    {
      id: "cust-2",
      name: "Marcus Sterling",
      email: "m.sterling@fintech.io",
      phone: "+1 (555) 782-9912",
      tier: "Gold",
      totalSpent: 432.00,
      points: 860,
      visitCount: 12,
      preferredGenres: ["Action", "Sci-Fi"],
      notes: "Frequent corporate walk-in guest. Always requests receipt for expense filing.",
      lastVisit: "2026-10-21",
      joinDate: "2024-06-20"
    },
    {
      id: "cust-3",
      name: "Sarah Jenkins",
      email: "sarah.j@creativemedia.org",
      phone: "+1 (555) 412-8874",
      tier: "Platinum",
      totalSpent: 785.00,
      points: 1570,
      visitCount: 22,
      preferredGenres: ["Drama", "Indie", "Biography"],
      notes: "Cinephile club organizer. Often books 4-6 seats together on opening weekends.",
      lastVisit: "2026-10-22",
      joinDate: "2023-11-04"
    },
    {
      id: "cust-4",
      name: "Liam O'Connor",
      email: "liam.oconnor@skyline.ie",
      phone: "+1 (555) 901-3345",
      tier: "Silver",
      totalSpent: 215.50,
      points: 430,
      visitCount: 7,
      preferredGenres: ["Sci-Fi", "Thriller"],
      notes: "Allergic to dairy concessions (almond milk only).",
      lastVisit: "2026-10-18",
      joinDate: "2025-01-12"
    },
    {
      id: "cust-5",
      name: "Priya Sharma",
      email: "priya.sharma@horizon.dev",
      phone: "+1 (555) 674-2201",
      tier: "Gold",
      totalSpent: 388.00,
      points: 770,
      visitCount: 11,
      preferredGenres: ["Animation", "Drama"],
      notes: "Loves animated film releases and festival showcases.",
      lastVisit: "2026-10-22",
      joinDate: "2024-08-30"
    },
    {
      id: "cust-6",
      name: "David Chen",
      email: "dchen@apexarch.com",
      phone: "+1 (555) 234-9081",
      tier: "Bronze",
      totalSpent: 112.00,
      points: 220,
      visitCount: 3,
      preferredGenres: ["Action", "Sci-Fi"],
      notes: "Prefers aisle seating on row D or E.",
      lastVisit: "2026-10-15",
      joinDate: "2025-05-19"
    },
    {
      id: "cust-7",
      name: "Amara Okafor",
      email: "amara.okafor@biotech.org",
      phone: "+1 (555) 543-1129",
      tier: "Gold",
      totalSpent: 470.50,
      points: 940,
      visitCount: 13,
      preferredGenres: ["Biography", "Historical"],
      notes: "Student discount verified until Dec 2026.",
      lastVisit: "2026-10-20",
      joinDate: "2024-04-10"
    },
    {
      id: "cust-8",
      name: "Julian Vance",
      email: "julian.vance@soundlab.net",
      phone: "+1 (555) 887-4432",
      tier: "Platinum",
      totalSpent: 890.00,
      points: 1780,
      visitCount: 25,
      preferredGenres: ["Sci-Fi", "Music", "IMAX"],
      notes: "Sound technician; insists on Dolby Atmos center sweet-spot (Row C seats 5-6).",
      lastVisit: "2026-10-22",
      joinDate: "2023-09-18"
    },
    {
      id: "cust-9",
      name: "Chloe Dubois",
      email: "chloe.dubois@parisien.fr",
      phone: "+1 (555) 332-9012",
      tier: "Silver",
      totalSpent: 195.00,
      points: 390,
      visitCount: 6,
      preferredGenres: ["Romance", "Drama"],
      notes: "Prefers subtitles/open captions when available.",
      lastVisit: "2026-10-14",
      joinDate: "2025-02-08"
    },
    {
      id: "cust-10",
      name: "Hiroshi Tanaka",
      email: "tanaka.hiroshi@globalai.jp",
      phone: "+1 (555) 765-8833",
      tier: "Bronze",
      totalSpent: 88.00,
      points: 175,
      visitCount: 2,
      preferredGenres: ["Animation", "Cyberpunk"],
      notes: "Visiting researcher. Registered with international card.",
      lastVisit: "2026-10-10",
      joinDate: "2025-08-22"
    },
    {
      id: "cust-11",
      name: "Maya Lin",
      email: "maya.lin@urbanart.org",
      phone: "+1 (555) 449-0123",
      tier: "Silver",
      totalSpent: 260.00,
      points: 520,
      visitCount: 8,
      preferredGenres: ["Documentary", "Indie"],
      notes: "Weekend afternoon regular.",
      lastVisit: "2026-10-19",
      joinDate: "2024-12-01"
    },
    {
      id: "cust-12",
      name: "Carlos Rodriguez",
      email: "carlos.r@velocity.mx",
      phone: "+1 (555) 890-4411",
      tier: "Bronze",
      totalSpent: 135.00,
      points: 270,
      visitCount: 4,
      preferredGenres: ["Action", "Comedy"],
      notes: "Walk-in box office customer.",
      lastVisit: "2026-10-16",
      joinDate: "2025-04-14"
    },
    {
      id: "cust-13",
      name: "Zoe Kravitz-Miller",
      email: "zoe.km@voguefashion.com",
      phone: "+1 (555) 678-2299",
      tier: "Gold",
      totalSpent: 510.00,
      points: 1020,
      visitCount: 14,
      preferredGenres: ["Drama", "Fashion", "Sci-Fi"],
      notes: "Frequent Screen 3 Luxe Recliner patron.",
      lastVisit: "2026-10-22",
      joinDate: "2024-05-11"
    },
    {
      id: "cust-14",
      name: "Arthur Pendleton",
      email: "arthur.p@heritage.uk",
      phone: "+1 (555) 123-7744",
      tier: "Bronze",
      totalSpent: 54.00,
      points: 100,
      visitCount: 1,
      preferredGenres: ["Historical", "Epic"],
      notes: "Wheelchair accessible Row H seat patron.",
      lastVisit: "2026-10-21",
      joinDate: "2025-10-01"
    },
    {
      id: "cust-15",
      name: "Naomi Watts-Cole",
      email: "naomi.w@cinemaarts.edu",
      phone: "+1 (555) 987-6543",
      tier: "Platinum",
      totalSpent: 730.00,
      points: 1460,
      visitCount: 20,
      preferredGenres: ["Drama", "Sci-Fi", "Thriller"],
      notes: "Film Studies department faculty. Frequently attends director Q&As.",
      lastVisit: "2026-10-22",
      joinDate: "2023-10-15"
    },
    {
      id: "cust-16",
      name: "Walk-in Box Office Guest",
      email: "guest@cinepulse-walkin.com",
      phone: "+1 (555) 000-0000",
      tier: "Bronze",
      totalSpent: 940.00,
      points: 0,
      visitCount: 35,
      preferredGenres: ["General"],
      notes: "System default profile for anonymous walk-in purchases.",
      lastVisit: "2026-10-22",
      joinDate: "2024-01-01"
    }
  ],
  showtimes: [
    {
      id: "st-101",
      movieId: "mov-1", // Oppenheimer
      screenId: "scr-1",
      date: "2026-10-22",
      startTime: "14:00",
      endTime: "17:15",
      priceMultiplier: 1.0,
      status: "Active",
      bookedSeats: ["B3", "B4", "C4", "C5", "C6", "D4", "D5", "E7", "E8", "F3", "F4", "F5"]
    },
    {
      id: "st-102",
      movieId: "mov-2", // Dune: Part Two
      screenId: "scr-1",
      date: "2026-10-22",
      startTime: "18:00",
      endTime: "20:55",
      priceMultiplier: 1.1,
      status: "Active",
      bookedSeats: [
        "A4", "A5", "A6", "B4", "B5", "B6", "B7",
        "C3", "C4", "C5", "C6", "C7", "C8",
        "D4", "D5", "D6", "D7",
        "E3", "E4", "E5", "E6",
        "F4", "F5", "F6",
        "G4", "G5"
      ]
    },
    {
      id: "st-103",
      movieId: "mov-3", // Across the Spider-Verse
      screenId: "scr-2",
      date: "2026-10-22",
      startTime: "15:30",
      endTime: "18:00",
      priceMultiplier: 1.0,
      status: "Active",
      bookedSeats: ["B2", "B3", "B4", "C5", "C6", "C7", "D3", "D4", "E5", "E6"]
    },
    {
      id: "st-104",
      movieId: "mov-4", // Interstellar IMAX
      screenId: "scr-1",
      date: "2026-10-22",
      startTime: "21:30",
      endTime: "00:30",
      priceMultiplier: 1.15,
      status: "Active",
      bookedSeats: [
        "A3", "A4", "B3", "B4", "B5", "B6",
        "C4", "C5", "C6", "C7",
        "D4", "D5", "D6", "D7",
        "E4", "E5", "E6", "E7",
        "F5", "F6"
      ]
    },
    {
      id: "st-105",
      movieId: "mov-5", // Past Lives
      screenId: "scr-3",
      date: "2026-10-22",
      startTime: "16:15",
      endTime: "18:15",
      priceMultiplier: 1.0,
      status: "Active",
      bookedSeats: ["A3", "A4", "B4", "B5", "C3", "C4", "C5", "D4", "D5"]
    },
    {
      id: "st-106",
      movieId: "mov-6", // Blade Runner 2049
      screenId: "scr-2",
      date: "2026-10-22",
      startTime: "19:00",
      endTime: "21:55",
      priceMultiplier: 1.05,
      status: "Active",
      bookedSeats: ["A4", "A5", "B4", "B5", "C4", "C5", "C6", "D4", "D5", "E3", "E4"]
    },
    {
      id: "st-107",
      movieId: "mov-2", // Dune: Part Two
      screenId: "scr-1",
      date: "2026-10-23",
      startTime: "15:00",
      endTime: "17:55",
      priceMultiplier: 1.0,
      status: "Active",
      bookedSeats: ["C4", "C5", "D5", "D6"]
    },
    {
      id: "st-108",
      movieId: "mov-1", // Oppenheimer
      screenId: "scr-1",
      date: "2026-10-23",
      startTime: "19:00",
      endTime: "22:15",
      priceMultiplier: 1.1,
      status: "Active",
      bookedSeats: ["B4", "B5", "C5", "C6", "D5"]
    },
    {
      id: "st-109",
      movieId: "mov-4", // Interstellar
      screenId: "scr-3",
      date: "2026-10-22",
      startTime: "20:00",
      endTime: "23:00",
      priceMultiplier: 1.2,
      status: "Active",
      bookedSeats: ["A1", "A2", "B3", "B4", "C1", "C2", "C3", "D1", "D2"]
    }
  ],
  reservations: [
    {
      id: "CP-1001",
      customerId: "cust-1",
      showtimeId: "st-102",
      seats: ["B4", "B5"],
      seatTier: "VIP Recliner",
      subtotal: 48.40,
      fee: 3.00,
      tax: 4.37,
      totalAmount: 55.77,
      paymentMethod: "Credit Card",
      status: "Confirmed",
      bookedBy: "Marcus Vance",
      createdAt: "2026-10-22 10:14:22"
    },
    {
      id: "CP-1002",
      customerId: "cust-3",
      showtimeId: "st-102",
      seats: ["C4", "C5", "C6"],
      seatTier: "Standard",
      subtotal: 54.45,
      fee: 4.50,
      tax: 5.01,
      totalAmount: 63.96,
      paymentMethod: "Apple Pay",
      status: "Confirmed",
      bookedBy: "Marcus Vance",
      createdAt: "2026-10-22 11:20:05"
    },
    {
      id: "CP-1003",
      customerId: "cust-8",
      showtimeId: "st-104",
      seats: ["C5", "C6"],
      seatTier: "Standard",
      subtotal: 37.95,
      fee: 3.00,
      tax: 3.48,
      totalAmount: 44.43,
      paymentMethod: "Credit Card",
      status: "Confirmed",
      bookedBy: "Elena Rostova (Self)",
      createdAt: "2026-10-22 11:45:10"
    },
    {
      id: "CP-1004",
      customerId: "cust-2",
      showtimeId: "st-101",
      seats: ["B3", "B4"],
      seatTier: "VIP Recliner",
      subtotal: 44.00,
      fee: 3.00,
      tax: 4.00,
      totalAmount: 51.00,
      paymentMethod: "Corporate Card",
      status: "Confirmed",
      bookedBy: "Box Office Terminal 1",
      createdAt: "2026-10-22 12:05:40"
    },
    {
      id: "CP-1005",
      customerId: "cust-5",
      showtimeId: "st-103",
      seats: ["C5", "C6"],
      seatTier: "Standard",
      subtotal: 30.00,
      fee: 3.00,
      tax: 2.81,
      totalAmount: 35.81,
      paymentMethod: "UPI / QR",
      status: "Confirmed",
      bookedBy: "Box Office Terminal 2",
      createdAt: "2026-10-22 12:30:19"
    },
    {
      id: "CP-1006",
      customerId: "cust-13",
      showtimeId: "st-105",
      seats: ["A3", "A4"],
      seatTier: "VIP Lounge",
      subtotal: 50.00,
      fee: 3.00,
      tax: 4.51,
      totalAmount: 57.51,
      paymentMethod: "Credit Card",
      status: "Confirmed",
      bookedBy: "Marcus Vance",
      createdAt: "2026-10-22 13:10:45"
    },
    {
      id: "CP-1007",
      customerId: "cust-15",
      showtimeId: "st-104",
      seats: ["B4", "B5"],
      seatTier: "VIP Recliner",
      subtotal: 50.60,
      fee: 3.00,
      tax: 4.56,
      totalAmount: 58.16,
      paymentMethod: "Credit Card",
      status: "Confirmed",
      bookedBy: "Box Office Terminal 1",
      createdAt: "2026-10-22 13:40:12"
    },
    {
      id: "CP-1008",
      customerId: "cust-16", // Walk-in Guest
      showtimeId: "st-102",
      seats: ["D5", "D6"],
      seatTier: "Standard",
      subtotal: 36.30,
      fee: 3.00,
      tax: 3.34,
      totalAmount: 42.64,
      paymentMethod: "Cash",
      status: "Confirmed",
      bookedBy: "Box Office Walk-in",
      createdAt: "2026-10-22 14:02:18"
    },
    {
      id: "CP-1009",
      customerId: "cust-7",
      showtimeId: "st-101",
      seats: ["E7", "E8"],
      seatTier: "Standard",
      subtotal: 33.00,
      fee: 3.00,
      tax: 3.06,
      totalAmount: 39.06,
      paymentMethod: "Debit Card",
      status: "Confirmed",
      bookedBy: "Box Office Terminal 2",
      createdAt: "2026-10-22 14:22:50"
    },
    {
      id: "CP-1010",
      customerId: "cust-6",
      showtimeId: "st-106",
      seats: ["C4", "C5"],
      seatTier: "Standard",
      subtotal: 32.55,
      fee: 3.00,
      tax: 3.02,
      totalAmount: 38.57,
      paymentMethod: "Google Pay",
      status: "Confirmed",
      bookedBy: "Box Office Terminal 1",
      createdAt: "2026-10-22 14:45:00"
    },
    {
      id: "CP-1011",
      customerId: "cust-14",
      showtimeId: "st-101",
      seats: ["F3", "F4", "F5"],
      seatTier: "Standard",
      subtotal: 49.50,
      fee: 4.50,
      tax: 4.59,
      totalAmount: 58.59,
      paymentMethod: "Credit Card",
      status: "Confirmed",
      bookedBy: "Marcus Vance",
      createdAt: "2026-10-22 15:02:11"
    },
    {
      id: "CP-1012",
      customerId: "cust-4",
      showtimeId: "st-103",
      seats: ["B2", "B3"],
      seatTier: "VIP Recliner",
      subtotal: 40.00,
      fee: 3.00,
      tax: 3.66,
      totalAmount: 46.66,
      paymentMethod: "Apple Pay",
      status: "Confirmed",
      bookedBy: "Box Office Terminal 2",
      createdAt: "2026-10-22 15:15:33"
    },
    {
      id: "CP-1013",
      customerId: "cust-11",
      showtimeId: "st-105",
      seats: ["B4", "B5"],
      seatTier: "VIP Lounge",
      subtotal: 50.00,
      fee: 3.00,
      tax: 4.51,
      totalAmount: 57.51,
      paymentMethod: "Credit Card",
      status: "Confirmed",
      bookedBy: "Marcus Vance",
      createdAt: "2026-10-22 15:30:20"
    },
    {
      id: "CP-1014",
      customerId: "cust-12",
      showtimeId: "st-106",
      seats: ["D4", "D5"],
      seatTier: "Standard",
      subtotal: 32.55,
      fee: 3.00,
      tax: 3.02,
      totalAmount: 38.57,
      paymentMethod: "Cash",
      status: "Confirmed",
      bookedBy: "Box Office Walk-in",
      createdAt: "2026-10-22 15:42:05"
    },
    {
      id: "CP-1015",
      customerId: "cust-10",
      showtimeId: "st-109",
      seats: ["A1", "A2"],
      seatTier: "VIP Lounge",
      subtotal: 60.00,
      fee: 3.00,
      tax: 5.36,
      totalAmount: 68.36,
      paymentMethod: "Credit Card",
      status: "Confirmed",
      bookedBy: "Marcus Vance",
      createdAt: "2026-10-22 15:50:18"
    },
    // Past reservations for history & analytics
    {
      id: "CP-1016",
      customerId: "cust-1",
      showtimeId: "st-101",
      seats: ["C4", "C5"],
      seatTier: "Standard",
      subtotal: 33.00,
      fee: 3.00,
      tax: 3.06,
      totalAmount: 39.06,
      paymentMethod: "Credit Card",
      status: "Confirmed",
      bookedBy: "Online Portal",
      createdAt: "2026-10-21 16:30:00"
    },
    {
      id: "CP-1017",
      customerId: "cust-3",
      showtimeId: "st-104",
      seats: ["D5", "D6"],
      seatTier: "Standard",
      subtotal: 37.95,
      fee: 3.00,
      tax: 3.48,
      totalAmount: 44.43,
      paymentMethod: "Apple Pay",
      status: "Confirmed",
      bookedBy: "Online Portal",
      createdAt: "2026-10-21 18:45:00"
    },
    {
      id: "CP-1018",
      customerId: "cust-2",
      showtimeId: "st-106",
      seats: ["B4", "B5"],
      seatTier: "VIP Recliner",
      subtotal: 42.00,
      fee: 3.00,
      tax: 3.83,
      totalAmount: 48.83,
      paymentMethod: "Corporate Card",
      status: "Confirmed",
      bookedBy: "Terminal 1",
      createdAt: "2026-10-20 17:15:00"
    },
    {
      id: "CP-1019",
      customerId: "cust-9",
      showtimeId: "st-105",
      seats: ["C3", "C4"],
      seatTier: "VIP Lounge",
      subtotal: 50.00,
      fee: 3.00,
      tax: 4.51,
      totalAmount: 57.51,
      paymentMethod: "Credit Card",
      status: "Confirmed",
      bookedBy: "Terminal 2",
      createdAt: "2026-10-20 19:20:00"
    },
    {
      id: "CP-1020",
      customerId: "cust-8",
      showtimeId: "st-102",
      seats: ["A4", "A5"],
      seatTier: "VIP Recliner",
      subtotal: 48.40,
      fee: 3.00,
      tax: 4.37,
      totalAmount: 55.77,
      paymentMethod: "Credit Card",
      status: "Confirmed",
      bookedBy: "Terminal 1",
      createdAt: "2026-10-19 14:10:00"
    },
    {
      id: "CP-1021",
      customerId: "cust-5",
      showtimeId: "st-101",
      seats: ["D4", "D5"],
      seatTier: "Standard",
      subtotal: 33.00,
      fee: 3.00,
      tax: 3.06,
      totalAmount: 39.06,
      paymentMethod: "UPI / QR",
      status: "Confirmed",
      bookedBy: "Terminal 2",
      createdAt: "2026-10-19 18:05:00"
    },
    {
      id: "CP-1022",
      customerId: "cust-7",
      showtimeId: "st-104",
      seats: ["E4", "E5"],
      seatTier: "Standard",
      subtotal: 37.95,
      fee: 3.00,
      tax: 3.48,
      totalAmount: 44.43,
      paymentMethod: "Credit Card",
      status: "Confirmed",
      bookedBy: "Online Portal",
      createdAt: "2026-10-18 19:30:00"
    },
    {
      id: "CP-1023",
      customerId: "cust-13",
      showtimeId: "st-109",
      seats: ["B3", "B4"],
      seatTier: "VIP Lounge",
      subtotal: 60.00,
      fee: 3.00,
      tax: 5.36,
      totalAmount: 68.36,
      paymentMethod: "Credit Card",
      status: "Confirmed",
      bookedBy: "Marcus Vance",
      createdAt: "2026-10-17 20:15:00"
    },
    // Example Refunded Transactions
    {
      id: "CP-1024",
      customerId: "cust-4",
      showtimeId: "st-101",
      seats: ["E1", "E2"], // Released back to available
      seatTier: "Standard",
      subtotal: 33.00,
      fee: 3.00,
      tax: 3.06,
      totalAmount: 39.06,
      paymentMethod: "Apple Pay",
      status: "Cancelled / Refunded",
      refundReason: "Customer flight delayed; requested full refund at desk",
      refundedAt: "2026-10-22 13:15:00",
      bookedBy: "Box Office Terminal 1",
      createdAt: "2026-10-22 09:30:00"
    },
    {
      id: "CP-1025",
      customerId: "cust-6",
      showtimeId: "st-102",
      seats: ["F1", "F2"],
      seatTier: "Standard",
      subtotal: 36.30,
      fee: 3.00,
      tax: 3.34,
      totalAmount: 42.64,
      paymentMethod: "Credit Card",
      status: "Cancelled / Refunded",
      refundReason: "Accidental double-booking by patron",
      refundedAt: "2026-10-22 14:50:00",
      bookedBy: "Online Portal",
      createdAt: "2026-10-22 11:00:00"
    }
  ],
  activityLogs: [
    {
      id: "act-1",
      type: "booking",
      title: "Walk-in Ticket Issued",
      description: "Booking CP-1015 confirmed for Interstellar (Screen 3) - Seats A1, A2 ($68.36)",
      timestamp: "10 mins ago",
      isoTime: "2026-10-22T15:50:18"
    },
    {
      id: "act-2",
      type: "booking",
      title: "Box Office Reservation",
      description: "Booking CP-1014 confirmed for Blade Runner 2049 - Seats D4, D5 ($38.57)",
      timestamp: "18 mins ago",
      isoTime: "2026-10-22T15:42:05"
    },
    {
      id: "act-3",
      type: "refund",
      title: "Refund Processed & Seats Released",
      description: "Booking CP-1025 refunded ($42.64) - Seats F1, F2 released on Screen 1",
      timestamp: "1 hour ago",
      isoTime: "2026-10-22T14:50:00"
    },
    {
      id: "act-4",
      type: "booking",
      title: "VIP Lounge Booking",
      description: "Booking CP-1013 confirmed for Past Lives - Seats B4, B5 ($57.51)",
      timestamp: "1.5 hours ago",
      isoTime: "2026-10-22T14:22:50"
    },
    {
      id: "act-5",
      type: "customer",
      title: "Loyalty Tier Upgraded",
      description: "Julian Vance reached 1,780 points - upgraded to Platinum tier status",
      timestamp: "2 hours ago",
      isoTime: "2026-10-22T13:45:00"
    },
    {
      id: "act-6",
      type: "showtime",
      title: "New Showtime Added",
      description: "Dune: Part Two scheduled for Screen 1 tomorrow at 15:00 PM",
      timestamp: "3 hours ago",
      isoTime: "2026-10-22T12:50:00"
    },
    {
      id: "act-7",
      type: "system",
      title: "Shift Initiated",
      description: "Marcus Vance logged in as Lead Box Office Operator (Shift A)",
      timestamp: "6 hours ago",
      isoTime: "2026-10-22T10:00:00"
    }
  ]
};

/**
 * CinePulse Store Singleton
 */
class CinePulseStore {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Verify key structural integrity
        if (parsed.movies && parsed.screens && parsed.showtimes && parsed.customers && parsed.reservations) {
          // Migration: Theatres
          if (!parsed.theatres || parsed.theatres.length === 0) {
            parsed.theatres = INITIAL_DEMO_DATA.theatres;
          }
          // Migration: Admin Profile & Notifications
          if (!parsed.settings.adminProfile) {
            parsed.settings.adminProfile = INITIAL_DEMO_DATA.settings.adminProfile;
          }
          if (!parsed.settings.notifications) {
            parsed.settings.notifications = INITIAL_DEMO_DATA.settings.notifications;
          }
          // Ensure movies have releaseDate
          parsed.movies.forEach((m, idx) => {
            if (!m.releaseDate) {
              const defaultDates = ["2023-07-21", "2024-03-01", "2023-06-02", "2024-11-07", "2023-06-23", "2023-10-06", "2024-11-22"];
              m.releaseDate = defaultDates[idx % defaultDates.length] || "2024-05-15";
            }
          });
          // Ensure screens have theatreId & availability
          parsed.screens.forEach(s => {
            if (!s.theatreId) s.theatreId = s.id === "scr-3" ? "th-2" : "th-1";
            if (!s.theatreName) s.theatreName = s.theatreId === "th-2" ? "CinePulse Uptown Luxe Promenade" : "CinePulse Downtown Complex";
            if (!s.availability) s.availability = s.id === "scr-3" ? "Maintenance" : "Available";
          });
          // Ensure customers have accountStatus
          parsed.customers.forEach(c => {
            if (!c.accountStatus) c.accountStatus = (c.tier === "Platinum" || c.tier === "Gold") ? "VIP Member" : "Active";
          });
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error parsing CinePulse DB from localStorage, falling back to seed data", e);
    }
    // Seed initial demo data
    this.save(INITIAL_DEMO_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
  }

  save(data = null) {
    if (data) this.data = data;
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }

  resetToDemo() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
    this.save();
    return this.data;
  }

  // --- MOVIES ---
  getMovies() {
    return this.data.movies || [];
  }

  getMovieById(id) {
    return this.data.movies.find(m => m.id === id);
  }

  addMovie(movie) {
    const newMovie = {
      id: "mov-" + Date.now(),
      title: movie.title.trim(),
      genre: movie.genre.trim(),
      duration: parseInt(movie.duration) || 120,
      rating: movie.rating || "PG-13",
      director: movie.director?.trim() || "Independent",
      poster: movie.poster?.trim() || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
      status: movie.status || "Active",
      basePrice: parseFloat(movie.basePrice) || 15.00,
      synopsis: movie.synopsis?.trim() || "Film screening at CinePulse."
    };
    this.data.movies.unshift(newMovie);
    this.addActivity("movie", "New Movie Added", `"${newMovie.title}" added to theater catalog.`);
    this.save();
    return newMovie;
  }

  updateMovie(id, updateData) {
    const idx = this.data.movies.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.data.movies[idx] = { ...this.data.movies[idx], ...updateData };
      this.save();
      return this.data.movies[idx];
    }
    return null;
  }

  deleteMovie(id) {
    const movie = this.getMovieById(id);
    if (!movie) return false;
    this.data.movies = this.data.movies.filter(m => m.id !== id);
    // Also remove associated showtimes
    this.data.showtimes = this.data.showtimes.filter(st => st.movieId !== id);
    this.addActivity("movie", "Movie Archived / Removed", `"${movie.title}" was removed from rotation.`);
    this.save();
    return true;
  }

  // --- SCREENS ---
  getScreens() {
    return this.data.screens || [];
  }

  getScreenById(id) {
    return this.data.screens.find(s => s.id === id);
  }

  // --- SHOWTIMES ---
  getShowtimes() {
    return this.data.showtimes || [];
  }

  getShowtimeById(id) {
    return this.data.showtimes.find(st => st.id === id);
  }

  /**
   * Conflict Detection Engine
   * Checks whether the proposed screening overlaps with another screening on the same screen.
   * Includes a 20-minute cleaning/buffer interval.
   */
  checkShowtimeConflict(screenId, date, startTime, endTime, excludeShowtimeId = null) {
    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const newStart = toMinutes(startTime);
    const newEnd = toMinutes(endTime);
    const buffer = 20; // 20 minutes buffer for auditorium turnover

    const sameScreenSameDate = this.data.showtimes.filter(st => 
      st.screenId === screenId && 
      st.date === date && 
      st.id !== excludeShowtimeId &&
      st.status !== "Cancelled"
    );

    for (const existing of sameScreenSameDate) {
      const existingStart = toMinutes(existing.startTime);
      const existingEnd = toMinutes(existing.endTime);

      // Check overlap: [newStart, newEnd + buffer] overlaps [existingStart, existingEnd + buffer]
      if (newStart < (existingEnd + buffer) && newEnd > (existingStart - buffer)) {
        const movie = this.getMovieById(existing.movieId);
        return {
          conflict: true,
          conflictingShowtime: existing,
          conflictingMovie: movie ? movie.title : "Unknown Movie",
          message: `Screening conflicts with "${movie ? movie.title : 'Existing Showtime'}" (${existing.startTime} - ${existing.endTime}) including turnover cleaning buffer.`
        };
      }
    }

    return { conflict: false };
  }

  addShowtime(data) {
    const conflictCheck = this.checkShowtimeConflict(data.screenId, data.date, data.startTime, data.endTime);
    if (conflictCheck.conflict) {
      throw new Error(conflictCheck.message);
    }

    const newShowtime = {
      id: "st-" + Date.now(),
      movieId: data.movieId,
      screenId: data.screenId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      priceMultiplier: parseFloat(data.priceMultiplier) || 1.0,
      status: "Active",
      bookedSeats: []
    };

    this.data.showtimes.push(newShowtime);
    const movie = this.getMovieById(data.movieId);
    const screen = this.getScreenById(data.screenId);
    this.addActivity("showtime", "Showtime Scheduled", `"${movie?.title}" allocated to ${screen?.name} on ${data.date} at ${data.startTime}.`);
    this.save();
    return newShowtime;
  }

  deleteShowtime(id) {
    const st = this.getShowtimeById(id);
    if (!st) return false;
    this.data.showtimes = this.data.showtimes.filter(s => s.id !== id);
    this.save();
    return true;
  }

  // --- CUSTOMERS ---
  getCustomers() {
    return this.data.customers || [];
  }

  getCustomerById(id) {
    return this.data.customers.find(c => c.id === id);
  }

  addCustomer(customerData) {
    const newCustomer = {
      id: "cust-" + Date.now(),
      name: customerData.name.trim(),
      email: customerData.email.trim(),
      phone: customerData.phone.trim(),
      tier: customerData.tier || "Bronze",
      totalSpent: 0,
      points: 50, // Welcome points
      visitCount: 0,
      preferredGenres: customerData.preferredGenres || ["All"],
      notes: customerData.notes?.trim() || "New member enrolled at CinePulse.",
      lastVisit: new Date().toISOString().split("T")[0],
      joinDate: new Date().toISOString().split("T")[0]
    };

    this.data.customers.unshift(newCustomer);
    this.addActivity("customer", "New Customer Registered", `${newCustomer.name} enrolled in ${newCustomer.tier} Tier (+50 welcome pts).`);
    this.save();
    return newCustomer;
  }

  updateCustomer(id, updateData) {
    const idx = this.data.customers.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.customers[idx] = { ...this.data.customers[idx], ...updateData };
      this.save();
      return this.data.customers[idx];
    }
    return null;
  }

  // --- RESERVATIONS & BOOKINGS ---
  getReservations() {
    return this.data.reservations || [];
  }

  getReservationById(id) {
    return this.data.reservations.find(r => r.id === id);
  }

  createReservation(bookingData) {
    // 1. Verify showtime and seats availability
    const showtime = this.getShowtimeById(bookingData.showtimeId);
    if (!showtime) throw new Error("Showtime not found");

    const alreadyBooked = bookingData.seats.filter(seat => showtime.bookedSeats.includes(seat));
    if (alreadyBooked.length > 0) {
      throw new Error(`Seats ${alreadyBooked.join(", ")} were just taken by another transaction. Please select alternative seats.`);
    }

    // 2. Add seats to showtime
    showtime.bookedSeats.push(...bookingData.seats);

    // 3. Generate Booking ID (CP-XXXX)
    const nextNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = "CP-" + nextNum;

    const newReservation = {
      id: bookingId,
      customerId: bookingData.customerId,
      showtimeId: bookingData.showtimeId,
      seats: [...bookingData.seats],
      seatTier: bookingData.seatTier || "Standard",
      subtotal: parseFloat(bookingData.subtotal) || 0,
      fee: parseFloat(bookingData.fee) || 0,
      tax: parseFloat(bookingData.tax) || 0,
      totalAmount: parseFloat(bookingData.totalAmount) || 0,
      paymentMethod: bookingData.paymentMethod || "Credit Card",
      status: "Confirmed",
      bookedBy: this.data.settings.activeStaff || "Marcus Vance",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19)
    };

    this.data.reservations.unshift(newReservation);

    // 4. Update Customer Stats and Loyalty Points
    const customer = this.getCustomerById(bookingData.customerId);
    if (customer && customer.id !== "cust-16") { // cust-16 is walk-in guest
      customer.totalSpent = +(customer.totalSpent + newReservation.totalAmount).toFixed(2);
      customer.visitCount += 1;
      customer.lastVisit = new Date().toISOString().split("T")[0];
      // 10 loyalty points per dollar spent
      const earnedPoints = Math.floor(newReservation.totalAmount * 10);
      customer.points += earnedPoints;

      // Tier recalculation
      if (customer.totalSpent >= 600) {
        customer.tier = "Platinum";
      } else if (customer.totalSpent >= 350) {
        customer.tier = "Gold";
      } else if (customer.totalSpent >= 150) {
        customer.tier = "Silver";
      }
    }

    // 5. Activity log
    const movie = this.getMovieById(showtime.movieId);
    this.addActivity(
      "booking",
      "Box Office Tickets Issued",
      `Booking ${bookingId} confirmed for "${movie?.title || 'Movie'}" - ${newReservation.seats.join(", ")} ($${newReservation.totalAmount.toFixed(2)})`
    );

    this.save();
    return newReservation;
  }

  /**
   * Refund Engine
   * Releases allocated seats, cancels booking, adjusts revenue & logs activity.
   */
  refundReservation(reservationId, reason = "Admin desk refund requested") {
    const reservation = this.getReservationById(reservationId);
    if (!reservation) throw new Error("Reservation not found");
    if (reservation.status === "Cancelled / Refunded") {
      throw new Error("This reservation has already been refunded.");
    }

    // 1. Release seats on the associated showtime
    const showtime = this.getShowtimeById(reservation.showtimeId);
    if (showtime) {
      showtime.bookedSeats = showtime.bookedSeats.filter(s => !reservation.seats.includes(s));
    }

    // 2. Mark reservation as refunded
    reservation.status = "Cancelled / Refunded";
    reservation.refundReason = reason;
    reservation.refundedAt = new Date().toISOString().replace("T", " ").substring(0, 19);

    // 3. Adjust customer lifetime spend if not guest
    const customer = this.getCustomerById(reservation.customerId);
    if (customer && customer.id !== "cust-16") {
      customer.totalSpent = Math.max(0, +(customer.totalSpent - reservation.totalAmount).toFixed(2));
      customer.points = Math.max(0, customer.points - Math.floor(reservation.totalAmount * 10));
    }

    // 4. Log activity
    this.addActivity(
      "refund",
      "Refund & Seat Release Completed",
      `Booking ${reservation.id} ($${reservation.totalAmount.toFixed(2)}) refunded. Seats [${reservation.seats.join(", ")}] released to Available.`
    );

    this.save();
    return reservation;
  }

  // --- ACTIVITY LOGS ---
  getActivityLogs() {
    return this.data.activityLogs || [];
  }

  addActivity(type, title, description) {
    if (!this.data.activityLogs) this.data.activityLogs = [];
    const newLog = {
      id: "act-" + Date.now(),
      type: type, // 'booking' | 'refund' | 'customer' | 'showtime' | 'system' | 'movie'
      title: title,
      description: description,
      timestamp: "Just now",
      isoTime: new Date().toISOString()
    };
    this.data.activityLogs.unshift(newLog);
    // Keep max 40 logs
    if (this.data.activityLogs.length > 40) {
      this.data.activityLogs = this.data.activityLogs.slice(0, 40);
    }
  }

  // --- SETTINGS ---
  getSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  // --- BACKUP & RECOVERY ---
  exportDatabaseJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  importDatabaseJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.movies || !parsed.screens || !parsed.showtimes || !parsed.reservations || !parsed.customers) {
        throw new Error("Invalid CinePulse backup file structure. Missing core schemas.");
      }
      this.data = parsed;
      this.save();
      this.addActivity("system", "Database Restored", "System state was successfully imported from JSON backup.");
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // --- ANALYTICS COMPUTATIONS ---
  getAnalyticsSummary() {
    const today = new Date().toISOString().split("T")[0];
    const reservations = this.data.reservations || [];
    
    // Confirmed reservations
    const confirmedReservations = reservations.filter(r => r.status === "Confirmed");
    
    // Today's Confirmed Bookings
    const todayConfirmed = confirmedReservations.filter(r => r.createdAt && r.createdAt.startsWith(today));
    
    // Today's Gross Revenue
    const todayRevenue = todayConfirmed.reduce((sum, r) => sum + r.totalAmount, 0);

    // Total tickets sold today
    const todayTickets = todayConfirmed.reduce((sum, r) => sum + r.seats.length, 0);

    // Today's showtimes & capacity
    const todayShowtimes = (this.data.showtimes || []).filter(st => st.date === today && st.status !== "Cancelled");
    let totalCapacityToday = 0;
    let totalBookedToday = 0;

    todayShowtimes.forEach(st => {
      const screen = this.getScreenById(st.screenId);
      if (screen) {
        totalCapacityToday += screen.totalSeats;
        totalBookedToday += st.bookedSeats.length;
      }
    });

    const averageOccupancy = totalCapacityToday > 0 ? ((totalBookedToday / totalCapacityToday) * 100).toFixed(1) : 0;

    // Active Loyalty Members count
    const activeLoyalty = (this.data.customers || []).filter(c => c.tier !== "Bronze").length;
    const totalCustomers = (this.data.customers || []).length;

    return {
      todayRevenue: todayRevenue,
      todayTickets: todayTickets,
      todayShowtimesCount: todayShowtimes.length,
      averageOccupancy: parseFloat(averageOccupancy),
      totalCapacityToday: totalCapacityToday,
      totalBookedToday: totalBookedToday,
      activeLoyaltyMembers: activeLoyalty,
      totalCustomers: totalCustomers
    };
  }

  /**
   * 7-Day Revenue Trend
   */
  get7DayRevenueTrend() {
    const days = [];
    const labels = [];
    const revenues = [];
    const tickets = [];

    // Build last 7 days
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      
      days.push(dateStr);
      labels.push(dayName);

      const dayBookings = this.data.reservations.filter(r => 
        r.status === "Confirmed" && r.createdAt && r.createdAt.startsWith(dateStr)
      );

      const rev = dayBookings.reduce((sum, r) => sum + r.totalAmount, 0);
      const tix = dayBookings.reduce((sum, r) => sum + r.seats.length, 0);

      // Add realistic background baseline for demo display if day is earlier and has few records
      const simulatedBaseline = [4120, 3850, 4420, 4980, 5210, 4890, 0][6 - i];
      revenues.push(rev > 0 ? +rev.toFixed(2) : simulatedBaseline);
      tickets.push(tix > 0 ? tix : Math.floor(simulatedBaseline / 16.5));
    }

    return { labels, revenues, tickets };
  }

  /**
   * Occupancy & Revenue by Movie
   */
  getTopMoviesAnalytics() {
    const movieStats = {};

    this.data.movies.forEach(m => {
      movieStats[m.id] = {
        title: m.title,
        revenue: 0,
        ticketsSold: 0,
        genre: m.genre
      };
    });

    this.data.reservations.forEach(r => {
      if (r.status === "Confirmed") {
        const st = this.getShowtimeById(r.showtimeId);
        if (st && movieStats[st.movieId]) {
          movieStats[st.movieId].revenue += r.totalAmount;
          movieStats[st.movieId].ticketsSold += r.seats.length;
        }
      }
    });

    return Object.values(movieStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }

  // --- THEATRES ---
  getTheatres() {
    return this.data.theatres || [];
  }

  getTheatreById(id) {
    return (this.data.theatres || []).find(th => th.id === id);
  }

  addTheatre(th) {
    const newTheatre = {
      id: "th-" + Date.now(),
      name: th.name.trim(),
      location: th.location.trim(),
      city: th.city?.trim() || "Metro City",
      totalScreens: parseInt(th.totalScreens) || 1,
      status: th.status || "Active",
      phone: th.phone?.trim() || "+1 (555) 000-0000",
      manager: th.manager?.trim() || "Marcus Vance"
    };
    if (!this.data.theatres) this.data.theatres = [];
    this.data.theatres.push(newTheatre);
    this.save();
    return newTheatre;
  }

  // --- SCREENS ENHANCED ---
  addScreen(data) {
    const newScreen = {
      id: "scr-" + Date.now(),
      theatreId: data.theatreId || "th-1",
      theatreName: data.theatreId === "th-2" ? "CinePulse Uptown Luxe Promenade" : "CinePulse Downtown Complex",
      name: data.name.trim(),
      type: data.type || "IMAX Laser",
      availability: data.availability || "Available",
      totalSeats: parseInt(data.totalSeats) || 60,
      rows: 6,
      cols: 10,
      pricing: {
        vip: parseFloat(data.pricingVip) || 22.00,
        standard: parseFloat(data.pricingStandard) || 16.50,
        accessible: parseFloat(data.pricingAccessible) || 15.00
      },
      tiers: {
        vipRows: ["A", "B"],
        standardRows: ["C", "D", "E"],
        accessibleRows: ["F"]
      }
    };
    this.data.screens.push(newScreen);
    this.addActivity("system", "Screen Provisioned", `"${newScreen.name}" added to theater matrix.`);
    this.save();
    return newScreen;
  }

  updateScreen(id, updateData) {
    const idx = this.data.screens.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.screens[idx] = { ...this.data.screens[idx], ...updateData };
      this.save();
      return this.data.screens[idx];
    }
    return null;
  }

  deleteScreen(id) {
    const screen = this.getScreenById(id);
    if (!screen) return false;
    this.data.screens = this.data.screens.filter(s => s.id !== id);
    this.save();
    return true;
  }

  // --- CUSTOMER ENHANCEMENTS ---
  updateCustomer(id, updateData) {
    const idx = this.data.customers.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.customers[idx] = { ...this.data.customers[idx], ...updateData };
      this.save();
      return this.data.customers[idx];
    }
    return null;
  }

  updateCustomerStatus(id, newStatus) {
    const cust = this.getCustomerById(id);
    if (cust) {
      cust.accountStatus = newStatus;
      this.save();
      return cust;
    }
    return null;
  }

  // --- DASHBOARD TELEMETRY WIDGETS ---
  getRecentBookings(limit = 6) {
    return (this.data.reservations || [])
      .slice(0, limit)
      .map(r => {
        const cust = this.getCustomerById(r.customerId);
        const st = this.getShowtimeById(r.showtimeId);
        const movie = st ? this.getMovieById(st.movieId) : null;
        const screen = st ? this.getScreenById(st.screenId) : null;
        return {
          ...r,
          customerName: cust ? cust.name : "Guest Patron",
          customerEmail: cust ? cust.email : "guest@cinepulse.io",
          customerAvatar: cust ? (cust.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80") : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80",
          customerTier: cust ? cust.tier : "Bronze",
          movieTitle: movie ? movie.title : (r.movieTitle || "Movie"),
          moviePoster: movie ? movie.poster : "",
          screenName: screen ? screen.name : (r.screenName || "Screen"),
          theatreName: screen ? (screen.theatreName || "Downtown Complex") : "Downtown Complex",
          paymentStatus: r.status === "Cancelled / Refunded" ? "Refunded" : "Paid"
        };
      });
  }

  getPopularMovies(limit = 4) {
    const movies = this.getMovies();
    const stats = this.getTopMoviesAnalytics();
    return movies.slice(0, limit).map((m, idx) => {
      const stat = stats.find(s => s.title === m.title);
      const simulatedRevs = [54200, 48300, 39600, 31400];
      const simulatedOcc = [88, 76, 68, 62];
      return {
        ...m,
        revenue: stat && stat.revenue > 0 ? stat.revenue : simulatedRevs[idx % simulatedRevs.length],
        ticketsSold: stat && stat.ticketsSold > 0 ? stat.ticketsSold : Math.floor(simulatedRevs[idx % simulatedRevs.length] / 17),
        occupancy: simulatedOcc[idx % simulatedOcc.length]
      };
    });
  }

  // --- PROFILE & SETTINGS ---
  updateAdminProfile(profileData) {
    if (!this.data.settings.adminProfile) {
      this.data.settings.adminProfile = {};
    }
    this.data.settings.adminProfile = { ...this.data.settings.adminProfile, ...profileData };
    this.addActivity("system", "Profile Updated", "Administrator account details updated.");
    this.save();
    return this.data.settings.adminProfile;
  }

  updateNotificationPreferences(notifData) {
    this.data.settings.notifications = { ...this.data.settings.notifications, ...notifData };
    this.addActivity("system", "Notification Alerts Updated", "Operational notification preferences saved.");
    this.save();
    return this.data.settings.notifications;
  }

  changeAdminPassword(oldPass, newPass) {
    if (!oldPass || oldPass.trim().length === 0) {
      throw new Error("Current password verification failed. Please enter your valid current password.");
    }
    if (!newPass || newPass.length < 6) {
      throw new Error("New password must be at least 6 characters.");
    }
    this.addActivity("system", "Security Credential Changed", "Admin account password successfully rotated.");
    this.save();
    return { success: true };
  }
}

// Global Store Instance
window.CinePulse = {
  Store: new CinePulseStore()
};
