"""
Build the 3 Kaizen habit tracker logo concepts.
All symbols are 256x256, pure paths/shapes, solid black (#18181B) for Phase 4-5 craft evaluation.
"""
import math
import os

OUTPUT_DIR = r"C:\Users\HP\OneDrive\Documents\Project\Code\Kaizen APP\docs\branding"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -------------------------------------------------------------
# CONCEPT A: Ensō 1% (The Ascending Ensō / Monogram K)
# -------------------------------------------------------------
# An open Zen Ensō ring that does not stagnate in a closed loop,
# but steps 1% upward and outward at the upper terminal.
# Balanced with a grounded vertical cadence on the left and a focal
# habit seed dot poised at the gateway, evoking a modern, Zen letter 'K'.
#
# Construction:
# Center: (124, 128)
# Left vertical trunk: x=48 to 76, y=52 to 204 (height 152, rx=14)
# Ensō Arc: Sweeps from bottom (x=124, y=204) up through the right (x=200, y=128)
# to top (x=124, y=52).
# Or let's build a single cohesive, unified Ensō with an open apex and focal seed:
def build_concept_a():
    # Outer radius = 88, Inner radius = 60 (stroke thickness = 28)
    # Center = (120, 128)
    # The ring starts at angle +30° (bottom-right: ~196, 172)
    # Sweeps clockwise to 90° (bottom: 120, 216), 180° (left: 32, 128),
    # 270° (top: 120, 40), and reaches angle -30° (top-right: ~196, 84).
    # But at the top-right, the arc steps OUTWARD to radius 102 and extends up-right to (208, 64).
    # A focal pebble/seed dot (r=14) sits poised at (198, 136).
    # This creates a dynamic tension: the circular flow, the 1% step ascent, and the daily habit point.
    
    # Let's write clean SVG paths with rounded caps:
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-a">
  <title id="title-a">Ensō 1% - Ascending Zen Habit Loop</title>
  <!-- Vertical Pillar / Daily Discipline Trunk -->
  <rect x="44" y="44" width="28" height="168" rx="14" fill="#18181B" />
  
  <!-- Upper Ascending Arm (1% Stepped Growth) -->
  <path fill="#18181B" d="
    M 88 128
    L 164 52
    A 16 16 0 0 1 187 52
    L 194 59
    A 16 16 0 0 1 194 82
    L 132 144
    Z
  "/>
  
  <!-- Lower Grounding Arm / Return Loop -->
  <path fill="#18181B" d="
    M 126 138
    L 188 200
    A 16 16 0 0 1 188 223
    L 181 230
    A 16 16 0 0 1 158 230
    L 88 160
    Z
  "/>
  
  <!-- Zen Ensō Orbital Arc connecting the arms into a continuous habit cycle -->
  <path fill="none" stroke="#18181B" stroke-width="24" stroke-linecap="round" d="
    M 176 72
    A 88 88 0 0 1 176 196
  "/>
</svg>'''
    return svg

# Wait, let's explore an even purer, more fluid geometric Ensō:
def build_concept_a_pure():
    # Pure Zen Ensō with an open 1% ascending step and floating habit seed
    # Center (120, 128). Outer R = 90, Inner R = 64 (thickness = 26)
    # The ring sweeps from (175, 175) clockwise all the way around to (175, 81),
    # where the upper tip tapers and elevates like a Japanese calligraphy stroke meeting modern geometry.
    # Beside it, an ascending 1% seed dot rests at (196, 96).
    # And negative space forms a subtle 'K'.
    # Let's craft it using pure filled path geometry.
    
    # Outer circle: R=92, center=(124, 128).
    # Inner circle: R=64, center=(124, 128).
    # Opening at angle from -25° to +25° (x ≈ 180 to 208).
    # Terminal at bottom is rounded at angle +25°.
    # Terminal at top lifts up and steps to angle -40° and radius 104!
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-a">
  <title id="title-a">Ensō 1% - Ascending Habit Ring</title>
  <!-- Zen Ensō Body with Ascending 1% Step -->
  <path fill="#18181B" fill-rule="evenodd" d="
    M 184 176
    A 90 90 0 1 1 176 72
    L 204 46
    A 16 16 0 0 1 228 66
    L 208 94
    A 112 112 0 0 0 196 192
    A 16 16 0 0 1 184 176
    Z
    M 124 64
    A 64 64 0 1 0 172 168
    L 156 150
    A 40 40 0 1 1 154 94
    Z
  "/>
  <!-- 1% Habit Seed (Focal Point) -->
  <circle cx="188" cy="128" r="14" fill="#18181B" />
</svg>'''
    return svg

