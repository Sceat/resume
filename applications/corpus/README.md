# Corpus — the evidence base behind tailored CVs

`master.md` is the _claims_ layer: the short, owner-approved facts a CV may state.
This corpus is the _evidence_ layer underneath it: per-project depth (architecture,
metrics, subsystems, every technology actually touched) mined when tailoring a CV
to a specific job offer, and when prepping interviews.

Rules:

- A CV bullet still needs its fact in `master.md`. The corpus JUSTIFIES and
  ENRICHES claims (numbers, subsystem names, stack detail) — when tailoring finds
  a corpus fact worth claiming that master.md lacks, promote it to master.md first.
- Corpus files are periodically refreshed from ground truth (local repos, GitHub
  API) — each file states its harvest date. Stale numbers (LOC, stars, player
  counts) must be re-measured before landing on a CV if the harvest is >3 months old.
- This repo may be public: no secrets, no private business figures beyond what the
  owner already publishes, no private repo contents — names and metadata only.

Files:

- `aresrpg.md` — the current flagship monorepo (deep survey).
- `local-projects.md` — every other project in ~/dev (identity, scale, last activity).
- `github-portfolio.md` — full GitHub inventory: Sceat + HydreIO + aresrpg orgs.
- `tech-inventory.md` — every technology touched, mapped to its strongest evidence.
