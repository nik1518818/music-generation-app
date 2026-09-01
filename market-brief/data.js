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
  updated: "2026-08-31",
  /** NYSE sessions. close: null = shut all day, otherwise minutes from midnight ET. */
  holidays: [
    { d: "2026-09-07", name: "Labor Day",      close: null },
    { d: "2026-11-26", name: "Thanksgiving",   close: null },
    { d: "2026-11-27", name: "day after Thanksgiving", close: 780 },
    { d: "2026-12-25", name: "Christmas Day",  close: null },
    { d: "2027-01-01", name: "New Year’s Day", close: null },
    { d: "2027-01-18", name: "Martin Luther King Jr. Day", close: null }
  ],

  /**
   * Who reports, and when. bmo = before the open, amc = after the close.
   * Companies confirm dates only two to three weeks ahead, so most of these
   * sit at status "expected" until they are announced.
   */
  earnings: [
    // ---- off-cycle reporters, September ----
    { d: "2026-09-10", when: "amc", ticker: "ORCL", name: "Oracle", impact: "high", status: "expected",
      note: "First big AI-infrastructure read of the quarter. The cloud backlog number has moved the whole data-centre complex.",
      watch: "Remaining performance obligations, and cloud infrastructure revenue growth." },
    { d: "2026-09-10", when: "amc", ticker: "ADBE", name: "Adobe", impact: "medium", status: "expected",
      note: "A proxy for whether software companies can charge for AI features.",
      watch: "Net new digital media ARR." },
    { d: "2026-09-23", when: "bmo", ticker: "GIS", name: "General Mills", impact: "medium", status: "confirmed",
      note: "Packaged-food pricing power and volumes, the cleanest read on whether consumers are still trading down.",
      watch: "Organic net sales growth and gross margin, the line most exposed to input-cost inflation." },
    { d: "2026-09-24", when: "amc", ticker: "COST", name: "Costco", impact: "medium", status: "confirmed",
      note: "A read on the higher-income consumer heading into the holiday quarter.",
      watch: "Comparable sales excluding fuel, and membership renewal rates." },
    { d: "2026-09-24", when: "bmo", ticker: "DRI", name: "Darden Restaurants", impact: "medium", status: "confirmed",
      note: "Casual-dining traffic is one of the cleanest reads on discretionary consumer spending.",
      watch: "Same-restaurant sales growth at Olive Garden, the segment that drives the stock." },
    { d: "2026-09-30", when: "amc", ticker: "MU", name: "Micron", impact: "high", status: "confirmed",
      note: "Memory pricing is the cleanest available signal on AI data-centre build-out.",
      watch: "High-bandwidth memory demand and pricing commentary." },
    { d: "2026-10-01", when: "amc", ticker: "NKE", name: "Nike", impact: "medium", status: "confirmed",
      note: "Discretionary spending and China demand in one report.",
      watch: "Greater China revenue and inventory levels." },

    // ---- Q3 season opens: the banks ----
    { d: "2026-10-13", when: "bmo", ticker: "JPM", name: "JPMorgan Chase", impact: "high", status: "confirmed",
      note: "Opens Q3 earnings season and sets the tone for it. The best read on credit conditions anyone gets.",
      watch: "Loan loss provisions and net interest income guidance." },
    { d: "2026-10-13", when: "bmo", ticker: "GS", name: "Goldman Sachs", impact: "medium", status: "confirmed",
      note: "Investment banking and trading revenue show whether deal-making has thawed.",
      watch: "Advisory backlog." },
    { d: "2026-10-13", when: "bmo", ticker: "WFC", name: "Wells Fargo", impact: "medium", status: "confirmed",
      note: "The most consumer-weighted of the big banks.",
      watch: "Card delinquency rates." },
    { d: "2026-10-13", when: "bmo", ticker: "C", name: "Citigroup", impact: "medium", status: "confirmed",
      note: "Global exposure makes it the read on international credit.",
      watch: "Expense guidance and the restructuring progress." },
    { d: "2026-10-14", when: "bmo", ticker: "BAC", name: "Bank of America", impact: "medium", status: "confirmed",
      note: "Largest US deposit base, so it is the clearest look at the mass-market consumer.",
      watch: "Deposit costs and net interest margin." },
    { d: "2026-10-14", when: "bmo", ticker: "MS", name: "Morgan Stanley", impact: "medium", status: "confirmed",
      note: "Wealth management flows show where retail money is going.",
      watch: "Net new assets." },
    { d: "2026-10-15", when: "bmo", ticker: "TSM", name: "TSMC", impact: "high", status: "expected",
      note: "Manufactures nearly every leading-edge AI chip. Its capex plan is the industry's forward guidance.",
      watch: "Capex for the year ahead, and advanced-node revenue mix." },
    { d: "2026-10-20", when: "amc", ticker: "NFLX", name: "Netflix", impact: "medium", status: "expected",
      note: "First mega-cap tech name out, and a proxy for streaming and ad spend.",
      watch: "Ad-tier momentum and operating margin guidance." },

    // ---- the heavy week ----
    { d: "2026-10-27", when: "amc", ticker: "MSFT", name: "Microsoft", impact: "high", status: "expected",
      note: "One of the largest index weights. Azure growth and capex guidance move the entire tech complex.",
      watch: "Azure growth rate, and any change to the capex plan." },
    { d: "2026-10-27", when: "amc", ticker: "GOOGL", name: "Alphabet", impact: "high", status: "expected",
      note: "Search revenue answers whether AI assistants are eating traditional search.",
      watch: "Search revenue growth and Google Cloud margin." },
    { d: "2026-10-28", when: "amc", ticker: "META", name: "Meta", impact: "high", status: "expected",
      note: "High-beta name that routinely moves 5–10% overnight on the spending outlook.",
      watch: "Capex guidance — the line that has caused the last several large moves." },
    { d: "2026-10-28", when: "amc", ticker: "TSLA", name: "Tesla", impact: "high", status: "expected",
      note: "Trades on margins and the story, rarely on the earnings number itself.",
      watch: "Automotive gross margin excluding credits, and delivery guidance." },
    { d: "2026-10-29", when: "amc", ticker: "AAPL", name: "Apple", impact: "high", status: "expected",
      note: "Largest index weight, reporting into the holiday quarter.",
      watch: "December-quarter revenue guidance and iPhone unit commentary." },
    { d: "2026-10-29", when: "amc", ticker: "AMZN", name: "Amazon", impact: "high", status: "expected",
      note: "AWS growth plus the consumer, in one report.",
      watch: "AWS growth rate and Q4 operating income guidance." },

    // ---- November and December ----
    { d: "2026-11-19", when: "bmo", ticker: "WMT", name: "Walmart", impact: "medium", status: "expected",
      note: "The broadest read on the American consumer, right before the holidays.",
      watch: "Comparable sales, and management's language on trade-down behaviour." },
    { d: "2026-11-25", when: "amc", ticker: "NVDA", name: "Nvidia", impact: "high", status: "expected",
      note: "The most consequential single earnings report in the market. Sets direction for the whole AI and semiconductor complex, and often the index with it.",
      watch: "Data centre revenue and next-quarter guidance. Options typically price a 7–9% move." },
    { d: "2026-12-10", when: "amc", ticker: "AVGO", name: "Broadcom", impact: "high", status: "expected",
      note: "Custom AI accelerators and networking — the clearest read on demand outside Nvidia.",
      watch: "AI revenue guidance for the coming year." }
  ],

  events: [
    // ---------- August 2026 ----------
    { d: "2026-08-28", t: "10:00", cat: "fed", impact: "high", status: "confirmed",
      title: "Jackson Hole keynote — Fed chair Kevin Warsh",
      why: "The Kansas City Fed's symposium (27–29 August) is where chairs have historically signalled a shift in policy ahead of committing to it at a meeting. This is Warsh's first as chair, so the market has no read yet on how he phrases things — which makes the reaction bigger, not smaller.",
      watch: "How he characterises the current stance and the direction of the next move. The stated 2026 theme — financial innovation and payments — matters far less than the policy language around it." },

    // ---------- September 2026 ----------
    { d: "2026-09-01", t: "10:00", cat: "growth", impact: "medium", status: "expected",
      title: "ISM Manufacturing PMI (August)",
      why: "First hard read on the new month. A print under 50 says factories are still contracting.",
      watch: "The prices-paid subindex leads goods inflation by a month or two." },

    { d: "2026-09-04", t: "08:30", cat: "jobs", impact: "high", status: "confirmed",
      title: "August jobs report",
      why: "The single biggest scheduled mover before the September Fed meeting. Payrolls, unemployment rate and average hourly earnings all land at once.",
      watch: "Wage growth matters more than the headline count right now — it is what keeps the Fed cautious." },

    { d: "2026-09-06", t: null, cat: "policy", impact: "medium", status: "confirmed",
      title: "OPEC+ monthly production meeting",
      why: "The eight core members review output quotas monthly by video call. A surprise change to the unwind pace moves crude and, with it, energy-sector earnings and headline inflation a month or two out.",
      watch: "Whether the group holds course or accelerates/pauses the production increases it has been phasing in." },

    { d: "2026-09-07", t: null, cat: "market", impact: "medium", status: "confirmed",
      title: "Labor Day — US markets closed",
      why: "No equity or bond trading. Volume is thin either side of the long weekend.",
      watch: "Positioning often gets squared off on the Friday before." },

    { d: "2026-09-11", t: "08:30", cat: "inflation", impact: "high", status: "confirmed",
      title: "CPI inflation (August)",
      why: "Last inflation print the Fed sees before it decides on rates five days later. Reliably the most volatile 30 minutes of the month.",
      watch: "Core CPI ex-food-and-energy, month over month. Shelter and services are the sticky parts." },

    { d: "2026-09-16", t: "08:30", cat: "growth", impact: "medium", status: "confirmed",
      title: "Retail sales (August)",
      why: "The consumer is two-thirds of the economy. Lands the same morning as the Fed decision, so it can set the tone early.",
      watch: "The control group, which feeds straight into GDP." },

    { d: "2026-09-16", t: "14:00", cat: "fed", impact: "high", status: "confirmed",
      title: "FOMC decision, dot plot and Warsh press conference",
      why: "Rate decision at 2:00, updated projections the same moment, Warsh at 2:30. Quarterly meetings carry the dot plot, which is where the surprises usually are.",
      watch: "The 2:00–3:00 window often reverses. The dots and the press conference frequently say different things." },

    { d: "2026-09-18", t: "16:00", cat: "market", impact: "medium", status: "confirmed",
      title: "Quad witching and S&P 500 rebalance",
      why: "Options and futures expire together and index funds rebalance into the close. Volume runs two to three times normal.",
      watch: "Price action into the close is mechanical, not informational. Do not read a signal into it." },

    { d: "2026-09-24", t: "08:30", cat: "growth", impact: "medium", status: "expected",
      title: "Q2 GDP, third estimate",
      why: "Third look at a quarter that already ended, so it rarely moves much on its own.",
      watch: "Revisions to consumer spending are the part that still gets traded." },

    { d: "2026-09-30", t: "23:59", cat: "policy", impact: "high", status: "confirmed",
      title: "Government funding deadline (FY2026 continuing resolution expires)",
      why: "Current funding lapses at midnight unless Congress passes a bridge before then. The House and Senate have each passed continuing resolutions to different dates (Dec 4 and Dec 11) that still need to be reconciled, so a lapse is a live possibility, not a formality.",
      watch: "Whether a shutdown actually happens. The 2025 shutdown pushed the September jobs report from Oct 3 to Nov 20 and October CPI never published at all — the Oct 2 jobs report and Oct 13 CPI below are the first releases at risk this time." },

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
      why: "First payrolls print of the quarter, ahead of an October Fed meeting with no new projections. At risk of delay if the government funding deadline four days earlier is not resolved.",
      watch: "Revisions to the prior two months have been large enough to flip the story." },

    { d: "2026-10-04", t: null, cat: "policy", impact: "medium", status: "confirmed",
      title: "OPEC+ Joint Ministerial Monitoring Committee meeting",
      why: "The JMMC reviews compliance with existing quotas and can recommend production changes to the full group. Its recommendations often preview the following month's OPEC+ decision.",
      watch: "Compliance commentary on the largest producers, and any recommended change to the group's output path." },

    { d: "2026-10-07", t: "14:00", cat: "fed", impact: "medium", status: "expected",
      title: "FOMC minutes (September meeting)",
      why: "Full account of the September debate three weeks after the fact. Occasionally reveals how split the committee was.",
      watch: "Language about the pace of future cuts." },

    { d: "2026-10-13", t: "08:30", cat: "inflation", impact: "high", status: "expected",
      title: "CPI inflation (September)",
      why: "Sets expectations for the October Fed meeting two weeks later.",
      watch: "Core month over month. Three consecutive soft prints is what changes the rate path." },

    { d: "2026-10-15", t: "08:30", cat: "growth", impact: "medium", status: "expected",
      title: "Retail sales (September)",
      why: "Consumer health going into the holiday quarter.",
      watch: "Any pullback in discretionary categories." },

    { d: "2026-10-28", t: "14:00", cat: "fed", impact: "high", status: "confirmed",
      title: "FOMC decision and Warsh press conference",
      why: "Rate decision with no updated projections, so everything hangs on the statement wording and the press conference.",
      watch: "Changes to the statement language versus September, word for word." },

    { d: "2026-10-29", t: "08:30", cat: "growth", impact: "medium", status: "confirmed",
      title: "Q3 GDP, advance estimate",
      why: "First official read on how the economy did last quarter.",
      watch: "Consumer spending contribution versus inventories — inventory-driven beats do not last." },

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

    { d: "2026-11-18", t: "14:00", cat: "fed", impact: "medium", status: "expected",
      title: "FOMC minutes (October meeting)",
      why: "Detail behind an October decision that came without projections.",
      watch: "How many participants wanted a different outcome." },

    { d: "2026-11-25", t: "08:30", cat: "inflation", impact: "high", status: "expected",
      title: "PCE price index (October)",
      why: "Pulled forward into the short Thanksgiving week, so it lands in thin liquidity — moves get amplified.",
      watch: "Core PCE month over month." },

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
      title: "FOMC decision, dot plot and Warsh press conference",
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
    { d: "2027-01-08", t: "08:30", cat: "jobs", impact: "high", status: "confirmed",
      title: "December jobs report",
      why: "First payrolls print of the year, ahead of the January Fed meeting.",
      watch: "Whether year-end seasonal hiring patterns distort the headline number." },

    { d: "2027-01-13", t: "08:30", cat: "inflation", impact: "high", status: "confirmed",
      title: "CPI inflation (December)",
      why: "Last inflation print before the January FOMC decision.",
      watch: "Core CPI month over month, and whether shelter disinflation is still intact." },

    { d: "2027-01-27", t: "14:00", cat: "fed", impact: "high", status: "confirmed",
      title: "FOMC decision and Warsh press conference",
      why: "First Fed meeting of 2027, setting the tone for the year.",
      watch: "Any shift in how the committee frames the neutral rate." },

    { d: "2027-02-24", t: "10:00", cat: "fed", impact: "high", status: "expected",
      title: "Semiannual monetary policy testimony to Congress",
      why: "The chair takes two days of questions from the House and Senate banking committees. Prepared remarks are policy; the answers under questioning are where the market gets something new. Held every February and July — the exact February dates are usually set only a few weeks ahead.",
      watch: "Any daylight between the prepared testimony and the answers on the rate path." },

    { d: "2027-03-17", t: "14:00", cat: "fed", impact: "high", status: "confirmed",
      title: "FOMC decision, dot plot and Warsh press conference",
      why: "First quarterly meeting of 2027 with updated economic projections, six weeks after the January decision.",
      watch: "How the median 2027 dot has shifted since January, and any change to the committee's read on the neutral rate." }
  ]
};
