export const commands = {
  help: () => `Dostępne polecenia:
help - lista poleceń
man - opis terminala
edu - edukacja
exp - doświadczenie
about - informacje o autorze
system - informacje o systemie
clear - czyści ekran
exit - wyjście z terminala`,

  man: () => (
    "Ten terminal to bezpieczny symulator.\nObsługuje tylko polecenia CV."
  ),

  "edu": () => (
    "Edukacja:\n" +
    "Informatyka, Politechnika Śląska\n" +
    "Zarządzanie cyberbezpieczeństwem, Akademia WSB, podyplomowe"
  ),

  "exp": () => (
    "Doświadczenie:\n" +
    "- 2021-2025 — Frontend Developer, Atomstore\n" +
    "- Programista PHP\n" +
    "- Specjalista IT\n"
  ),

  about: () => (
    "Autor: Anna Kaszuba-Cybulska\nSpecjalizacja: Frontend / Vue / JS / cyberbezpieczeństwo"
  ),

  system: () => `System pseudo-terminal v1.0
Przeglądarka: ${navigator.userAgent}
Język: ${navigator.language}
Platforma: ${navigator.platform}
Online: ${navigator.onLine}
`,

  clear: (history) => {
    history.value = []
    return null
  },

  exit: history => {
    history.value = ["Session terminated. Press F5 to restart."]
    document.body.classList.add("terminal-locked")
    return null
  },


  theme: (history, arg) => {

    if (!arg) {
      return "Użycie: theme [day|night]"
    }

    if (arg === "day") {
      document.body.className = "theme-day"
      return "Motyw ustawiony: DAY (jasny)"
    }

    if (arg === "night") {
      document.body.className = "theme-night"
      return "Motyw ustawiony: NIGHT (ciemny)"
    }

    return "Nieznany motyw. Dostępne: day, night"
  } 
}
