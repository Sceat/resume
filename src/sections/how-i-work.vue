<template>
  <section
    id="how-i-work"
    v-reveal
    class="hiw"
    aria-labelledby="hiw-heading"
  >
    <div class="hiw__inner">
      <header class="hiw__head">
        <h2 id="hiw-heading" class="hiw__eyebrow">
          // how i work — multi-agent orchestration
        </h2>
        <p class="hiw__lead">
          I orchestrate
          <span
            class="hiw__lead-term"
            tabindex="0"
            role="button"
            aria-describedby="hiw-fleet-tip"
          >
            parallel agent consensus<span
              id="hiw-fleet-tip"
              class="hiw__tip"
              role="tooltip"
            >Claude Code subagents — N per task, disjoint scope, consensus before commit</span>
          </span>
          in Claude Code. Plan-mode by default, parallel subagents with
          disjoint scope, critique loops on every plan before a single line
          gets written.
        </p>
        <p class="hiw__sub">
          <span class="text-primary">&gt;</span>
          Twelve years of pattern recognition, applied at machine speed.
        </p>
      </header>

      <!-- 3-column workflow visualization -->
      <ol class="hiw__cols" aria-label="Workflow stages">
        <li
          v-for="(stage, i) in stages"
          :key="stage.id"
          class="hiw__col"
          :data-stage="stage.id"
        >
          <div class="hiw__col-head">
            <span class="hiw__col-step" aria-hidden="true">
              0{{ i + 1 }}
            </span>
            <span class="hiw__col-glyph" aria-hidden="true">{{ stage.glyph }}</span>
            <h3 class="hiw__col-title">{{ stage.title }}</h3>
          </div>
          <p class="hiw__col-tag">{{ stage.tagline }}</p>
          <ul class="hiw__col-list">
            <li v-for="bullet in stage.bullets" :key="bullet">
              <span class="hiw__col-mark" aria-hidden="true">·</span>
              {{ bullet }}
            </li>
          </ul>
        </li>
      </ol>

      <!-- Sample workflow snippet -->
      <figure class="hiw__terminal" aria-label="Example session">
        <figcaption class="hiw__terminal-cap">
          <span class="dot dot--r" aria-hidden="true" />
          <span class="dot dot--y" aria-hidden="true" />
          <span class="dot dot--g" aria-hidden="true" />
          <span class="hiw__terminal-title">{{ sessionTitle }}</span>
        </figcaption>
        <pre class="hiw__terminal-body"><code><span class="prompt">nox&gt;</span> <span class="cmd">plan</span>
<span class="out">&gt;</span> N parallel agents · 42h scope · ship in 5d
<span class="prompt">nox&gt;</span> <span class="cmd">critique</span>
<span class="out">&gt;</span> 3 reviewers · 12 weak points · 3 escalated
<span class="prompt">nox&gt;</span> <span class="cmd">diff</span>
<span class="out">&gt;</span> 2,840 + / 1,205 - · 31 files · 0 conflicts
<span class="prompt">nox&gt;</span> <span class="cmd">ship</span><span class="caret-blink" aria-hidden="true">▍</span></code></pre>
      </figure>

    </div>

    <!-- Full-bleed productivity band — no card, no border, just gradient
         haze + breathing flow. Escapes the inner container so it spans
         the whole viewport, breaking the "stack of bordered cards" rhythm. -->
    <aside class="hiw__band" aria-label="What changes with AI">
      <span class="hiw__band-haze" aria-hidden="true" />
      <span class="hiw__band-rule" aria-hidden="true" />
      <div class="hiw__band-inner">
        <p class="hiw__band-quote">
          12 years of programming taught me
          <span class="hiw__quote-em">what to look for.</span>
          The agents apply that judgment
          <span class="hiw__quote-em">at machine speed.</span>
        </p>
        <p class="hiw__band-meta">
          <span>parallel subagents · disjoint scope</span>
          <span class="sep" aria-hidden="true">·</span>
          <span>4 flagships · solo</span>
          <span class="sep" aria-hidden="true">·</span>
          <span>consensus before commit</span>
        </p>
      </div>
    </aside>
  </section>
