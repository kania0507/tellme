<template>
  <div
    class="min-h-screen p-4 font-mono relative overflow-hidden text-left"
  >
    <div
      class="pointer-events-none absolute inset-0 opacity-20 bg-repeat"
      style="background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEklEQVR4nGP4////fwYiYGBgAAMTAgN7gv5cAAAAAElFTkSuQmCC'); mix-blend-mode:overlay;"
    ></div>

    <div class="crt-glare"></div>

    <div class="mb-2 animate-fadein">Witaj w pseudo-konsoli.</div>

    <div v-for="(entry, index) in history" :key="index" class="whitespace-pre-wrap animate-fadein whitespace-pre">{{ entry }}</div>

   <div class="relative w-full flex animate-fadein">
      <span class="absolute left-0 top-0 h-full flex items-center pl-1 text-green-500 font-bold">$</span>
      
      <input
        ref="inputRef"
        v-model="currentCommand"
        :disabled="isLocked"
        @keydown.enter="(e) => { if(!isLocked) runCommand(); }"
        @keydown="(e) => { if(!isLocked) handleKeydown(e); if(!isLocked) handleHistoryNavigation(e); }"
        class="flex-1 bg-transparent text-current font-mono outline-none border-none shadow-none focus:ring-0 disabled:opacity-50 pl-6"
        autocomplete="off"
        placeholder="Wpisz help, aby zobaczyć dostępne polecenia."
      />

      <!-- Migający kursor -->
      <span class="absolute right-0 top-0 h-full w-1 bg-green-500 animate-blink"></span>
    </div>


  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { commands } from '../commands'

const inputRef = ref(null)
const currentCommand = ref('')
const history = ref([])
const commandHistory = ref([])
const historyIndex = ref(-1)
const isLocked = ref(false)

// Focusing input on click
function focusInput() {
  inputRef.value?.focus()
}

// Typing effect
async function typeOutput(text) {
  let out = ""
  for (const char of text) {
    out += char
    // Temporary push to show gradual typing
    if (history.value[history.value.length - 1]?.startsWith('$ ')) {
      history.value.push(out)
      history.value.pop()
    } else {
      history.value.push(out)
      history.value.pop()
    }
    await new Promise(r => setTimeout(r, 5))
  }
  history.value.push(text)
}

// Run command
async function runCommand() {
  const cmd = currentCommand.value.trim()
  if (!cmd) return
  history.value.push(`$ ${cmd}`)
  commandHistory.value.push(cmd)
  historyIndex.value = -1

  const [name, arg] = cmd.split(" ")

  if (commands[name]) {
    const output = commands[name](history, arg)
    if (output) await typeOutput(output)
  } else {
    await typeOutput(`Polecenie nieznane: ${cmd}`)
  }

  currentCommand.value = ''
}

// Handle arrow up/down
function handleHistoryNavigation(event) {
  if (event.key === "ArrowUp") {
    if (commandHistory.value.length === 0) return
    if (historyIndex.value === -1) historyIndex.value = commandHistory.value.length - 1
    else if (historyIndex.value > 0) historyIndex.value--
    currentCommand.value = commandHistory.value[historyIndex.value]
  }
  if (event.key === "ArrowDown") {
    if (commandHistory.value.length === 0) return
    if (historyIndex.value < commandHistory.value.length - 1) {
      historyIndex.value++
      currentCommand.value = commandHistory.value[historyIndex.value]
    } else {
      historyIndex.value = -1
      currentCommand.value = ""
    }
  }
}

function handleKeydown(event) {
  // add TAB etc
}

// Observe exit / lock
watch(
  () => document.body.classList.contains("terminal-locked"),
  val => {
    isLocked.value = val
  }
)

// Focus input on mount
focusInput()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400&display=swap');

body, #app {
  font-family: 'Source Code Pro', monospace;
}

@keyframes blink { 50% { opacity: 0; } }
.animate-blink { animation: blink 1s step-end infinite; }

@keyframes fadein { from{opacity:0;} to{opacity:1;} }
.animate-fadein { animation: fadein 0.3s ease-out; }

.crt-glare {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 5;
  background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(0, 0, 0, 0) 60%
  ),
  radial-gradient(
      circle at 50% -20%,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.05) 60%,
      rgba(0, 0, 0, 0) 100%
  );
  mix-blend-mode: screen;
  opacity: 0.4;
}

/* Motywy */
.theme-night {
  --bg: #000000;
  --color: #00ff00;
}
.theme-day {
  --bg: #ffffff;
  --color: #222222;
}

body, #app {
  background: var(--bg);
  color: var(--color);
}

.terminal-locked * {
  pointer-events: none;
}

.whitespace-pre {
  white-space: pre-wrap;
  word-break: break-word;
}
.terminal-input {
  background: transparent;
  color: var(--color, #00ff00);
  font-family: 'Source Code Pro', monospace;
  font-size: 1rem;
  outline: none;
  border: none;
  box-shadow: none;
  padding-left: 1.5rem; /* zostaw miejsce na $ */
  width: 100%;
  position: relative;
}

.terminal-input::before {
  content: "$";
  position: absolute;
  left: 0.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color, #00ff00);
  font-weight: bold;
  pointer-events: none; /* nie blokuje wpisywania */
}
span.absolute.left-0 {
  pointer-events: none;
}
</style>
