#!/usr/bin/env python3
"""
Extract text from PowerPoint files without python-pptx library
PPTX files are ZIP archives containing XML files
"""

import zipfile
import xml.etree.ElementTree as ET
import os
import sys

def extract_pptx_text(pptx_path):
    """Extract text from PPTX file by parsing XML"""
    try:
        text_content = []

        with zipfile.ZipFile(pptx_path, 'r') as zip_ref:
            # List all slide files
            slide_files = [f for f in zip_ref.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')]
            slide_files.sort()

            for slide_num, slide_file in enumerate(slide_files, 1):
                try:
                    # Read slide XML
                    xml_content = zip_ref.read(slide_file)

                    # Parse XML
                    root = ET.fromstring(xml_content)

                    # Extract all text elements
                    # Define namespaces
                    namespaces = {
                        'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
                        'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
                        'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
                    }

                    slide_text = []

                    # Find all text elements
                    for t_elem in root.findall('.//a:t', namespaces):
                        if t_elem.text:
                            slide_text.append(t_elem.text)

                    if slide_text:
                        text_content.append(f"\n=== SLIDE {slide_num} ===\n" + "\n".join(slide_text))

                except Exception as e:
                    text_content.append(f"\n=== SLIDE {slide_num} ===\nError: {str(e)}")

        return "\n".join(text_content) if text_content else "No text extracted"

    except Exception as e:
        return f"Error processing {pptx_path}: {str(e)}"

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))

    print("=" * 80)
    print("PowerPoint Extractor for Coptic Lessons")
    print("=" * 80)

    pptx_files = []
    for file in os.listdir(current_dir):
        if file.endswith('.pptx') or file.endswith('.ppt'):
            pptx_files.append(file)

    pptx_files.sort()

    results = {}

    for pptx_file in pptx_files:
        if pptx_file.endswith('.ppt'):
            print(f"\nSkipping {pptx_file} (old format, needs conversion)")
            results[pptx_file] = "OLD FORMAT - Needs manual conversion to PPTX"
            continue

        print(f"\nProcessing: {pptx_file}")
        file_path = os.path.join(current_dir, pptx_file)

        text = extract_pptx_text(file_path)
        results[pptx_file] = text
        print(f"  Extracted {len(text)} characters")

    # Save results
    output_file = os.path.join(current_dir, 'POWERPOINT_LESSONS.txt')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("COPTIC LANGUAGE POWERPOINT LESSONS\n")
        f.write("Extracted content from lesson presentations\n")
        f.write("=" * 80 + "\n\n")

        for filename in sorted(results.keys()):
            f.write("\n" + "=" * 80 + "\n")
            f.write(f"FILE: {filename}\n")
            f.write("=" * 80 + "\n")
            f.write(results[filename])
            f.write("\n\n")

    print(f"\n\nSaved to: {output_file}")
    print(f"Processed {len(results)} PowerPoint files")

if __name__ == "__main__":
    main()
