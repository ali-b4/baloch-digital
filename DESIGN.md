---
name: Baloch Digital
description: A calibrated frontier instrument built from monumental mono type, signal green, measurement lines, and orbital geometry.
colors:
  background: "#030304"
  foreground: "#eaeaea"
  muted: "#787883"
  signal: "#01ff00"
  line: "rgba(234, 234, 234, 0.12)"
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
    backgroundColor: "{colors.signal}"
    textColor: "{colors.background}"
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
    backgroundColor: "{colors.signal}"
    textColor: "{colors.background}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.25rem"
    height: "50px"
  contact-rail:
    backgroundColor: "rgba(3, 3, 4, 0.78)"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    padding: "15px clamp(1.25rem, 2vw, 3.75rem)"
    height: "58px"
---

# Design System: Baloch Digital

## Overview

**Creative North Star: "The Calibrated Frontier Instrument"**

Baloch Digital presents as a single technical instrument rather than a conventional fund website. A near-black field, monumental monospaced type, fine measurement lines, and orbital vector geometry make the interface feel precise, speculative, and controlled without borrowing credibility from generic portraits, cards, or decorative luxury cues.

The system is sparse but not quiet: scale creates authority, signal green marks live state, and slow choreography gives the page a sense of calibration in progress. Every layer stays legible as part of one instrument plane, from the persistent instrument header to the strategy frames, controlled-access surfaces, and the contact rail that docks at the close.

**Key Characteristics:**

- Near-black full-bleed instrument field with no card chrome.
- Monumental monospaced identity and strategy typography.
- Signal green reserved for live state, guidance, and interaction.
- Hairline measurement grids and orbital vector geometry supply structure.
- Slow, deliberate reveal and docking motion; reduced motion stays complete.

**The One Instrument Rule.** Every visible element should feel calibrated to the same near-black field; avoid disconnected themed panels.

## Colors

The palette is almost monochrome: Void Black carries the field, Chalk White carries authority, Telemetry Gray carries supporting information, and Signal Green appears only when the instrument is communicating state or action.

### Primary

- **Signal Green** (`signal`): Marks protocol copy, strategy identifiers, live-status geometry, focus states, and the docking rail's active boundary.

### Neutral

- **Void Black** (`background`): The uninterrupted page field and opaque base for fixed chrome.
- **Chalk White** (`foreground`): Primary identity, strategy headlines, and high-contrast copy after interaction.
- **Telemetry Gray** (`muted`): System labels, metadata, supporting descriptions, and dormant contact actions.
- **Hairline White** (`line`): Measurement grid, separators, orbit guides, and structural rules that should register without becoming content.

**The Signal Is State Rule.** Use signal green only for protocol labels, live status, geometry cores, focus, and intentional interaction; never as a broad decorative fill.

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

The page is a full-bleed instrument field with a responsive edge inset (`clamp(1.25rem, 2vw, 3.75rem)`). A fixed hairline grid uses `5vw` cells on wide screens and `25vw` cells below the `768px` breakpoint. A persistent opaque instrument header occupies the top `56px`; full-height surfaces account for that housing rather than allowing content to pass beneath it. The landing viewport remains a centered `100svh` stage with orbital geometry behind the identity.

Strategy frames alternate between `1fr / 2fr` and `2fr / 1fr` grids, aligned to the lower edge and separated by generous viewport rhythm (`25vh`). A single vertical structural line relates the sequence. At `768px` and below, the frames collapse to one column, all text returns to left alignment, the vertical guide moves to center, and the orbital object deliberately overscales beyond the viewport.

The contact rail remains fixed to the viewport floor. Near the document end it moves to the vertical midpoint, centers its contents, and gains signal-green boundaries, turning ordinary contact chrome into the closing event.

## Elevation & Depth

There are no conventional surface shadows. Depth comes from the fixed measurement grid, line opacity, orbital overlap, difference blending on the hero identity, a low-opacity green radial response behind hovered strategies, and translucent docking chrome with a restrained blur. The only explicit shadow is a soft signal-green text glow on an active strategy title.

**The Flat Instrument Plane Rule.** Keep surfaces flat at rest. Create depth with opacity, blend, hairlines, motion, and the single signal glow—not generic card shadows.

## Shapes

