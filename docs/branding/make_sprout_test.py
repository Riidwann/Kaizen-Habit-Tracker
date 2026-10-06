"""
Test geometric sprout with distinct separated leaves and central negative space stem.
"""
import os

OUTPUT_DIR = r"C:\Users\HP\OneDrive\Documents\Project\Code\Kaizen APP\docs\branding"

def make_zen_sprout():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-sprout">
  <title id="title-sprout">Tunas Kaizen - Geometric Habit Sprout</title>
  <!-- Left Leaf (Foundation & Discipline) -->
  <path fill="#18181B" d="
    M 120 196
    C 68 184, 48 136, 56 96
    C 64 68, 88 52, 116 48
    C 118 90, 114 146, 120 196
    Z
  "/>

  <!-- Right Leaf (1% Compounded Growth - Elevated) -->
  <path fill="#18181B" d="
    M 136 182
    C 136 132, 140 76, 134 32
    C 164 36, 196 60, 200 98
    C 204 142, 180 174, 136 182
    Z
  "/>

  <!-- Root Pebble (The 2-Minute Habit Anchor) -->
  <circle cx="128" cy="218" r="14" fill="#18181B" />
</svg>'''

with open(os.path.join(OUTPUT_DIR, "test-zen-sprout.svg"), "w", encoding="utf-8") as f:
    f.write(make_zen_sprout())

print("Saved test-zen-sprout.svg")
