# Selected Work — Clay Object Spec (Step B)

Portfolio homepage stage: four low-poly clay dioramas.
Style anchor: Isleo clay isometric language (matte, layered bases, soft studio light).
Site background stays `#f5f3ee` — do not paste full Isleo `#C8E8F0` page wash.

## Shared engineering budget

| Constraint | Target |
|------------|--------|
| Per-object triangles | ≤ 2,500 tris (prefer ≤ 1,800) |
| Materials | Flat Principled, roughness 0.65–0.85, no image textures if possible |
| GLB size | ≤ 350 KB each (≤ 1.2 MB total) |
| Units | Meters; object fits ~1.0 unit bounding box |
| Camera (web) | Isometric-ish: rotate X ~54.7°, Y 0°, Z 45°; or orbit light |
| Lighting (web) | 1 key + 1 fill + soft env; match soft Isleo studio |
| Load | Dynamic import R3F; load GLB when section enters viewport |
| Reduced motion | Static still frame / paused mixer |

## Interaction contract (all four)

**Idle**
- Soft loop 4–8s
- Subtle bob (Y ±0.02) and/or yaw ±4°
- Optional secondary motion (water pulse, needle twitch, belt crawl, charge glow)

**Hover / focus**
- Pause generic bob OR amplify secondary motion
- One “signature” beat (reveal / spin / door / pulse) 0.6–1.2s
- Web UI: title + 1-line description + tags rise below (not in Blender)

**Click**
- Navigate to case study; 3D must not steal hit targets

---

## 01 — Isleo (featuredOrder 0)

**Metaphor:** Paradise hex island — product atom, not a phone mockup.

**Read at thumbnail:** “clay focus world”

**Parts**
1. Hex base — 3 stacked layers (grass / sand band / soil) — like product tiles
2. Recessed pond (flat water disc)
3. 2–3 trees (round canopy + optional pine)
4. 1–2 bush mounds

**Palette**
- Grass `#7BC47F` · sand `#E8D9B8` · soil `#8B6914` / `#A67C52`
- Water `#8EC8E0` · canopy `#6BBF7A` · trunk `#8B5E3C`
- Accent mint from Isleo OK in small doses (`#48A88E`)

**Idle:** whole island soft bob + tiny water opacity/emissive pulse  
**Hover:** staged mini-reveal — pond fades in → trees scale up 0→1 (reuse product birth idea, shortened)

**Export:** `public/work/clay/isleo.glb`  
**Anim clips:** `idle`, `hover` (or single clip with markers)

---

## 02 — Trail (featuredOrder 1)

**Metaphor:** Desk compass on a short clay pedestal — job-hunt direction / copilot.

**Parts**
1. Round pedestal (2-layer clay puck)
2. Compass body (low cylinder + bezel)
3. Needle (2-tone arrow)
4. Tiny N marker block

**Palette**
- Body `#F4F0E8` · bezel `#2D3E4A` · needle rose `#C45C4A` / north `#48A88E`
- Pedestal `#D4CBB8`

**Idle:** needle micro-twitch ±6° every few seconds + soft bob  
**Hover:** needle spins ~360° then settles north; bezel catches highlight

**Export:** `public/work/clay/trail.glb`

---

## 03 — Listing Image Pipeline (featuredOrder 2)

**Metaphor:** Mini conveyor with 3 picture frames rolling past — system, not a single Amazon screenshot.

**Parts**
1. Belt slab + two roller cylinders
2. Side rails
3. Three simple frames (plane + rim) with flat color “slots” (no photo textures)
4. Optional small hopper / stamp block at start

**Palette**
- Machine `#6B7C8A` · belt `#3D4A54` · frames `#F5F3EE` rims `#2D3E4A`
- Slot accents (6-slot hint): soft purple `#A78BFA`, mint, amber as flat fills

**Idle:** frames translate along belt in a loop (shader offset or bone/empty parents)  
**Hover:** belt speeds up 1.5×; stamp taps once

**Export:** `public/work/clay/listing-pipeline.glb`

---

## 04 — Tesla Charging (featuredOrder 3)

**Metaphor:** Mini charging pedestal + cable stub + soft charge glow — systems UX, not a car render.

**Parts**
1. Thick base pad
2. Charger body (rounded box / truncated wedge)
3. Screen inset (flat dark rect)
4. Cable curve (beveled curve or few cylinders) ending in handle
5. Glow disc on pad (emissive low)

**Palette**
- Body `#E8EAED` · dark `#1A1D21` · Tesla-adjacent red accent sparingly `#E31937` or portfolio purple `#A78BFA` for brand cohesion
- Glow `#5AD2B4` soft

**Idle:** glow pulse (emissive strength) + soft bob  
**Hover:** glow brightens + cable slight flex; screen “bars” scale up (3 flat bars as mesh)

**Export:** `public/work/clay/tesla-charging.glb`

---

## Build order

1. Isleo hex (style lock — matches existing cover language)
2. Trail compass
3. Listing conveyor
4. Tesla charger
5. Web stage component (after GLBs exist)

## Acceptance for Step B (this phase)

- [ ] Spec agreed (this file)
- [ ] Concept stills for all four (orthographic / isometric clay)
- [ ] Isleo prototype mesh in Blender matching poly budget
- [ ] User sign-off on silhouettes before finishing Trail / Pipeline / Tesla
