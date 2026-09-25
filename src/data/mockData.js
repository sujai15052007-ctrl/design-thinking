// Mock dataset for ReRoot Food Waste Management System
// Rich, realistic, organic content adhering to strict design standards

export const INITIAL_USER = {
  name: "Julian Thorne",
  handle: "@julian_thorne",
  role: "household", // "household" | "business" | "ngo"
  location: "Kitsilano, Vancouver, BC",
  joinedDate: "October 2024",
  avatarSeed: "JulianT",
  bio: "Committed home cook aiming for a zero-landfill kitchen. Composting enthusiast & urban forager.",
  ecoScore: 3420,
  level: "Canopy Guardian",
  levelTier: 4,
  streakDays: 19,
  metrics: {
    wasteDivertedKg: 142.8,
    mealsDonated: 64,
    co2SavedKg: 312.4,
    moneySaved: 846.50
  },
  preferences: {
    dietary: ["Vegetarian", "Dairy-Friendly"],
    alertFrequency: "daily",
    measurementUnit: "metric", // "metric" | "imperial"
    defaultStorage: "Fridge",
    notifyExpiring24h: true,
    notifyCommunityClaim: true,
    notifyDonationPickup: true
  }
};

export const INITIAL_INVENTORY = [
  {
    id: "inv-01",
    name: "Organic Baby Spinach",
    category: "Produce",
    quantity: 300,
    unit: "g",
    storage: "Fridge",
    purchaseDate: "2026-09-22",
    expiryDate: "2026-09-26", // expires tomorrow / in 24h
    status: "expiring_soon",
    estimatedValue: 4.80,
    co2ImpactKg: 1.2,
    notes: "Half bag opened for salads. Crisp but needs using in 24 hours.",
    imageTag: "spinach"
  },
  {
    id: "inv-02",
    name: "Artisan Sourdough Batard",
    category: "Bakery",
    quantity: 1,
    unit: "loaf",
    storage: "Pantry",
    purchaseDate: "2026-09-21",
    expiryDate: "2026-09-27",
    status: "expiring_soon",
    estimatedValue: 7.50,
    co2ImpactKg: 2.1,
    notes: "From Wild Flour Bakery. Crust hardening, ideal for croutons or bread pudding.",
    imageTag: "bread"
  },
  {
    id: "inv-03",
    name: "Greek Whole Milk Yogurt",
    category: "Dairy",
    quantity: 500,
    unit: "g",
    storage: "Fridge",
    purchaseDate: "2026-09-18",
    expiryDate: "2026-09-28",
    status: "fresh",
    estimatedValue: 5.90,
    co2ImpactKg: 3.4,
    notes: "Unopened tub, pasteurized pasture-raised milk.",
    imageTag: "dairy"
  },
  {
    id: "inv-04",
    name: "Heirloom Beefsteak Tomatoes",
    category: "Produce",
    quantity: 4,
    unit: "items",
    storage: "Pantry",
    purchaseDate: "2026-09-23",
    expiryDate: "2026-09-26", // expires in 24h
    status: "expiring_soon",
    estimatedValue: 6.20,
    co2ImpactKg: 1.8,
    notes: "Very ripe, deeply fragrant. Great for fresh tomato gazpacho or sauce.",
    imageTag: "tomato"
  },
  {
    id: "inv-05",
    name: "Oat Milk Barista Edition",
    category: "Pantry",
    quantity: 2,
    unit: "cartons",
    storage: "Pantry",
    purchaseDate: "2026-09-10",
    expiryDate: "2026-10-15",
    status: "fresh",
    estimatedValue: 9.00,
    co2ImpactKg: 1.4,
    notes: "Ambient storage, shelf stable until unsealed.",
    imageTag: "milk"
  },
  {
    id: "inv-06",
    name: "Roasted Chickpea & Herb Hummus",
    category: "Prepared Meals",
    quantity: 220,
    unit: "g",
    storage: "Fridge",
    purchaseDate: "2026-09-20",
    expiryDate: "2026-09-26", // urgent
    status: "expiring_soon",
    estimatedValue: 4.50,
    co2ImpactKg: 0.9,
    notes: "Housemade batch, garlic, tahini, lemon.",
    imageTag: "hummus"
  },
  {
    id: "inv-07",
    name: "Fresh Atlantic Salmon Fillet",
    category: "Proteins",
    quantity: 420,
    unit: "g",
    storage: "Freezer",
    purchaseDate: "2026-09-15",
    expiryDate: "2026-11-20",
    status: "fresh",
    estimatedValue: 14.50,
    co2ImpactKg: 4.8,
    notes: "Vacuum-sealed upon purchase, blast-frozen.",
    imageTag: "salmon"
  },
  {
    id: "inv-08",
    name: "Ripe Hass Avocados",
    category: "Produce",
    quantity: 3,
    unit: "items",
    storage: "Fridge",
    purchaseDate: "2026-09-21",
    expiryDate: "2026-09-27",
    status: "expiring_soon",
    estimatedValue: 5.50,
    co2ImpactKg: 2.3,
    notes: "Soft to gentle thumb pressure. Ready to eat right now.",
    imageTag: "avocado"
  },
  {
    id: "inv-09",
    name: "Red Lentils (Organic)",
    category: "Pantry",
    quantity: 850,
    unit: "g",
    storage: "Pantry",
    purchaseDate: "2026-08-01",
    expiryDate: "2027-02-15",
    status: "fresh",
    estimatedValue: 3.80,
    co2ImpactKg: 0.7,
    notes: "Airtight glass jar storage.",
    imageTag: "lentils"
  },
  {
    id: "inv-10",
    name: "Heavy Whipping Cream 36%",
    category: "Dairy",
    quantity: 250,
    unit: "ml",
    storage: "Fridge",
    purchaseDate: "2026-09-16",
    expiryDate: "2026-09-25", // expiring today
    status: "urgent",
    estimatedValue: 3.20,
    co2ImpactKg: 2.6,
    notes: "Opened for pasta sauce, 3 days left on shelf life.",
    imageTag: "cream"
  }
];