</template>

<script setup>
/**
 * How I Work — multi-agent orchestration narrative.
 * Three-column workflow (PLAN / DELEGATE / CRITIQUE) + rotating session
 * terminal + machine-speed productivity statement.
 *
 * Verbatim CLAUDE.md vocabulary: subagents, disjoint scope, plan-mode,
 * critique loops, tasks/lessons.md, the one-sentence test.
 */
const stages = [
  {
    id: 'plan',
    glyph: '◇',
    title: 'PLAN',
    tagline: 'context engineering, the unfair advantage',
    bullets: [
      'read the codebase deeply — every line I touch',
      'spawn research subagents for unknowns',
      'draft detailed specs, lock direction before a token is written',
      "the one-sentence test: if I can't explain it in one sentence, it's too complex",
    ],
  },
  {
    id: 'delegate',
    glyph: '◈',
    title: 'DELEGATE',
    tagline: 'parallel subagents, full context, one tack each',
    bullets: [
      'spawn parallel subagents with disjoint scope — count fits the task',
      'give each full context: paths, constraints, examples, anti-patterns',
      'one tack per subagent — focused execution',
      'throw more compute at hard problems via more subagents',
    ],
  },
  {
    id: 'critique',
    glyph: '◆',
    title: 'CRITIQUE',
    tagline: 'reverse-brainstorm: how could this fail?',
    bullets: [
      'spawn parallel critique agents — find weak points before users do',
      'diff behavior between main and branch',
      'ask: would a staff engineer approve this?',
      'log lessons → tasks/lessons.md → next session is sharper',
    ],
  },
]

// Pick a real-looking session title once on mount.
const sessionTitles = [
  '~/aresrpg/marketplace · nox',
  '~/hytale/anticheat-v2 · nox',
  'claude-code · session 0481',
]
const sessionTitle = sessionTitles[Math.floor(Math.random() * sessionTitles.length)]
</script>

<style scoped>
.hiw {
  width: 100%;
  padding: 4rem 1rem 4.5rem;
}

.hiw__inner {
  margin: 0 auto;
  max-width: 1100px;
}

/* ─── Header ─── */
.hiw__head {
  margin-bottom: 2rem;
}

.hiw__eyebrow {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--color-fg-mute);
  letter-spacing: 0.04em;
  text-transform: lowercase;
}

.hiw__lead {
  margin-top: 0.7rem;
  font-family: var(--font-sans);
  font-size: clamp(1.5rem, 3vw, 2.4rem);
  line-height: 1.18;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--color-fg);
}

/* tooltip term */
.hiw__lead-term {
  position: relative;
  background: var(--gradient-cyan-sky);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  cursor: help;
  border-bottom: 1px dashed
    color-mix(in oklab, var(--color-primary) 40%, transparent);
  outline: none;
}

.hiw__tip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 0.5rem);
  transform: translateX(-50%);
  width: max-content;
  max-width: 280px;
  padding: 0.5rem 0.65rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 1.4;
  letter-spacing: 0;
  color: var(--color-fg-dim);
  background: color-mix(in oklab, var(--color-bg) 92%, var(--color-surface));
  border: 1px solid var(--color-line);
  border-radius: 4px;
  box-shadow: 0 8px 24px -12px
    color-mix(in oklab, var(--color-primary) 40%, transparent);
  -webkit-text-fill-color: var(--color-fg-dim);
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms ease-out;
  z-index: 5;
}

.hiw__lead-term:hover .hiw__tip,
.hiw__lead-term:focus-visible .hiw__tip {
  opacity: 1;
}

.hiw__sub {
  margin-top: 0.65rem;
  font-family: var(--font-mono);
  font-style: italic;
  font-size: 0.875rem;
  color: var(--color-fg-dim);
}

.hiw__sub .text-primary {
  color: var(--color-primary);
  margin-right: 0.25rem;
  font-style: normal;
}

/* ─── Columns ─── */
.hiw__cols {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;
}

