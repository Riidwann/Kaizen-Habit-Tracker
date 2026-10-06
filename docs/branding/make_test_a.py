import os

OUTPUT_DIR = r"C:\Users\HP\OneDrive\Documents\Project\Code\Kaizen APP\docs\branding"

svg_a_k_enso = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-a">
  <title id="title-a">Ensō K - Ascending Zen Monogram</title>
  <!-- Grounded Habit Spine (Discipline) -->
  <rect x="52" y="44" width="26" height="168" rx="13" fill="#18181B" />

  <!-- Upper 1% Growth Arm (Ascending at 45°) -->
  <path fill="#18181B" d="
    M 96 128
    L 170 54
    A 18 18 0 0 1 196 54
    L 198 56
    A 18 18 0 0 1 196 82
    L 134 144
    Z
  "/>

  <!-- Lower Foundation Arm -->
  <path fill="#18181B" d="
    M 106 120
    L 134 92
    L 196 154
    A 18 18 0 0 1 196 180
    L 194 182
    A 18 18 0 0 1 168 180
    L 96 138
    Z
  "/>

  <!-- Zen Ensō Halo Arc (The Continuous Habit Circle) -->
  <path fill="none" stroke="#18181B" stroke-width="24" stroke-linecap="round" d="
    M 184 84
    A 84 84 0 0 1 184 172
  "/>
</svg>'''

with open(os.path.join(OUTPUT_DIR, "test-a-k.svg"), "w", encoding="utf-8") as f:
    f.write(svg_a_k_enso)

print("Saved test-a-k.svg")
