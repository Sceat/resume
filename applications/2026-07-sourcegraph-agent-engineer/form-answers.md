# Form answers — Sourcegraph, Agent Engineer [IC4]

Status: PARKED (needs-cyril) — required location field (city/country/zip)
unknown; everything else pre-filled/drafted below. Submitted: NO.

- First/Last: Cyril / Morlet · Email: fetch@sceat.xyz · Phone: +380 68 978 1786
- Resume: Cyril-Morlet-Resume.pdf (this dir) · Cover letter: skip (optional)
- LinkedIn: none (leave blank)
- How did you hear: "Job search (Greenhouse board)"
- Compensation targeting: "USD 100,000+"
- Visa sponsorship needed: No
- Location (city/country/zip): ⚠ UNKNOWN — Cyril must provide
- Demographics: Decline to self-identify (all)
- Multi-step agentic system shipped (select): Yes
- Production software services (select): Yes
- Personally built/evaluated/operated an ML MODEL (select): No — honest; he
  operates LLM agents and embeddings retrieval, he does not train models.

**"What experience do you have that aligns with what we're looking for?"**

> I build multi-step agent systems daily. My main platform (~600K lines) is
> shipped by a Claude Code multi-agent harness I engineered: model routing by
> task shape, N agents doing implementation and review in parallel, and
> mechanical evaluation gates (tests, CodeQL, semgrep) that every agent change
> must pass before merge. I also built Noxant, an agentic CI/CD where agents
> execute, verify and publish autonomously in sandboxes on Kubernetes, and I
> authored three MCP servers (tool use, memory with embeddings retrieval, agent
> pooling). I care a lot about making agents reliable, observable and
> cost-bounded because I pay the token bill myself.

**"Describe your hands-on experience with coding agents"**

> Coding agents are my primary way of shipping software. I run Claude Code with
> multi-agent orchestration on every task: worker agents build under written
> briefs with file fences and attempt budgets, reviewer agents check with fresh
> context, cross-vendor review through OpenAI Codex, and everything lands only
> through mechanical gates. I designed the memory system, the routing rules and
> the guardrails myself, including immutable quality anchors the agents cannot
> modify. It is not a demo workflow, it ships a production game and its
> infrastructure.

**"What about this role aligns with what you're looking for next?"**

> I want to build the tooling itself instead of just being its power user. I
> have strong opinions about what makes agents reliable, formed by operating
> them in production on my own systems where every failure costs me directly.
> Sourcegraph works on exactly that problem, at scale and remote. That is the
> next step I am looking for.
