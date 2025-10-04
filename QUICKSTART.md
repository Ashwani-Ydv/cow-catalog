# Quick Start Guide - Cow Catalog App

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm start
```

### 3. Run the App

Choose your preferred platform:

#### iOS (Mac only)
- Press `i` in the terminal
- Or scan the QR code with your iPhone Camera app

#### Android
- Press `a` in the terminal
- Or scan the QR code with the Expo Go app

#### Web
- Press `w` in the terminal
- Or open http://localhost:8081 in your browser

## First Time Usage

1. **Launch the App**
   - The app will start with an empty catalog

2. **Load Sample Data**
   - Navigate to the "Tools" tab (wrench icon at bottom)
   - Tap the "Load Sample Data" button
   - Confirm the action
   - 20 sample cows will be added to the catalog

3. **Explore Features**
   - Return to the "Catalog" tab
   - Browse the list of cows
   - Try searching by ear tag
   - Test the filters (status and pen)
   - Tap any cow to see details
   - Tap the green (+) button to add a new cow

## Key Features to Test

### Search & Filter (CA-02)
1. Tap the search bar at the top
2. Type an ear tag number (e.g., "1234")
3. Tap the filter icon
4. Select different statuses and pens
5. Notice filters persist when navigating away and back

### Add New Cow (CA-03)
1. Tap the green (+) floating button
2. Fill in the form:
   - Enter a unique ear tag
   - Select sex (male/female)
   - Enter a pen (e.g., "A1")
   - Keep status as "Active" or change it
   - Optionally add weight
3. Tap "Add Cow"
4. Find your new cow in the list

### View Details (CA-04)
1. Tap any cow card from the list
2. View comprehensive information:
   - Basic info (tag, sex, pen, status)
   - Weight statistics (if available)
   - Complete event timeline
3. Tap back to return to the list

## Troubleshooting

### Metro Bundler Issues
```bash
# Clear cache and restart
npm start -- --clear
```

### iOS Simulator Issues
```bash
# Reset simulator
xcrun simctl erase all
```

### Android Emulator Issues
```bash
# Cold boot emulator
adb reboot
```

## Development Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Lint code
npm run lint
```

## Project Structure Quick Reference

```
app/
├── (tabs)/
│   ├── index.tsx          → Cow List Screen (main)
│   └── explore.tsx        → Developer Tools
├── cow/
│   └── [id].tsx           → Cow Detail Screen
└── add-cow.tsx            → Add Cow Form

contexts/
└── CowContext.tsx         → State Management

types/
└── cow.ts                 → TypeScript Definitions

services/
└── storage.ts             → Data Persistence

utils/
├── cowUtils.ts            → Helper Functions
└── sampleData.ts          → Test Data Generator
```

## Testing Checklist

- [ ] Load sample data
- [ ] Browse cow list
- [ ] Search by ear tag
- [ ] Filter by status
- [ ] Filter by pen
- [ ] Clear filters
- [ ] Add new cow with all fields
- [ ] Add new cow with only required fields
- [ ] Try adding duplicate ear tag (should fail)
- [ ] View cow details
- [ ] Check weight statistics
- [ ] View event timeline
- [ ] Test dark mode (system settings)
- [ ] Test on different screen sizes

## Data Management

### Clear All Data
1. Go to "Tools" tab
2. Tap "Clear All Data"
3. Confirm the action
4. All cows will be removed

### Load Fresh Sample Data
1. After clearing, tap "Load Sample Data" again
2. New set of 20 cows with random data

## Support

If you encounter any issues:
1. Check the terminal for error messages
2. Try clearing Metro cache: `npm start -- --clear`
3. Restart the app
4. Check that all dependencies are installed

## What's Working

✅ All CA-01 requirements (Cow List)
✅ All CA-02 requirements (Search & Filters)
✅ All CA-03 requirements (Add Cow)
✅ All CA-04 requirements (Detail View)
✅ Dark mode support
✅ Data persistence
✅ Form validation
✅ Sample data generation

Enjoy exploring the Cow Catalog app! 🐄