export const INITIAL_NGOS = [
  {
    id: "ngo-01",
    name: "The Kettle Friendship Society",
    type: "Community Food Bank & Kitchen",
    distanceKm: 1.2,
    coordinates: { x: 38, y: 44 }, // for mock map relative %
    address: "1725 Venables St, East Vancouver",
    openHours: "08:00 - 19:30 Daily",
    urgentNeeds: ["Fresh Produce", "Dairy & Eggs", "Prepared Soups"],
    acceptsCookedFood: true,
    refrigeratedStorage: true,
    capacityStatus: "high_demand", // "urgent" | "high_demand" | "moderate"
    contactPerson: "Elena Rostova (Kitchen Director)",
    phone: "+1 (604) 251-0784",
    impactScore: "4,200 meals/wk",
    pickupAvailable: true
  },
  {
    id: "ngo-02",
    name: "Downtown Eastside Community Kitchens",
    type: "Grassroots Mutual Aid Kitchen",
    distanceKm: 2.4,
    coordinates: { x: 58, y: 32 },
    address: "392 Powell St, Vancouver",
    openHours: "07:30 - 20:00 Daily",
    urgentNeeds: ["Whole Grain Bread", "Root Vegetables", "Proteins"],
    acceptsCookedFood: true,
    refrigeratedStorage: true,
    capacityStatus: "urgent",
    contactPerson: "Marcus Vance (Logistics)",
    phone: "+1 (604) 682-1492",
    impactScore: "6,800 meals/wk",
    pickupAvailable: true
  },
  {
    id: "ngo-03",
    name: "Kitsilano Neighborhood House Pantry",
    type: "Neighborhood Food Share Locker",
    distanceKm: 0.8,
    coordinates: { x: 26, y: 62 },
    address: "2305 W 7th Ave, Kitsilano",
    openHours: "Open 24/7 (Sheltered Locker)",
    urgentNeeds: ["Fresh Fruit", "Shelf-Stable Milk", "Baked Goods"],
    acceptsCookedFood: false,
    refrigeratedStorage: true,
    capacityStatus: "moderate",
    contactPerson: "Clara Tremblay",
    phone: "+1 (604) 736-3588",
    impactScore: "1,150 meals/wk",
    pickupAvailable: false
  },
  {
    id: "ngo-04",
    name: "Union Gospel Mission Food Services",
    type: "Shelter & Bulk Dining Hall",
    distanceKm: 3.1,
    coordinates: { x: 72, y: 50 },
    address: "601 E Hastings St, Vancouver",
    openHours: "06:00 - 21:00 Daily",
    urgentNeeds: ["Bulk Grains", "Fresh Vegetables", "Proteins"],
    acceptsCookedFood: true,
    refrigeratedStorage: true,
    capacityStatus: "urgent",
    contactPerson: "Chef Brian Kelly",
    phone: "+1 (604) 253-3323",
    impactScore: "12,000 meals/wk",
    pickupAvailable: true
  },
  {
    id: "ngo-05",
    name: "Aboriginal Front Door Society",
    type: "Indigenous Drop-In & Nourishment Center",
    distanceKm: 2.8,
    coordinates: { x: 64, y: 22 },
    address: "384 E Hastings St, Vancouver",
    openHours: "08:30 - 16:30 Mon-Sat",
    urgentNeeds: ["Warm Hearty Soups", "Breads", "Citrus & Apples"],
    acceptsCookedFood: true,
    refrigeratedStorage: false,
    capacityStatus: "high_demand",
    contactPerson: "Tania Paul",
    phone: "+1 (604) 697-9930",
    impactScore: "3,400 meals/wk",
    pickupAvailable: true
  }
];

