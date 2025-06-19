# Changelog

## [Unreleased]
- Full containerization: separate Dockerfiles for backend and frontend
- Docker Compose updated for backend, frontend, and db
- Tag removal feature (frontend and backend)
- Sun/moon theme switch button
- Root alignment and layout fixes
- Backend tag delete endpoint
- UI/UX improvements (gear menu, overlays, accessibility)
- New documentation: frontend setup, Docker usage, local Postgres with Docker
- Dockerfile for backend moved to `src/backend/Dockerfile`
- Screenshots added to README
- Database schema & seed now provided as SQL script (`docs/db-init.sql`); docs updated

### Added
- Export to PDF button for application status and response time report (using jsPDF and jspdf-autotable)

### Changed
- Card grid is now always centered in the tabs container
- Added spacing between cards and the border of the tabs container
- Added spacing below the cards grid for better visual separation

### Fixed
- PDF export bug: ensure jsPDF-AutoTable is properly imported and used 