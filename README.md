# CopticLingo

A cross-platform mobile and web application for learning the Coptic language, built with React Native and Expo.

## Features

- **Progressive Learning Path**: 5 units covering alphabet, vocabulary, grammar, numbers, and family
- **Interactive Exercises**: Multiple choice, fill-in-the-blank, translation, matching, and sentence building
- **Gamification**: XP points, levels, daily streaks, and achievement badges
- **Progress Tracking**: Track completed lessons, vocabulary learned, and performance
- **Spaced Repetition**: Review system to reinforce learning over time
- **Cross-Platform**: Runs on iOS, Android, and Web

## Tech Stack

- **React Native** with TypeScript
- **Expo** for cross-platform builds
- **Zustand** for state management
- **React Navigation** for navigation
- **Expo AV** for audio support

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Expo Go app (for mobile testing)

### Installation

1. Clone the repository:
```bash
cd copticlingo
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
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
copticlingo/
├── src/
│   ├── components/        # Reusable UI components
│   │   └── exercises/     # Exercise type components
│   ├── screens/           # Screen components
│   ├── store/             # Zustand stores (state management)
│   ├── data/              # Lesson content and data
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── hooks/             # Custom React hooks
├── assets/                # Images, audio, fonts
├── App.tsx               # Main app component
└── package.json          # Dependencies and scripts
```

## Lesson Content

### Unit 1: Coptic Alphabet Basics
- Letters Ⲁ-Ⲍ
- Letters Ⲏ-Ⲙ
- Letters Ⲛ-Ⲱ

### Unit 2: Basic Words & Greetings
- Greetings (ⲟⲩϫⲁⲓ - peace, ϣⲉⲡ ϩⲙⲟⲧ - thank you)
- Common words (water, bread, house, earth)

### Unit 3: Basic Grammar
- Articles (ⲡ, ⲧ, ⲛⲓ)
- Simple sentences (ⲁⲛⲟⲕ ⲡⲉ - I am)

### Unit 4: Numbers & Counting
- Numbers 1-10 in Coptic

### Unit 5: Family & People
- Family members (father, mother, brother, sister)

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

### Web
```bash
npm run web
```

## Features Implemented

- ✅ Progressive skill tree with locked/unlocked lessons
- ✅ 5 exercise types (multiple choice, fill blank, translation, matching, sentence building)
- ✅ XP and leveling system
- ✅ Daily streak tracking
- ✅ Achievement badges
- ✅ User profile with statistics
- ✅ Spaced repetition algorithm for review
- ✅ Audio support infrastructure
- ✅ Cross-platform compatibility (iOS, Android, Web)

## Future Enhancements

- Add audio recordings for Coptic pronunciation
- Implement backend for user authentication and cloud sync
- Add more lesson content (Units 6-20)
- Implement leaderboards
- Add offline mode with lesson caching
- Add speech recognition for pronunciation practice
- Implement social features (friend challenges, sharing progress)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Acknowledgments

- Coptic language resources and grammar references
- Duolingo for UX inspiration
- The Coptic community for language preservation efforts