export const INITIAL_MARKETPLACE = [
  {
    id: "mkt-01",
    title: "Surplus Sourdough & Cardamom Buns",
    giverName: "Levain & Leaf Bakery (Soren K.)",
    giverType: "Commercial Bakery",
    giverRating: 4.96,
    portions: "6 full portions",
    category: "Bakery",
    dietary: ["Vegetarian", "Dairy"],
    locationDistance: "0.4 km away (Arbutus & 10th)",
    pickupWindow: "Today 17:30 - 19:00",
    claimed: false,
    claimedBy: null,
    co2SavedKg: 3.8,
    description: "Baked at 5:00 AM today. Completely fresh, beautiful golden crust. We bake in small batches but made excess for a catering event that downsized.",
    imageBadge: "sourdough"
  },
  {
    id: "mkt-02",
    title: "Organic Red Apples & Bartlett Pears Box",
    giverName: "Nora Chen",
    giverType: "Neighbor / Garden Gleaner",
    giverRating: 5.0,
    portions: "approx. 4.5 kg",
    category: "Produce",
    dietary: ["Vegan", "Nut-Free", "Gluten-Free"],
    locationDistance: "0.7 km away (Point Grey)",
    pickupWindow: "Today until 21:00",
    claimed: false,
    claimedBy: null,
    co2SavedKg: 2.4,
    description: "Harvested directly from our heritage garden trees yesterday. Unsprayed, washed, sweet and juicy. Great for eating whole or baking crisps.",
    imageBadge: "apples"
  },
  {
    id: "mkt-03",
    title: "Slow-Cooked Vegetable Minestrone (Fresh Batch)",
    giverName: "Harvest Moon Cafe (Chef Matteo)",
    giverType: "Neighborhood Bistro",
    giverRating: 4.92,
    portions: "4 large mason jars (1L each)",
    category: "Prepared Meals",
    dietary: ["Vegan", "Gluten-Free"],
    locationDistance: "1.1 km away (West 4th Ave)",
    pickupWindow: "Tomorrow 09:00 - 11:30",
    claimed: false,
    claimedBy: null,
    co2SavedKg: 5.2,
    description: "Cooked with organic kale, cannellini beans, slow-roasted San Marzano tomatoes and garden rosemary. Packed warm into sterilized jars today.",
    imageBadge: "soup"
  },
  {
    id: "mkt-04",
    title: "Unopened Extra-Firm Tofu (3-Pack)",
    giverName: "David Sterling",
    giverType: "Neighbor",
    giverRating: 4.88,
    portions: "3 x 350g packs",
    category: "Proteins",
    dietary: ["Vegan", "Organic", "Non-GMO"],
    locationDistance: "1.5 km away (South Granville)",
    pickupWindow: "Today 18:00 - 22:00",
    claimed: true,
    claimedBy: "Amira H.",
    co2SavedKg: 2.1,
    description: "Bought in bulk at Costco, leaving for a 2-week work trip on Sunday. Best before date is Oct 8. Kept constantly cold.",
    imageBadge: "tofu"
  },
  {
    id: "mkt-05",
    title: "Fresh Herbs Medley (Basil, Rosemary, Mint)",
    giverName: "Celia & Liam R.",
    giverType: "Urban Rooftop Farm",
    giverRating: 4.98,
    portions: "5 generous bunches",
    category: "Produce",
    dietary: ["Vegan", "Zero-Waste"],
    locationDistance: "0.9 km away (Granville Island)",
    pickupWindow: "Today 16:00 - 20:00",
    claimed: false,
    claimedBy: null,
    co2SavedKg: 0.8,
    description: "Clipped this afternoon from our rooftop aeroponic planters. Incredibly aromatic, with roots wrapped in moist unbleached paper towels.",
    imageBadge: "herbs"
  }
];