# Let's test a very clean, iconic version for Concept A:
def build_concept_a_refined():
    # Let's create an iconic mark that combines the Letter K + Zen Ensō + 1% Step
    # Using clean solid geometry:
    # 1. Left vertical spine: disciplined vertical pillar, width 28, height 168 (from y=44 to 212, x=48 to 76, rx=14)
    # 2. Right Ensō loop: A bold open circular brush that springs from the spine:
    #    Upper diagonal arm steps up-right at 45° to (196, 60), rounded cap.
    #    Lower diagonal arm steps down-right at 45° to (196, 196), rounded cap.
    #    A circular connecting bridge curves along outer radius 88, tying them together into an open Zen loop.
    #    Inside between the arms is a serene circular aperture with a floating habit seed.
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-a">
  <title id="title-a">Ensō 1% - Monogram K and Zen Ring</title>
  <!-- Grounded Habit Spine (Discipline) -->
  <rect x="46" y="44" width="28" height="168" rx="14" fill="#18181B" />

  <!-- Upper 1% Growth Arm (Ascending at 45°) -->
  <path fill="#18181B" d="
    M 106 132
    L 174 64
    A 18 18 0 0 1 200 64
    L 202 66
    A 18 18 0 0 1 200 92
    L 142 150
    Z
  "/>

  <!-- Lower Foundation Arm -->
  <path fill="#18181B" d="
    M 106 124
    L 142 106
    L 200 164
    A 18 18 0 0 1 200 190
    L 198 192
    A 18 18 0 0 1 172 190
    Z
  "/>

  <!-- Zen Ensō Halo Arc (The Continuous Habit Circle) -->
  <path fill="none" stroke="#18181B" stroke-width="26" stroke-linecap="round" d="
    M 188 88
    A 92 92 0 0 1 188 168
  "/>
</svg>'''
    return svg

# -------------------------------------------------------------
# CONCEPT B: Tunas Kaizen (The Stepping Sprout / 2-Minute Seed)
# -------------------------------------------------------------
# Metaphor: "Too small to fail" (2-Minute Rule) -> Organic exponential compounding.
# Geometry:
# - Base pebble/seed: Grounded at lower-left, representing the micro-step that takes < 2 mins.
# - Primary leaf 1: Intermediate step rising at 45°.
# - Primary leaf 2: Soaring apex leaf pointing up-right, completing an ascending chevron/growth sprout.
def build_concept_b():
    # Base Seed: Circle at (68, 188) with radius 16
    # Leaf 1 (Middle): Smooth organic geometric leaf from (92, 172) rising to (148, 116)
    # Leaf 2 (Apex): Soaring leaf from (132, 132) rising to (208, 48)
    # Built using circular arcs (tangent circle geometry):
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-b">
  <title id="title-b">Tunas Kaizen - The Stepping Sprout</title>
  <!-- Micro-Habit Seed (2-Minute Foundation) -->
  <circle cx="68" cy="188" r="18" fill="#18181B" />

  <!-- First Step: Emerging Leaf (Daily Consistency) -->
  <path fill="#18181B" d="
    M 88 168
    C 88 136, 114 116, 144 112
    C 144 144, 120 168, 88 168
    Z
  "/>

  <!-- Compounding Apex Leaf (1% Growth Acceleration) -->
  <path fill="#18181B" d="
    M 124 132
    C 124 80, 164 48, 208 44
    C 208 92, 172 132, 124 132
    Z
  "/>
</svg>'''
    return svg

