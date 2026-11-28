# Brief – Adventkalender Türchen 2: Das Christkind sucht eine Wohnung

Neuauflage eines bestehenden Videos (576 × 1024, 28 s) mit deutlich hochwertigerer Animation.
Geschichte, Texte und Advent-Rahmen bleiben gleich, alles ist neu gezeichnet und animiert.

- Format: 9:16, 1080 × 1920, 30 fps, 32 s, mit Ton
- Rahmen: Nacht-Hintergrund mit Bokeh und Schneefall in mehreren Ebenen, Schneeverwehungen,
  Tannenzweig mit Lichterkette und goldener Kugel „2“ (pendelt), Goldrahmen, Logo „searchplace“ oben rechts
- Alle Illustrationen als Vektorgrafik (assets/art.js): Christkind mit Ausdrücken (traurig, Träne,
  freudig, „Ooh“, skeptisch), Flügelschlag, Heiligenschein; Dachkammer; Traumwohnung; Kartenbilder

## Ablauf

| Zeit | Szene | Animation |
| --- | --- | --- |
| 0–5 s | Dachkammer | Titelkarte, Briefe fallen, Stapel drücken zusammen, Geschenk kippt auf den Tisch, Träne, Handy vibriert, Idee, Blase „Zeit für was Neues!“ |
| 5–6 s | Flug ins Handy | Kamera zoomt ins Handy in der Hand, das Handy wächst zum vollen Bildschirm |
| 6–10 s | Beschreiben | App-Oberfläche baut sich auf, Wunsch wird getippt (88 Zeichen), Christkind „Ich beschreib's einfach!“, Tipp auf LOS |
| 10–11,5 s | KI-Suche | Zähler rollt auf 205.736, Inserate rauschen durch, Scan-Linie, drei Treffer leuchten auf |
| 11,5–19,5 s | Treffer | Karten fliegen ein; Altbau „Schön, aber …“; Penthouse mit Windböen „Zu windig da oben …“; zurück zum Loft „Doch die erste! DIE ist es!“, Herz + Funken |
| 19,5–24,5 s | Traumwohnung | Kartenbild wächst zur ganzen Wohnung, Christkind fliegt ein, Feuer/Kerzen/Baumlichter/Sterne leben, Geschenke unter dem Baum, „Endlich Platz für alle Wünsche.“ |
| 24,5–32 s | Schluss | Kamera durchs Fenster, „Wenn sogar das Christkind seine Traumwohnung findet … warum nicht auch du?“, Suchzeile wird zum Logo, „Beschreib dein Zuhause. Die KI findet es.“, searchplace.ai |

## Ton

`assets/music/compose_christkind_score.py` synthetisiert Musik und Geräusche (keine Samples, frei nutzbar):
A-Moll-Spieluhr im Problem, ab der Idee C-Dur mit Celesta, Pizzicato-Bass und Schlittenglöckchen,
fülliger beim Einzug, Auflösung mit Glockenschlag, wenn das Logo steht. Geräusche liegen auf den
Bildaktionen (Tastenanschläge, Vibration, Pops, Wind, Herz, Whooshes). Normalisiert auf −16 LUFS.

## Exporte

- `exports/SearchPlace_Christkind_1080x1920.mp4` – H.264 2-Pass, ~3,3 Mbit/s, AAC 192 kbit/s, 14 MB
- `exports/SearchPlace_Christkind_Cover.jpg` – Titelbild (Bild bei 1,6 s)

## Prüfung

`npm run check` besteht. Verbleibende Hinweise sind bewusst: Datei ist eine einzige Komposition
(szenenübergreifende Übergänge), Texte gescrollter Karten liegen außerhalb des Handy-Ausschnitts,
der getippte Wunsch steht etwas kürzer als die Lesezeit-Faustregel.
