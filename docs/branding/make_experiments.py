"""
Generate experimental candidate variations:
- Spiral Ensō (Concept A exploration)
- Stepping Chevrons (Concept C exploration)
- Nenrin Concentric Ripples
"""
import math
import os

OUTPUT_DIR = r"C:\Users\HP\OneDrive\Documents\Project\Code\Kaizen APP\docs\branding"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. The Spiral Ensō (Continuous 1% Compounding Spiral)
# Golden spiral / Archimedean spiral arc:
# Radius expands from 56 to 96 over 360 degrees.
# Center (128, 128). Stroke width 24.
def make_spiral_enso():
    points = []
    # Generate points along spiral from theta = 0 to 360+45 deg
    r_start = 54
    r_end = 96
    total_deg = 360
    for deg in range(0, total_deg + 1, 5):
        rad = math.radians(deg)
        t = deg / total_deg
        r = r_start + (r_end - r_start) * t
        x = round(128 + r * math.cos(rad), 2)
        y = round(128 + r * math.sin(rad), 2)
        points.append((x, y))
    
    d_str = f"M {points[0][0]} {points[0][1]} " + " ".join([f"L {p[0]} {p[1]}" for p in points[1:]])
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-spiral">
  <title id="title-spiral">Spirala Kaizen - The Compounding Habit Spiral</title>
  <path fill="none" stroke="#18181B" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" d="{d_str}" />
  <circle cx="128" cy="128" r="14" fill="#18181B" />
</svg>'''

# 2. Three Ascending Chevrons (Kaizen Momentum: 1% compounding)
# Three nested, sleek chevrons pointing UP (0, -1),
# with progressive stroke or scale:
def make_ascending_chevrons():
    # Chevron 1 (Micro-habit / bottom): light & grounded
    # Chevron 2 (Consistency / middle): medium
    # Chevron 3 (Apex / top): bold & expansive
    # Or two interlocking chevrons forming a K!
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-chev">
  <title id="title-chev">Tangga Kaizen - Ascending Progress Chevrons</title>
  <!-- Foundation Step 1 (2-Minute Rule) -->
  <path fill="none" stroke="#18181B" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" d="
    M 88 196 L 128 160 L 168 196
  "/>
  <!-- Progression Step 2 (Consistency) -->
  <path fill="none" stroke="#18181B" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" d="
    M 68 136 L 128 84 L 188 136
  "/>
  <!-- Soaring Apex Step 3 (1% Compounding Breakthrough) -->
  <path fill="none" stroke="#18181B" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" d="
    M 48 76 L 128 8 L 208 76
  "/>
</svg>'''

# 3. Authentic Ensō with 1% Stepped Horizon
# A circular Ensō of radius 88, opening on the right (from -35° to +35°).
# The bottom terminal ends gracefully with a round cap.
# Inside the opening, a clean 45° step rising from the circle's inner rim to the outer rim.
# A habit pebble sits centered in the aperture.
def make_pure_enso():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-enso">
  <title id="title-enso">Ensō Zen - Open Habit Circle</title>
  <!-- Authentic Open Ensō Circle: 300° continuous sweeping habit loop -->
  <path fill="none" stroke="#18181B" stroke-width="28" stroke-linecap="round" d="
    M 188 178
    A 88 88 0 1 1 188 78
  "/>
  <!-- 1% Habit Seed: Grounded focal point of daily action -->
  <circle cx="188" cy="128" r="16" fill="#18181B" />
</svg>'''

# 4. Sprout & Stepping Stones (Tunas Kaizen):
# Micro-seed (circle) + Small leaf + Large soaring leaf (completely separate elements, 45° angle)
def make_sprout_pure():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-sprout">
  <title id="title-sprout">Tunas Kaizen - Stepping Sprout of Growth</title>
  <!-- Micro-Habit Seed (2-Minute Rule) -->
  <circle cx="60" cy="196" r="16" fill="#18181B" />

  <!-- Foundation Leaf (Daily Consistency) -->
  <path fill="#18181B" d="
    M 84 172
    C 84 136, 114 116, 144 116
    C 144 152, 114 172, 84 172
    Z
  "/>

  <!-- Soaring Apex Leaf (1% Better Every Day) -->
  <path fill="#18181B" d="
    M 124 132
    C 124 76, 168 44, 214 44
    C 214 100, 170 132, 124 132
    Z
  "/>
</svg>'''

with open(os.path.join(OUTPUT_DIR, "exp-spiral.svg"), "w", encoding="utf-8") as f:
    f.write(make_spiral_enso())

with open(os.path.join(OUTPUT_DIR, "exp-chevrons.svg"), "w", encoding="utf-8") as f:
    f.write(make_ascending_chevrons())

with open(os.path.join(OUTPUT_DIR, "exp-enso.svg"), "w", encoding="utf-8") as f:
    f.write(make_pure_enso())

with open(os.path.join(OUTPUT_DIR, "exp-sprout.svg"), "w", encoding="utf-8") as f:
    f.write(make_sprout_pure())

print("Saved experimental SVGs.")
