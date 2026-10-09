---
workflow: product-launch-video
flow: automation
storyboard: no
message: "Sag einfach, was du suchst – SearchPlace.ai durchsucht den ganzen Markt für dich."
destination: instagram-reels
aspect: 1080x1920
language: de
audience: Wohnungssuchende in Österreich / DACH
length: 20s
angle: problem-solution (Filterchaos → Freitextsuche → Ergebnisse → Marke)
---

## Intent

Instagram-Reel für searchplace.ai im Stil der Launch-Filme auf whatships.com:
dunkel, präzise, eine durchgehende Welt, große kinetische Typo, ruhige
long-tail-Eases, keine Bounce-Effekte. Kern-Idee: Die Suchleiste **ist** die
Logo-Hülle – am Ende setzt sich das Logo in genau dieser Leiste zusammen.

## Assets

- Logo (im Chat geteilt, Datei nicht im Repo) — als Vektor nachgebaut im
  `#bar`-Element von `index.html` (SEARCH-Pille, PLACE-Band, AI-Kreis).
- assets/fonts/ — Josefin Sans (Logo-Annäherung), Inter (UI/Headlines), lokal.
- assets/vendor/gsap.min.js — lokal, damit der Render ohne CDN läuft.

## Customizations

- Beispielsuche aus der Pressemitteilung: „Helle 3-Zimmer-Wohnung nahe
  Schönbrunn, unter 1.200 €“.
- Ergebnis-Karten sind stilisierte Illustrationen, keine echten Inserate.

## Notes

- Keine Screenshots der echten App vorhanden → stilisierte UI in Markenoptik.
  Sobald eine Bildschirmaufnahme existiert, ersetzt sie Szene 3–4.
- Stumm gerendert: Musik wird in Instagram als Trend-Audio ergänzt.
- Reels-Safe-Zone: Kerninhalte zwischen y≈230 und y≈1460.
- Belegte Aussagen: semantische Freitextsuche, mehrere Portale gleichzeitig,
  Ergebnisse in Sekunden, Basissuche kostenlos (Pressemitteilung 10/2025).
