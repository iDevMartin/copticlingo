# COPTICLINGO DEVELOPER QUICK REFERENCE

## Files Overview

This directory contains comprehensive Coptic language resources processed and organized for the CopticLingo application.

### Core Files

#### 1. `COPTICLINGO_MASTER_RESOURCE.md` (14.47 MB)
**The complete knowledge base** - Contains all extracted content from 40+ PDFs, PowerPoint presentations, and dictionary files.

**Sections:**
- Section 1: Alphabet & Pronunciation
- Section 2: Grammar Rules & Lessons (articles, pronouns, verb tenses)
- Section 3: Vocabulary (beginner to intermediate)
- Section 4: Phrases & Expressions (greetings, daily use, liturgical)
- Section 5: Comprehensive Dictionaries (Coptic→English, English→Coptic)
- Section 6: Lesson Plans & Curriculum
- Section 7: Reading & Practice Materials
- Section 8: Linguistic Analysis

**Use for:**
- AI lesson generation
- Content validation
- Grammar rule reference
- Vocabulary extraction
- Cultural context

#### 2. `LESSON_GENERATION_SYSTEM_PROMPT.md`
**AI instruction manual** - Complete system prompt for generating Coptic lessons in Duolingo style.

**Contains:**
- Coptic language overview
- Complete alphabet (32 letters)
- Grammar concepts (articles, pronouns, verb tenses)
- 7 exercise type templates (JSON format)
- Gamification guidelines (XP, badges)
- Vocabulary organized by themes
- Cultural context integration
- Lesson generation format (JSON schema)

**Use for:**
- Configuring AI lesson generator
- Understanding lesson structure
- Implementing exercise types
- Building gamification system

### Supporting Files

#### 3. `MASTER_COPTIC_RESOURCES.txt`
Raw extracted text from all PDF files (unorganized).

#### 4. `POWERPOINT_LESSONS.txt`
Extracted content from PowerPoint presentations (Lessons 1-22).

#### 5. `COPTIC_DICTIONARY.txt`
HTML dictionary entries extracted and converted to text.

#### 6. `extracted_content.json`
JSON database of all extracted PDF content with metadata.

### Extraction Scripts (Python)

- `extract_all.py` - Extracts all PDF files
- `extract_pptx.py` - Extracts PowerPoint presentations
- `extract_dictionary.py` - Extracts HTML dictionary files
- `create_master.py` - Creates the organized master file

## Quick Start for Developers

### Using the Master Resource File

```python
# Example: Load master resource for AI processing
with open('COPTICLINGO_MASTER_RESOURCE.md', 'r', encoding='utf-8') as f:
    coptic_knowledge_base = f.read()

# Feed to AI with system prompt
system_prompt = open('LESSON_GENERATION_SYSTEM_PROMPT.md', 'r').read()

# Generate lesson
lesson = ai_generate_lesson(
    system_prompt=system_prompt,
    knowledge_base=coptic_knowledge_base,
    unit=1,
    lesson_number=1,
    difficulty="beginner"
)
```

### Lesson Generation Workflow

```
1. Load system prompt (LESSON_GENERATION_SYSTEM_PROMPT.md)
2. Load knowledge base (COPTICLINGO_MASTER_RESOURCE.md)
3. Specify lesson parameters (unit, level, topic)
4. AI generates structured lesson (JSON format)
5. Validate output against schema
6. Generate audio files for Coptic text
7. Save lesson to database
```

## Key Coptic Concepts for Developers

### Unicode Support
- **Range**: U+2C80 to U+2CFF
- **Characters**: 32 Coptic letters
- **Fonts**: Ensure app supports Coptic fonts (e.g., "New Athena Unicode", "Antinoou")

### Alphabet Structure
```javascript
const copticAlphabet = [
  // Greek-derived (24 letters)
  { letter: 'Α', name: 'alpha', sound: 'a' },
  { letter: 'Β', name: 'beta', sound: 'b' },
  // ... (22 more)

  // Demotic-derived (6-7 letters)
  { letter: 'Ϣ', name: 'shai', sound: 'sh' },
  { letter: 'Ϥ', name: 'fai', sound: 'f' },
  { letter: 'Ϧ', name: 'hori', sound: 'kh' },
  { letter: 'Ϩ', name: 'hori', sound: 'h' },
  { letter: 'Ϫ', name: 'janja', sound: 'j' },
  { letter: 'Ϭ', name: 'chima', sound: 'ch' },
  { letter: 'Ϯ', name: 'ti', sound: 't' }
];
```

### Grammar Patterns

**Articles:**
```javascript
const articles = {
  definite: {
    masculine: 'ⲡ',
    feminine: 'ⲧ',
    plural: 'ⲛ'
  },
  indefinite: 'ⲟⲩ'
};
```

