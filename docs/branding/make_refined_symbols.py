"""
Generate refined, masterfully crafted symbols for the 3 concepts.
All in Docs/branding, 256x256, pure paths, solid #18181B.
"""
import math
import os

OUTPUT_DIR = r"C:\Users\HP\OneDrive\Documents\Project\Code\Kaizen APP\docs\branding"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -------------------------------------------------------------
# CONCEPT A: Ensō 1% (The Ascending Ensō)
# -------------------------------------------------------------
# An open Zen Ensō habit circle.
# Center (122, 128).
# Sweeps from bottom-right (176, 176) clockwise around bottom, left, top.
# At top-right, the arc steps UPWARD and OUTWARD into a 45° ascending terminal.
# A focal habit seed dot (r=13) is poised at (186, 128).
# Clean stroke width = 26px with rounded caps, scaled inside viewBox.
def get_concept_a_svg():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-a">
  <title id="title-a">Ensō 1% - Ascending Habit Ring</title>
  <!-- Main Zen Ensō Loop with 1% Stepped Apex -->
  <path fill="none" stroke="#18181B" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" d="
    M 172 176
    A 86 86 0 1 1 168 80
    L 204 44
  "/>
  <!-- 1% Habit Seed (Micro-Action Focal Point) -->
  <circle cx="184" cy="128" r="14" fill="#18181B" />
</svg>'''

# -------------------------------------------------------------
# CONCEPT B: Tunas Kaizen (The Origami / Stepping Sprout)
# -------------------------------------------------------------
# Two geometric leaf facets forming an upward sprout & progress chevron.
# Left facet (Dusk/Shadow): grounded, representing the disciplined foundation.
# Right facet (Dawn/Light): elevated, representing the 1% growth.
# Together they form an ascending leaf sprout, an upward arrow, and a subtle 'K' stance.
# Grounded with a serene habit seed at the base.
def get_concept_b_svg():
    # Let's construct with clean geometric polygons/curves:
    # Stem/base seed: circle at (128, 212) r=12
    # Left leaf: curves from (128, 186) out to (68, 136) up to (128, 48), curving back in.
    # Right leaf: curves from (128, 186) up to (128, 48) out to (188, 106) and back to (128, 186).
    # Separated by a clean 10px vertical negative-space spine!
    # Let's write the exact coordinates:
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-b">
  <title id="title-b">Tunas Kaizen - The Stepping Sprout</title>
  <!-- Left Leaf Blade (Grounded Discipline) -->
  <path fill="#18181B" d="
    M 122 192
    C 76 172, 58 132, 64 96
    C 72 64, 96 46, 122 40
    C 122 84, 118 140, 122 192
    Z
  "/>
  <!-- Right Leaf Blade (1% Ascending Growth - Elevated) -->
  <path fill="#18181B" d="
    M 134 176
    C 134 130, 138 78, 134 32
    C 162 38, 192 62, 196 98
    C 200 138, 178 168, 134 176
    Z
  "/>
  <!-- Habit Foundation Pebble (2-Minute Root) -->
  <circle cx="128" cy="216" r="12" fill="#18181B" />
</svg>'''

# -------------------------------------------------------------
# CONCEPT C: Nenrin / Tangga Kontinuitas (Growth Rings / Compound Spiral)
# -------------------------------------------------------------
# Three concentric progressive arcs (Tree Growth Rings - Nenrin),
# illustrating 1% daily habits compounding over time.
# Center (128, 128).
# Tier 1 (Inner - Day 1): Radius 42, 90° arc (starts small)
# Tier 2 (Middle - Day 30): Radius 68, 180° arc (builds consistency)
# Tier 3 (Outer - Day 365): Radius 96, 270° arc (compounding breakthrough)
# All with uniform stroke width 22px, rounded caps.
def get_concept_c_svg():
    # Arc 1: R=42. From (128, 170) [bottom: 90°] to (86, 128) [left: 180°]
    # Arc 2: R=68. From (196, 128) [right: 0°] to (128, 196) [bottom: 90°] to (60, 128) [left: 180°] to (128, 60) [top: 270°]
    # Let's arrange them so they flow in a clockwise compounding spiral!
    # Spiral flow:
    # Inner: R=40, from (128, 88) to (88, 128) to (128, 168) (span 180°, left semicircle)
    # Middle: R=68, from (128, 60) to (196, 128) to (128, 196) to (60, 128) (span 270°)
    # Outer: R=96, from (128, 32) to (224, 128) to (128, 224) to (32, 128) to (128, 32)
    # Wait, let's make it a clean, rhythmic set of 3 nested arcs with a shared opening or stepped progression:
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-c">
  <title id="title-c">Nenrin - The Compounding Growth Rings</title>
  <!-- Tier 1: Micro Habit (2-Minute Seed Action) -->
  <path fill="none" stroke="#18181B" stroke-width="22" stroke-linecap="round" d="
    M 128 170
    A 42 42 0 0 1 86 128
  "/>

  <!-- Tier 2: Consistent Momentum (Daily Streak) -->
  <path fill="none" stroke="#18181B" stroke-width="22" stroke-linecap="round" d="
    M 176 176
    A 68 68 0 0 1 60 128
    A 68 68 0 0 1 128 60
  "/>

  <!-- Tier 3: Exponential Compounding (1% Better Every Day) -->
  <path fill="none" stroke="#18181B" stroke-width="22" stroke-linecap="round" d="
    M 204 180
    A 96 96 0 0 1 32 128
    A 96 96 0 0 1 128 32
    A 96 96 0 0 1 216 92
  "/>
</svg>'''

with open(os.path.join(OUTPUT_DIR, "symbol-a.svg"), "w", encoding="utf-8") as f:
    f.write(get_concept_a_svg())

with open(os.path.join(OUTPUT_DIR, "symbol-b.svg"), "w", encoding="utf-8") as f:
    f.write(get_concept_b_svg())

with open(os.path.join(OUTPUT_DIR, "symbol-c.svg"), "w", encoding="utf-8") as f:
    f.write(get_concept_c_svg())

print("Generated symbol-a.svg, symbol-b.svg, symbol-c.svg")