export const RECIPES_DB = [
  {
    id: "rec-01",
    title: "Cast-Iron Heirloom Tomato & Basil Galette",
    description: "A rustic, buttery open tart celebrating ultra-ripe tomatoes with a crisp golden crust.",
    prepTimeMinutes: 35,
    cookTimeMinutes: 25,
    difficulty: "Easy",
    servings: 4,
    matchingIngredients: [
      "Heirloom Beefsteak Tomatoes",
      "Organic Baby Spinach"
    ],
    pantryStaplesNeeded: ["Flour", "Butter", "Olive Oil", "Flaky Sea Salt", "Black Pepper"],
    matchPercentage: 92,
    co2DivertedKg: 3.0,
    zeroWasteTip: "Don't discard tomato seeds or watery core! Strain the juice, mix with olive oil and vinegar for an instant tomato-water vinaigrette.",
    steps: [
      "Slice the ripe heirloom tomatoes into 1/4-inch rounds. Salt lightly on a paper towel for 10 minutes to draw out excess moisture.",
      "Roll out your chilled pastry dough or store-bought pie crust onto parchment paper to a 12-inch circle.",
      "Scatter fresh baby spinach and a drizzle of olive oil across the base, leaving a 2-inch border around the edge.",
      "Overlap tomato slices attractively in the center. Fold the pastry edges inward over the filling, pleating gently.",
      "Bake at 200°C (400°F) for 25-28 minutes until the pastry is deep bronze and tomatoes are caramelized."
    ]
  },
  {
    id: "rec-02",
    title: "Crispy Sourdough Panzanella with Ripe Avocado",
    description: "Classic Tuscan bread salad turning slightly hardened sourdough into crunchy flavor sponges.",
    prepTimeMinutes: 20,
    cookTimeMinutes: 10,
    difficulty: "Beginner",
    servings: 3,
    matchingIngredients: [
      "Artisan Sourdough Batard",
      "Ripe Hass Avocados",
      "Heirloom Beefsteak Tomatoes"
    ],
    pantryStaplesNeeded: ["Extra Virgin Olive Oil", "Red Wine Vinegar", "Garlic", "Salt"],
    matchPercentage: 100,
    co2DivertedKg: 4.4,
    zeroWasteTip: "Tear bread with your hands rather than cutting with a knife — jagged, craggy edges catch significantly more dressing.",
    steps: [
      "Tear stale sourdough into rough 1-inch bite-sized chunks. Toss in olive oil with a pinch of sea salt.",
      "Toast in a heavy skillet or oven at 190°C until exterior is golden crisp but center retains slight chew (approx 8 mins).",
      "Cut ripe tomatoes into wedges, collecting all their juices in a large ceramic salad bowl.",
      "Whisk vinegar, minced garlic, and olive oil directly into the warm tomato juices to form a vibrant dressing.",
      "Toss the toasted bread into the dressing, gently fold in diced avocados, and let rest 10 minutes so flavors marry."
    ]
  },
  {
    id: "rec-03",
    title: "Velvety Whipped Cream & Spinach Pasta",
    description: "Silky, comforting green pasta emulsion that uses up both heavy cream and spinach in minutes.",
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    difficulty: "Easy",
    servings: 2,
    matchingIngredients: [
      "Heavy Whipping Cream 36%",
      "Organic Baby Spinach"
    ],
    pantryStaplesNeeded: ["Fettuccine or Rigatoni", "Garlic", "Nutmeg", "Parmesan or Nutritional Yeast"],
    matchPercentage: 88,
    co2DivertedKg: 3.8,
    zeroWasteTip: "Use starchy pasta boiling water to loosen the cream sauce without needing extra dairy.",
    steps: [
      "Bring a pot of heavily salted water to a rolling boil and drop in your chosen pasta.",
      "In a wide skillet, melt a knob of butter or olive oil, soften two cloves of minced garlic on medium-low.",
      "Pour in the heavy cream and let it simmer gently until reduced by a third (about 4 minutes).",
      "Fold in raw baby spinach in handfuls until fully wilted and vibrant emerald green.",
      "Transfer pasta directly into the sauce with 60ml pasta water; toss vigorously to glaze every noodle."
    ]
  },
  {
    id: "rec-04",
    title: "Zero-Waste Creamy Hummus Toast with Roasted Veggies",
    description: "High-protein open sandwich elevating leftover hummus and soft produce into an artisan lunch.",
    prepTimeMinutes: 12,
    cookTimeMinutes: 8,
    difficulty: "Beginner",
    servings: 2,
    matchingIngredients: [
      "Roasted Chickpea & Herb Hummus",
      "Artisan Sourdough Batard",
      "Ripe Hass Avocados"
    ],
    pantryStaplesNeeded: ["Chili Flakes", "Olive Oil", "Lemon Juice"],
    matchPercentage: 100,
    co2DivertedKg: 3.2,
    zeroWasteTip: "Save avocado skins and pit to brew a subtle natural plant dye for textiles, or compost thoroughly.",
    steps: [
      "Slice thick sourdough wedges and grill or pan-toast in olive oil until charred at the ridges.",
      "Spread a generous 3-tablespoon layer of chilled hummus edge-to-edge.",
      "Fan thinly sliced avocado across the top.",
      "Finish with coarse sea salt, cracked black pepper, lemon zest, and a pinch of toasted chili flakes."
    ]
  }
];

