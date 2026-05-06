# R1.6 — Frame pipeline completion report

> Phase R1.6 — extract 600 AVIF frames (plus 600 WebP fallbacks + 5 posters) from 5 timelapse videos. One-time pass.

---

## Result

**ENCODING COMPLETE at 1080p, AVIF q=42, effort=6.**

| Metric | Value | Spec target | Status |
| --- | --- | --- | --- |
| Total frames | 600 | 600 | ✓ |
| Resolution | 1920 × 1080 | 1920 × 1080 | ✓ |
| Source frame rate | 24 fps | 24 or 30 | ✓ |
| Output frame rate | 15 fps | 15 | ✓ |
| Frames per clip | 120 each | 120 each | ✓ |
| AVIF total | 53.21 MB | ≤ 60 MB (revised) | ✓ |
| WebP total | 91.60 MB | ≤ 14 MB (original spec) | ✗ deviation, see below |
| AVIF avg per frame | 90.8 KB | n/a (revised target) | informational |
| WebP avg per frame | 156.2 KB | n/a (informational) | informational |
| Posters | 5 (one per clip) | 5 | ✓ |
| `manifest.json` | present, valid | present, valid | ✓ |

---

## Per-clip breakdown

| Clip | Stage transition | Frames | AVIF | WebP |
| --- | --- | ---: | ---: | ---: |
| clip1 | Stage 1 → 2 (plot to foundation) | 120 | 11.97 MB | 20.18 MB |
| clip2 | Stage 2 → 3 (foundation to frame) | 120 | 12.68 MB | 21.42 MB |
| clip3 | Stage 3 → 4 (frame to cladding) | 120 | 9.59 MB | 16.81 MB |
| clip4 | Stage 4 → 5 (cladding to glass) | 120 | 9.24 MB | 16.42 MB |
| clip5 | Stage 5 → 6 (glass to night) | 120 | 9.73 MB | 16.77 MB |
| **Total** | — | **600** | **53.21 MB** | **91.60 MB** |

---

## Posters

5 JPEG posters generated from the first frame of each clip (`mozjpeg q=85`):

| File | Size | Spec target |
| --- | ---: | --- |
| `clip1_poster.jpg` | 232 KB | ≤ 200 KB (deviation: +32 KB) |
| `clip2_poster.jpg` | 432 KB | ≤ 200 KB (deviation: +232 KB) |
| `clip3_poster.jpg` | 264 KB | ≤ 200 KB (deviation: +64 KB) |
| `clip4_poster.jpg` | 288 KB | ≤ 200 KB (deviation: +88 KB) |
| `clip5_poster.jpg` | 244 KB | ≤ 200 KB (deviation: +44 KB) |
| **Total** | **1.45 MB** | — |

---

## `manifest.json` validity

Parsed successfully. Top-level keys:

- `version`            → `1`
- `totalFrames`        → `600`
- `fps`                → `15`
- `resolution`         → `{ width: 1920, height: 1080 }`
- `framePathTemplate`  → `/frames/clip{clip}_{frame}.{ext}`
- `posterPathTemplate` → `/frames/clip{clip}_poster.jpg`
- `formats`            → `["avif", "webp"]`
- `clips`              → array of 5 clip descriptors with `id`, `name`, `frames`, `sectionLabel`, `firstFrame`, `lastFrame`

Clip descriptors (verbatim from the manifest, in order):

1. `plot-to-foundation`  — Stage 1 → 2, frames 1–120
2. `foundation-to-frame` — Stage 2 → 3, frames 1–120
3. `frame-to-cladding`   — Stage 3 → 4, frames 1–120
4. `cladding-to-glass`   — Stage 4 → 5, frames 1–120
5. `glass-to-night`      — Stage 5 → 6, frames 1–120

---

## Deviations from the spec, and why

1. **AVIF total 53.21 MB vs original 8 MB target.** Source content is dense construction-timelapse imagery — many small details, harsh contrast, lots of edges. AVIF compression hits diminishing returns. First pass at q=50 produced 69.94 MB; per the user's revised budget (~50 MB realistic), re-encoded at q=42 producing 53.21 MB. Visual quality at q=42 should still be indistinguishable at scroll speed.

2. **WebP total 91.60 MB vs original 14 MB target.** Same content-density reason. WebP wasn't re-encoded in the q=42 pass per the user's instruction ("Keep WebP at q=70 unchanged"). WebP only loads for the ~3% of users on browsers without AVIF support; total page weight for those users will be the WebP set, not AVIF.

3. **Posters 232–432 KB vs ≤ 200 KB target.** Source PNG first-frames are lossless 1920×1080. mozjpeg q=85 doesn't get below 200 KB on this content. Could be brought down with a follow-up pass at q=75 or by downscaling posters to 1280×720 (canvas downscales them on display anyway), if needed.

None of these deviations are blocking — page weight on AVIF-capable browsers is still well under the project total budget.

---

## Pipeline parameters used

```
Source        : public/videos/clip{1..5}.mp4 — 1920×1080 24fps 8.04s 193 frames each
Workdir       : C:\procare-frames-work (cleaned up after copy)
Extraction    : ffmpeg → fps=15, scale=1920:1080:flags=lanczos, PNG intermediate
Per-clip count: 121 → trimmed to 120 (delete clip{i}_121.png)
AVIF encode   : sharp 0.34.x → quality=42, effort=6
WebP encode   : sharp 0.34.x → quality=70, effort=6
Posters       : sharp jpeg → quality=85, mozjpeg=true (first-frame PNG → JPEG)
ffmpeg build  : 8.1.1-full_build (Gyan.FFmpeg via winget) — libaom-av1, librav1e, libsvtav1 all available
```

---

## Files now in the project

```
public/frames/
├─ clip1_001.avif … clip1_120.avif         (120 frames)
├─ clip1_001.webp … clip1_120.webp         (120 frames)
├─ clip1_poster.jpg
├─ clip2_001.avif … clip2_120.avif         (120 frames)
├─ clip2_001.webp … clip2_120.webp         (120 frames)
├─ clip2_poster.jpg
├─ clip3_001.avif … clip3_120.avif         (120 frames)
├─ clip3_001.webp … clip3_120.webp         (120 frames)
├─ clip3_poster.jpg
├─ clip4_001.avif … clip4_120.avif         (120 frames)
├─ clip4_001.webp … clip4_120.webp         (120 frames)
├─ clip4_poster.jpg
├─ clip5_001.avif … clip5_120.avif         (120 frames)
├─ clip5_001.webp … clip5_120.webp         (120 frames)
├─ clip5_poster.jpg
└─ manifest.json
```

Total: **1206 files** (600 AVIF + 600 WebP + 5 posters + 1 manifest), **~146 MB**.

`public/videos/clip{1..5}.mp4` left intact per the user's instruction.

---

## Next step

Awaiting the visual spot-check on these 6 frames before R1.6 closes:

- `public/frames/clip1_001.avif` — Stage 1 (golden dawn, empty plot)
- `public/frames/clip1_120.avif` — Stage 2 (foundation pit, midday)
- `public/frames/clip2_120.avif` — Stage 3 (golden hour, steel frame)
- `public/frames/clip3_120.avif` — Stage 4 (overcast, mid-construction)
- `public/frames/clip4_120.avif` — Stage 5 (dusk, finished glass)
- `public/frames/clip5_120.avif` — Stage 6 (night, fully lit)

Once the user confirms all six look right, the commit lands as `R1.6: 600 AVIF frames extracted and verified`.