Interface chrome is rectilinear and zero-radius. One-pixel rules, square focus fills, and edge-to-edge rails create the instrument housing; large circles, tilted ellipses, axes, and crosshairs are reserved for orbital diagrams. Strategy emphasis appears as a hairline underline that grows across the title rather than as a container.

**The Zero-Radius Rule.** Panels, rails, rules, and links remain square; curves belong to orbital diagrams, not interface chrome.

## Components

### Hero Wordmark

- **Character:** Monumental, centered, and almost diagrammatic rather than logo-like.
- **Type:** Two uppercase lines in the display role with tight negative tracking and difference blending over the orbital field.
- **Protocol line:** Signal green, tiny, widely tracked, and separated from the identity by viewport-based space.

### Orbital Geometry

- **Structure:** Concentric circles, tilted ellipses, signal axes, and a compact crosshair core drawn with exceptionally fine strokes.
- **Color:** Hairline and chalk-white guides establish the field; signal green is limited to axes and the core.
- **Motion:** One continuous `120s` linear rotation. Stop the animation entirely when reduced motion is requested.

### Strategy Frames

- **Structure:** Alternating two-column compositions with metadata attached to a signal-green side rule, a large multi-line title, and supporting copy spanning the full grid.
- **State:** Hover shifts the title horizontally (`12px`), grows a green underline, lifts the description (`4px`), and introduces the one approved signal glow.
- **Touch behavior:** Suppress the hover translation, glow, and underline on devices without hover.

### Instrument Header

- **Structure:** A persistent opaque `56px` top housing with a one-pixel lower rule and the shared responsive edge inset.
- **Navigation:** Only one zero-radius, one-pixel Telemetry Gray navigation control appears at a time. The landing surface places `Data Room` on the left with telemetry on the right; the locked surface moves telemetry to the left and places the matching `Return // Home` control on the right.
- **State:** Hover shifts either navigation control's border and text to Signal Green. Keyboard focus and active states use a square Signal Green fill with Void Black text.
- **Motion:** Keep the header visually anchored during navigation. The page plane uses a mirrored `8–10px` directional shift with a brief blur-and-opacity handoff over `260ms`; reduced motion retains only a short opacity crossfade.

### Locked Data Room Gate

- **Composition:** A restrained two-column identity-and-authorization surface on wide screens that collapses to one column below `768px`; orbital geometry stays behind the identity as structural continuity, not decoration.
- **Fields:** Password field and action share a `50px` height, zero radius, one-pixel rules, and Space Mono. The action begins with a Signal Green fill and Void Black text, then inverts on hover or keyboard focus.
- **Copy:** Keep the gate to `Authorization`, `Password // Required`, and `Authenticate`; reveal `Invalid passphrase` only after a failed submission.
- **Status:** Invalid and focus feedback use the existing Signal Green state language; do not introduce a new alert palette, card treatment, or access-only theme.

### Social Links

- **Shape:** Square minimum target (`32px`) with no visible container at rest.
- **Default / Hover:** Muted gray at rest; signal green on hover.
- **Focus:** A full signal-green square with Void Black iconography provides an unmistakable keyboard state.

### Docking Contact Rail

- **Style:** A fixed, translucent near-black rail with a hairline top edge, restrained backdrop blur, and uppercase telemetry labeling.
- **Closing state:** Centers at mid-viewport with signal-green top and bottom boundaries, slightly roomier padding, translucent fill, and restrained backdrop blur.
- **Motion:** Use the shared expressive ease over `0.8s`; the rail must remain stable and immediately usable under reduced motion.

## Do's and Don'ts

### Do:

- Do use signal green as a scarce state and interaction color.
- Do let large regular-weight Space Mono carry hierarchy through scale and spacing.
- Do build structure with one-pixel rules, measured grids, axes, and disciplined alignment.
- Do make motion slow, legible, and fully optional under reduced-motion preferences.
- Do preserve generous viewport-scale pauses between major strategy frames.

### Don't:

- Don't introduce rounded cards, pills, soft dashboard containers, or conventional fund-site modules.
- Don't substitute generic sans-serif display type or mix unrelated type families into the instrument voice.
- Don't wash large surfaces in signal green or add competing accent colors.
- Don't use generic drop shadows, glossy gradients, or decorative blur as the main depth language.
- Don't hide essential identity, strategy copy, or contact actions behind motion.
