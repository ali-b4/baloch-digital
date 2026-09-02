import "server-only";

import type { NarrativeSection, ReportMetadata } from "./report-types";

export const reportMetadata: ReportMetadata = {
  assetName: "$NOCK",
  ticker: "$NOCK",
  reportType: "Initiating Coverage",
  author: "Baloch Digital // Editorial Prototype",
  publishedAt: "Not scheduled",
  updatedAt: "Format review build",
  revision: "DRAFT // 01",
  readingTime: "08 MIN // PROTOTYPE",
  dataStatus: "placeholder",
  disclosureStatus: "required",
} as const;

export const reportClosingSections = [
  {
    id: "thesis-summary",
    heading: "Thesis summary",
    body: "This prototype advances one conditional sequence: network activity becomes useful service, useful service becomes recurring economic output, and durable output supports a stronger valuation case. The figure is designed to make that accumulation visible without turning it into a conclusion. It is an argument map for editorial review, not an investment recommendation or a claim about Nock today; the final article should replace every provisional link with sourced evidence, explicit assumptions, and an approved interpretation.",
  },
  {
    id: "risks-invalidation",
    heading: "Risks & invalidation",
    body: "The proposed chain would weaken if work rate can rise without corresponding demand, if useful activity fails to produce sustainable revenue, or if economic value accrues somewhere other than the token. It would also require scrutiny of service quality, cost structure, network concentration, competitive substitutes, security, governance, liquidity, and regulatory exposure. A publishable version should rank these risks, assign observable invalidation thresholds, and show which model outputs change when a dependency fails.",
  },
  {
    id: "methodology-notes",
    heading: "Methodology",
    body: "For this format study, four modeled milestones are arranged on an ordinal progression axis beginning with the Primer. $NOCK FDV, work rate, inference revenue, and OpenRouter market share each retain an independent scale; their visual alignment shows narrative sequence, not equivalence or statistical correlation. No probability, forecast horizon, confidence interval, or uncertainty band has been assigned. The numbers exist only to test chart behavior, explanatory order, annotation density, and the transition from one mechanism to the next.",
  },
  {
    id: "sources-disclosures",
    heading: "Sources & disclosures",
    body: "No external source is represented in this prototype as verified evidence. The reference labels below are editorial slots for protocol materials, primary network data, model inputs, counter-evidence, and methodology notes. Before publication, every factual statement and modeled input should resolve to a dated source, assumptions should be separated from observations, and ownership, commercial relationships, conflicts, and the limits of this analysis should receive an explicit disclosure review.",
  },
] as const;

