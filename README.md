# ReRoot — Regenerative Food Waste Management System

> **A design thinking prototype for hyper-local food waste prevention, pantry expiry tracking, mutual-aid shelter redistribution, and community food sharing.**

---

## 🌿 Core Features

1. **Editorial Landing Page**:
   - Asymmetric split hero with 2-line maximum heading.
   - Interactive Problem-Story comparison (Linear Landfill Pipeline vs. Circular ReRoot Regeneration).
   - Real-time animated counters: Waste Diverted (142.8 tonnes), Meals Matched (124,500), CO2e Averted (312 tonnes).
   - Gapless 12-column Bento feature showcase.
   - Continuous partner & chef testimonial marquee.

2. **Active Food Inventory Tracker**:
   - Shelf-life buffer countdown indicators with color-coded urgency chips (`<24h`, `2-3d`, `4+d`).
   - Category filtering (Produce, Bakery, Dairy, Pantry, Prepared Meals, Proteins).
   - Storage location sorting (Fridge, Pantry, Freezer, Countertop).
   - Quick actions: **Mark as Consumed** (+50 Eco XP), **Donate to Shelter**, **Find Recipes**, and **Discard**.
   - Card grid and high-density Table view modes.
   - Quick-add food modal with pantry presets.

3. **Smart Expiry Alerts & Nudges**:
   - Contextual radar banners for items approaching expiration with 1-click recipe or donation actions.

4. **Mutual-Aid Redistribution & Shelter Matchmaker**:
   - Interactive topographical canvas map with custom shelter pins and 2km radius indicator.
   - Shelter profiles with operating hours, intake urgency, cold storage readiness, and accepted provisions.
   - Multi-item donation scheduler with volunteer cargo-bike courier dispatching.

5. **Waste Diversion & Carbon Analytics**:
   - Recharts monthly biomass trend area chart (Diverted vs. Discarded in kg).
   - Category diversion donut chart.
   - Financial capital preserved ($ CAD) monthly bar chart.
   - Destination split breakdown (Consumed, Shelter, Neighbors, Compost).

6. **Neighborhood Surplus Marketplace**:
   - Hyper-local gift economy for sharing extra portions and garden harvests.
   - Dietary & allergen tags (Vegan, Halal, Gluten-Free, Nut-Free).
   - 1-click portion reservation and claim flow.

7. **Zero-Waste Culinary Generator**:
   - Live scanning of crisper inventory matching available ingredients to chef-crafted recipes.
   - Match percentage indicators and chef's zero-scrap cooking techniques.
   - 1-click "Mark Ingredients as Cooked" action.

8. **Gamification & Community Champions**:
   - Eco-Score & level tier progression (Canopy Guardian -> Ecosystem Steward).
   - 19-day zero-discard streak counter.
   - Tiered badges (Bronze, Silver, Gold, Diamond) with criteria.
   - Community diversion leaderboard.

9. **NGO Dispatch Logistics**:
   - Dedicated intake portal for shelter coordinators.
   - Status pipeline (*Pending Verification → Scheduled → En Route → Completed*).
   - Certified scale weight intake modal for official donation receipts.

10. **Profile, Settings & Onboarding**:
    - Perspective switcher: **Home Cook**, **Local Bakery/Cafe**, **NGO Food Bank**.
    - Notification controls, dietary preferences, and measurement unit toggle (Metric vs. Imperial).
    - 4-step interactive onboarding walkthrough tour.

---

## 🎨 Design System

- **Palette**: Earthy and sustainable — Forest Green (`#2D5016`), Terracotta (`#C4652E`), Wheat (`#D4A747`), Warm Cream (`#FAF7F2`), Sand (`#D4CBBF`), Charcoal Night (`#1A1714`).
- **Typography**: Google Fonts `Outfit` (display) + `Source Serif 4` (editorial body) + `JetBrains Mono` (numerical data).
- **Dark Mode**: Complete CSS custom property tokens with smooth theme transitions.
- **Local Persistence**: Client-side state persistence via `localStorage` with React Context.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/thanusrajm05-code/food-waste-management-.git
cd food-waste-management-

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📦 Tech Stack

- **Framework**: React 19 + Vite 8
- **Charts**: Recharts
- **Icons**: Phosphor Icons (`@phosphor-icons/react`)
- **Animation**: Framer Motion
- **Styling**: Vanilla CSS Design Tokens (Earthy / Sustainable Design System)
