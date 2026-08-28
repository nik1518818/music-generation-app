/**
 * Market-moving events calendar.
 *
 * status: "confirmed" = date published by the issuing agency / exchange.
 *         "expected"  = follows the normal release pattern, not yet locked in.
 * impact: "high"      = routinely moves the whole index.
 *         "medium"    = moves sectors, or sets up a bigger event.
 * Times are US Eastern. Edit this file to add or correct events; nothing else
 * needs to change.
 */
window.MARKET_BRIEF = {
  updated: "2026-08-28",
  /** NYSE sessions. close: null = shut all day, otherwise minutes from midnight ET. */
  holidays: [
    { d: "2026-09-07", name: "Labor Day",      close: null },
    { d: "2026-11-26", name: "Thanksgiving",   close: null },
    { d: "2026-11-27", name: "day after Thanksgiving", close: 780 },
    { d: "2026-12-25", name: "Christmas Day",  close: null },
    { d: "2027-01-01", name: "New Year’s Day", close: null },
    { d: "2027-01-18", name: "Martin Luther King Jr. Day", close: null }
  ],

  events: [
    // ---------- September 2026 ----------
    { d: "2026-09-01", t: "10:00", cat: "growth", impact: "medium", status: "expected",
      title: "ISM Manufacturing PMI (August)",
      why: "First hard read on the new month. A print under 50 says factories are still contracting.",
      watch: "The prices-paid subindex leads goods inflation by a month or two." },

    { d: "2026-09-04", t: "08:30", cat: "jobs", impact: "high", status: "confirmed",
      title: "August jobs report",
      why: "The single biggest scheduled mover before the September Fed meeting. Payrolls, unemployment rate and average hourly earnings all land at once.",
      watch: "Wage growth matters more than the headline count right now — it is what keeps the Fed cautious." },

    { d: "2026-09-07", t: null, cat: "market", impact: "medium", status: "confirmed",
      title: "Labor Day — US markets closed",
      why: "No equity or bond trading. Volume is thin either side of the long weekend.",
      watch: "Positioning often gets squared off on the Friday before." },

    { d: "2026-09-11", t: "08:30", cat: "inflation", impact: "high", status: "confirmed",
      title: "CPI inflation (August)",
      why: "Last inflation print the Fed sees before it decides on rates five days later. Reliably the most volatile 30 minutes of the month.",
      watch: "Core CPI ex-food-and-energy, month over month. Shelter and services are the sticky parts." },

    { d: "2026-09-16", t: "08:30", cat: "growth", impact: "medium", status: "expected",
      title: "Retail sales (August)",
      why: "The consumer is two-thirds of the economy. Lands the same morning as the Fed decision, so it can set the tone early.",
      watch: "The control group, which feeds straight into GDP." },

    { d: "2026-09-16", t: "14:00", cat: "fed", impact: "high", status: "confirmed",
      title: "FOMC decision, dot plot and Powell press conference",
      why: "Rate decision at 2:00, updated projections the same moment, Powell at 2:30. Quarterly meetings carry the dot plot, which is where the surprises usually are.",
      watch: "The 2:00–3:00 window often reverses. The dots and the press conference frequently say different things." },

    { d: "2026-09-18", t: "16:00", cat: "market", impact: "medium", status: "confirmed",
      title: "Quad witching and S&P 500 rebalance",
      why: "Options and futures expire together and index funds rebalance into the close. Volume runs two to three times normal.",
      watch: "Price action into the close is mechanical, not informational. Do not read a signal into it." },

    { d: "2026-09-24", t: "08:30", cat: "growth", impact: "medium", status: "expected",
      title: "Q2 GDP, third estimate",
      why: "Third look at a quarter that already ended, so it rarely moves much on its own.",
      watch: "Revisions to consumer spending are the part that still gets traded." },

    { d: "2026-09-30", t: "08:30", cat: "inflation", impact: "high", status: "confirmed",
      title: "PCE price index (August)",
      why: "The Fed's preferred inflation gauge, and the last major data point of the quarter.",
      watch: "Core PCE year over year against the 2% target." },

    // ---------- October 2026 ----------
    { d: "2026-10-01", t: "10:00", cat: "growth", impact: "medium", status: "expected",
      title: "ISM Manufacturing PMI (September)",
      why: "Opens the new quarter and the run-up to the jobs report.",
      watch: "New orders — the forward-looking component." },

    { d: "2026-10-02", t: "08:30", cat: "jobs", impact: "high", status: "confirmed",
      title: "September jobs report",
      why: "First payrolls print of the quarter, ahead of an October Fed meeting with no new projections.",
      watch: "Revisions to the prior two months have been large enough to flip the story." },

    { d: "2026-10-07", t: "14:00", cat: "fed", impact: "medium", status: "expected",
      title: "FOMC minutes (September meeting)",
      why: "Full account of the September debate three weeks after the fact. Occasionally reveals how split the committee was.",
      watch: "Language about the pace of future cuts." },

    { d: "2026-10-13", t: "08:30", cat: "inflation", impact: "high", status: "expected",
      title: "CPI inflation (September)",
      why: "Sets expectations for the October Fed meeting two weeks later.",
      watch: "Core month over month. Three consecutive soft prints is what changes the rate path." },

    { d: "2026-10-13", t: "before open", cat: "earnings", impact: "high", status: "expected",
      title: "Big banks open Q3 earnings season",
      why: "JPMorgan, Goldman Sachs, Wells Fargo and Citi report first and set the tone for the whole season.",
      watch: "Loan loss provisions and net interest income — the cleanest read on credit conditions available." },

    { d: "2026-10-15", t: "08:30", cat: "growth", impact: "medium", status: "expected",
      title: "Retail sales (September)",
      why: "Consumer health going into the holiday quarter.",
      watch: "Any pullback in discretionary categories." },

    { d: "2026-10-20", t: "after close", cat: "earnings", impact: "medium", status: "expected",
      title: "Netflix Q3 results",
      why: "First mega-cap tech name out, and a proxy for streaming and ad spend.",
      watch: "Ad-tier momentum and margin guidance." },

    { d: "2026-10-27", t: "after close", cat: "earnings", impact: "high", status: "expected",
      title: "Microsoft and Alphabet Q3 results",
      why: "Two of the largest index weights on the same evening. Cloud and AI capex guidance moves the entire tech complex.",
      watch: "Azure and Google Cloud growth rates, and any change to capex plans." },

    { d: "2026-10-28", t: "14:00", cat: "fed", impact: "high", status: "confirmed",
      title: "FOMC decision and Powell press conference",
      why: "Rate decision with no updated projections, so everything hangs on the statement wording and the press conference.",
      watch: "Changes to the statement language versus September, word for word." },

    { d: "2026-10-28", t: "after close", cat: "earnings", impact: "high", status: "expected",
      title: "Meta and Tesla Q3 results",
      why: "Both are high-beta names that routinely move 5–10% overnight on guidance.",
      watch: "Meta's capex line and Tesla's margin per vehicle." },

    { d: "2026-10-29", t: "08:30", cat: "growth", impact: "medium", status: "expected",
      title: "Q3 GDP, advance estimate",
      why: "First official read on how the economy did last quarter.",
      watch: "Consumer spending contribution versus inventories — inventory-driven beats do not last." },

    { d: "2026-10-29", t: "after close", cat: "earnings", impact: "high", status: "expected",
      title: "Apple and Amazon Q3 results",
      why: "The two largest consumer-facing mega-caps close out the busiest week of the season.",
      watch: "Apple's holiday-quarter guidance and AWS growth." },

    { d: "2026-10-30", t: "08:30", cat: "inflation", impact: "high", status: "expected",
      title: "PCE price index (September)",
      why: "The Fed's preferred inflation measure, two days after the October meeting.",
      watch: "Core PCE and the personal savings rate together — they tell you how much room the consumer has left." },

    // ---------- November 2026 ----------
    { d: "2026-11-03", t: "all day", cat: "policy", impact: "high", status: "confirmed",
      title: "US midterm elections",
      why: "Control of Congress decides what is possible on tax, spending and regulation for the next two years. Results land overnight, so the move shows up at the next open.",
      watch: "Sector rotation rather than index direction — healthcare, energy and defense react hardest to the balance of power." },

    { d: "2026-11-04", t: "08:30", cat: "policy", impact: "medium", status: "expected",
      title: "Treasury quarterly refunding announcement",
      why: "How much debt Treasury will issue and at which maturities. Has moved long-end yields more than some Fed meetings.",
      watch: "The split between short bills and long bonds." },

    { d: "2026-11-06", t: "08:30", cat: "jobs", impact: "high", status: "confirmed",
      title: "October jobs report",
      why: "First labour market read after the midterms and ahead of the December Fed decision.",
      watch: "Unemployment rate trend — it moves slowly, which makes any change meaningful." },

    { d: "2026-11-10", t: "08:30", cat: "inflation", impact: "high", status: "expected",
      title: "CPI inflation (October)",
      why: "One of two inflation prints before the December meeting, where a fresh dot plot is due.",
      watch: "Core services excluding housing — the measure the Fed keeps pointing at." },

    { d: "2026-11-17", t: "before open", cat: "earnings", impact: "medium", status: "expected",
      title: "Walmart Q3 results",
      why: "The broadest available read on the American consumer, right before the holiday season.",
      watch: "Comparable sales and what management says about trade-down behaviour." },

    { d: "2026-11-18", t: "14:00", cat: "fed", impact: "medium", status: "expected",
      title: "FOMC minutes (October meeting)",
      why: "Detail behind an October decision that came without projections.",
      watch: "How many participants wanted a different outcome." },

    { d: "2026-11-25", t: "08:30", cat: "inflation", impact: "high", status: "expected",
      title: "PCE price index (October)",
      why: "Pulled forward into the short Thanksgiving week, so it lands in thin liquidity — moves get amplified.",
      watch: "Core PCE month over month." },

    { d: "2026-11-25", t: "after close", cat: "earnings", impact: "high", status: "expected",
      title: "Nvidia Q3 FY27 results",
      why: "The most consequential single earnings report in the market. Sets the direction for the entire AI and semiconductor complex, and often the index with it.",
      watch: "Data centre revenue and next-quarter guidance. The options market typically prices a 7–9% move." },

    { d: "2026-11-26", t: null, cat: "market", impact: "medium", status: "confirmed",
      title: "Thanksgiving — US markets closed",
      why: "No trading.",
      watch: "Liquidity stays poor through the following Monday." },

    { d: "2026-11-27", t: "13:00", cat: "market", impact: "medium", status: "confirmed",
      title: "Early close, 1:00 pm ET",
      why: "Half session with very thin volume. Small orders move prices more than usual.",
      watch: "Early holiday spending data starts trickling out over the weekend." },

    // ---------- December 2026 ----------
    { d: "2026-12-04", t: "08:30", cat: "jobs", impact: "high", status: "confirmed",
      title: "November jobs report",
      why: "Last payrolls print before the final Fed meeting of the year.",
      watch: "This is the one that decides a December move if the committee is on the fence." },

    { d: "2026-12-09", t: "14:00", cat: "fed", impact: "high", status: "confirmed",
      title: "FOMC decision, dot plot and Powell press conference",
      why: "Final meeting of 2026, with projections that lay out the committee's expected path for all of 2027.",
      watch: "The 2027 median dot. That number frames positioning into January." },

    { d: "2026-12-10", t: "08:30", cat: "inflation", impact: "high", status: "expected",
      title: "CPI inflation (November)",
      why: "Lands the day after the Fed decision, which is an unusual order — the market has to react to inflation with the rate path already set.",
      watch: "Whether the print contradicts what the Fed just said." },

    { d: "2026-12-16", t: "08:30", cat: "growth", impact: "medium", status: "expected",
      title: "Retail sales (November)",
      why: "Covers Black Friday and Cyber Monday. The definitive read on holiday spending.",
      watch: "Online versus in-store mix." },

    { d: "2026-12-18", t: "16:00", cat: "market", impact: "medium", status: "confirmed",
      title: "Quad witching and S&P 500 rebalance",
      why: "Final expiry of the year, combined with index rebalancing and year-end fund positioning.",
      watch: "Heavy, mechanical volume into the close." },

    { d: "2026-12-23", t: "08:30", cat: "inflation", impact: "medium", status: "expected",
      title: "PCE price index (November)",
      why: "Last significant data point of the year, released into a nearly empty market.",
      watch: "Thin conditions exaggerate the reaction. Fades are common." },

    { d: "2026-12-25", t: null, cat: "market", impact: "medium", status: "confirmed",
      title: "Christmas Day — US markets closed",
      why: "No trading.",
      watch: "The low-volume stretch between Christmas and New Year follows." },

    // ---------- 2027 ----------
    { d: "2027-01-27", t: "14:00", cat: "fed", impact: "high", status: "confirmed",
      title: "FOMC decision and Powell press conference",
      why: "First Fed meeting of 2027, setting the tone for the year.",
      watch: "Any shift in how the committee frames the neutral rate." }
  ]
};