export const BADGES_DB = [
  {
    id: "b-01",
    name: "Seedling Pioneer",
    tier: "Bronze",
    unlocked: true,
    unlockedDate: "Oct 2024",
    icon: "Plant",
    description: "Logged your first 5 food items before their expiration date."
  },
  {
    id: "b-02",
    name: "14-Day Zero Discard",
    tier: "Silver",
    unlocked: true,
    unlockedDate: "Nov 2024",
    icon: "Flame",
    description: "Maintained a 14-day streak with 0 items marked as discarded/waste."
  },
  {
    id: "b-03",
    name: "Centennial Rescuer",
    tier: "Gold",
    unlocked: true,
    unlockedDate: "Jan 2025",
    icon: "Medal",
    description: "Diverted over 100 kilograms of edible food from landfill."
  },
  {
    id: "b-04",
    name: "Community Anchor",
    tier: "Gold",
    unlocked: true,
    unlockedDate: "Feb 2025",
    icon: "Handshake",
    description: "Directly donated surplus provisions to verified local shelter kitchens 25 times."
  },
  {
    id: "b-05",
    name: "Culinary Alchemist",
    tier: "Silver",
    unlocked: true,
    unlockedDate: "Mar 2025",
    icon: "CookingPot",
    description: "Prepared 15 zero-waste recipes using ingredients with under 24 hours shelf life."
  },
  {
    id: "b-06",
    name: "Atmosphere Guardian",
    tier: "Diamond",
    unlocked: false,
    unlockedDate: null,
    progress: "312 / 500 kg CO2",
    icon: "CloudSun",
    description: "Avert 500 kg of equivalent methane greenhouse emissions through food diversion."
  },
  {
    id: "b-07",
    name: "Neighborhood Hero",
    tier: "Diamond",
    unlocked: false,
    unlockedDate: null,
    progress: "18 / 30 claims",
    icon: "Sparkle",
    description: "Fulfill 30 surplus marketplace requests for community members."
  }
];