**Verb Tenses:**
```javascript
const verbPatterns = {
  present: { prefix: 'ϯ', example: 'ϯⲥⲱⲧⲙ (I hear)' },
  past: { prefix: 'ⲁⲓ', example: 'ⲁⲓⲥⲱⲧⲙ (I heard)' },
  future: { prefix: 'ϯⲛⲁ', example: 'ϯⲛⲁⲥⲱⲧⲙ (I will hear)' }
};
```

### Exercise Type Implementation

Each exercise type from the system prompt should be implemented as a component:

```typescript
interface Exercise {
  type: 'multiple_choice' | 'translation' | 'fill_blank' |
        'matching' | 'sentence_builder' | 'listening' | 'speaking';
  question: string;
  correct: string | number | string[];
  options?: string[];
  audio?: string;
  hints?: string[];
  // ... type-specific fields
}
```

### Gamification System

```typescript
interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  badges: Badge[];
  lessonsCompleted: number;
  vocabulary: string[]; // Learned words
}

interface Badge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  dateUnlocked?: Date;
}
```

## Database Schema Recommendations

### Lessons Table
```sql
CREATE TABLE lessons (
  id VARCHAR(50) PRIMARY KEY,
  unit INT NOT NULL,
  lesson_number INT NOT NULL,
  title VARCHAR(200),
  difficulty ENUM('beginner', 'elementary', 'intermediate', 'advanced'),
  estimated_time_minutes INT,
  xp_reward INT,
  content JSON, -- Full lesson data
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Vocabulary Table
```sql
CREATE TABLE vocabulary (
  id INT PRIMARY KEY AUTO_INCREMENT,
  coptic VARCHAR(100) NOT NULL,
  transliteration VARCHAR(100),
  english VARCHAR(200),
  type VARCHAR(50), -- noun, verb, adjective, etc.
  audio_url VARCHAR(255),
  introduced_in_lesson VARCHAR(50),
  FOREIGN KEY (introduced_in_lesson) REFERENCES lessons(id)
);
```

### User Progress Table
```sql
CREATE TABLE user_progress (
  user_id INT,
  lesson_id VARCHAR(50),
  completed BOOLEAN,
  score INT,
  attempts INT,
  last_attempt TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);
```

## Audio File Management

### Naming Convention
```
{coptic_word_transliteration}.mp3
Example: oujai.mp3 (for ⲟⲩϫⲁⲓ)
```

### Storage Structure
```
/audio
  /alphabet
    alpha.mp3
    beta.mp3
    ...
  /vocabulary
    oujai.mp3
    shep_hmot.mp3
    ...
  /phrases
    peace_greeting.mp3
    ...
  /exercises
    lesson_1_1_q1.mp3
    ...
```

### Text-to-Speech Options
- Record native speakers (preferred)
- Use Coptic TTS if available
- Provide IPA transcriptions for accuracy

## API Endpoints (Suggested)

```
GET  /api/lessons                    # List all lessons
GET  /api/lessons/:id                # Get specific lesson
GET  /api/lessons/unit/:unit         # Get lessons by unit
POST /api/lessons/:id/complete       # Mark lesson complete
GET  /api/vocabulary                 # Get all vocabulary
GET  /api/vocabulary/search?q=       # Search vocabulary
GET  /api/user/progress              # Get user progress
POST /api/user/progress              # Update user progress
GET  /api/audio/:filename            # Stream audio file
```

## Testing Guidelines

### Content Validation
1. All Coptic text uses Unicode U+2C80-2CFF
2. Transliterations are consistent
3. Translations are accurate
4. Audio files exist for all Coptic content
5. Grammar explanations match source materials

### Exercise Validation
1. All correct answers are verified
2. Distractors (wrong options) are plausible
3. Hints don't give away answers
4. Difficulty progression is smooth
5. No duplicate exercises in same lesson

## Resource Statistics

- **Total PDF files**: 40
- **PowerPoint presentations**: 20 (6 old format .ppt, 14 .pptx)
- **Dictionary entries**: 1500+ (HTML files)
- **Lessons extracted**: 22+ structured lessons
- **Grammar topics**: 10+ major concepts
- **Vocabulary items**: 500+ words documented
- **Total content**: 15+ million characters

## Next Steps for Development

1. **Set up database** with schema for lessons, vocabulary, user progress
2. **Implement lesson loader** to parse JSON lesson format
3. **Create exercise components** for each exercise type
4. **Build audio system** for Coptic pronunciation
5. **Design UI/UX** following Duolingo patterns
6. **Integrate AI** using system prompt for dynamic content generation
7. **Add gamification** (XP, streaks, badges)
8. **Implement spaced repetition** algorithm
9. **Create admin panel** for content management
10. **Test with native speakers** and Coptic scholars

## Contact & Resources

### Coptic Language Resources
- St. Shenouda Coptic Society
- Coptic Orthodox Church websites
- Academic Coptic dictionaries

### Development Resources
- Unicode Consortium (Coptic block documentation)
- Coptic fonts (New Athena Unicode, Antinoou)
- Language learning frameworks (React Native, PWA)

---

**Note**: This is a living document. Update as the project evolves and new resources are added.

Last Updated: 2025-11-12
