"""
Refining concepts A, B, and C for maximum visual impact, precision, and alignment with Kaizen psychology.
"""
import math
import os

OUTPUT_DIR = r"C:\Users\HP\OneDrive\Documents\Project\Code\Kaizen APP\docs\branding"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -------------------------------------------------------------
# CONCEPT A: Ensō 1% (The Ascending Zen Habit Loop)
# -------------------------------------------------------------
# An open Ensō brush ring with an ascending step.
# Outer circle sweeps from bottom-right (angle +35°) clockwise around to top-right (angle -35°).
# The bottom terminal is grounded at radius 82.
# The top terminal steps UPWARD and OUTWARD to radius 100, finishing with an elevated, forward posture.
# An intentional focal habit seed dot (r=13) is positioned in the aperture.
# Smooth, pure, organic yet razor-sharp modern Zen.
def make_refined_concept_a():
    # Center = (122, 128)
    # Arc 1: From (178, 174) [R=82] clockwise around (122, 214) -> (36, 128) -> (122, 38) -> (194, 68) [R=98]
    # We can model the spiral or the stepped ring:
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-a">
  <title id="title-a">Ensō 1% - Ascending Habit Loop</title>
  <!-- The Ascending Zen Ensō: Continuous daily practice spiraling 1% upward -->
  <path fill="none" stroke="#18181B" stroke-width="26" stroke-linecap="round" d="
    M 172 178
    A 84 84 0 1 1 182 72
    A 104 104 0 0 1 206 50
  "/>
  <!-- The 1% Habit Seed: Grounded daily micro-action -->
  <circle cx="178" cy="128" r="14" fill="#18181B" />
</svg>'''

# -------------------------------------------------------------
# CONCEPT B: Tobi-Ishi K (Japandi Stepping Stones Monogram)
# -------------------------------------------------------------
# Three Zen river stepping stones forming a dynamic letter 'K':
# 1. Grounded Discipline Spine: x=52, width=32, height=172 (from y=42 to 214), rx=16.
# 2. Upper Ascending Stone (1% Growth): length=124, width=32, angled at -45°,
#    starts at (112, 126), soaring to (200, 38).
# 3. Lower Foundation Stone (Consistency): length=96, width=32, angled at +45°,
#    starts at (112, 130), resting firmly at (180, 198).
# The upper arm is intentionally longer and higher (+1% overshoot), creating forward momentum.
def make_refined_concept_b():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-b">
  <title id="title-b">Tobi-Ishi K - Zen Stepping Stones Monogram</title>
  <!-- Habit Spine: Grounded Daily Discipline -->
  <rect x="50" y="42" width="32" height="172" rx="16" fill="#18181B" />

  <!-- Upper Stone: 1% Compounded Growth (Extended Ascending Reach) -->
  <g transform="translate(112, 124) rotate(-45)">
    <rect x="0" y="-16" width="124" height="32" rx="16" fill="#18181B" />
  </g>

  <!-- Lower Stone: Grounded Daily Consistency -->
  <g transform="translate(112, 132) rotate(45)">
    <rect x="0" y="-16" width="96" height="32" rx="16" fill="#18181B" />
  </g>
</svg>'''

# -------------------------------------------------------------
# CONCEPT C: Tunas Kaizen (Stepping Sprout / Compounding Growth)
# -------------------------------------------------------------
# An ascending staircase of organic growth:
# 1. Base pebble: circle at (64, 192) r=16 (the 2-minute micro-habit trigger).
# 2. Foundation leaf: angled at 45°, rising from (86, 170) to (142, 114).
# 3. Apex leaf: elevated higher along the 45° axis, rising from (128, 128) to (212, 44).
# Formed from pure tangent circular arcs.
def make_refined_concept_c():
    # Leaf 1 (Middle): length 80, width 36. Formed by two arcs.
    # Leaf 2 (Apex): length 116, width 48. Formed by two arcs.
    # Rotated at -45° to soar up-right.
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-c">
  <title id="title-c">Tunas Kaizen - The Compounding Sprout</title>
  <!-- Micro-Habit Seed (2-Minute Trigger) -->
  <circle cx="64" cy="192" r="16" fill="#18181B" />

  <!-- Foundation Sprout Leaf (Consistent Daily Practice) -->
  <path fill="#18181B" d="
    M 88 168
    C 84 136, 110 114, 142 110
    C 146 142, 120 164, 88 168
    Z
  "/>

  <!-- Compounded Apex Leaf (1% Better Every Day - Soaring Growth) -->
  <path fill="#18181B" d="
    M 124 132
    C 120 84, 156 50, 208 44
    C 214 96, 178 132, 124 132
    Z
  "/>
</svg>'''

with open(os.path.join(OUTPUT_DIR, "concept-a-symbol.svg"), "w", encoding="utf-8") as f:
    f.write(make_refined_concept_a())

with open(os.path.join(OUTPUT_DIR, "concept-b-symbol.svg"), "w", encoding="utf-8") as f:
    f.write(make_refined_concept_b())

with open(os.path.join(OUTPUT_DIR, "concept-c-symbol.svg"), "w", encoding="utf-8") as f:
    f.write(make_refined_concept_c())

print("Saved refined concepts successfully.")
