"""
Build the 3 polished concept symbols and their horizontal lockups.
Canvas:
- Symbols: 256x256
- Lockups: 800x256
"""
import os

OUTPUT_DIR = r"C:\Users\HP\OneDrive\Documents\Project\Code\Kaizen APP\docs\branding"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. CONCEPT A: Ensō 1% (The Ascending Zen Habit Loop)
# -------------------------------------------------------------
symbol_a = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-a">
  <title id="title-a">Ensō 1% - Ascending Zen Habit Loop</title>
  <!-- Sweeping Ensō Ring with 1% Stepped Horizon -->
  <path fill="none" stroke="#18181B" stroke-width="26" stroke-linecap="round" d="
    M 178 184
    A 86 86 0 1 1 184 76
    L 208 52
  "/>
  <!-- The 1% Habit Seed (Daily Micro-Action Anchor) -->
  <circle cx="180" cy="130" r="14" fill="#18181B" />
</svg>'''

lockup_a = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 256" width="800" height="256" role="img" aria-labelledby="title-lockup-a">
  <title id="title-lockup-a">KaizenFlow - Ensō 1% Horizontal Lockup</title>
  <!-- Symbol -->
  <g transform="translate(16, 28) scale(0.78)">
    <path fill="none" stroke="#18181B" stroke-width="26" stroke-linecap="round" d="
      M 178 184
      A 86 86 0 1 1 184 76
      L 208 52
    "/>
    <circle cx="180" cy="130" r="14" fill="#18181B" />
  </g>
  <!-- Brand Wordmark -->
  <text x="248" y="146" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', sans-serif" font-size="64" font-weight="700" letter-spacing="-0.03em" fill="#18181B">Kaizen<tspan font-weight="400" fill="#52525B">Flow</tspan></text>
  <!-- Tagline -->
  <text x="250" y="182" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500" letter-spacing="0.18em" fill="#71717A">1% BETTER EVERY DAY</text>
</svg>'''

# -------------------------------------------------------------
# 2. CONCEPT B: Tobi-Ishi K (Japandi Stepping Stones Monogram)
# -------------------------------------------------------------
symbol_b = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-b">
  <title id="title-b">Tobi-Ishi K - Zen Stepping Stones Monogram</title>
  <!-- Grounded Habit Spine (Daily Discipline) -->
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

lockup_b = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 256" width="800" height="256" role="img" aria-labelledby="title-lockup-b">
  <title id="title-lockup-b">KaizenFlow - Tobi-Ishi K Horizontal Lockup</title>
  <!-- Symbol -->
  <g transform="translate(16, 28) scale(0.78)">
    <rect x="50" y="42" width="32" height="172" rx="16" fill="#18181B" />
    <g transform="translate(116, 114) rotate(-45)">
      <rect x="0" y="-16" width="122" height="32" rx="16" fill="#18181B" />
    </g>
    <g transform="translate(116, 142) rotate(45)">
      <rect x="0" y="-16" width="94" height="32" rx="16" fill="#18181B" />
    </g>
  </g>
  <!-- Brand Wordmark -->
  <text x="248" y="146" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', sans-serif" font-size="64" font-weight="700" letter-spacing="-0.03em" fill="#18181B">Kaizen<tspan font-weight="400" fill="#52525B">Flow</tspan></text>
  <!-- Tagline -->
  <text x="250" y="182" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500" letter-spacing="0.18em" fill="#71717A">1% BETTER EVERY DAY</text>
</svg>'''

# -------------------------------------------------------------
# 3. CONCEPT C: Tunas Kaizen (Geometric Habit Sprout)
# -------------------------------------------------------------
symbol_c = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-c">
  <title id="title-c">Tunas Kaizen - Geometric Habit Sprout</title>
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

lockup_c = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 256" width="800" height="256" role="img" aria-labelledby="title-lockup-c">
  <title id="title-lockup-c">KaizenFlow - Tunas Kaizen Horizontal Lockup</title>
  <!-- Symbol -->
  <g transform="translate(16, 28) scale(0.78)">
    <path fill="#18181B" d="
      M 120 196
      C 68 184, 48 136, 56 96
      C 64 68, 88 52, 116 48
      C 118 90, 114 146, 120 196
      Z
    "/>
    <path fill="#18181B" d="
      M 136 182
      C 136 132, 140 76, 134 32
      C 164 36, 196 60, 200 98
      C 204 142, 180 174, 136 182
      Z
    "/>
    <circle cx="128" cy="218" r="14" fill="#18181B" />
  </g>
  <!-- Brand Wordmark -->
  <text x="248" y="146" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', sans-serif" font-size="64" font-weight="700" letter-spacing="-0.03em" fill="#18181B">Kaizen<tspan font-weight="400" fill="#52525B">Flow</tspan></text>
  <!-- Tagline -->
  <text x="250" y="182" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500" letter-spacing="0.18em" fill="#71717A">1% BETTER EVERY DAY</text>
</svg>'''

# Write symbols
with open(os.path.join(OUTPUT_DIR, "concept-a-symbol.svg"), "w", encoding="utf-8") as f:
    f.write(symbol_a)

with open(os.path.join(OUTPUT_DIR, "concept-b-symbol.svg"), "w", encoding="utf-8") as f:
    f.write(symbol_b)

with open(os.path.join(OUTPUT_DIR, "concept-c-symbol.svg"), "w", encoding="utf-8") as f:
    f.write(symbol_c)

# Write lockups
with open(os.path.join(OUTPUT_DIR, "concept-a-lockup.svg"), "w", encoding="utf-8") as f:
    f.write(lockup_a)

with open(os.path.join(OUTPUT_DIR, "concept-b-lockup.svg"), "w", encoding="utf-8") as f:
    f.write(lockup_b)

with open(os.path.join(OUTPUT_DIR, "concept-c-lockup.svg"), "w", encoding="utf-8") as f:
    f.write(lockup_c)

print("Saved all 3 symbols and lockups successfully.")
