# CopticLingo

A Duolingo-style language learning app for Bohairic Coptic, built with React Native and Expo.

## Overview

CopticLingo is an interactive language learning application designed to teach Bohairic Coptic through gamified lessons, exercises, and achievement tracking. The app provides a comprehensive curriculum covering the alphabet, grammar, vocabulary, and Biblical passages.

Bohairic Coptic is the dialect currently used in the Coptic Orthodox Church for liturgy and hymns, making it the most practical dialect for modern learners.

## Features

### 📚 Learning System

- **45 Learning Units** organized by difficulty and topic
- **209 Lessons** with comprehensive coverage
- **1,670+ Exercises** across all lesson types
- **Progressive Skill Tree** - Visual learning path with locked/unlocked lessons
- **7 Exercise Types**:
  - **Translation** - Translate between Coptic and English
  - **Sentence Building** - Construct sentences using word banks (with duplicate letter support)
  - **Listening Comprehension** - Listen and answer questions about audio
  - **Speaking Practice** - Record yourself speaking Coptic phrases
  - **Multiple Choice** - Select the correct answer from options
  - **Matching Pairs** - Match Coptic words with English translations (smart disable logic)
  - **Fill-in-the-Blank** - Complete sentences with missing words

### 🎯 Gamification

- **XP System** - Earn experience points for completing lessons (10-50 XP per lesson)
- **Level Progression** - Level up based on total XP earned (100 XP per level)
- **Daily Streaks** - Track consecutive days of practice
- **Achievement System** - 15 achievements including:
  - 🎯 First Steps (complete first lesson)
  - 📚 Getting Started (complete 5 lessons)
  - 🌟 Dedicated Learner (complete 10 lessons)
  - 🏆 Unit Master (complete your first unit)
  - 🔥 On Fire! (3-day streak)
  - ⚡ Week Warrior (7-day streak)
  - ⭐ Rising Star (reach level 5)
  - 💎 Expert (reach level 10)
  - ✨ Perfectionist (100% lesson accuracy)
  - 📖 Word Collector (learn 25 vocabulary words)
  - 📚 Vocabulary Master (learn 50 vocabulary words)
  - 🧙 Word Wizard (learn 100 vocabulary words)
  - 🔤 Alphabet Master (complete all alphabet lessons)
  - 📝 Grammar Guru (complete all grammar units)
  - 📖 Bible Scholar (complete 10 Biblical passage lessons)

### 📊 Progress Tracking

- **Persistent Storage** - Progress saved locally with AsyncStorage
- **Lesson Completion** - Track which lessons you've finished
- **Vocabulary Mastery** - Monitor words learned
- **Mistake Tracking** - Review words you struggle with
- **Spaced Repetition** - Review system using SM-2 algorithm for optimal retention

### 🎨 User Interface

- **Welcome Screen** - Engaging landing page for new users
- **Onboarding Tutorial** - Step-by-step guide for first-time users
- **Home Screen** - View skill tree, streak counter, level, and quick actions
- **Profile Screen** - See detailed stats, all achievements, and progress metrics
- **Review Screen** - Practice mistakes and due reviews with spaced repetition
- **Settings Screen** - Customize app preferences and reset progress
- **Lesson Result Screen** - See performance summary with XP earned
- **Dark Mode** - Full theme support for light and dark modes with automatic switching
- **Developer Mode** - Debug mode for testing with all lessons unlocked (progress not saved)

### 🔊 Audio Support

- **Audio Playback** - Listen to Coptic pronunciation in listening exercises
- **Background Audio** - Managed audio service with proper initialization/cleanup
- **Future: Speech Recording** - Practice speaking exercises (infrastructure ready)

## Tech Stack

- **Framework**: React Native 0.82 with Expo 54
- **Language**: TypeScript 5.9
- **State Management**: React Context API with AsyncStorage
- **Navigation**: Custom state-based navigation system
- **Storage**: @react-native-async-storage/async-storage 2.2.0
- **Audio**: expo-av 16.0
- **Platform Support**: iOS, Android, and Web

## Project Structure

