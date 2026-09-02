export type ReportCopySegment = {
  text: string;
  emphasis?: "strong";
};

export type ReportAbstract = {
  title: string;
  heading: string;
  disclaimer: string;
  paragraphs: readonly (readonly ReportCopySegment[])[];
};

export const reportAbstract: ReportAbstract = {
  title: "Decentralized Hyperscalers: Nockchain",
  heading: "Abstract",
  disclaimer: "*disclaimer: Baloch Digital holds a position in $NOCK.",
  paragraphs: [
    [
      {
        text: "We believe that the most underexplored and raw applications of blockchain remain incentive coordination. To date, no network beyond Bitcoin has meaningfully applied a solution to the Byzantine Generals’ problem at scale. This is not for lack of infrastructure, but for lack of demand. Programmable chains with no proven demand drivers lack value accrual and productive output.",
      },
    ],
    [
      {
        text: "Nockchain is one of the pioneers of the Proof-of-",
      },
      { text: "useful", emphasis: "strong" },
      {
        text: "-work model; a consensus mechanism in which the work conducted to secure the chain is also used to produce some sort of useful output from the same energy used to mine. In this case, that output is currently pointed at providing inference. Inference mining will position Nockchain to become one of the world's largest token factories over the next few years as a first-of-its-kind ",
      },
      { text: "Decentralized Hyperscaler.", emphasis: "strong" },
    ],
  ],
};
