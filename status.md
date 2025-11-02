# Build Status

## Active Work
- [x] Projekt am 27.05.2024 in ein reines Archiv überführt.
- [ ] Keine weiteren Aktualisierungen geplant; Dokumentation nur bei Bedarf für Archiv-Hinweise anpassen.

## Upcoming
- [ ] Keine neuen Features – Fokus liegt auf langfristiger Lesbarkeit der archivierten Daten.

## Risks
- Langfristige Framework-Änderungen könnten die Archivansicht optisch beeinträchtigen, obwohl die Daten bestehen bleiben.
- Externe Links in den archivierten Daten werden nicht mehr überwacht und könnten veralten.

## Decisions
- Primäre Landing Page zeigt einen klaren Archiv-Hinweis statt interaktiver Planungstools.
- Datensatz bleibt lokal gebündelt und wird über `/api/archive` als JSON-Export angeboten.
- Bestehende Bilder werden weiterhin über die interne Proxy-Route bereitgestellt, aber ohne zukünftige Erweiterungen.
