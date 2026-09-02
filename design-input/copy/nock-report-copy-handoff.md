# $NOCK report copy handoff

Use this structure in a plain Word document when the final report copy is ready. The existing `copy.md` in this folder remains the homepage copy source; do not combine the two.

## Handoff rules

- Keep every `[[FIELD:...]]` marker exactly as written. The marker identifies where the text belongs; it will not appear on the site.
- Put the final text immediately below its marker. A field ends at the next marker.
- A `body` field may contain any number of normal Word paragraphs. Each Word paragraph becomes one article paragraph, in the same order.
- Use plain body text. Word's automatic line wrapping is ignored; only actual paragraph breaks are preserved.
- Wording, spelling, punctuation, capitalization, Unicode characters, and paragraph order will be transferred verbatim. No silent copyediting.
- Accept tracked changes before handoff. Comments are treated as editorial notes and are not published.
- Inline bold, italics, footnotes, and linked display text are outside the current article schema. Put source URLs on their own lines in the Sources block.
- Use `[[KEEP CURRENT]]` when a field should retain the existing value and `[[REMOVE]]` when an optional field should be deleted. Do not leave fields blank.
- Attach the `.docx` in chat or place it at `design-input/copy/nock-report-copy.docx`.
- Authentication labels, chart controls, table headers, and other interface instructions remain system copy unless they are supplied under a clearly labeled `Interface overrides` appendix.

## Front matter

[[FIELD:report.asset-name]]

[[FIELD:report.ticker]]

[[FIELD:report.type]]

[[FIELD:report.abstract-title]]

[[FIELD:report.abstract-disclaimer]]

[[FIELD:report.abstract-body]]

[[FIELD:report.author]]

[[FIELD:report.published-at]]

[[FIELD:report.updated-at]]

[[FIELD:report.revision]]

[[FIELD:report.reading-time]]

## Primer

[[FIELD:section.primer.navigation-label]]

[[FIELD:section.primer.heading]]

[[FIELD:section.primer.summary]]

[[FIELD:step.primer-orientation.heading]]

[[FIELD:step.primer-orientation.body]]

[[FIELD:step.primer-orientation.note]]

[[FIELD:step.primer-variable-map.heading]]

[[FIELD:step.primer-variable-map.body]]

[[FIELD:step.primer-variable-map.note]]

## Stage 1

[[FIELD:section.stage-1.navigation-label]]

[[FIELD:section.stage-1.heading]]

[[FIELD:section.stage-1.summary]]

[[FIELD:step.stage-1-work.heading]]

[[FIELD:step.stage-1-work.body]]

[[FIELD:step.stage-1-work.note]]

## Stage 2

[[FIELD:section.stage-2.navigation-label]]

[[FIELD:section.stage-2.heading]]

[[FIELD:section.stage-2.summary]]

[[FIELD:step.stage-2-revenue.heading]]

[[FIELD:step.stage-2-revenue.body]]

[[FIELD:step.stage-2-revenue.note]]

## Stage 3

[[FIELD:section.stage-3.navigation-label]]

[[FIELD:section.stage-3.heading]]

[[FIELD:section.stage-3.summary]]

[[FIELD:step.stage-3-share.heading]]

[[FIELD:step.stage-3-share.body]]

[[FIELD:step.stage-3-share.note]]

## Closing sections

[[FIELD:close.heading]]

[[FIELD:close.summary]]

[[FIELD:closing.thesis-summary.heading]]

[[FIELD:closing.thesis-summary.body]]

[[FIELD:closing.risks-invalidation.heading]]

[[FIELD:closing.risks-invalidation.body]]

[[FIELD:closing.methodology-notes.heading]]

[[FIELD:closing.methodology-notes.body]]

[[FIELD:closing.sources-disclosures.heading]]

[[FIELD:closing.sources-disclosures.body]]

## Hover stage summaries

These are the short lines shown when the main chart is inspected.

[[FIELD:point.primer.stage-summary]]

[[FIELD:point.stage-1.stage-summary]]

[[FIELD:point.stage-2.stage-summary]]

[[FIELD:point.stage-3.stage-summary]]

## Chart captions and annotations

[[FIELD:cue.cover-calibration.annotation]]

[[FIELD:cue.cover-calibration.summary]]

[[FIELD:cue.primer-orientation.annotation]]

[[FIELD:cue.primer-orientation.summary]]

[[FIELD:cue.primer-variable-map.annotation]]

[[FIELD:cue.primer-variable-map.summary]]

[[FIELD:cue.stage-1-work.annotation]]

[[FIELD:cue.stage-1-work.summary]]

[[FIELD:cue.stage-2-revenue.annotation]]

[[FIELD:cue.stage-2-revenue.summary]]

[[FIELD:cue.stage-3-share.annotation]]

[[FIELD:cue.stage-3-share.summary]]

[[FIELD:cue.close-complete.annotation]]

[[FIELD:cue.close-complete.summary]]

## Sources and disclosures

Use one record per source. Keep the record ID stable when the same source is cited more than once.

[[FIELD:sources]]

```text
S01
Label: Publication or source title
URL: https://example.com/source
Kind: source | assumption | risk | disclosure

S02
Label: Second source title
URL: https://example.com/second-source
Kind: source
```

## Optional metric accessibility copy

Metric names, units, chart scales, and values remain locked unless separately requested. These descriptions are read by assistive technology and should accurately describe the final metrics.

[[FIELD:metric.token-value.accessibility-description]]

[[FIELD:metric.work-rate.accessibility-description]]

[[FIELD:metric.inference-revenue.accessibility-description]]

[[FIELD:metric.openrouter-market-share.accessibility-description]]

## Import verification

When this document is returned, the import pass will:

1. Reject missing, duplicate, or unknown field markers instead of guessing.
2. Preserve the source `.docx` unchanged.
3. Produce a field-level before/after summary for review.
4. Update editorial copy without changing chart values, reveal timing, authentication, or hover behavior.
5. Run report validation, tests, type-checking, lint, and a production build before any requested deployment.