.hiw__col {
  position: relative;
  padding: 1.1rem 1.1rem 1.25rem;
  border-radius: 8px;
  background: linear-gradient(
    180deg,
    color-mix(in oklab, var(--color-surface) 90%, var(--color-bg)) 0%,
    color-mix(in oklab, var(--color-surface-2) 88%, var(--color-bg)) 100%
  );
  border: 1px solid var(--color-line);
  overflow: hidden;
  isolation: isolate;
}

/* gradient hairline at the top of each column */
.hiw__col::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: var(--col-accent, var(--gradient-aurora));
  opacity: 0.85;
}

/* gradient halo glow, subtle */
.hiw__col::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: var(--col-accent, var(--gradient-aurora));
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  opacity: 0.18;
  pointer-events: none;
  z-index: -1;
}

/* PLAN — primary blue family */
.hiw__col[data-stage='plan'] {
  --col-accent: linear-gradient(
    135deg,
    var(--color-primary-glow) 0%,
    var(--color-primary) 100%
  );
}
/* DELEGATE — indigo → cyan (cyan-sky) */
.hiw__col[data-stage='delegate'] {
  --col-accent: var(--gradient-cyan-sky);
}
/* CRITIQUE — green → blue (success → primary) */
.hiw__col[data-stage='critique'] {
  --col-accent: linear-gradient(
    135deg,
    var(--color-success) 0%,
    var(--color-primary) 100%
  );
}

.hiw__col-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.55rem;
}

.hiw__col-step {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: var(--color-fg-mute);
  padding: 0.05rem 0.4rem;
  border: 1px solid var(--color-line);
  border-radius: 3px;
  background: color-mix(in oklab, var(--color-bg) 50%, transparent);
}

.hiw__col-glyph {
  font-size: 1rem;
  background: var(--col-accent, var(--gradient-aurora));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.hiw__col-title {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--color-fg);
}

.hiw__col-tag {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--color-fg-dim);
  margin-bottom: 0.85rem;
}

.hiw__col-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--color-fg-dim);
  line-height: 1.55;
}

.hiw__col-list li {
  position: relative;
  padding-left: 1rem;
}

.hiw__col-mark {
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

/* ─── Terminal mock ─── */
.hiw__terminal {
  margin: 1.75rem 0 0;
  border: 1px solid var(--color-line);
  border-radius: 8px;
  background: color-mix(in oklab, var(--color-surface) 92%, var(--color-bg));
  overflow: hidden;
  box-shadow: 0 18px 48px -28px
    color-mix(in oklab, var(--color-primary) 35%, transparent);
}

.hiw__terminal-cap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.875rem;
  border-bottom: 1px solid var(--color-line);
  background: color-mix(in oklab, var(--color-surface-2) 80%, transparent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-fg-dim);
}

.dot {
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 999px;
}
.dot--r { background: color-mix(in oklab, var(--color-danger) 75%, transparent); }
.dot--y { background: color-mix(in oklab, var(--color-warn) 75%, transparent); }
.dot--g { background: color-mix(in oklab, var(--color-success) 75%, transparent); }

.hiw__terminal-title {
  margin-left: 0.5rem;
  letter-spacing: 0.04em;
}

.hiw__terminal-body {
  margin: 0;
  padding: 1rem 1.1rem 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.7;
  color: var(--color-fg-dim);
  overflow-x: auto;
  white-space: pre;
}

.hiw__terminal-body .prompt {
  color: var(--color-primary);
  margin-right: 0.25rem;
}

.hiw__terminal-body .cmd {
  color: var(--color-fg);
  font-weight: 600;
}

.hiw__terminal-body .out {
  color: var(--color-fg-mute);
  margin-right: 0.25rem;
}

.caret-blink {
  display: inline-block;
  margin-left: 2px;
  color: var(--color-primary);
  animation: caret-blink 1s steps(2) infinite;
}

@keyframes caret-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

/* ─── Full-bleed productivity band — gradient haze, no card, no border ───
 * Escapes parent's max-width via the `100vw` trick so it spans the full
 * viewport. Two animated layers compose a "shaderified" feel:
 *  - Haze: large radial gradient that drifts horizontally over 24s
 *  - Rule: 1px gradient hairline above the quote, fades at both ends
 * No box, no padding-card silhouette — just text floating on light. */
