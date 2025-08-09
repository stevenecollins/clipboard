# Clipboards Project Context for Claude Code

## Project Overview
Clipboards is a cross-platform bookmarking application that allows users to save images and URLs from any website or app into private, organized boards.

## Project Documentation
- **Vision & Mission**: `docs/requirements/vision-mission.md`
- **MVP Brief**: `docs/requirements/mvp-brief.md`
- **Feature List**: `docs/requirements/feature-list.md`
- **Technical Requirements**: `docs/technical/technical-requirements.md`
- **Development Roadmap**: `docs/technical/development-roadmap.md`
- **UX Flows**: `docs/design/ux-flows.md`
- **Privacy & Legal**: `docs/legal/privacy-legal.md`

## Core Problem We're Solving
- Pinterest locks saves to their ecosystem
- Screenshots lose source links
- Bookmarks are scattered across devices
- Marketplace/social content disappears quickly

## Technical Architecture

### Backend (Phase 1 Priority)
- REST API using Node.js/Express
- PostgreSQL database for metadata
- AWS S3 for image storage
- Firebase Auth/Auth0 for authentication
- JWT tokens for API security

### Frontend Components
- React Native mobile app (iOS & Android)
- Chrome/Firefox browser extensions
- React web dashboard
- All using TypeScript

## Current Development Phase
**Phase 0 - Preparation** (Current)
- Setting up project structure
- Choosing tech stack
- Creating initial documentation

## Key Technical Decisions Made
1. **Database**: PostgreSQL for relational data
2. **Storage**: AWS S3 for images
3. **Auth**: Firebase Auth or Auth0
4. **Mobile**: React Native for cross-platform
5. **Web**: React + TypeScript
6. **API**: REST (considering GraphQL for future)

## MVP Features to Implement
1. User authentication (email/social login)
2. Mobile share target integration
3. Browser extension with right-click save
4. Board CRUD operations
5. Image + URL dual save
6. Cross-device sync
7. Private-by-default storage

## Development Principles
- Privacy first - all boards private by default
- Mobile-first design
- Fast capture process (< 2 seconds)
- Always preserve source links
- Cross-platform consistency

## File Naming Conventions
- Components: PascalCase (e.g., BoardView.tsx)
- Utilities: camelCase (e.g., imageCompressor.ts)
- Constants: UPPER_SNAKE_CASE
- CSS/Styles: kebab-case

## API Endpoint Structure (Planned)
```
POST   /auth/signup
POST   /auth/login
GET    /boards
POST   /boards
PATCH  /boards/:id
DELETE /boards/:id
GET    /items
POST   /items
GET    /items/:id
DELETE /items/:id
```

## Database Schema (Planned)
```sql
users: id, email, name, created_at
boards: id, user_id, name, created_at, updated_at
items: id, board_id, image_url, source_url, title, created_at
tags: id, name (future feature)
```

## Environment Variables Needed
- DATABASE_URL
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_S3_BUCKET
- JWT_SECRET
- FIREBASE_CONFIG or AUTH0_CONFIG

## Testing Strategy
- Unit tests for API endpoints
- Integration tests for auth flow
- E2E tests for critical user paths
- Manual testing on iOS/Android devices

## Deployment Plan
- Backend: AWS EC2 or Heroku
- Database: AWS RDS or Heroku Postgres
- Frontend Web: Vercel or Netlify
- Mobile: App Store & Google Play
- Extensions: Chrome & Firefox stores