---
name: Baloch Digital
description: A sunlit frontier instrument built from monumental mono type, warm cream, pale sage-green signals, measurement lines, and responsive radial geometry.
colors:
  background: "#f7f2e7"
  surface: "#fffaf1"
  foreground: "#1f1e1b"
  muted: "#5f5c56"
  accentGreen: "#c0cfbb"
  accentGreenInk: "#435a49"
  signal: "#435a49"
  live: "#435a49"
  line: "rgba(31, 30, 27, 0.14)"
typography:
  display:
    fontFamily: "Space Mono, monospace"
    fontSize: "11vw"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Space Mono, monospace"
    fontSize: "5vw"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Space Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0.02em"
  label:
    fontFamily: "Space Mono, monospace"
    fontSize: "0.65rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.1em"
  reportDisplay:
    fontFamily: "Space Mono, monospace"
    fontSize: "clamp(4.5rem, 8vw, 7.5rem)"
    fontWeight: 400
    lineHeight: 0.84
    letterSpacing: "-0.04em"
  reportHeading:
    fontFamily: "Space Mono, monospace"
    fontSize: "clamp(2.7rem, 5.2vw, 5.8rem)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  reportBody:
    fontFamily: "Space Mono, monospace"
    fontSize: "clamp(0.96rem, 1.08vw, 1.06rem)"
    fontWeight: 400
    lineHeight: 1.82
    letterSpacing: "0"
rounded:
  none: "0px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2rem"
  gutter: "clamp(1.25rem, 2vw, 3.75rem)"
components:
  strategy-title:
    textColor: "{colors.foreground}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
  strategy-title-hover:
    textColor: "{colors.signal}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
  social-link:
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    size: "32px"
  social-link-focus:
    backgroundColor: "{colors.accentGreen}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
    size: "32px"
  site-header:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
    padding: "0 clamp(1.25rem, 2vw, 3.75rem)"
    height: "56px"
  access-field:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
    height: "50px"
  access-action:
    backgroundColor: "{colors.accentGreen}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.25rem"
    height: "50px"
  contact-rail:
    backgroundColor: "rgba(247, 242, 231, 0.86)"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    padding: "15px clamp(1.25rem, 2vw, 3.75rem)"
    height: "58px"
---

# Design System: Baloch Digital

## Overview

**Creative North Star: "The Calibrated Frontier Instrument"**

Baloch Digital presents as a single technical instrument rather than a conventional fund website. A warm-cream field, monumental graphite monospaced type, fine measurement lines, and responsive radial geometry make the interface feel precise, speculative, and controlled without borrowing credibility from generic portraits, cards, or decorative luxury cues.

The system is sparse but not quiet: scale creates authority, pale sage green guides action and structure, Sage Ink marks live emphasis, and slow choreography gives the page a sense of calibration in progress. Every layer stays legible as part of one sunlit instrument plane, from the persistent instrument header to the strategy frames, controlled-access surfaces, and the contact rail that docks at the close.

**Key Characteristics:**

- Warm-cream full-bleed instrument field with no card chrome.
- Monumental monospaced identity and strategy typography.
- Pale Sage and Sage Ink establish one restrained signal language across fills, guidance, state, and interaction.
- Hairline measurement grids and cursor-responsive radial geometry supply structure.
- Slow, deliberate reveal and docking motion; reduced motion stays complete.

**The One Instrument Rule.** Every visible element should feel calibrated to the same warm-cream field; avoid disconnected themed panels.

## Colors

The palette reads like a technical sheet in daylight: Warm Cream carries the field, Graphite carries authority, Telemetry Gray carries supporting information, Pale Sage owns generous highlight fields, and Sage Ink carries guidance, action, and live state.

### Primary

- **Pale Sage** (`accentGreen`) and **Sage Ink** (`signal`, `live`): Pale Sage owns washes, selections, and active fills; Sage Ink owns guidance, primary actions, focus, live status, terminal boundaries, and the report's modeled path.

### Neutral