export const LEADERBOARD_DATA = [
  {
    rank: 1,
    name: "Flora & Flour Hearth Bakery",
    type: "Local Business",
    location: "Mount Pleasant",
    divertedKg: 894.2,
    streak: 64,
    badge: "Master Diverter"
  },
  {
    rank: 2,
    name: "Kitsilano Co-op House 12",
    type: "Collective Household",
    location: "Kitsilano",
    divertedKg: 512.6,
    streak: 42,
    badge: "Eco Collective"
  },
  {
    rank: 3,
    name: "Julian Thorne (You)",
    type: "Household",
    location: "Kitsilano",
    divertedKg: 142.8,
    streak: 19,
    badge: "Canopy Guardian"
  },
  {
    rank: 4,
    name: "Sunburst Farmstand & Grocer",
    type: "Small Grocer",
    location: "Commercial Drive",
    divertedKg: 138.4,
    streak: 18,
    badge: "Fresh Vanguard"
  },
  {
    rank: 5,
    name: "Dr. Evelyn Gallagher",
    type: "Household",
    location: "Fairview",
    divertedKg: 119.5,
    streak: 26,
    badge: "Waste Scout"
  },
  {
    rank: 6,
    name: "Green Horizon Cafe",
    type: "Local Business",
    location: "Gastown",
    divertedKg: 104.2,
    streak: 15,
    badge: "Zero Scrap"
  }
];

export const ANALYTICS_DATA = {
  monthlyTrend: [
    { month: "Apr", divertedKg: 14.2, discardedKg: 3.8, co2Saved: 31.2, dollarsSaved: 88.50 },
    { month: "May", divertedKg: 18.6, discardedKg: 2.9, co2Saved: 40.9, dollarsSaved: 114.20 },
    { month: "Jun", divertedKg: 24.1, discardedKg: 2.1, co2Saved: 53.0, dollarsSaved: 146.00 },
    { month: "Jul", divertedKg: 28.5, discardedKg: 1.8, co2Saved: 62.7, dollarsSaved: 172.40 },
    { month: "Aug", divertedKg: 32.8, discardedKg: 1.2, co2Saved: 72.1, dollarsSaved: 198.80 },
    { month: "Sep", divertedKg: 24.6, discardedKg: 0.6, co2Saved: 54.1, dollarsSaved: 126.60 }
  ],
  categoryBreakdown: [
    { name: "Produce", value: 42, color: "#2D5016", kg: 60.0 },
    { name: "Bakery", value: 24, color: "#C4652E", kg: 34.3 },
    { name: "Dairy", value: 16, color: "#D4A747", kg: 22.8 },
    { name: "Prepared Meals", value: 12, color: "#7BA05B", kg: 17.1 },
    { name: "Proteins", value: 6, color: "#A84E1D", kg: 8.6 }
  ],
  destinationSplit: [
    { name: "Directly Consumed", percentage: 58, color: "#2D5016" },
    { name: "Donated to Shelter", percentage: 26, color: "#3A6B1E" },
    { name: "Shared with Neighbors", percentage: 12, color: "#C4652E" },
    { name: "Municipal Compost", percentage: 4, color: "#D4CBBF" }
  ]
};

