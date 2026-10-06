"""
Precision generation of 3 distinct, breathtaking concepts:
- Concept A: Ensō 1% (Zen Ensō with Spiral Ascent & Focal Seed)
- Concept B: Tobi-Ishi K (Japandi Monogram K sculpted from Zen Stepping Stones)
- Concept C: Tunas Kaizen (Geometric Sprout: Micro-Seed + 2 Ascending Leaves)
"""
import math
import os

OUTPUT_DIR = r"C:\Users\HP\OneDrive\Documents\Project\Code\Kaizen APP\docs\branding"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -------------------------------------------------------------
# CONCEPT A: Ensō 1% (The Ascending Zen Habit Loop)
# -------------------------------------------------------------
# Philosophy: Daily habit practice is a cycle, but in Kaizen,
# the cycle does not return to baseline—it spirals upward by 1%.
# Geometry:
# A harmonious Zen Ensō ring (Center: 128, 128)
# Constructed with pure geometric arcs:
# Starts at bottom (128, 218), sweeps clockwise through left (38, 128),
# top (128, 38), and right (218, 128).
# As it completes the circle, instead of closing at (128, 218),
# it sweeps up and out into an elevated terminal at (200, 68).
# Poised in the upper threshold is a serene habit seed (r=14).
def make_concept_a_master():
    # Let's craft an open Ensō stroke with elegant, balanced terminals:
    # Canvas 256x256, center (124, 128).
    # Stroke width: 26, stroke-linecap="round".
    # Sweeps from (176, 184) [angle +40°], around bottom, left, top,
    # to (196, 76) [angle -35°].
    # At the top-right, it has an upward 1% elevation step!
    # And a focal dot at (180, 130).
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-a">
  <title id="title-a">Ensō 1% - Ascending Zen Habit Loop</title>
  <!-- Zen Ensō Body (Open Daily Habit Cycle) -->
  <path fill="none" stroke="#18181B" stroke-width="26" stroke-linecap="round" d="
    M 174 186
    A 86 86 0 1 1 174 70
    L 204 70
  "/>
  <!-- The 1% Habit Seed (Daily Micro-Action Anchor) -->
  <circle cx="178" cy="128" r="14" fill="#18181B" />
</svg>'''

# -------------------------------------------------------------
# CONCEPT B: Tobi-Ishi K (Japandi Monogram K)
# -------------------------------------------------------------
# Philosophy: Stepping stones across the stream of time.
# Discipline on the left, continuous 1% compounding on the right.
# Geometry:
# 1. Vertical Spine (Habit discipline): x=50, width=32, height=172 (from y=42 to 214), rx=16.
# 2. Upper Stone (1% Ascending reach): starts at (114, 116), length=120, width=32, rx=16, angled at -45° to (199, 31).
# 3. Lower Stone (Grounded consistency): starts at (114, 140), length=94, width=32, rx=16, angled at +45° to (180, 206).
# A clean 24px vertical separation between the two stones at x=114 ensures zero touching or muddy pixels!
def make_concept_b_master():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-b">
  <title id="title-b">Tobi-Ishi K - Zen Stepping Stones Monogram</title>
  <!-- Grounded Habit Spine (Discipline Anchor) -->
  <rect x="50" y="42" width="32" height="172" rx="16" fill="#18181B" />

  <!-- Upper Stepping Stone: 1% Continuous Growth (Soaring Ascending Reach) -->
  <g transform="translate(116, 114) rotate(-45)">
    <rect x="0" y="-16" width="122" height="32" rx="16" fill="#18181B" />
  </g>

  <!-- Lower Stepping Stone: Daily Consistency Foundation -->
  <g transform="translate(116, 142) rotate(45)">
    <rect x="0" y="-16" width="94" height="32" rx="16" fill="#18181B" />
  </g>
</svg>'''

# -------------------------------------------------------------
# CONCEPT C: Tunas Kaizen (The Geometric Sprout)
# -------------------------------------------------------------
# Philosophy: "Too small to fail" (The 2-Minute Rule).
# A tiny seed at the foundation sprouts into two ascending leaves.
# Geometry:
# Three distinct, perfectly proportioned elements along a 45° axis:
# 1. Micro-seed: Circle at (64, 192), r=16 (solid black).
# 2. Foundation leaf: A crisp leaf petal angled at 45°, center (108, 148).
# 3. Apex leaf: A larger, soaring leaf petal angled at 45°, center (168, 88).
# Separated by clean, harmonious negative-space channels.
def make_concept_c_master():
    # Let's construct the leaves from pure circular arcs:
    # Leaf 1 (middle): from (84, 172) to (132, 124). Length = 68, width = 32.
    # Leaf 2 (apex): from (128, 128) to (208, 48). Length = 113, width = 48.
    # Leaf geometry using SVG arc:
    # Start at tip 1, arc out and meet tip 2, arc back to tip 1.
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-c">
  <title id="title-c">Tunas Kaizen - Geometric Compounding Sprout</title>
  <!-- Micro-Habit Seed (The 2-Minute Habit Trigger) -->
  <circle cx="64" cy="192" r="16" fill="#18181B" />

  <!-- Foundation Sprout Leaf (Daily Consistency) -->
  <path fill="#18181B" d="
    M 86 170
    A 44 44 0 0 1 144 112
    A 44 44 0 0 1 86 170
    Z
  "/>

  <!-- Compounded Apex Leaf (1% Compounded Transformation) -->
  <path fill="#18181B" d="
    M 132 124
    A 76 76 0 0 1 216 40
    A 76 76 0 0 1 132 124
    Z
  "/>
</svg>'''

with open(os.path.join(OUTPUT_DIR, "concept-a-symbol.svg"), "w", encoding="utf-8") as f:
    f.write(make_concept_a_master())

with open(os.path.join(OUTPUT_DIR, "concept-b-symbol.svg"), "w", encoding="utf-8") as f:
    f.write(make_concept_b_master())

with open(os.path.join(OUTPUT_DIR, "concept-c-symbol.svg"), "w", encoding="utf-8") as f:
    f.write(make_concept_c_master())

print("Updated master concept files.")
