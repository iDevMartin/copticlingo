#!/usr/bin/env python3
"""
Extract Coptic dictionary from HTML files
"""

import os
import re
from html.parser import HTMLParser

class HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.in_script = False
        self.in_style = False

    def handle_starttag(self, tag, attrs):
        if tag.lower() == 'script':
            self.in_script = True
        elif tag.lower() == 'style':
            self.in_style = True

    def handle_endtag(self, tag):
        if tag.lower() == 'script':
            self.in_script = False
        elif tag.lower() == 'style':
            self.in_style = False

    def handle_data(self, data):
        if not self.in_script and not self.in_style:
            text = data.strip()
            if text:
                self.text.append(text)

    def get_text(self):
        return '\n'.join(self.text)

def extract_html_text(html_path):
    """Extract text from HTML file"""
    try:
        with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        parser = HTMLTextExtractor()
        parser.feed(content)
        return parser.get_text()
    except Exception as e:
        return f"Error: {str(e)}"

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dict_dir = os.path.join(current_dir, 'Coptic dictionary')

    if not os.path.exists(dict_dir):
        print("Coptic dictionary folder not found")
        return

    print("=" * 80)
    print("Coptic Dictionary HTML Extractor")
    print("=" * 80)

    html_files = []
    for file in os.listdir(dict_dir):
        if file.endswith('.html'):
            html_files.append(file)

    html_files.sort()

    output_file = os.path.join(current_dir, 'COPTIC_DICTIONARY.txt')

    with open(output_file, 'w', encoding='utf-8') as out:
        out.write("=" * 80 + "\n")
        out.write("COPTIC DICTIONARY ENTRIES\n")
        out.write("Extracted from HTML dictionary files\n")
        out.write("=" * 80 + "\n\n")

        for html_file in html_files:
            print(f"Processing: {html_file}")
            file_path = os.path.join(dict_dir, html_file)

            text = extract_html_text(file_path)

            out.write("\n" + "=" * 80 + "\n")
            out.write(f"FILE: {html_file}\n")
            out.write("=" * 80 + "\n")
            out.write(text)
            out.write("\n\n")

    print(f"\nSaved to: {output_file}")
    print(f"Processed {len(html_files)} HTML dictionary files")

if __name__ == "__main__":
    main()