- **Warm Cream** (`background`): The uninterrupted page field and opaque base for fixed chrome.
- **Paper White** (`surface`): A restrained elevated paper tone available only when the base needs separation.
- **Graphite** (`foreground`): Primary identity, strategy headlines, and high-contrast copy after interaction.
- **Telemetry Gray** (`muted`): System labels, metadata, supporting descriptions, and dormant contact actions.
- **Graphite Hairline** (`line`): Measurement grid and quiet separators that should register without becoming content.

**The One-Signal Rule.** Sage is the only accent family. Pale Sage fills visible regions; Sage Ink carries small text, focus outlines, critical one-pixel marks, and modeled paths. Invalid and failure feedback remains Graphite with explicit copy so green is never mistaken for success.

## Typography

**Display Font:** Space Mono (with monospace fallback)  
**Body Font:** Space Mono (with monospace fallback)  
**Label/Mono Font:** Space Mono (with monospace fallback)

**Character:** One monospaced family unifies identity, telemetry, and narrative into a coherent machine voice. Regular weight dominates; scale, spacing, case, and contrast create hierarchy while tabular numerals keep system readouts aligned.

### Hierarchy

- **Display** (400, `11vw`, `0.9` line-height): Stacked uppercase firm identity; reduce to `15vw` with a slightly looser `0.94` line-height on narrow screens.
- **Headline** (400, `5vw`, `1` line-height): Multi-line strategy names; on narrow screens use `clamp(2.5rem, 11vw, 4.5rem)`.
- **Body** (400, `0.75rem`, `1.7` line-height): Strategy explanation copy, held to about `52ch` on wide layouts and released to full width on mobile.
- **Label** (400, `0.65rem`, `0.1em` tracking): Uppercase metadata and status. Instrument-header telemetry and the contact rail may widen tracking to `0.2em`; the hero protocol line widens to `0.4em`.

**The Scale Carries Hierarchy Rule.** Weight stays mostly regular; hierarchy comes from viewport-relative size, line height, spacing, and case.

## Layout

The page is a full-bleed instrument field with a responsive edge inset (`clamp(1.25rem, 2vw, 3.75rem)`). A fixed hairline grid uses `5vw` cells on wide screens and `25vw` cells below the `768px` breakpoint. A persistent opaque instrument header occupies the top `56px`; full-height surfaces account for that housing rather than allowing content to pass beneath it. The landing viewport remains a `100svh` stage with the wordmark centered and the responsive radial field anchored into the lower-right crop behind it.

Strategy frames alternate between `1fr / 2fr` and `2fr / 1fr` grids, aligned to the lower edge and separated by generous viewport rhythm (`25vh`). A single vertical structural line relates the sequence. At `768px` and below, the frames collapse to one column, all text returns to left alignment, the vertical guide moves to center, and the radial field deliberately overscales beyond the viewport.

The contact rail remains fixed to the viewport floor. Near the document end it moves to the vertical midpoint, centers its contents, and gains paired Sage Ink boundaries, turning ordinary contact chrome into the closing event.

## Elevation & Depth

There are no conventional surface shadows. Depth comes from the fixed measurement grid, line opacity, radial overlap, a low-opacity pale-sage response behind hovered strategies, and translucent cream docking chrome with a restrained blur. The only explicit shadow is a soft, vertically offset pale-sage response on an active strategy title.

**The Flat Instrument Plane Rule.** Keep surfaces flat at rest. Create depth with opacity, hairlines, motion, and the single active-title shadow—not generic card shadows.

## Shapes

Interface chrome is rectilinear and zero-radius. One-pixel rules, square focus fills, and edge-to-edge rails create the instrument housing; large circles, tilted ellipses, axes, and crosshairs are reserved for orbital diagrams. Strategy emphasis appears as a hairline underline that grows across the title rather than as a container.

**The Zero-Radius Rule.** Panels, rails, rules, and links remain square; curves belong to orbital diagrams, not interface chrome.

## Components

### Hero Wordmark