```
copticlingo/
├── src/
│   ├── components/
│   │   ├── exercises/          # Exercise type components
│   │   │   ├── TranslationExercise.tsx
│   │   │   ├── SentenceBuildingExercise.tsx    # Fixed duplicate letter handling
│   │   │   ├── ListeningExercise.tsx
│   │   │   ├── SpeakingExercise.tsx
│   │   │   ├── MultipleChoiceExercise.tsx
│   │   │   ├── MatchingExercise.tsx           # Fixed disable logic
│   │   │   ├── FillInBlankExercise.tsx
│   │   │   └── LessonExercises.tsx
│   │   ├── AchievementModal.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   └── index.ts
│   ├── data/
│   │   ├── lessons.ts           # Main lesson index
│   │   └── unit-XX-*.ts         # 45 modular unit files with 209 lessons, 1,670+ exercises
│   ├── screens/
│   │   ├── WelcomeScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── HomeScreen.tsx       # Skill tree + quick actions
│   │   ├── LessonScreen.tsx
│   │   ├── LessonResultScreen.tsx
│   │   ├── ProfileScreen.tsx    # Stats + achievements
│   │   ├── ReviewScreen.tsx     # Spaced repetition
│   │   ├── ReviewLessonScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── store/
│   │   ├── progressStore.tsx    # User progress context
│   │   ├── achievementStore.tsx # Achievement tracking context
│   │   └── reviewStore.tsx      # Spaced repetition context
│   ├── utils/
│   │   ├── achievementChecker.ts  # Achievement unlock logic
│   │   ├── audioService.ts        # Audio management
│   │   └── spacedRepetition.ts    # SM-2 algorithm
│   └── types/
│       └── index.ts               # TypeScript interfaces
├── App.tsx                        # Main app with Context providers
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, uses npx by default)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
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
- **Web**: Press `w` in the terminal or run `npm run web`
- **iOS**: Press `i` (requires macOS with Xcode)
- **Android**: Press `a` (requires Android Studio)

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Start on Android device/emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start web version

## Development Notes

### State Management Migration

The app originally used Zustand 5.x for state management but was migrated to React Context API due to compatibility issues with React Native Web. Zustand's devtools middleware used `import.meta.env` syntax which caused "SyntaxError: import.meta is only valid inside modules" errors in the web bundle.

**Solution**: Replaced all three Zustand stores with React Context providers:
- `ProgressProvider` - User progress and stats
- `AchievementProvider` - Achievement tracking
- `ReviewProvider` - Spaced repetition data

All stores use AsyncStorage for automatic persistence.

### Known Issues Fixed

- ✅ **Duplicate letter bug** (SentenceBuildingExercise.tsx:23-37) - Changed from value-based filtering to index-based filtering so duplicate letters (e.g., "a", "b", "b", "a") can be selected independently
- ✅ **Matching exercise disable logic** (MatchingExercise.tsx:26-85) - Incorrect matches now only disable the left side, correct matches disable both sides, allowing retry of wrong answers
- ✅ **Achievement unlocking** (LessonScreen.tsx:34-105) - Fixed timing issue where achievements checked stale state; now calculates updated values locally before checking
- ✅ **Zustand import.meta errors** - Migrated to React Context API

## Curriculum Overview

### Units 1-3: Foundations (12 lessons)
- Unit 1: Coptic Alphabet (Ⲁ-Ⲱ)
- Unit 2: Pronunciation Rules
- Unit 3: First Words & Basic Vocabulary

### Units 4-8: Core Grammar (25 lessons)
- Unit 4: Definite Article (Ⲡⲓ, Ϯ, Ⲛⲓ)
- Unit 5: Indefinite Article (ⲟⲩ, ϩⲁⲛ)
- Unit 6: Subject Pronouns
- Unit 7: Possessive Pronouns
- Unit 8: "To Be" - Copula Sentences (ⲡⲉ, ⲧⲉ, ⲛⲉ)

### Units 9-14: Verb System (30 lessons)
- Unit 9: Common Verbs
- Unit 10: Present Tense
- Unit 11: Perfect/Past Tense
- Unit 12: Future Tense
- Unit 13: Imperative Mood (Commands)
- Unit 14: Suffix Pronouns (Object Pronouns)

### Units 15-25: Advanced Grammar (55 lessons)
- Units 15-22: Core advanced grammar (prepositions, demonstratives, questions, negation, relative clauses, existentials, genitive, conditionals)
- Units 23-25: Complex grammar (temporal clauses, causative, participles)

### Units 26-30: Vocabulary & Application (35 lessons)
- Unit 26: Extended Vocabulary
- Units 27-30: Biblical & liturgical texts (Lord's Prayer, Gospels, Liturgy, Reading & Composition)

### Units 31-45: Comprehensive Biblical & Liturgical Studies (62 lessons)
- Advanced Gospel readings and analysis
- Liturgical Coptic texts and prayers
- Psalms and hymns
- Church vocabulary and usage
- Reading comprehension and composition

**Total: 45 units • 209 lessons • 1,670+ exercises**

## Feature Status

### Completed ✅
- [x] Core learning system with 7 exercise types
- [x] 45 units with 209 lessons and 1,670+ exercises
- [x] Progress tracking and persistence
- [x] Achievement system (15 achievements)
- [x] Daily streak tracking
- [x] XP and leveling system
- [x] Spaced repetition review system
- [x] Onboarding tutorial
- [x] Profile and statistics screen
- [x] Settings screen with reset functionality
- [x] Audio playback support
- [x] Complete navigation flow
- [x] Web platform support
- [x] React Context state management
- [x] AsyncStorage persistence
- [x] Modular unit architecture
- [x] Bohairic dialect corrections throughout curriculum

### In Progress 🚧
- [ ] Audio pronunciation for all vocabulary words
- [ ] Speech recording implementation for speaking exercises
- [ ] Unit completion celebration animations
- [ ] More lesson content (expand existing units)

### Planned - High Priority 📋
- [ ] Offline mode improvements
- [ ] Dictionary/reference section with all vocabulary
- [ ] Lesson notes and bookmarks
- [ ] Advanced statistics dashboard
- [ ] Export/import progress functionality
- [ ] Push notifications for streak reminders
- [ ] Dark mode support
- [ ] Haptic feedback on interactions

### Planned - Medium Priority 🔮
- [ ] Custom lesson creation tool
- [ ] Flashcard mode for vocabulary review
- [ ] Cultural notes and historical context
- [ ] Practice mode customization (difficulty, types)
- [ ] Audio recording quality improvements
- [ ] Accessibility improvements (screen reader, high contrast)
- [ ] Multiple UI languages (Arabic, Greek, English)
- [ ] Tablet/iPad optimized layouts
- [ ] Keyboard shortcuts for web

### Future Enhancements - Low Priority 🌟
- [ ] Backend API for cloud sync
- [ ] User accounts and authentication
- [ ] Cross-device progress sync
- [ ] Social features (leaderboards, friends)
- [ ] Community forums and discussions
- [ ] Teacher/classroom mode
- [ ] Lesson marketplace (user-created content)
- [ ] Premium features and monetization
- [ ] Desktop standalone app (Electron)
- [ ] Voice recognition for pronunciation scoring

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Guidelines

1. **Code Style**: Follow TypeScript best practices and existing patterns
2. **Components**: Use functional components with hooks
3. **State**: Use Context API for global state, useState for local state
4. **Storage**: Persist important data with AsyncStorage
5. **Types**: Maintain strong typing throughout - no `any` types
6. **Testing**: Test all exercise types and navigation flows
7. **Commits**: Write clear commit messages describing changes

### Adding New Lessons

1. Edit `src/data/lessons.ts`
2. Add to the appropriate unit or create a new unit
3. Follow the existing `Lesson` interface structure
4. Add exercises with proper types (translation, multipleChoice, etc.)
5. Include XP rewards (10-50 based on difficulty)
6. Test the lesson thoroughly in the app

### Adding New Exercise Types

1. Create component in `src/components/exercises/`
2. Implement the exercise props interface
3. Handle user input and answer checking
4. Add success/failure feedback UI
5. Update `LessonExercises.tsx` to include new type
6. Update `Exercise` type in `src/types/index.ts`
7. Add example to lesson data

### Adding New Achievements

1. Add achievement object to `initialAchievements` in `achievementStore.tsx`
2. Include: id, title, description, icon, unlocked: false
3. Add unlock logic to `LessonScreen.tsx` handleLessonComplete
4. Test achievement triggers correctly

## Testing

Currently manual testing. Automated testing framework (Jest/React Testing Library) to be added.

### Manual Test Checklist

**Core Features:**
- [ ] Complete a lesson from start to finish
- [ ] Test all 7 exercise types work correctly
- [ ] Verify achievement unlocking (first lesson, perfect score)
- [ ] Check progress persistence (close/reopen app)
- [ ] Test streak calculation (complete lesson, return next day)
- [ ] Verify review system shows mistakes
- [ ] Test navigation between all screens

**Exercise-Specific:**
- [ ] Sentence building with duplicate letters ("abba" example)
- [ ] Matching exercise correct/incorrect disable behavior
- [ ] Audio playback in listening exercises
- [ ] Multiple choice answer selection
- [ ] Fill-in-blank text input

**Platforms:**
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on web browser (Chrome, Safari, Firefox)
- [ ] Test on physical device

**Edge Cases:**
- [ ] Reset progress and start fresh
- [ ] Complete all lessons in a unit
- [ ] Reach level 10+
- [ ] Build 7+ day streak
- [ ] Get 100% on a lesson

## Troubleshooting

### Web Build Errors

**Problem**: "SyntaxError: import.meta is only valid inside modules"

**Solution**: This was caused by Zustand. The app now uses React Context API instead. If you encounter this:
1. Ensure all store files use `.tsx` extension (not `.ts`)
2. Clear cache: `rm -rf .expo node_modules/.cache`
3. Restart dev server: `npx expo start --clear`

### Audio Not Playing

**Problem**: Audio files not found or failing to play

**Solution**:
1. Check `audioService.ts` initialization
2. Ensure audio files exist in expected paths
3. Verify Expo AV permissions

### Progress Not Saving

**Problem**: Progress resets after closing app

**Solution**:
1. Check AsyncStorage permissions
2. Verify Context providers are wrapping App
3. Check browser localStorage (for web)

## License

[License to be determined - currently unlicensed]

## Acknowledgments

- **Coptic Church** - For preserving the Coptic language
- **St. Shenouda Coptic Society** - Coptic language resources
- **Duolingo** - UX/UI inspiration and gamification concepts
- **React Native Community** - Excellent framework and ecosystem
- **Expo Team** - Making cross-platform development seamless

## Contact

For questions, suggestions, or contributions, please open an issue on GitHub.

## Additional Resources

- **[Coptic Resources Repository](https://github.com/pishoyg/coptic)** - Comprehensive collection of Coptic language resources, tools, and references

---

**Version**: 1.0.0
**Last Updated**: January 12, 2025
**Status**: Active Development
**Platforms**: iOS, Android, Web
**Language**: Bohairic Coptic
