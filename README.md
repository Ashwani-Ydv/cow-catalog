# Cow Catalog App

A comprehensive React Native mobile application for managing a cattle catalog with features for browsing, searching, filtering, and tracking cow information and events.

## Features

### CA-01: Cow List Screen ✅
- Displays a scrollable list of all cows in the catalog
- Each item shows:
  - Ear tag number (unique identifier)
  - Sex (male/female with icons)
  - Pen location
  - Status badge (Active, In Treatment, Deceased)
  - Date of last recorded event
- Responsive card-based UI with dark mode support

### CA-02: Search and Filters ✅
- **Search**: Real-time search by ear tag number
- **Filters**:
  - Filter by status (All, Active, In Treatment, Deceased)
  - Filter by pen (dynamically generated from existing cows)
- Filter state persists across navigation
- Visual indicators for active filters
- Results counter showing number of matching cows

### CA-03: Add New Cow ✅
- Accessible via floating action button (+) on the list screen
- Form validation with real-time error feedback
- Required fields:
  - Ear tag (unique, validated against existing cows)
  - Sex (male/female selector)
  - Pen (text input)
  - Status (default: Active)
- Optional fields:
  - Weight (must be positive number if provided)
- Creates initial events (creation + optional weight check)
- Modal presentation with cancel/save actions

### CA-04: Cow Detail Screen ✅
- Comprehensive cow information display:
  - Header with ear tag and status badge
  - Sex and pen information with icons
  - Weight statistics card:
    - Current weight
    - Daily weight gain/loss (calculated from weight check history)
    - Visual indicator with trend icon
  - Event timeline:
    - All events sorted by date (most recent first)
    - Color-coded event types with icons
    - Event descriptions and timestamps
    - Visual timeline connector

## Architecture

### Data Layer
- **Types** (`types/cow.ts`): TypeScript interfaces for Cow, Event, Status, Sex, and Filters
- **Storage** (`services/storage.ts`): AsyncStorage-based persistence layer
- **Context** (`contexts/CowContext.tsx`): React Context for state management
- **Utilities** (`utils/cowUtils.ts`): Helper functions for date formatting, calculations, etc.

### UI Layer
- **Screens**:
  - `app/(tabs)/index.tsx`: Main cow list with search and filters
  - `app/add-cow.tsx`: Modal form for adding new cows
  - `app/cow/[id].tsx`: Detailed cow information view
  - `app/(tabs)/explore.tsx`: Developer utilities for managing data
- **Navigation**: Expo Router with tab-based navigation
- **Theming**: Light/dark mode support throughout

### Event Types
- `created`: Initial catalog entry
- `weight_check`: Weight measurement with recorded value
- `treatment`: Medical procedures or interventions
- `pen_move`: Relocation between pens
- `death`: End-of-life event

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository:
```bash
cd cow-catalog
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser

### Loading Sample Data

1. Navigate to the "Tools" tab
2. Tap "Load Sample Data" to add 20 test cows
3. Return to the "Catalog" tab to explore features

## Project Structure

```
cow-catalog/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation configuration
│   │   ├── index.tsx             # Cow list screen (CA-01, CA-02)
│   │   └── explore.tsx           # Developer utilities
│   ├── cow/
│   │   └── [id].tsx              # Cow detail screen (CA-04)
│   ├── _layout.tsx               # Root layout with context provider
│   └── add-cow.tsx               # Add cow form (CA-03)
├── components/                   # Reusable UI components
├── contexts/
│   └── CowContext.tsx            # Global state management
├── services/
│   └── storage.ts                # AsyncStorage persistence
├── types/
│   └── cow.ts                    # TypeScript type definitions
├── utils/
│   ├── cowUtils.ts               # Helper functions
│   └── sampleData.ts             # Sample data generator
└── package.json
```

## Key Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tooling
- **Expo Router**: File-based routing
- **TypeScript**: Type-safe development
- **AsyncStorage**: Local data persistence
- **React Context**: State management
- **Expo Vector Icons**: Icon library

## Features Implemented

✅ CA-01: Cow list with all required information  
✅ CA-02: Search and filter functionality with persistence  
✅ CA-03: Add new cow form with validation  
✅ CA-04: Detailed cow view with timeline and statistics  
✅ Local data persistence  
✅ Dark mode support  
✅ Responsive UI design  
✅ Type-safe codebase  
✅ Sample data generator for testing  

## Development Notes

- All filter states are persisted using AsyncStorage
- Ear tag uniqueness is validated before saving
- Weight gain calculations require at least 2 weight check events
- Event timeline is automatically sorted by date
- The app works completely offline (no backend required)

## Future Enhancements (Not Implemented)

- Edit existing cow information
- Add new events to cow timeline
- Delete cows
- Export data to CSV
- Photo attachments
- Push notifications for treatments
- Multi-language support

## License

This project is created as a demonstration application.