- **Character:** Monumental, centered, and almost diagrammatic rather than logo-like.
- **Type:** Two uppercase graphite lines in the display role with tight negative tracking over the radial field.
- **Protocol line:** Sage Ink, tiny, widely tracked, and separated from the identity by viewport-based space.

### Interactive Radial Field

- **Structure:** A deterministic set of fine graphite rays connects one fixed center to irregularly distributed endpoints. The field begins at the hero midpoint, placing its core near the lower-right edge so the viewport crops it asymmetrically behind the centered wordmark. Seeded angular jitter, varied reach, and restrained point sizes keep the burst organic without allowing it to recompose between visits. A compact Pale Sage disc masks the line convergence behind a hairline Sage Ink rim.
- **Color:** Graphite carries the quiet ray field and most endpoints. A small seeded subset uses Sage Ink, and pointer influence temporarily moves nearby endpoints into that same live-signal color. Pale Sage remains confined to the core.
- **Motion:** On fine-pointer devices, the cursor opens a bounded cavity in nearby endpoints; critically damped springs return each point to its exact home position on exit. The canvas runs only while input or settling requires it. Touch, no-hover, no-JavaScript, and reduced-motion paths retain the complete static vector composition.

### Strategy Frames

- **Structure:** Alternating two-column compositions with metadata attached to a Sage Ink side rule, a large multi-line title, and supporting copy spanning the full grid. Strategy identifiers use Sage Ink; each status sits on a persistent Pale Sage highlighter with Graphite text.
- **State:** Hover shifts the title horizontally (`12px`) into Sage Ink, grows a substantial pale-sage underline, lifts the description (`4px`), and introduces the one approved sage response shadow.
- **Touch behavior:** Suppress the hover translation, glow, and underline on devices without hover.

### Instrument Header

- **Structure:** A persistent opaque `56px` top housing with a one-pixel lower rule and the shared responsive edge inset.
- **Navigation:** Only one zero-radius, one-pixel Telemetry Gray navigation control appears at a time. The landing surface places `Data Room` on the left with telemetry on the right; the locked surface moves telemetry to the left and places the matching `Return // Home` control on the right.
- **State:** Hover shifts either navigation control's border and text to Sage Ink. Keyboard focus and active state use a Pale Sage fill with a Sage Ink boundary and Graphite text.
- **Motion:** Keep the header visually anchored during navigation. The page plane uses a mirrored `8–10px` directional shift with a brief blur-and-opacity handoff over `260ms`; reduced motion retains only a short opacity crossfade.

### Locked Data Room Gate

- **Composition:** A restrained two-column identity-and-authorization surface on wide screens that collapses to one column below `768px`; orbital geometry stays behind the identity as structural continuity, not decoration.
- **Fields:** Password field and action share a `50px` height, zero radius, one-pixel rules, and Space Mono. The action uses a Pale Sage fill with Graphite text and a Sage Ink boundary through its interaction states.
- **Copy:** Keep the gate to `Authorization`, `Password // Required`, and `Authenticate`; reveal `Invalid passphrase` only after a failed submission.
- **Status:** Focus uses Sage Ink; invalid feedback uses Graphite and explicit copy. Do not introduce a card treatment or access-only theme.

### Research Report Instrument

