# Pre-Market Catalysts

A single page listing the scheduled events most likely to move US equities —
Fed decisions, inflation prints, jobs reports, the earnings that carry an index,
and the market-structure days (expiries, holidays) worth knowing about.

Open it in the morning, scan the top three blocks, decide.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page. All markup, CSS and logic. |
| `data.js` | The calendar and the earnings roster. **This is the only file you edit to keep it current.** |
| `build.mjs` | Bundles the two into one self-contained file. |

## Running it

Open `index.html` in a browser — no server, no build, no keys. It also works
from the repo's Express server or Vercel deployment at `/market-brief/`.

To get a single portable file:

```sh
node build.mjs              # -> dist/market-brief.html
node build.mjs --fragment   # -> dist/market-brief.fragment.html (for Claude Artifacts)
```

## What the page computes

Everything is derived from `data.js` against the current date in US Eastern
time, so it stays correct wherever you open it:

- **Market status** — open, closed, or the countdown to the opening bell,
  accounting for weekends, holidays and half sessions.
- **Next major catalyst** — the next high-impact event, with a countdown.
- **Today** — leads the page, at full strength, in time order, opening with a
  count of how many high- and medium-impact events are due. High-impact events
  carry a filled badge and a heavier rule; the run sheet below stays quiet by
  comparison, so the loud styling means something. Anything whose
  time has passed keeps its prominence and is badged "already out" — the
  market is still trading the reaction — but stops counting as the next
  catalyst.
- **Reporting** — who announces earnings today and tomorrow, split into before
  the open and after the close, with the impact level and what to watch on each
  name. Out of season, when nothing reports on either day, it names the next
  reporting day and who is on it instead of showing an empty block.
- **Ahead** — the run sheet, filterable by category, impact and horizon.
  Earnings appear here too, one row per reporting slot, synthesised from the
  `earnings` array — so there is a single source of truth for who reports when.

## Keeping the calendar current

Add or correct entries in the `events` array in `data.js`:

```js
{ d: "2026-09-04", t: "08:30", cat: "jobs", impact: "high", status: "confirmed",
  title: "August jobs report",
  why:   "Why this moves the market, in one or two sentences.",
  watch: "The specific number to look at." }
```

- `d` — `YYYY-MM-DD`.
- `t` — `"HH:MM"` in 24h US Eastern, or `"before open"`, `"after close"`,
  `"all day"`, or `null` for no particular time.
- `cat` — `fed`, `inflation`, `jobs`, `earnings`, `growth`, `policy`, `market`.
  Category filter buttons appear automatically for whichever ones you use.
- `impact` — `high` (moves the index) or `medium` (moves sectors, or sets up
  something bigger).
- `status` — `confirmed` if the issuing agency has published the date,
  `expected` if it only follows the usual pattern.

Keep the array sorted by date. Nothing else needs to change.

## The earnings roster

Per-company entries live in the `earnings` array:

```js
{ d: "2026-11-25", when: "amc", ticker: "NVDA", name: "Nvidia",
  impact: "high", status: "expected",
  note:  "Why this report matters to the wider market.",
  watch: "The specific line in the release to look at." }
```

- `when` — `"bmo"` (before the open) or `"amc"` (after the close). The page
  marks a name "reported" once its window has safely closed: 9:30am ET for
  before-the-open names, 4:30pm ET for after-the-close.
- `impact` — `high` if the name can move the index or its whole sector,
  `medium` otherwise.
- Everything else matches the event schema above. Keep this array sorted by
  date too.

Do not also add an earnings entry to `events` — the page builds those rows
from this array, and a manual copy would show up twice.

`holidays` drives the market-status line: `close: null` means shut all day,
otherwise it is minutes from midnight ET (a 1:00 pm close is `780`).

## Where the dates come from

The current calendar runs to January 2027 and was built from:

- **FOMC meetings and minutes** — the Federal Reserve's published schedule.
  Meeting dates through 2027 are already announced.
- **Fed speaking events** — the Jackson Hole symposium (late August, hosted by
  the Kansas City Fed) and the semiannual testimony to Congress (February and
  July). These are not data releases, so they are easy to leave off a calendar
  built from release schedules alone — and they move markets as hard as a
  meeting does.
- **CPI, PPI, jobs reports** — Bureau of Labor Statistics release schedule.
- **PCE and GDP** — Bureau of Economic Analysis.
- **Retail sales** — Census Bureau.
- **Expiries and holidays** — NYSE calendar.
- **Earnings** — company investor-relations announcements where confirmed,
  otherwise the company's usual reporting week.

Agency dates are published a year or more ahead, so `confirmed` entries are
stable. Earnings dates are typically only fixed two to three weeks out, which
is why most carry `expected` until then — check the company's IR page before
sizing a position around one.

Kevin Warsh became Fed chair on 22 May 2026, succeeding Jerome Powell. The FOMC
entries name the chair, so update them if that changes again.
