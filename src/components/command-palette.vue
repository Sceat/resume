<!--
  ============================================================================
  command-palette.vue
  ----------------------------------------------------------------------------
  Cmd+K modal. Centered card on a blurred backdrop, mono input, ranked list
  below. ESC / backdrop click closes; ↑↓ navigate; Enter executes; clicking
  a row executes it.

  Mounted at app level (`App.vue`), conditionally rendered via `v-if` on
  `isOpen` so it costs nothing when closed.
  ============================================================================
-->
<template>
  <Teleport to="body">
    <Transition name="cmdk">
      <div
        v-if="isOpen"
        ref="rootEl"
        class="cmdk"
        @keydown="onKeyDown"
      >
        <button
          type="button"
          class="cmdk__backdrop"
          aria-label="Close command palette"
          tabindex="-1"
          @click="close"
        />

        <div
          ref="dialogEl"
          class="cmdk__dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div class="cmdk__input-row">
            <span class="cmdk__prompt">&gt;</span>
            <input
              ref="inputEl"
              v-model="queryModel"
              type="text"
              class="cmdk__input"
              placeholder="type a command..."
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              aria-label="Command search"
              aria-controls="cmdk-list"
              :aria-activedescendant="filtered.length ? `cmdk-row-${selectedIndex}` : null"
            />
            <span class="cmdk__hint" aria-hidden="true">esc</span>
          </div>

          <ul
            id="cmdk-list"
            class="cmdk__list"
            role="listbox"
            aria-label="Commands"
          >
            <li
              v-for="(cmd, i) in filtered"
              :id="`cmdk-row-${i}`"
              :key="cmd.label"
              :class="['cmdk__row', { 'is-selected': i === selectedIndex }]"
              role="option"
              :aria-selected="i === selectedIndex"
              @mouseenter="selectIndex(i)"
              @click="executeSelected"
            >
              <span class="cmdk__row-prompt">&gt;</span>
              <span class="cmdk__row-label">{{ cmd.label }}</span>
              <span v-if="cmd.shortcut" class="cmdk__row-shortcut">
                {{ cmd.shortcut }}
              </span>
            </li>

            <li v-if="!filtered.length" class="cmdk__empty" role="status">
              &gt; no matches found
            </li>
          </ul>

          <div class="cmdk__footer" aria-hidden="true">
            <span>↑↓ navigate</span>
            <span class="cmdk__sep">·</span>
            <span>↵ select</span>
            <span class="cmdk__sep">·</span>
            <span>esc close</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

import { useCommandPalette } from '../composables/use-command-palette.js'

const {
  isOpen,
  query,
  selectedIndex,
  filtered,
  close,
  setQuery,
  moveSelection,
  selectIndex,
  executeSelected,
} = useCommandPalette()

const rootEl = ref(null)
const dialogEl = ref(null)
const inputEl = ref(null)

// v-model proxy → centralised setQuery (resets selectedIndex)
const queryModel = computed({
  get: () => query.value,
  set: (val) => setQuery(val),
})

// Focus input on open + lock body scroll
let prevOverflow = ''
watch(isOpen, async (open) => {
  if (open) {
    prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    await nextTick()
    inputEl.value?.focus()
  } else {
    document.body.style.overflow = prevOverflow
  }
})

// Cleanup if component is torn down while open
onBeforeUnmount(() => {
  if (isOpen.value) document.body.style.overflow = prevOverflow
})

// ----- keyboard handling on the dialog (focus trap + nav) ------------------
function onKeyDown(event) {
  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      close()
      return
    case 'ArrowDown':
      event.preventDefault()
      moveSelection(1)
      return
    case 'ArrowUp':
      event.preventDefault()
      moveSelection(-1)
      return
    case 'Enter':
      event.preventDefault()
      executeSelected()
      return
    case 'Tab':
      // Trap focus inside dialog. With only one focusable element (input),
      // any Tab keeps focus on the input.
      event.preventDefault()
      inputEl.value?.focus()
  }
}
</script>

<style scoped>
/* ---------- root + backdrop ---------- */
.cmdk {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: clamp(80px, 18vh, 180px);
  padding-inline: 1rem;
}

.cmdk__backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: color-mix(in oklab, var(--color-bg) 60%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 0;
  padding: 0;
  cursor: pointer;
}