.hiw__band {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-top: 3rem;
  padding-block: 3.5rem;
  isolation: isolate;
  overflow: hidden;
  z-index: 0;
}

/* Animated radial-haze backdrop. Two offset blobs slowly counter-drift,
 * masked horizontally so the band fades into the page on both sides. */
.hiw__band-haze {
  position: absolute;
  inset: -20% -5%;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 45% 90% at 28% 50%,
      color-mix(in oklab, var(--color-primary) 16%, transparent) 0%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 38% 80% at 78% 55%,
      color-mix(in oklab, var(--color-primary-glow) 13%, transparent) 0%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 70% 60% at 50% 100%,
      color-mix(in oklab, var(--color-secondary, #818cf8) 7%, transparent) 0%,
      transparent 75%
    );
  -webkit-mask: linear-gradient(
    to right,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
          mask: linear-gradient(
    to right,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
  animation: hiw-band-flow 24s ease-in-out infinite alternate;
}

@keyframes hiw-band-flow {
  0%   { transform: translateX(-2.5%) scale(1); }
  50%  { transform: translateX(2%)    scale(1.04); }
  100% { transform: translateX(-1%)   scale(0.98); }
}

/* 1px gradient hairline beneath the quote — sits between quote and meta.
 * Same vocabulary as the nav accent line. */
.hiw__band-rule {
  position: absolute;
  left: 22%;
  right: 22%;
  top: 50%;
  height: 1px;
  pointer-events: none;
  background: linear-gradient(
    to right,
    transparent 0%,
    color-mix(in oklab, var(--color-primary) 30%, transparent) 22%,
    color-mix(in oklab, var(--color-primary-glow) 50%, transparent) 50%,
    color-mix(in oklab, var(--color-primary) 30%, transparent) 78%,
    transparent 100%
  );
  filter: drop-shadow(0 0 5px color-mix(in oklab, var(--color-primary-glow) 35%, transparent));
  opacity: 0.6;
}

.hiw__band-inner {
  margin: 0 auto;
  max-width: 64rem;
  padding-inline: clamp(1rem, 5vw, 3rem);
  text-align: center;
  position: relative;
  z-index: 1;
}

.hiw__band-quote {
  font-family: var(--font-sans);
  font-size: clamp(1.4rem, 2.8vw, 2.25rem);
  line-height: 1.25;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--color-fg);
  margin: 0 auto;
  max-width: 36ch;
}

.hiw__quote-em {
  background: linear-gradient(
    115deg,
    var(--color-primary-glow) 0%,
    var(--color-primary) 60%,
    var(--color-primary-glow) 100%
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  font-weight: 600;
  animation: hiw-quote-shimmer 8s linear infinite;
}

@keyframes hiw-quote-shimmer {
  to { background-position: -200% center; }
}

.hiw__band-meta {
  margin-top: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--color-fg-mute);
  text-align: center;
  line-height: 1.6;
}

.hiw__band-meta .sep {
  display: inline;
  width: auto;
  margin: 0 0.5rem;
  color: var(--color-line);
}

@media (prefers-reduced-motion: reduce) {
  .hiw__band-haze,
  .hiw__quote-em,
  .caret-blink {
    animation: none !important;
  }
  .caret-blink { opacity: 1; }
}

/* ─── Tablet+ ─── */
@media (min-width: 768px) {
  .hiw {
    padding: 5rem 1.5rem 5.5rem;
  }
  .hiw__eyebrow {
    font-size: 1rem;
  }
  .hiw__sub {
    font-size: 0.95rem;
  }
  .hiw__cols {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  .hiw__col {
    padding: 1.25rem 1.25rem 1.4rem;
  }
  .hiw__col-title {
    font-size: 1rem;
  }
  .hiw__col-tag {
    font-size: 0.82rem;
  }
  .hiw__col-list {
    font-size: 0.82rem;
  }
  .hiw__quote {
    font-size: 1.375rem;
  }
  .hiw__terminal-body {
    font-size: 0.9rem;
    padding: 1.1rem 1.25rem 1.35rem;
  }
}
</style>