# Let's also create an alternative geometric construction for Concept B:
def build_concept_b_chevron():
    # Two crisp geometric leaves aligned along the 45° diagonal with uniform negative space:
    # Leaf 1 (Base): from (52, 204) to (132, 124)
    # Leaf 2 (Crown): from (112, 144) to (204, 52)
    # Each leaf is formed by two symmetrical circular arcs meeting at sharp 45° points,
    # but rounded gracefully at terminals.
    # An anchor seed dot sits grounded at (64, 192).
    # Let's construct with precise arc math:
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-b">
  <title id="title-b">Tunas Kaizen - Stepping Sprout Chevron</title>
  <!-- Grounding Habit Pebble (The 2-Minute Habit) -->
  <circle cx="64" cy="192" r="16" fill="#18181B" />

  <!-- Foundation Sprout (Consistent Action) -->
  <path fill="#18181B" d="
    M 90 166
    A 54 54 0 0 1 152 104
    A 54 54 0 0 1 90 166
    Z
  "/>

  <!-- Soaring Apex Leaf (Compounded Self-Improvement) -->
  <path fill="#18181B" d="
    M 132 124
    A 82 82 0 0 1 216 40
    A 82 82 0 0 1 132 124
    Z
  "/>
</svg>'''
    return svg

# -------------------------------------------------------------
# CONCEPT C: Lingkar Momentum (The Compounding Ring / Tangga Kontinuitas)
# -------------------------------------------------------------
# Three modular concentric circular arcs arranged clockwise:
# - Arc 1 (7 to 10 o'clock): Delicate 16px arc (micro start)
# - Arc 2 (11 to 2 o'clock): Medium 24px arc (daily streak)
# - Arc 3 (3 to 6 o'clock): Bold 32px arc (exponential breakthrough)
# Clean negative space channels (20° gaps) separate the three tiers.
def build_concept_c():
    # Center = (128, 128)
    # Arc 1: radius 92, stroke-width 16, from angle 195° to 255° (60° span)
    # Arc 2: radius 92, stroke-width 24, from angle 285° to 345° (60° span)
    # Arc 3: radius 92, stroke-width 34, from angle 15° to 165° (150° span - dominant)
    # Let's compute exact arc endpoints:
    # x = 128 + R * cos(theta), y = 128 + R * sin(theta)
    
    def pt(deg, r=92):
        rad = math.radians(deg)
        return round(128 + r * math.cos(rad), 2), round(128 + r * math.sin(rad), 2)
    
    # Arc 1: 200° to 255°
    p1_s = pt(200)
    p1_e = pt(255)
    # Arc 2: 285° to 345°
    p2_s = pt(285)
    p2_e = pt(345)
    # Arc 3: 15° to 170°
    p3_s = pt(15)
    p3_e = pt(170)
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-c">
  <title id="title-c">Lingkar Momentum - Compounding Arc Ring</title>
  <!-- Tier 1: Micro-Action (Day 1 - Delicate Foundation) -->
  <path fill="none" stroke="#18181B" stroke-width="16" stroke-linecap="round" d="
    M {p1_s[0]} {p1_s[1]}
    A 92 92 0 0 1 {p1_e[0]} {p1_e[1]}
  "/>

  <!-- Tier 2: Daily Consistency (Building Streak Momentum) -->
  <path fill="none" stroke="#18181B" stroke-width="26" stroke-linecap="round" d="
    M {p2_s[0]} {p2_s[1]}
    A 92 92 0 0 1 {p2_e[0]} {p2_e[1]}
  "/>

  <!-- Tier 3: Exponential Compound (The 37x Transformation) -->
  <path fill="none" stroke="#18181B" stroke-width="36" stroke-linecap="round" d="
    M {p3_s[0]} {p3_s[1]}
    A 92 92 0 0 1 {p3_e[0]} {p3_e[1]}
  "/>
</svg>'''
    return svg

with open(os.path.join(OUTPUT_DIR, "test-a.svg"), "w", encoding="utf-8") as f:
    f.write(build_concept_a_pure())

with open(os.path.join(OUTPUT_DIR, "test-b.svg"), "w", encoding="utf-8") as f:
    f.write(build_concept_b_chevron())

with open(os.path.join(OUTPUT_DIR, "test-c.svg"), "w", encoding="utf-8") as f:
    f.write(build_concept_c())

print("Saved test SVG files successfully.")