/* ---------- dialog ---------- */
.cmdk__dialog {
  position: relative;
  width: min(520px, 92vw);
  background: var(--color-surface-2);
  border: 1px solid color-mix(in oklab, var(--color-primary) 40%, transparent);
  box-shadow:
    0 24px 64px -12px rgba(0, 0, 0, 0.6),
    0 0 0 1px color-mix(in oklab, var(--color-primary) 18%, transparent),
    0 0 80px -20px color-mix(in oklab, var(--color-primary-glow) 60%, transparent);
  display: flex;
  flex-direction: column;
  max-height: min(70vh, 560px);
  overflow: hidden;
  isolation: isolate;
}

/* Gradient hairline on top edge — terminal-sharp accent */
.cmdk__dialog::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(
    135deg,
    #22d3ee 0%,
    #60a5fa 40%,
    #a78bfa 75%,
    #f0abfc 100%
  );
  opacity: 0.85;
  pointer-events: none;
}

/* ---------- input row ---------- */
.cmdk__input-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--color-line);
}

.cmdk__prompt {
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  color: var(--color-primary);
  user-select: none;
  flex: 0 0 auto;
}

.cmdk__input {
  flex: 1 1 auto;
  background: transparent;
  border: 0;
  outline: 0;
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  color: var(--color-fg);
  letter-spacing: var(--track-mono-tight);
  padding: 0;
  min-width: 0;
}

.cmdk__input::placeholder {
  color: var(--color-fg-mute);
  font-style: italic;
}

.cmdk__hint {
  flex: 0 0 auto;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: var(--track-mono-wide);
  text-transform: uppercase;
  color: var(--color-fg-mute);
  padding: 2px 6px;
  border: 1px solid var(--color-line);
}

/* ---------- list ---------- */
.cmdk__list {
  list-style: none;
  margin: 0;
  padding: 0.375rem 0;
  overflow-y: auto;
  flex: 1 1 auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-line) transparent;
}

.cmdk__row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1rem 0.5rem calc(1rem - 2px);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  border-left: 2px solid transparent;
  transition: background-color 120ms var(--ease-standard);
}

.cmdk__row.is-selected {
  background: color-mix(in oklab, var(--color-primary) 12%, transparent);
  border-left-color: var(--color-primary);
}

.cmdk__row-prompt {
  color: var(--color-primary);
  flex: 0 0 auto;
  user-select: none;
  opacity: 0.85;
}

.cmdk__row-label {
  flex: 1 1 auto;
  color: var(--color-fg);
  letter-spacing: var(--track-mono-tight);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cmdk__row-shortcut {
  flex: 0 0 auto;
  color: var(--color-fg-mute);
  font-size: 0.6875rem;
  letter-spacing: var(--track-mono-wide);
  padding: 2px 6px;
  border: 1px solid var(--color-line);
  text-transform: lowercase;
}

.cmdk__empty {
  padding: 1rem;
  text-align: center;
  font-family: var(--font-mono);
  font-style: italic;
  font-size: 0.8125rem;
  color: var(--color-fg-mute);
}

/* ---------- footer ---------- */
.cmdk__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-top: 1px solid var(--color-line);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--color-fg-mute);
  letter-spacing: var(--track-mono-tight);
  background: color-mix(in oklab, var(--color-bg) 50%, transparent);
}

.cmdk__sep {
  opacity: 0.5;
}

/* ---------- transition: fade + scale ---------- */
.cmdk-enter-active,
.cmdk-leave-active {
  transition: opacity 180ms var(--ease-out-expo);
}

.cmdk-enter-active .cmdk__dialog,
.cmdk-leave-active .cmdk__dialog {
  transition:
    transform 180ms var(--ease-out-expo),
    opacity 180ms var(--ease-out-expo);
}

.cmdk-enter-from,
.cmdk-leave-to {
  opacity: 0;
}

.cmdk-enter-from .cmdk__dialog,
.cmdk-leave-to .cmdk__dialog {
  transform: scale(0.96) translateY(-6px);
  opacity: 0;
}

/* ---------- reduced motion: instant ---------- */
@media (prefers-reduced-motion: reduce) {
  .cmdk-enter-active,
  .cmdk-leave-active,
  .cmdk-enter-active .cmdk__dialog,
  .cmdk-leave-active .cmdk__dialog {
    transition: none !important;
  }
  .cmdk-enter-from .cmdk__dialog,
  .cmdk-leave-to .cmdk__dialog {
    transform: none;
  }
}

/* ---------- mobile tightening ---------- */
@media (max-width: 480px) {
  .cmdk {
    padding-top: clamp(60px, 12vh, 120px);
  }
  .cmdk__dialog {
    max-height: 75vh;
  }
}
</style>
