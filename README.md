# 🗄️ DB Mastery – Datenbanken Lernplattform

Interaktive Lernplattform für die Datenbanken-Vorlesung (Module 1–10). Lerninhalte,
Diagramme, Vergleichstabellen und ein Quiz-/Prüfungsmodus mit allen wichtigen Fragen
aus den Quizzes und der Test-Klausur.

Läuft komplett **offline im Browser** – keine Installation außer Python (für den
lokalen Mini-Webserver) nötig. Dein Fortschritt wird lokal im Browser gespeichert.

---

## 🚀 Starten

Voraussetzung: **Python 3** installiert ([Download](https://www.python.org/downloads/) –
bei Windows beim Setup *„Add Python to PATH"* anhaken).

| Betriebssystem | So startest du |
|----------------|----------------|
| **Windows**    | Doppelklick auf **`start.bat`** |
| **macOS**      | Doppelklick auf **`start-mac.command`** *(beim 1. Mal evtl. Rechtsklick → „Öffnen")* |
| **Linux**      | Im Terminal: `./start.sh` |

Der Browser öffnet sich automatisch auf <http://localhost:8765>. Zum Beenden das
Terminal-/Konsolenfenster schließen oder `Strg+C` drücken.

> **Warum ein Server und kein simples Doppelklick auf `index.html`?**
> Die App lädt ihre Inhalte per `fetch()` aus JSON-Dateien. Browser blockieren das
> bei direktem Öffnen über `file://` (CORS). Der kleine Python-Server umgeht das.

### Manuell starten (Alternative)
```bash
cd db-learning-platform
python3 -m http.server 8765
# dann im Browser öffnen: http://localhost:8765
```

---

## ✨ Funktionen

- **Lernen** – 10 Module mit tiefem, prüfungsfokussiertem Inhalt: Tabellen,
  ASCII-Diagramme (ER-Notationen, Lock-Granularität, Architektur-Layer …),
  Vergleichskarten und Schlüsselbegriffen. Jedes Modul mit „⚡ Prüfungs-Spickzettel".
- **Prüfung** – Quiz-Modi: pro Modul, Prüfungssimulation (mit Timer),
  Schwachstellen-Training und Kahoot-Recap. Deckt alle Quiz- und Klausurfragen ab.
- **Fortschritt** – abgeschlossene Abschnitte und Quiz-Ergebnisse werden lokal
  gespeichert (`localStorage`).
- **Dark/Light Mode** und responsives Layout (Desktop + Mobile).

## 📚 Module

1. Database Systems · 2. Data Models · 3. Relational Data Model ·
4. Entity-Relationship Modeling · 5. Normalization · 6. Basic SQL ·
7. Advanced SQL · 8. Transactions & Concurrency · 9. DB Connectivity & Web ·
10. DB Administration, Security & NoSQL

## 🛠️ Aufbau

Reines HTML/CSS/JavaScript, keine Build-Tools, keine Abhängigkeiten.

```
index.html              App-Shell
styles.css              Styling
app.js                  Logik (Views, Quiz, Renderer)
content_modules_*.json  Lerninhalte je Modulpaar
kahoot_questions.json   Recap-Fragen
start.*                 Starter pro Betriebssystem
```

---

## ⚠️ Hinweis

Die Inhalte sind als **Lern-/Prüfungsvorbereitung** zusammengefasst und basieren auf
den Vorlesungsfolien (Coronel & Morris, *Database Systems*) sowie den Kursquizzes.
Nur zum internen Lernen für Klassenkolleg:innen – kein offizielles Kursmaterial,
ohne Gewähr auf Vollständigkeit/Richtigkeit. Quizfragen ersetzen nicht das Skript.

Viel Erfolg bei der Prüfung! 🍀
