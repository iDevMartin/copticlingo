#!/usr/bin/env python3
"""
Create the ultimate master file for Coptic language learning
Combines all extracted content with proper categorization
"""

import os
import json

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Read all extracted data
    json_file = os.path.join(current_dir, 'extracted_content.json')
    with open(json_file, 'r', encoding='utf-8') as f:
        pdf_data = json.load(f)

    # Read PowerPoint data
    pptx_file = os.path.join(current_dir, 'POWERPOINT_LESSONS.txt')
    with open(pptx_file, 'r', encoding='utf-8') as f:
        pptx_content = f.read()

    # Read dictionary data
    dict_file = os.path.join(current_dir, 'COPTIC_DICTIONARY.txt')
    with open(dict_file, 'r', encoding='utf-8') as f:
        dict_content = f.read()

    # Create comprehensive master file
    output_file = os.path.join(current_dir, 'COPTICLINGO_MASTER_RESOURCE.md')

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("""# COPTICLINGO MASTER LANGUAGE RESOURCE FILE

================================================================================
COMPREHENSIVE COPTIC LANGUAGE LEARNING DATABASE
For CopticLingo Duolingo-Style App Development
================================================================================

## Purpose
This master file contains all extracted content from Coptic language resources
to be used as a knowledge base for generating lessons, exercises, and content
for the CopticLingo mobile/web application.

## Contents Overview
1. Alphabet & Pronunciation
2. Grammar Rules & Lessons
3. Vocabulary (Beginner to Advanced)
4. Phrases & Expressions
5. Dictionary Entries
6. Lesson Plans & Curriculum
7. Bible Verses & Liturgical Text
8. Linguistic Analysis

## Usage for Lesson Generation
Use this resource to:
- Generate progressive lesson paths
- Create vocabulary exercises
- Build grammar explanations
- Design translation exercises
- Develop listening/speaking exercises
- Create cultural context

================================================================================

""")

        # Section 1: Alphabet & Pronunciation
        f.write("\n" + "=" * 80 + "\n")
        f.write("# SECTION 1: ALPHABET & PRONUNCIATION\n")
        f.write("=" * 80 + "\n\n")

        alphabet_files = [
            'Coptic Lesson 1 - Alphabets.pptx',
            'Coptic Lesson 9 - Pronunciation.pptx',
            'CopticLettersBooklet.pdf',
            'coptic_lesson1.pdf',
            'coptic_lesson_intro.pdf'
        ]

        f.write(pptx_content)  # Contains alphabet lessons

        for filename in alphabet_files:
            if filename.endswith('.pdf'):
                for key, data in pdf_data.items():
                    if filename in key:
                        f.write(f"\n## {data['filename']}\n")
                        f.write(data['content'])
                        f.write("\n\n")

        # Section 2: Grammar
        f.write("\n" + "=" * 80 + "\n")
        f.write("# SECTION 2: GRAMMAR RULES & LESSONS\n")
        f.write("=" * 80 + "\n\n")

        grammar_files = [
            'coptic_garmmer.pdf',
            'introductory-sahidic-coptic-grammar_john-martin-plumley-1948.pdf',
            'Coptic Lesson 13 - Definite & Indefinite Articles.pptx',
            'Coptic Lesson 14 - Coptic Pronouns.pptx',
            'Coptic Lesson 15 - Coptic Relative Pronouns.pptx',
            'Coptic Lesson 16 - Coptic Possessive Adjectives.pptx',
            'Coptic Lesson 17 - Coptic Present Tense.pptx',
            'Coptic Lesson 18 - Coptic Past Tense.pptx',
            'Coptic Lesson 19 - Past Continuous Tense.pptx',
            'Coptic Lesson 20 - Coptic Future Tense.pptx',
            'Coptic Lesson 21 - Suffix Pronouns.pptx',
            'Coptic Lesson 22 - Possesive Article OF.pptx'
        ]

        for filename in grammar_files:
            if filename.endswith('.pdf'):
                for key, data in pdf_data.items():
                    if filename in key:
                        f.write(f"\n## {data['filename']}\n")
                        f.write(data['content'])
                        f.write("\n\n")

        # Section 3: Vocabulary
        f.write("\n" + "=" * 80 + "\n")
        f.write("# SECTION 3: VOCABULARY\n")
        f.write("=" * 80 + "\n\n")

        vocab_files = [
            'Coptic Vocabulary beginners.pdf',
            'Coptic Vocabulary intermediate.pdf'
        ]

        for filename in vocab_files:
            for key, data in pdf_data.items():
                if filename in key:
                    f.write(f"\n## {data['filename']}\n")
                    f.write(data['content'])
                    f.write("\n\n")

        # Section 4: Phrases & Expressions
        f.write("\n" + "=" * 80 + "\n")
        f.write("# SECTION 4: PHRASES & EXPRESSIONS\n")
        f.write("=" * 80 + "\n\n")

        phrase_files = [
            'Coptic Phrases.pdf',
            'Coptic Greetings.pdf',
            'Coptic Expressions for daily use.pdf',
            'Coptic Liturgical Phrases.pdf'
        ]

        for filename in phrase_files:
            for key, data in pdf_data.items():
                if filename in key:
                    f.write(f"\n## {data['filename']}\n")
                    f.write(data['content'])
                    f.write("\n\n")

        # Section 5: Dictionaries
        f.write("\n" + "=" * 80 + "\n")
        f.write("# SECTION 5: COMPREHENSIVE DICTIONARIES\n")
        f.write("=" * 80 + "\n\n")

        f.write("## Coptic-English Dictionary (HTML Extracted)\n")
        f.write(dict_content)
        f.write("\n\n")

        dict_files = [
            'Azevedo J. - A Simplified Coptic Dictionary. Sahidic Dialect.pdf',
            'Coptic English Lexicon.pdf',
            'English Coptic Lexicon.pdf',
            'english:coptic mini lexicon.pdf'
        ]

        for filename in dict_files:
            for key, data in pdf_data.items():
                if filename in key:
                    f.write(f"\n## {data['filename']}\n")
                    f.write(data['content'])
                    f.write("\n\n")

        # Section 6: Lesson Plans & Curriculum
        f.write("\n" + "=" * 80 + "\n")
        f.write("# SECTION 6: LESSON PLANS & CURRICULUM\n")
        f.write("=" * 80 + "\n\n")

        curriculum_files = [
            'CopticCurriculum.pdf',
            'CopticLessons.pdf',
            'CopticLanguageLessons.pdf',
            'ft-coptic language-lectures.pdf'
        ]

        for filename in curriculum_files:
            for key, data in pdf_data.items():
                if filename in key:
                    f.write(f"\n## {data['filename']}\n")
                    f.write(data['content'])
                    f.write("\n\n")

        # Add lessons folder content
        f.write("\n## Additional Lessons (lessons folder)\n")
        for key, data in sorted(pdf_data.items()):
            if key.startswith('lessons/'):
                f.write(f"\n### {data['filename']}\n")
                f.write(data['content'])
                f.write("\n\n")

        # Section 7: Reading Materials
        f.write("\n" + "=" * 80 + "\n")
        f.write("# SECTION 7: READING & PRACTICE MATERIALS\n")
        f.write("=" * 80 + "\n\n")

        reading_files = [
            'Coptic Lesson 6 - Reading.pptx',
            'Coptic Bible Verses.pdf',
            'coptic_lesson2.pdf',
            'coptic_lesson3.pdf',
            'coptic_lesson4.pdf'
        ]

        for filename in reading_files:
            if filename.endswith('.pdf'):
                for key, data in pdf_data.items():
                    if filename in key:
                        f.write(f"\n## {data['filename']}\n")
                        f.write(data['content'])
                        f.write("\n\n")

        # Section 8: Linguistic Analysis
        f.write("\n" + "=" * 80 + "\n")
        f.write("# SECTION 8: LINGUISTIC ANALYSIS & CONTEXT\n")
        f.write("=" * 80 + "\n\n")

        linguistic_files = [
            'coptic-lexical-influence-on-egyptian-arabic.pdf'
        ]

        for filename in linguistic_files:
            for key, data in pdf_data.items():
                if filename in key:
                    f.write(f"\n## {data['filename']}\n")
                    f.write(data['content'])
                    f.write("\n\n")

        # Appendix: Remaining files
        f.write("\n" + "=" * 80 + "\n")
        f.write("# APPENDIX: ADDITIONAL MATERIALS\n")
        f.write("=" * 80 + "\n\n")

        processed_files = set(alphabet_files + grammar_files + vocab_files +
                            phrase_files + dict_files + curriculum_files +
                            reading_files + linguistic_files)

        f.write("## Other Materials\n\n")
        for key, data in sorted(pdf_data.items()):
            if not any(pf in key for pf in processed_files) and not key.startswith('lessons/'):
                f.write(f"\n### {data['filename']}\n")
                f.write(data['content'])
                f.write("\n\n")

        # End
        f.write("\n" + "=" * 80 + "\n")
        f.write("# END OF MASTER RESOURCE FILE\n")
        f.write("=" * 80 + "\n")
        f.write("\nTotal resources compiled: {} PDFs + PowerPoint lessons + Dictionary\n".format(len(pdf_data)))
        f.write("Generated for: CopticLingo Language Learning Application\n")
        f.write("Purpose: AI-powered lesson generation and content creation\n")

    print("=" * 80)
    print("MASTER FILE CREATED SUCCESSFULLY!")
    print("=" * 80)
    print(f"\nFile: {output_file}")

    file_size = os.path.getsize(output_file)
    print(f"Size: {file_size:,} bytes ({file_size / 1024 / 1024:.2f} MB)")

    with open(output_file, 'r', encoding='utf-8') as f:
        content = f.read()
        print(f"Characters: {len(content):,}")
        print(f"Lines: {content.count(chr(10)):,}")

    print("\n" + "=" * 80)
    print("This file contains:")
    print("- Alphabet & Pronunciation lessons")
    print("- Complete grammar rules and verb tenses")
    print("- Beginner to intermediate vocabulary")
    print("- Common phrases and expressions")
    print("- Comprehensive dictionaries (Coptic-English & English-Coptic)")
    print("- Structured lesson plans and curriculum")
    print("- Reading materials and Bible verses")
    print("- Linguistic analysis")
    print("=" * 80)

if __name__ == "__main__":
    main()
