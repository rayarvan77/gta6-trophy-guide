[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/rayarvan77/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/rayarvan77/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Ledger — GTA VI Trophy Guide & Tracker

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden; 0 online), built for the [make.fun bounty](https://make.fun/bounty/gta6-trophy-guide-01) — and for [make.fun](https://make.fun) itself, where this entry was built and judged.

## What it does

- **Tracker** — every trophy with its official name, description and grade, as a checklist saved in your browser (localStorage), with export to a JSON file and import back.
- **Filters** — by kind (story, missable, collectibles, activities, side quests, combat, robbery, exploration, money, one-offs, online), by grade, by earned/not earned, and free-text search.
- **Spoiler setting** — hides the names and descriptions of hidden story trophies until you earn them.
- **Roadmap to the platinum** — three stages (story, 100% checklist, cleanup) with the trophy counts in each, built from the official descriptions and PowerPyx's launch roadmap.
- **Missables** — the one trophy the launch guides flag as potentially missable (Positive Mental Attitude, Chapter 1), plus a watchlist of one-time moments.
- **A cited guide to each trophy** — written in our own words for this entry, naming its sources beside it. Where a method is not yet confirmed, the guide says so instead of inventing one.

## Run it

Static files, no build step. Any static server with `app/` at its root works:

```sh
node serve.ts        # then open http://localhost:8080
```

Or open `app/index.html` directly — it works with the network off. Try it with sample progress: `http://localhost:8080/?seed=13` ticks 13 trophies so you can see the tracker part-way through.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`, the kit's copy, unchanged).

## Sources

- **Exophase** — the official trophy list: all 55 names, descriptions and grades — https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/
- **PSNProfiles** — the same list, plus PSN's progress target for each counted trophy — https://psnprofiles.com/trophies/43531-grand-theft-auto-vi
- **PowerPyx** — GTA 6 Trophy Guide & Roadmap (18 Nov 2026): difficulty, time, the one potentially missable trophy, the 100% checklist thresholds and the per-trophy how-to detail, rewritten here in our own words — https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/

Full method note: `app/data/sources.json`.

## License

MIT — see [LICENSE](LICENSE). Unofficial fan-made guide; Grand Theft Auto VI belongs to its owners. No Rockstar logo, artwork or game screenshots are used anywhere in this guide.
