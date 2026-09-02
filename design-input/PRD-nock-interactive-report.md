# Product Requirements Document: `$NOCK` Interactive Initiating-Coverage Report

**Status:** Ready for engineering handoff  
**Product mode:** Read  
**Target route:** `/data/nock`  
**Access:** Private Data Room session  
**Implementation target:** Existing Baloch Digital Next.js application  
**PRD date:** 2026-08-31  
**Content status:** Visual and interaction prototype only; all narrative and numerical projections remain placeholders

## 1. Executive summary

Build a private, long-form initiating-coverage report for `$NOCK` at `/data/nock`. The report's job is to help readers evaluate the author's investment thesis. Readers can be assumed to understand blockchain and AI at a rudimentary level, but not Nock itself; a primer must make the rest of the thesis legible without becoming a general blockchain or AI tutorial.

The defining experience is a long-form article paired with one persistent, scroll-controlled visualization. As the reader advances through Primer, Stage 1, Stage 2, and Stage 3 / Endgame, the visualization expands from a calibrated baseline into a complete model of:

- `$NOCK` token value as the primary series.
- Network work rate in `EMAC/s`.
- Inference revenue.
- Percentage of global open-weight token consumption.

Version 1 is authored and deterministic: scrolling controls the visualization, and readers do not manipulate scenarios or metrics. The chart and data architecture must nevertheless be controller-agnostic so an independently explorable version can be added later without replacing the renderer or reformatting the source data.

The report inherits the existing Baloch Digital visual system: near-black instrument field, Space Mono, chalk white, telemetry gray, signal green, hairline grids, zero-radius chrome, and slow calibrated motion. It must feel like a deeper mode of the existing site, not a microsite or a visual clone of the reference.

## 2. Decision record

| Decision | Requirement |
| --- | --- |
| Audience | Readers with rudimentary blockchain and AI knowledge but no assumed Nock knowledge |
| Reader outcome | Evaluate the investment thesis being put forward |
| Route | `/data/nock` |
| Access | Behind the existing Data Room gate, upgraded to real server-enforced access |
| Primary interaction | Scroll-controlled narrative visualization only |
| Narrative structure | Cover, Primer, Stage 1, Stage 2, Stage 3 / Endgame, close |
| Primary visual variable | `$NOCK` token value |
| Auxiliary variables | Work rate (`EMAC/s`), inference revenue, global open-weight token-consumption share |
| Brand | Inherit the existing Baloch Digital system |
| Copy and metrics | Clearly labeled filler only during this build |
| Future provision | Independent explorer using the same renderer and data contract |

## 3. Reference and design interpretation

