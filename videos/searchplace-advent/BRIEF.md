---
workflow: motion-graphics
flow: automation
storyboard: no
message: "SearchPlace Adventkalender – heute hinter Türchen N"
destination: instagram-reels
aspect: 1080x1920
language: de
length: 6s
angle: Intro für die tägliche Adventkalender-Serie (1.–24. Dezember)
---

## Intent

Weihnachtliches Intro für den SearchPlace-Adventkalender, bei dem jeden Tag ein
neues Türchen geöffnet wird. Konzept „Das Adventhaus“: ein Wiener Altbau bei Nacht
mit 24 Fenstern als Türchen (passend zur Immobiliensuche). Schnee, Lichterkette in
Gold und SearchPlace-Cyan, Christbaum, Kranz an der Tür.

## Customizations

- Variable `day` (1–24): Fenster in fester, gemischter Reihenfolge wie bei einem
  echten Adventkalender. Vergangene Tage leuchten, das Fenster des Tages öffnet sich,
  zukünftige bleiben zu. Kamera fliegt jeden Tag zu einer anderen Stelle.
- Render: `npx hyperframes render --variables '{"day":7}' -o renders/advent-07.mp4`.
- Exporte: exports/SearchPlace_Advent_Tuerchen_01–24.mp4 (+ Titelbilder).

## Notes

- Stumm; Musik in Instagram ergänzen.
- Logo als PNG (assets/logo.png).
