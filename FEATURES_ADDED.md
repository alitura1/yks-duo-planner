Added weekly rotation (client-side) and a basic History modal UI. Files modified/added:
- src/api/weekly.ts
- src/components/HistoryModal.tsx
- src/contexts/UserContext.tsx (calls rotation on login)
- src/components/TopBar.tsx (History button)

This is a starting implementation. For production, consider moving rotation to a backend cron or Cloud Function.

Added Cloud Functions scheduled rotation, StatsModal (recharts), Badges, and CSV export for history.
See /functions for Cloud Functions code and README for deploy notes.