- **Composition:** A semantic long-form article leads a roughly sixty/forty article-and-instrument plane. The opening cover uses a balanced report title and flat editorial abstract on the cream canvas rather than a metadata matrix. The sticky chart remains a supporting rail with a protected minimum width; the article becomes full width for methodology, sources, disclosures, and the accessible data table after the model unpins.
- **Type:** Report cover display, chapter headings, and editorial body use the dedicated `reportDisplay`, `reportHeading`, and `reportBody` roles above. Essential telemetry never shrinks below the `0.65rem` label role on compact screens.
- **Chart hierarchy:** Sage Ink belongs to the primary modeled path, current progress, focus, and navigation. A lower-opacity sage reference trace keeps the complete primary trajectory visible beneath the scroll reveal; a Pale Sage uncertainty band separates scenario range from trajectory. Auxiliary tracks use independent logarithmic scales and distinct solid, dash, area, or point patterns so the single-hue system never relies on color alone. Each persistent plot heading pairs its metric name with a compact, tabular current value that follows the line reveal; the primary value follows the inspection cursor while scrubbing. Text and completed paths retain accessible contrast when inactive. Plot interiors remain grid-free and each plot receives the same Sage Ink frame.
- **Milestone guides:** Primer and Stages 1–3 share faint sage dotted guides that rise from the bottom timeline through all four plots. A small Graphite circle appears on every track only after its drawn line reaches that stage, then persists as the article advances; delayed tracks cannot reveal a positive milestone before activation. The guides remain structural and low contrast, while the inspected stage lifts into full Sage Ink. Cover calibration is a seed state, not a plotted milestone.
- **Primary-path inspection:** On wide, hover-capable desktop layouts, scrubbing the primary `$NOCK` plot leaves the scroll-authored chart state untouched while the lower three plots crossfade in place to one flat four-row stage summary. The neutral inspection locator moves continuously, while the nearest stage row and timeline tick receive Sage Ink; pointer exit or article scrolling restores the telemetry. Keyboard focus exposes the same four stages with arrow, Home, End, Escape, and blur behavior; touch and compact layouts retain the normal chart stack.
- **Responsive behavior:** Portrait mobile pins a simplified chart below a two-row `100px` report header. Short landscape replaces the sticky chart with full-width stage snapshots and composes a compact seed-state chart beside the cover within the first viewport.
- **Motion:** Scroll state is authored, reversible, requestAnimationFrame-bounded, and independent from the pure renderer. All four tracks advance continuously on one shared progression axis beginning with Primer, without a held reveal plateau at chapter boundaries. `$NOCK` FDV and work rate rise immediately; inference revenue and OpenRouter market share travel along zero baselines, step to their first positive values at Stage 1, and then interpolate log-linearly to their own upper-right boundaries. Reduced motion snaps to complete cue states; no JavaScript and chart failures retain the article, final SVG, snapshots, caption, and data table.
- **Publication state:** Placeholder, draft, and final labels are data-driven. The publication gate remains locked until narrative, metrics, sources, annotations, disclosures, and metadata all resolve without fixture markers.

### Social Links

- **Shape:** Square minimum target (`32px`) with no visible container at rest.
- **Default / Hover:** Muted gray at rest; Sage Ink on hover.
- **Focus:** A Pale Sage square with Graphite iconography and a Sage Ink outline provides an unmistakable keyboard state.

### Docking Contact Rail

- **Style:** A fixed, translucent warm-cream rail with a hairline top edge, restrained backdrop blur, and uppercase telemetry labeling. The contact label carries a persistent Pale Sage highlighter so the secondary accent is visible in every viewport.
- **Closing state:** Centers at mid-viewport with Sage Ink top and bottom boundaries, slightly roomier padding, translucent fill, and restrained backdrop blur.
- **Motion:** Use the shared expressive ease over `0.8s`; the rail must remain stable and immediately usable under reduced motion.

## Do's and Don'ts

### Do:

- Do use Pale Sage for visible highlight fields and Sage Ink for guidance, action, and consequential emphasis.
- Do let large regular-weight Space Mono carry hierarchy through scale and spacing.
- Do build structure with one-pixel rules, measured grids, axes, and disciplined alignment.
- Do make motion slow, legible, and fully optional under reduced-motion preferences.
- Do preserve generous viewport-scale pauses between major strategy frames.

### Don't:

- Don't introduce rounded cards, pills, soft dashboard containers, or conventional fund-site modules.
- Don't substitute generic sans-serif display type or mix unrelated type families into the instrument voice.
- Don't use pastel fills for small text, focus outlines, or critical one-pixel strokes; use the matching ink tone.
- Don't use generic drop shadows, glossy gradients, or decorative blur as the main depth language.
- Don't hide essential identity, strategy copy, or contact actions behind motion.
