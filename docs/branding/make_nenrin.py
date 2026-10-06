"""
Test Nenrin (Concentric Zen Ripples / Growth Rings)
"""
import math
import os

OUTPUT_DIR = r"C:\Users\HP\OneDrive\Documents\Project\Code\Kaizen APP\docs\branding"

def make_nenrin_quadrant():
    # Origin at bottom-left: (68, 188)
    # Origin dot: r=14
    # Arc 1: R=46, 0° to 90° (from (114, 188) up to (68, 142))
    # Arc 2: R=86, 0° to 90° (from (154, 188) up to (68, 102))
    # Arc 3: R=126, 0° to 90° (from (194, 188) up to (68, 62))
    # Stroke width = 22, rounded caps.
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-nenrin">
  <title id="title-nenrin">Nenrin - The Compounding Growth Rings</title>
  <!-- Focal Origin Pebble (2-Minute Rule / Day 1 Action) -->
  <circle cx="68" cy="188" r="14" fill="#18181B" />

  <!-- Tier 1: Micro Consistency Arc -->
  <path fill="none" stroke="#18181B" stroke-width="22" stroke-linecap="round" d="
    M 116 188
    A 48 48 0 0 0 68 140
  "/>

  <!-- Tier 2: Habit Solidification Arc -->
  <path fill="none" stroke="#18181B" stroke-width="22" stroke-linecap="round" d="
    M 158 188
    A 90 90 0 0 0 68 98
  "/>

  <!-- Tier 3: 37x Compounding Transformation Arc -->
  <path fill="none" stroke="#18181B" stroke-width="22" stroke-linecap="round" d="
    M 200 188
    A 132 132 0 0 0 68 56
  "/>
</svg>'''

with open(os.path.join(OUTPUT_DIR, "test-nenrin.svg"), "w", encoding="utf-8") as f:
    f.write(make_nenrin_quadrant())

print("Saved test-nenrin.svg")
