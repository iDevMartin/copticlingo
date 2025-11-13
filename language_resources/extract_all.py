#!/usr/bin/env python3
"""
Comprehensive Coptic Language Resources Extractor
Extracts text from all PDFs and creates a master resource file
"""

import fitz  # PyMuPDF
import os
import sys
from pathlib import Path
import json

def extract_pdf_text(pdf_path):
    """Extract text from a PDF file"""
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page_num, page in enumerate(doc, 1):
            page_text = page.get_text()
            if page_text.strip():
                text += f"\n--- Page {page_num} ---\n{page_text}"
        doc.close()
        return text
    except Exception as e:
        return f"Error extracting {pdf_path}: {str(e)}"

def process_all_pdfs(directory):
    """Process all PDFs in directory and subdirectories"""
    results = {}

    # Walk through directory
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.pdf'):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, directory)
                print(f"Processing: {relative_path}")

                text = extract_pdf_text(file_path)
                results[relative_path] = {
                    'filename': file,
                    'path': relative_path,
                    'content': text,
                    'size': len(text)
                }

    return results

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))

    print("=" * 80)
    print("Coptic Language Resources Extractor")
    print("=" * 80)

    # Process all PDFs
    print("\nExtracting PDFs...")
    pdf_results = process_all_pdfs(current_dir)

    print(f"\nProcessed {len(pdf_results)} PDF files")

    # Save to JSON for inspection
    output_json = os.path.join(current_dir, 'extracted_content.json')
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(pdf_results, f, ensure_ascii=False, indent=2)

    print(f"\nSaved extraction data to: {output_json}")

    # Create master text file
    output_txt = os.path.join(current_dir, 'MASTER_COPTIC_RESOURCES.txt')
    with open(output_txt, 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("MASTER COPTIC LANGUAGE LEARNING RESOURCES\n")
        f.write("Comprehensive compilation for CopticLingo lesson generation\n")
        f.write("=" * 80 + "\n\n")

        # Sort files for organized output
        sorted_files = sorted(pdf_results.items(), key=lambda x: x[0])

        for relative_path, data in sorted_files:
            f.write("\n" + "=" * 80 + "\n")
            f.write(f"FILE: {relative_path}\n")
            f.write("=" * 80 + "\n")
            f.write(data['content'])
            f.write("\n\n")

    print(f"Created master file: {output_txt}")
    print("\nExtraction complete!")

    # Print summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    for relative_path, data in sorted(pdf_results.items()):
        print(f"{relative_path}: {data['size']:,} characters")

if __name__ == "__main__":
    main()