Primary reference: [AI 2040](https://ai-2040.com/).

Use the reference for its editorial interaction pattern:

- A substantial, chaptered long-form document.
- Persistent wayfinding through a large narrative.
- Visual models that evolve as the surrounding argument advances.
- A feeling that the visualization is evidence inside the article, not a dashboard embedded beside it.

Do not copy the reference site's identity, typography, palette, content, exact layout, or scenario conventions. The owner-described behavior—article alongside a chart that scales, grows, and changes with scroll—is the binding reference. The Baloch Digital design system remains visual authority.

## 4. Product goals

### 4.1 Primary goals

1. Make the investment thesis understandable as a staged causal model rather than a sequence of disconnected claims.
2. Give Nock newcomers enough high-level context in the Primer to evaluate the later thesis stages.
3. Keep token value visually primary while showing how work rate, inference revenue, and global consumption share relate to the valuation path.
4. Make progress through the argument obvious at all times.
5. Preserve a credible research-report reading experience even if motion is disabled or JavaScript fails.
6. Make later replacement of placeholder copy and data a content task, not a layout rewrite.
7. Keep the renderer reusable for a future explorer.

### 4.2 Success criteria

The visual prototype succeeds when:

- A first-time reader can identify the asset, report type, current thesis stage, and four modeled variables without instruction.
- The Primer can be understood without prior Nock knowledge.
- At every scroll position, the visible chart state corresponds unambiguously to the active narrative step.
- Readers can distinguish observed inputs, author assumptions, and modeled outputs once real content is added.
- The article remains readable and logically complete in reduced-motion and no-JavaScript fallbacks.
- An engineer can replace all filler values through the content/data layer without editing visualization logic.

Product analytics, if installed, should be able to measure report opens, highest stage reached, and report completion. No analytics provider is selected in this PRD.

## 5. Non-goals

Version 1 must not include:

- Final article prose, investment claims, valuation targets, forecasts, citations, or legal language.
- Real `$NOCK` metrics or market data.
- Live APIs, price feeds, network telemetry, or server-side data ingestion.
- Reader-controlled metric toggles, time-range controls, scenario controls, zoom, pan, drag, or tooltips.
- Bull/base/bear comparisons.
- Portfolio tracking, position sizing, trading controls, wallet connections, or purchase links.
- Comments, annotations, accounts, per-reader identity, or collaborative features.
- PDF generation or a print-perfect report edition.
- A redesign of the Baloch Digital home page.
- A new visual identity for the Data Room.

## 6. Existing-system context

The engineering implementation must extend the current application rather than start a separate project.

### 6.1 Current stack

- Next.js `16.3.2`, App Router.
- React `19.2.8`.
- TypeScript with strict checking.
- Tailwind CSS `4`, with much of the incumbent visual system expressed in `src/app/globals.css`.
- `next/font` with Space Mono.
- Vercel as the intended deployment platform.

Before implementation, the engineering agent must read the relevant local Next.js 16 guides in `node_modules/next/dist/docs/`, especially authentication, async cookies, Server Functions or Route Handlers, `proxy.ts`, route protection, and any chosen MDX integration. Next.js 16 conventions must take precedence over older framework habits.

### 6.2 Existing reusable surfaces

- `src/app/layout.tsx`: global font, metadata, and design contract.
- `src/app/site-header.tsx`: fixed instrument header and navigation behavior.
- `src/app/route-transition.tsx`: route-transition grammar.
- `src/app/data/page.tsx`: current Data Room landing surface.
- `src/app/data/data-room-gate.tsx`: current gate UI.
- `src/app/globals.css`: design tokens, grid, data-room styling, motion, responsive rules, and reduced-motion behavior.
- `DESIGN.md`: durable visual authority.

### 6.3 Important current limitation

The current Data Room gate is a client-side mock that always returns `Invalid passphrase`; it does not authenticate or protect any content. It must be replaced with server-side verification before `/data/nock` is considered gated.

## 7. Scope

### 7.1 Included in version 1

- Real Data Room authentication using one owner-provided shared password.
- Signed private session stored in an `HttpOnly` cookie.
- Protection for `/data/nock` on direct requests and client navigation.
- Report cover and metadata area.
- Long-form Primer, Stage 1, Stage 2, Stage 3 / Endgame, and closing sections populated with explicit filler.
- Sticky scroll-driven SVG visualization on desktop and tablet.
- Compact scroll-driven visualization or deterministic snapshot fallback on small/short viewports.
- Shared content and data contracts.
- Source/citation placeholders and disclosure slots.
- Accessible data table or equivalent non-visual representation.
- Reduced-motion, no-JavaScript, loading, error, and malformed-data fallbacks.
- Private-route metadata and indexing protection.
- Responsive, browser, performance, accessibility, and visual QA.

### 7.2 Deferred independent explorer

The following are explicitly deferred but must be enabled by the architecture:

- Metric visibility toggles.
- Hover/focus/tap inspection.
- Stage or milestone scrubber.
- Scenario selection.
- Linear/log scale control.
- Direct-linkable view state.
- Compare mode.
- CSV or image export.

No dormant explorer controls should appear in version 1.

## 8. Access and session requirements

### 8.1 Access flow

1. An unauthenticated request to `/data/nock` redirects to `/data?next=/data/nock`.
2. The Data Room gate validates the shared password on the server.
3. Successful validation creates a signed session and redirects to the validated same-origin `next` path.
4. If no `next` value is present, successful authentication redirects to `/data/nock` for version 1.
5. An authenticated visit to `/data` redirects to `/data/nock` while Nock is the only Data Room asset.
6. A `Lock // Data Room` action clears the session and returns to `/data`.
7. Expired, missing, or tampered sessions return the reader to the gate without exposing report markup or data.

### 8.2 Password and secret handling

- The initial shared password is the owner-provided value supplied separately to engineering.
- Store it only as `DATAROOM_PASSWORD` in local and Vercel environment configuration.
- Never place the password in a Client Component, checked-in source, PRD fixture, analytics event, console output, build log, or error message.
- Use a separate high-entropy `DATAROOM_SESSION_SECRET` to sign session data.
- Compare credentials on the server using a timing-safe strategy.
- Use generic failure feedback: `Invalid passphrase`.
- Do not reveal whether the submitted value had the correct length or partial match.

### 8.3 Session policy

- Cookie attributes: `HttpOnly`, `Secure` in production, `SameSite=Lax`, `Path=/data`.
- Default lifetime: seven days.
- Session payload must be minimal and signed; it must not contain the password.
- Clearing or rotating `DATAROOM_SESSION_SECRET` invalidates existing sessions.
- Authentication must be rechecked inside the protected server boundary. `proxy.ts` may perform an optimistic redirect but must not be the only authorization layer.
- Validate the `next` path against an allowlist under `/data`; prevent open redirects.

### 8.4 Security boundary

This is a shared-password publication gate, not an identity system or high-security vault. Do not place material secrets behind it. `noindex` is not security.

Protected report data and downloadable assets must not be emitted into public static files if their URLs would bypass the session check. If future assets require protection, deliver them through an authenticated server boundary.

### 8.5 Private-route metadata

All `/data` content must use:

- `robots: noindex, nofollow`.
- No sensitive Open Graph or social-preview description.
- Private/no-store caching where required to prevent protected response reuse across sessions.

## 9. Information architecture

### 9.1 Report sequence

1. **Cover / Calibration**
2. **Primer**
3. **Stage 1**
4. **Stage 2**
5. **Stage 3 / Endgame**
6. **Thesis close, risks, methodology, data table, sources, and disclosures**

The four requested thesis sections—Primer and Stages 1–3—are the primary navigation units. The cover and closing material support them but should not compete as numbered stages.

### 9.2 Wayfinding

The report must provide:

- Persistent report identity: `$NOCK // Initiating Coverage`.
- Current chapter label and `01 / 04`-style progress.
- A thin document-progress indicator.
- Anchor navigation to Primer and each stage.
- A visible exit/lock control.

Anchor navigation may jump the scroll position, but it does not independently manipulate the chart. The chart always resolves from the resulting document position.

### 9.3 Semantic outline

- One page `h1` for the report title.
- One `h2` for each primary section.
- `h3` headings for claims, mechanisms, risks, or evidence groups inside a section.
- Figures, captions, notes, tables, sources, and disclosures use their native semantic elements.
- Heading levels must not be chosen for visual size.

## 10. Page and layout requirements

### 10.1 First viewport

The report opens as a calibrated research instrument rather than a conventional article hero.

Required elements:

- `$NOCK` at monumental scale.
- `Initiating Coverage` as the report type.
- Placeholder metadata slots for author, publication date, revision, and reading time.
- A visible `Illustrative data` status while placeholders remain.
- The visualization in its seed state: origin, baseline, axes or calibration marks, but no fully drawn thesis path.
- A restrained scroll cue.
- The fixed Baloch Digital instrument header.

The reader should encounter the report's mechanism—the staged valuation model—in the first viewport. Do not place it below a generic title block.

### 10.2 Desktop composition

For wide viewports:

- Use one continuous instrument plane, not a series of cards.
- Narrative occupies approximately five of twelve columns.
- Visualization occupies approximately seven of twelve columns.
- The visualization remains sticky beneath the fixed header through Primer and Stages 1–3.
- The narrative reading measure should remain approximately `58–68ch`.
- Each stage contains one or more scroll steps with enough vertical runway to understand the copy and observe the corresponding transition; use content needs rather than identical fixed-height panels.
- Stage boundaries use large typographic and grid events, not rounded containers.
- At the close, the visualization unpins and resolves into a complete static figure aligned with methodology and data access.

### 10.3 Tablet composition

- Preserve the side-by-side relationship while legibility permits it.
- Give the visualization at least half the usable width.
- Collapse peripheral labels before shrinking essential values or article text.
- If a side-by-side layout would force the reading column below a comfortable measure, switch to the compact vertical composition.

### 10.4 Mobile composition

For narrow viewports:

- Use a compact visualization sticky below the header, occupying roughly `38–44svh`.
- Narrative steps scroll beneath it with the active stage clearly labeled.
- Preserve primary token value, active auxiliary metric, stage, and annotation; de-emphasize non-active auxiliary detail.
- Do not require horizontal scrolling.
- Do not depend on hover.
- On short-height or landscape mobile viewports where a sticky chart would trap the article, use inline stage snapshots with discrete state changes instead.
- The article must remain the primary interaction surface; the chart must not consume most of the reading viewport.

### 10.5 Long-form reading quality

The existing site's very small telemetry text is appropriate for labels but not for a full report. Continue using Space Mono, but introduce an article body role sized for sustained reading, with generous line height and measure. Do not introduce a second font merely to solve legibility.

## 11. Narrative-to-visual choreography

Every narrative step has a stable `cueId`. Each cue resolves to a visualization state. Copy length may change later without renaming the cue.

### 11.1 Cover / Calibration

Narrative role:

- Identify the asset and report type.
- State that the current build uses placeholders.

Visualization state:

- Empty calibrated plot.
- Origin marker for `$NOCK`.
- Four metric labels present as dormant telemetry.
- No implied price target or future date.

### 11.2 Primer

Narrative role:

- Explain at a high level what Nock is.
- Define the mechanisms necessary to understand later stages.
- Define the four chart variables and the causal relationships the report intends to test.
- Separate current/observed conditions from author assumptions.

Visualization progression:

1. Establish the horizontal progression axis.
2. Introduce the token-value axis and baseline point.
3. Introduce work rate as the first auxiliary track.
4. Reveal inactive placeholders for revenue and global consumption share without projecting them yet.

Completion state:

- Reader understands how to read the instrument.
- Token value and work rate are visible at baseline.
- No later-stage trajectory is revealed prematurely.

### 11.3 Stage 1

Narrative role:

- Present the first thesis mechanism and the evidence or assumptions supporting it.
- Explain why rising work rate matters to token value.

Visualization progression:

1. Extend the token-value path through the Stage 1 range.
2. Animate the work-rate track in synchrony.
3. Expand the primary value domain only as much as Stage 1 requires.
4. Add one or more annotation anchors tied to future copy/evidence.

Completion state:

- Token value remains dominant.
- Work rate is the clearly active explanatory vector.
- Revenue and consumption share remain contextual, not active.

### 11.4 Stage 2

Narrative role:

- Introduce inference economics.
- Connect work performed to inference revenue and token-value implications.

Visualization progression:

1. Extend the token-value path through Stage 2.
2. Preserve the prior work-rate trajectory.
3. Activate the inference-revenue track.
4. Rescale or reframe the primary plot smoothly if the placeholder values require a wider domain.
5. Add revenue-specific annotations and an explicit unit readout.

Completion state:

- The reader can see a staged transition from network work to revenue generation.
- The chart does not imply that differently scaled series share one numerical axis.

### 11.5 Stage 3 / Endgame

Narrative role:

- Present the terminal thesis mechanism.
- Connect Nock's modeled role to global open-weight token consumption.
- Surface the strongest dependencies and risks rather than ending on price alone.

Visualization progression:

1. Expand the chart to its full thesis horizon.
2. Activate the global-consumption-share track.
3. Complete the token-value path.
4. Resolve all four final metric readouts.
5. Show dependency or uncertainty bands if supplied later; never fabricate them.
6. Mark the final state as a modeled thesis outcome, not an observed fact.

Completion state:

- All four dimensions are visible and clearly labeled.
- Token value is still visually primary.
- The end state communicates dependence among variables, not false certainty.

### 11.6 Close

Narrative role:

- Summarize the thesis.
- Present risks, invalidation conditions, methodology, sources, disclosures, and data table.

Visualization state:

- Unpin the sticky scene.
- Preserve the completed figure as a stable artifact.
- Provide a non-animated view suitable for inspection beside methodology.

## 12. Visualization specification

### 12.1 Recommended form

Use a primary valuation plot plus three aligned auxiliary telemetry tracks sharing the same horizontal progression axis. Do not overlay four unrelated units on one Y-axis.

Suggested vertical hierarchy inside the sticky figure:

1. Primary token-value plot: approximately 55–65% of visual height.
2. Work-rate track.
3. Inference-revenue track.
4. Global-consumption-share track.
5. Shared stage/progression axis and annotation rail.

The exact proportions may adapt by viewport, but primary-versus-auxiliary hierarchy must remain unmistakable.

### 12.2 Encoding contract

| Metric | Visual priority | Encoding | Unit behavior |
| --- | --- | --- | --- |
| `$NOCK` token value | Primary | Solid signal line, leading point, value readout, optional assumption band | Currency formatter and configurable linear/log scale |
| Work rate | Auxiliary 1 | Chalk/gray line with distinct dash or point rhythm | `EMAC/s`, SI-aware formatter, independent domain |
| Inference revenue | Auxiliary 2 | Hairline/area hybrid or line plus baseline | Currency per selected period, independent domain |
| Global open-weight token consumption | Auxiliary 3 | Bounded line/band with explicit 0–100 context | Percentage, clamped only after data validation |

Color alone must not distinguish metrics. Use position, labels, line pattern, thickness, and shape.

### 12.3 Horizontal axis

Version 1 uses a thesis-progression or milestone axis, not a calendar axis, unless final content explicitly supplies defensible dates. The interface must not silently convert Primer/Stage 1/Stage 2/Stage 3 into years.

The data contract may later support dated points, but placeholder UI must use neutral milestone labels.

### 12.4 Scroll behavior

- The active narrative step owns a start state and end state.
- Normalize progress through the active step from `0` to `1`.
- Interpolate only declared properties: path reveal, plot domain, annotation position, opacity, emphasis, and readout value.
- Scrolling backward reverses the state without a separate animation timeline.
- Fast scrolling resolves immediately to the correct destination state.
- No autoplay, looping, or time-based story advancement.
- Do not hijack wheel/touch input or use scroll-jacking.
- Do not snap the document to steps.
- A refresh or direct anchor load initializes the correct state before the first visible frame where practical.

### 12.5 Motion grammar

- Line growth follows scroll progress.
- Domain changes feel like camera calibration, not a dramatic zoom effect.
- Auxiliary tracks activate one at a time as the narrative introduces them.
- Counters use tabular numerals and scrub with the modeled state.
- Annotations dock to data points via hairline leaders.
- Stage transitions may briefly brighten the active axis or crosshair in signal green.
- Avoid particles, decorative 3D, parallax copy, springy UI, or dashboard-like card animations.

### 12.6 Rendering approach

- Use semantic HTML for the article and SVG for the core visualization.
- A small set of focused scale/path utilities is acceptable; avoid a charting package whose visual defaults dictate the result.
- React should own the rendered structure.
- The chart renderer must accept a serializable view state from a controller; it must not read global scroll position itself.
- The narrative controller maps scroll position to view state.
- This separation is a release requirement because it enables a later explorer controller.

### 12.7 Placeholder integrity

While filler data is active:

- Display `Illustrative placeholder data` in the cover and figure caption.
- Keep a persistent but low-salience `SYNTHETIC` telemetry marker in the chart.
- Do not use current market prices, plausible-looking dates, or real-looking citations as filler.
- Prefer obviously synthetic values with a documented fixture status.
- Production-readiness checks must fail or warn while fixture status remains `placeholder`.

## 13. Content architecture

### 13.1 Authoring goals

The final article will be written after the visual system is approved. Narrative content must be editable without entering the chart implementation.

Recommended separation:

- MDX or an equivalently author-friendly structured document for long-form narrative, footnotes, citations, tables, asides, and explicit scroll-step markers.
- A separate typed data file for metrics, stages, chart cues, annotations, source references, and formatting rules.
- A schema-validation layer that fails during development/build for invalid references or values.

The engineering agent may choose the exact file names, but must preserve this separation.

### 13.2 Report metadata fields

- `assetName`
- `ticker`
- `reportType`
- `author`
- `publishedAt`
- `updatedAt`
- `revision`
- `readingTime`
- `dataStatus`: `placeholder`, `draft`, or `final`
- `disclosureStatus`

### 13.3 Narrative section fields

- Stable section ID.
- Navigation label.
- Stage number where applicable.
- Heading.
- Dek or summary placeholder.
- Ordered content blocks.
- One or more scroll steps.
- Cue ID for every scroll step.
- Source/footnote references.
- Risk or invalidation references where applicable.

### 13.4 Metric-definition fields

- Stable metric key.
- Display label.
- Short label.
- Unit.
- Number formatter.
- Scale type: linear or logarithmic.
- Optional explicit domain.
- Visual pattern.
- Accessibility description.
- Data status.
- Source or assumption references.

### 13.5 Data-point fields

- Stable point ID.
- Stage ID.
- Progress or milestone coordinate.
- Display milestone label.
- Token value.
- Work rate in `EMAC/s`.
- Inference revenue in a documented currency and period.
- Global open-weight token-consumption percentage.
- Observed/assumed/modeled classification.
- Source IDs.
- Optional uncertainty range.
- Optional annotation IDs.

### 13.6 Cue fields

- Stable cue ID.
- Section and stage IDs.
- Visible data range.
- Active metric.
- Primary plot domain or domain strategy.
- Line/path reveal progress.
- Visible annotations.
- Emphasized datum.
- Readout values.
- Reduced-motion snapshot state.

### 13.7 Future-compatible fields

The schema may reserve optional `scenarioId` and dated coordinates, but version 1 must contain only one authored thesis path. Do not build scenario-selection UI until the independent explorer is approved.

## 14. Visual-system requirements

### 14.1 Inherited identity

Use the existing tokens and rules in `DESIGN.md`:

- Void Black `#030304` field.
- Chalk White foreground.
- Telemetry Gray supporting text.
- Signal Green `#01ff00` for live state, focus, current progress, and key chart emphasis.
- Hairline measurement grid.
- Space Mono with tabular numerals.
- Rectilinear zero-radius chrome.
- Depth from opacity, overlap, blend, and lines—not cards or generic shadows.

### 14.2 Report-specific extension

Add article and data-visualization roles without changing the brand:

- A larger, more readable body-text role for long-form reading.
- Figure title, axis label, annotation, footnote, table, and source roles.
- Primary/secondary line weights and dash patterns.
- Stage-progress and assumption-status treatments.
- Print/static snapshot styling, even though a full print edition is deferred.

### 14.3 Prohibited visual patterns

- Rounded metric cards.
- Colorful multi-series dashboard palettes.
- Glassmorphism as a container system.
- Generic crypto candlestick styling.
- Trading-terminal density.
- Glowing green applied to every chart element.
- Unlabeled dual or multiple Y-axes.
- Decorative gradients that imply quantitative magnitude.
- Tiny body copy inherited from telemetry labels.

## 15. Accessibility requirements

Target WCAG 2.2 AA.

### 15.1 Reading and navigation

- Provide a skip link to the report body.
- Maintain logical source order independent of the desktop two-column layout.
- All stage anchors must be keyboard reachable with visible focus.
- The active-stage indication must not depend on color alone.
- Focus must not be obscured by the fixed header.
- Lock/exit actions need clear text labels and minimum touch targets.

### 15.2 Chart alternative

- Wrap the visualization in a labeled `figure` with a caption.
- Expose a concise static text summary of the active/final model.
- Do not make screen readers traverse hundreds of SVG path coordinates.
- Provide an HTML data table containing every displayed milestone and metric.
- Associate units, statuses, and source/assumption labels with table values.
- Keep narrative claims in the article; the chart must not be the only place information appears.

Avoid announcing every scrubbed value through a live region. If stage changes are announced, announce only the new stage summary once, not continuous scroll updates.

### 15.3 Reduced motion

When `prefers-reduced-motion: reduce` is active:

- Disable continuous scrub interpolation.
- Switch to complete, discrete chart snapshots at step boundaries.
- Remove line-drawing, counter-scrubbing, blur, and zoom effects.
- Preserve all data, labels, annotations, and narrative order.
- Do not hide content pending an observer or animation.

### 15.4 Contrast and non-color encoding

- Text and essential chart labels must meet AA contrast.
- Hairline decoration may be lower contrast, but axes and values needed for interpretation may not.
- Use line position, weight, pattern, labels, and markers in addition to color.

## 16. Responsive and browser requirements

### 16.1 Viewport QA matrix

At minimum, test:

- `1440 × 900` desktop.
- `1280 × 800` laptop.
- `1024 × 768` tablet/compact desktop.
- `390 × 844` mobile.
- `430 × 932` large mobile.
- `844 × 390` landscape mobile.

### 16.2 Browser support

- Current and previous major versions of Chrome, Safari, Firefox, and Edge.
- Current iOS Safari.
- Current Android Chrome.

Progressive enhancement is required. If a specific scroll or animation API is unavailable, the report must fall back to deterministic step activation and complete chart snapshots.

### 16.3 Resize and orientation

- Recompute plot geometry without changing the active narrative state.
- Preserve stage position across orientation changes where the browser permits.
- Never show stale desktop coordinates after a resize.
- Avoid layout shifts when the chart hydrates or fonts resolve.

## 17. Performance requirements

The report should remain lightweight relative to its editorial ambition.

### 17.1 User-facing budgets

- Largest Contentful Paint: target `< 2.5s` at the 75th percentile on a representative mobile connection.
- Interaction to Next Paint: target `< 200ms` at the 75th percentile.
- Cumulative Layout Shift: `< 0.1`.
- Scrolling should remain visually smooth; avoid recurring main-thread tasks over `50ms` during active scrub.
- The narrative must be visible before chart enhancement completes.

### 17.2 Implementation constraints

- No WebGL for version 1.
- No continuous React state update directly on every raw scroll event.
- Use passive observation and `requestAnimationFrame`-bounded work.
- Limit per-frame work to active geometry and readouts.
- Prefer SVG stroke reveal, transforms, and opacity over rebuilding every node.
- Do not fetch remote data in version 1.
- Selectively import visualization utilities.
- Server-render a stable initial figure frame to prevent a blank sticky region.
- Pause nonessential observers when the scrollytelling region is offscreen.

The engineering agent must report the added route-specific JavaScript weight and justify any animation or chart dependency.

## 18. States and edge cases

### 18.1 Authentication states

- Default gate.
- Submitting.
- Invalid passphrase.
- Successful authentication and redirect.
- Expired session.
- Tampered session.
- Lock/sign-out.
- Missing server configuration: fail closed with a controlled error; never bypass the gate.

### 18.2 Report states

- Initial server-rendered cover.
- Chart enhancement loading.
- Active narrative cue.
- Reverse scroll.
- Fast jump through multiple cues.
- Direct anchor load.
- Resize/orientation change.
- Reduced motion.
- JavaScript disabled.
- Malformed or missing data.
- Placeholder/draft/final data status.

### 18.3 Data validation failures

- Missing metric or cue references must fail development/build validation.
- Duplicate stable IDs must fail validation.
- Non-finite numbers must fail validation.
- Percentage values outside the accepted domain must fail validation rather than silently clamp.
- Non-positive values used with a logarithmic scale must fail validation.
- Missing units, formatters, or source classification must produce actionable errors.

### 18.4 Failure behavior

If the interactive chart cannot initialize:

- Keep the full article visible.
- Render the final static SVG or stage snapshots.
- Keep the data table and figure caption available.
- Do not show a generic application-error screen for a chart-only failure.

## 19. Analytics and privacy

Analytics are optional and must not block the first implementation. If the existing site later adopts an analytics provider, expose the following event contract:

- `nock_report_view`
- `nock_stage_reached` with stage ID, emitted once per stage per page view
- `nock_report_complete`
- `dataroom_auth_success`
- `dataroom_auth_failure` without attempted values or identifying payloads

Do not send chart values, password input, article selections, or private route content to analytics. Do not introduce a third-party analytics script without owner approval.

## 20. Future explorer architecture

Version 1 must establish three separable layers:

1. **Data model:** metrics, points, stages, sources, annotations, and scenarios.
2. **Renderer:** receives a complete serializable view state and draws the figure.
3. **Controller:** converts narrative scroll position into view state.

The future explorer will replace or complement layer 3 with direct controls. The renderer must not know whether its state came from scrolling, a stage selector, metric toggles, URL parameters, or a scenario control.

Future explorer candidates, in priority order:

1. Stage/milestone selector.
2. Focus a metric and inspect values.
3. Linear/log scale control where meaningful.
4. Bull/base/bear or alternate-assumption paths.
5. Shareable URL state.
6. Exportable data or figure.

This provision is architectural only. Do not implement hidden controls or premature explorer state in version 1.

## 21. Suggested implementation boundaries

Exact names are at engineering discretion, but responsibilities should be separated approximately as follows:

- Protected Data Room session utilities, server-only.
- Data Room gate action/handler and UI.
- Protected `/data` server boundary or layout.
- `/data/nock` server page and private metadata.
- Report shell and semantic article structure.
- Narrative scroll controller as a focused Client Component.
- Pure visualization renderer.
- Metric formatting and scale utilities.
- Typed report-data schema and build-time validation.
- Authorable narrative source.
- Data table and static/reduced-motion figure.
- Report-specific styles that extend rather than duplicate global tokens.

Avoid making the entire report a Client Component. Keep narrative and metadata server-rendered; isolate client behavior to the scroll controller and renderer boundary.

## 22. Delivery phases

### Phase 0: Data Room foundation

- Replace the mock gate with server-enforced authentication.
- Add signed session handling, deep-link redirects, lock action, and private metadata.
- Verify that direct protected requests fail closed.

### Phase 1: Report skeleton

- Create the route, semantic section structure, placeholder authoring source, metadata, wayfinding, and responsive two-column/compact layouts.
- Include explicit placeholder status and no final claims.
- Validate long-form reading measure before chart motion.

### Phase 2: Visualization renderer

- Build the complete static figure from synthetic data.
- Add primary and auxiliary tracks, labels, annotations, formatters, and data table.
- Validate the renderer independently from scroll.

### Phase 3: Scroll controller and choreography

- Bind stable narrative cues to view states.
- Implement forward, reverse, fast-scroll, deep-link, resize, and stage-progress behavior.
- Add reduced-motion snapshots.

### Phase 4: Hardening and QA

- Accessibility pass.
- Performance profiling.
- Cross-browser and viewport matrix.
- Authentication/security tests.
- Visual comparison against `DESIGN.md` and incumbent routes.
- Placeholder-publication guard.

### Future phase: Explorer

- Design and approve the independent exploration interaction before implementing controls.
- Reuse the version 1 data model and renderer.

## 23. Acceptance criteria

### 23.1 Access

- [ ] Unauthenticated direct access to `/data/nock` returns the reader to the gate with a safe `next` destination.
- [ ] The agreed password is verified only on the server from environment configuration.
- [ ] Valid authentication creates a signed `HttpOnly` session and returns the reader to `/data/nock`.
- [ ] Invalid, expired, and tampered sessions cannot access report content.
- [ ] Locking the Data Room clears access.
- [ ] The route is `noindex, nofollow` and does not leak sensitive preview metadata.
- [ ] No credential or session secret exists in client bundles or checked-in source.

### 23.2 Narrative and layout

- [ ] The report contains Cover, Primer, Stage 1, Stage 2, Stage 3 / Endgame, and closing methodology sections.
- [ ] All article prose and data are explicit placeholders.
- [ ] The first viewport demonstrates the chart mechanism.
- [ ] Desktop presents article and sticky visualization side by side.
- [ ] Mobile preserves chart context without trapping or obscuring the article.
- [ ] Current stage and report progress remain visible.
- [ ] Copy can expand materially without requiring fixed-height clipping or manual pixel offsets.

### 23.3 Visualization

- [ ] Token value is visually primary in every active state.
- [ ] Work rate, inference revenue, and global-consumption share use aligned independent tracks and labeled units.
- [ ] Scroll forward, backward, fast, and anchor jumps always resolve to the correct state.
- [ ] The chart does not hijack or snap scrolling.
- [ ] Differently scaled metrics are not presented as if they share one axis.
- [ ] Renderer state is provided externally; the renderer does not own scroll logic.
- [ ] Placeholder data is visibly labeled synthetic.
- [ ] Final values, sources, scale types, and domains can be replaced through data/content files.

### 23.4 Accessibility and fallback

- [ ] The semantic article is complete without the interactive chart.
- [ ] Reduced motion uses discrete complete states.
- [ ] A keyboard user can navigate stages and access gate/lock controls.
- [ ] An HTML data table communicates all plotted values.
- [ ] Color is not the only differentiator.
- [ ] Focus is visible and not hidden under fixed chrome.
- [ ] A chart failure leaves the article and static figure usable.

### 23.5 Quality

- [ ] The implementation passes lint, type checking, and production build.
- [ ] The defined viewport and browser matrix is verified.
- [ ] Core Web Vitals meet the stated targets in representative testing.
- [ ] No horizontal overflow, hydration mismatch, or large scroll-time main-thread task remains.
- [ ] The final visual review confirms the page belongs to the existing Baloch Digital instrument world.

## 24. Test plan

### 24.1 Unit and schema tests

- Credential comparison and session signing/verification.
- Expired and tampered sessions.
- Safe `next` destination allowlist.
- Metric formatting and unit labels.
- Linear/log scale validation.
- Cue-to-state resolution.
- Duplicate/missing ID rejection.
- Placeholder-status guard.

### 24.2 Integration tests

- Gate failure and success.
- Deep-link authentication round trip.
- Session persistence and lock.
- Protected server render.
- Narrative content renders without chart enhancement.
- Every cue references a valid chart state.

### 24.3 End-to-end tests

- Complete forward read through all stages.
- Reverse from Stage 3 to Primer.
- Fast scroll from cover to close.
- Direct navigation to each stage anchor.
- Refresh in every stage.
- Mobile portrait and landscape behavior.
- Reduced-motion behavior.
- Keyboard-only navigation.
- JavaScript-disabled/static fallback where the test environment permits.

### 24.4 Visual QA

Capture and compare the required viewport matrix at:

- Cover.
- Primer baseline.
- Stage 1 completed state.
- Stage 2 completed state.
- Stage 3 completed state.
- Closing static figure.
- Gate default, submitting, and invalid states.

Use the existing home and Data Room surfaces as incumbent identity references. The report may be denser and more readable, but it must retain the same instrument grammar.

## 25. Publication-readiness gate

The visual prototype may be reviewed privately with filler copy and data. It is not ready to be treated as an investment report until all of the following are complete:

- Placeholder prose is replaced and editorially approved.
- Every displayed value is replaced or intentionally retained with a truthful status.
- Observed, assumed, and modeled values are visibly distinguished.
- All sources and citations resolve.
- Methodology and uncertainty are documented.
- Risks and thesis-invalidation conditions are complete.
- Investment and conflict disclosures are supplied and approved.
- `dataStatus` is changed from `placeholder` only through an explicit owner decision.
- Final content, data, and legal review are complete.

The engineering agent must not invent or silently fill any of these items.

## 26. Open content decisions reserved for the owner

These decisions must remain configurable placeholders during implementation:

- Final report title and subtitle beyond `$NOCK` and `Initiating Coverage`.
- Author/byline presentation.
- Publication and revision dates.
- Actual narrative step count inside each stage.
- Final milestone or time axis.
- Currency basis and period for inference revenue.
- Linear versus logarithmic scale for token value.
- Actual metric domains and uncertainty ranges.
- Sources, citations, methodology, risks, and disclosures.
- Final thesis conclusion and call to action, if any.
- Whether and when to build the independent explorer.

## 27. Engineering handoff summary

Build one private article route whose core product is the relationship between narrative position and model state. First make the Data Room genuinely private. Then make the report semantically complete and readable. Build the figure as a reusable renderer from a validated data model. Finally, connect it to scroll through a separate narrative controller.

The release should feel like Baloch Digital's existing calibrated instrument becoming a research publication: more legible, more evidentiary, and more dimensional, while remaining sparse, black, monospaced, rectilinear, and precise.