export const INITIAL_NGO_REQUESTS = [
  {
    id: "req-01",
    donorName: "Julian Thorne (You)",
    ngoName: "The Kettle Friendship Society",
    itemSummary: "Organic Baby Spinach (300g) + Heirloom Tomatoes (4 items)",
    status: "En Route",
    scheduledTime: "Today 16:30",
    driverName: "Liam O'Connor (Volunteer Cargo Bike)",
    pickupAddress: "2340 W 4th Ave, Kitsilano",
    urgency: "High",
    verifiedWeightKg: 1.8
  },
  {
    id: "req-02",
    donorName: "Flora & Flour Bakery",
    ngoName: "Downtown Eastside Kitchens",
    itemSummary: "Whole Wheat Batards (12 loaves) + Brioche Buns (24 units)",
    status: "Scheduled",
    scheduledTime: "Today 18:00",
    driverName: "Tenzin Dorje (Van 03)",
    pickupAddress: "1280 Commercial Dr",
    urgency: "Medium",
    verifiedWeightKg: 14.5
  },
  {
    id: "req-03",
    donorName: "Harvest Moon Cafe",
    ngoName: "Union Gospel Mission",
    itemSummary: "Chilled Roasted Squash Soup (8 Liters)",
    status: "Completed",
    scheduledTime: "Yesterday 14:00",
    driverName: "Sarah M.",
    pickupAddress: "2104 W 4th Ave",
    urgency: "Normal",
    verifiedWeightKg: 8.2
  },
  {
    id: "req-04",
    donorName: "Green Horizon Bistro",
    ngoName: "Aboriginal Front Door Society",
    itemSummary: "Cooked Jasmine Rice & Braised Lentils (6kg)",
    status: "Pending Verification",
    scheduledTime: "Today 19:15",
    driverName: "Unassigned",
    pickupAddress: "450 Water St",
    urgency: "High",
    verifiedWeightKg: 6.0
  }
];

export const INITIAL_ALERTS = [
  {
    id: "alt-01",
    severity: "urgent",
    itemTitle: "Heavy Whipping Cream 36%",
    message: "Expires TODAY (24h remaining).",
    timeRemaining: "8 hours left",
    suggestedAction: "Use in 'Velvety Whipped Cream Pasta' recipe or donate immediately.",
    actionType: "recipe",
    targetRecipeId: "rec-03"
  },
  {
    id: "alt-02",
    severity: "warning",
    itemTitle: "Organic Baby Spinach & Tomatoes",
    message: "2 produce items expiring in under 36 hours.",
    timeRemaining: "34 hours left",
    suggestedAction: "Match with 'Heirloom Tomato Galette' or donate to Kettle Society (1.2 km).",
    actionType: "donate",
    targetNgoId: "ngo-01"
  },
  {
    id: "alt-03",
    severity: "info",
    itemTitle: "Community Surplus Alert",
    message: "Levain Bakery just listed fresh Sourdough (0.4 km away).",
    timeRemaining: "Pickup ends at 19:00",
    suggestedAction: "View and claim item on Community Marketplace.",
    actionType: "marketplace",
    targetMarketplaceId: "mkt-01"
  }
];