export const narrativeSections: readonly NarrativeSection[] = [
  {
    id: "primer",
    navigationLabel: "Primer",
    chapterIndex: 1,
    heading: "Primer",
    summary:
      "A reader should understand the model before being asked to believe it. This prototype establishes the vocabulary, separates input from output, and makes the figure readable on its own terms.",
    steps: [
      {
        cueId: "primer-orientation",
        heading: "Orient the reader",
        paragraphs: [
          "For this format review, imagine Nock as the subject of a staged network-economics argument. The final article will need to explain the protocol in plain language; this prototype supplies only enough structure to test whether a technically literate reader can enter the story without prior context and understand what the report intends to examine.",
          "The article distinguishes three kinds of information from the start. Observed facts would describe the network as it exists. Assumptions would express choices made by the analyst. Modeled outputs would show what follows if those choices hold. The figures in this build are placeholders, so every visible value should be read as a layout device until evidence is supplied.",
          "That distinction controls the reading order. The prose introduces a mechanism, the figure reveals its corresponding track, and the close asks what could invalidate it. Movement in the chart is never meant to stand in for proof; it simply lets the reader see how the eventual argument might unfold.",
        ],
        sourceIds: ["source-placeholder"],
      },
      {
        cueId: "primer-variable-map",
        heading: "Define the instrument",
        paragraphs: [
          "The instrument follows four variables. The sage path is the modeled $NOCK FDV output. Beneath it, work rate is expressed in EMAC/s, inference revenue is kept on its own annual currency scale, and OpenRouter market share is expressed as a percentage. The tracks share a progression axis, but they do not share a numeric scale. In the Primer, $NOCK FDV and work rate begin rising while revenue and market share advance along zero baselines until their Stage 1 activation.",
          "The proposed reading is causal but provisional: work could precede useful service; useful service could precede revenue; and durable revenue paired with broad usage could support a stronger valuation case. Each arrow needs evidence in the final article. A failure at any link should weaken the modeled output instead of being hidden by it.",
          "By the end of the primer, a reader should know which line is the output, which tracks are explanatory inputs, and why each new stage preserves the variables already introduced. That foundation is what allows the later chapters to become more complex without turning into a dashboard.",
        ],
        note: "Format-review checkpoint // every track should be interpretable before Stage 1 begins.",
        sourceIds: ["source-placeholder", "assumption-placeholder"],
      },
    ],
  },
  {
    id: "stage-1",
    navigationLabel: "Stage 1",
    chapterIndex: 2,
    heading: "Stage 1",
    summary:
      "The first chapter asks whether increasing network activity can become a meaningful leading indicator instead of a decorative growth metric.",
    steps: [
      {
        cueId: "stage-1-work",
        heading: "Mechanism 01 // Work rate",
        paragraphs: [
          "The first mechanism begins with a simple hypothetical: a network that performs more useful computation may be developing the capacity to serve more demand. In a finished report, this chapter would establish what work rate measures, how reliably it can be observed, what causes it to change, and whether the activity is distributed or concentrated. Here, the already-moving track takes focus only to test the pace of that explanation.",
          "Raw throughput would not be enough. A credible thesis must distinguish productive work from subsidized, duplicated, low-quality, or otherwise uneconomic activity. It must also explain why the token participates in the mechanism rather than merely sitting beside it. If work can expand indefinitely without creating user value or token demand, the relationship shown by the model should be rejected.",
          "As the reader scrolls, the primary path advances while the work-rate track becomes the active explanatory layer. At the Stage 1 boundary, inference revenue and OpenRouter market share step from zero to their first positive modeled values. The visual hierarchy keeps the valuation output visible while making clear that every relationship remains proposed rather than confirmed.",
        ],
        note: "Evidence checkpoint // define useful work, resolve the unit, and attach an observable invalidation condition.",
        sourceIds: ["source-placeholder", "assumption-placeholder"],
        riskIds: ["risk-placeholder"],
      },
    ],
  },
  {
    id: "stage-2",
    navigationLabel: "Stage 2",
    chapterIndex: 3,
    heading: "Stage 2",
    summary:
      "The second chapter tests the conversion from activity to economic output: work must become a service someone repeatedly chooses and pays for.",
    steps: [
      {
        cueId: "stage-2-revenue",
        heading: "Mechanism 02 // Revenue",
        paragraphs: [
          "Stage 2 introduces hypothetical inference revenue as a bridge between technical activity and economic value. The eventual article would need to identify the paying customer, the service being purchased, the pricing unit, the reporting period, and the portion of gross activity that is actually retained by the network. Without those definitions, a rising revenue line is only a visual proposition.",
          "The conversion from work to revenue also needs a cost-aware explanation. More computation may matter only if service quality is competitive, utilization is repeatable, and the value captured exceeds the resources required to produce it. The final model should expose those assumptions and show how sensitive its output is to price, demand, utilization, and take rate rather than presenting a single smooth path.",
          "The visual keeps the Stage 1 work-rate track in view while bringing the already-moving revenue track into focus beneath it. This cumulative treatment lets the reader ask whether the second mechanism truly follows from the first or whether the argument has quietly skipped a step.",
        ],
        note: "Model checkpoint // currency basis, take rate, and cost structure remain unresolved.",
        sourceIds: ["source-placeholder", "assumption-placeholder"],
        riskIds: ["risk-placeholder"],
      },
    ],
  },
  {
    id: "stage-3",
    navigationLabel: "Stage 3",
    chapterIndex: 4,
    heading: "Stage 3 / Endgame",
    summary:
      "The terminal chapter expands the scenario from a functioning economic loop to a question of reach, durability, and competitive share.",
    steps: [
      {
        cueId: "stage-3-share",
        heading: "Mechanism 03 // OpenRouter share",
        paragraphs: [
          "The final mechanism brings the already-active OpenRouter market-share track into focus as a terminal scenario variable, not an observation or forecast. Its role is to ask what scale of adoption the valuation case would require and whether that share is compatible with the addressable market, the network's capacity, plausible customer behavior, and the competitive landscape.",
          "The important question is not whether the curve reaches its displayed endpoint. It is whether every dependency beneath that endpoint can be named and tested: demand must exist, service must remain useful, capacity must scale, economics must stay attractive, and value capture must reach the token. Market growth alone cannot repair a broken link lower in the chain.",
          "This ending is deliberately conditional. Once active, all four tracks follow log-linear trajectories and resolve at the same upper-right boundary so the reader can inspect the complete thesis, then immediately move into risks, methodology, sources, and the underlying values. The format should leave room for conviction while making uncertainty impossible to miss.",
        ],
        note: "Scenario checkpoint // no probability, horizon, or uncertainty band is assigned in this prototype.",
        sourceIds: ["source-placeholder", "assumption-placeholder"],
        riskIds: ["risk-placeholder"],
      },
    ],
  },
] as const;
