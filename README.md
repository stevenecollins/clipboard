# Clipboards App

> A universal bookmarking vault for saving, organizing, and revisiting online finds from anywhere on the internet.

## 🎯 Overview

Clipboards is a cross-platform application that allows users to save both images and source links from any website or app into organized, private boards that sync across all devices.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone [your-repo-url]
cd clipboards

# Install dependencies (once we have package.json)
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

## 📁 Project Structure
```
clipboards/
├── backend/           # API server & database
├── frontend/          
│   ├── web/          # Web dashboard
│   ├── mobile/       # React Native app
│   └── extensions/   # Browser extensions
├── docs/             # Documentation
├── scripts/          # Build & deployment scripts
└── shared/           # Shared utilities & types
```

## 🛠️ Tech Stack

### Backend
- **API**: Node.js + Express (or Fastify)
- **Database**: PostgreSQL
- **Storage**: AWS S3
- **Auth**: Firebase Auth / Auth0

### Frontend
- **Web**: React + TypeScript
- **Mobile**: React Native
- **Extensions**: WebExtensions API

## 📋 Features

### MVP (Current Focus)
- ✅ Mobile share integration
- ✅ Browser extension capture  
- ✅ Board organization
- ✅ Cross-device sync
- ✅ Private by default

### Coming Soon
- 🔜 Tags & search
- 🔜 Image compression
- 🔜 Manual upload

## 🗓️ Development Phases

| Phase | Focus | Duration | Status |
|-------|-------|----------|--------|
| 0 | Preparation | 2-3 weeks | 🟡 In Progress |
| 1 | Core Backend & Auth | 3-4 weeks | ⏳ Pending |
| 2 | Mobile Capture MVP | 4-6 weeks | ⏳ Pending |
| 3 | Desktop Capture MVP | 3-4 weeks | ⏳ Pending |
| 4 | Viewing & Boards | 4-5 weeks | ⏳ Pending |
| 5 | Testing & Hardening | 2-3 weeks | ⏳ Pending |
| 6 | Launch | 1-2 weeks | ⏳ Pending |

## 👥 Team

- Steven - Full Stack Developer

## 📄 License

Private - All Rights Reserved

## 📚 Documentation

## For detailed project documentation, see:
- **Documentation Index** (./docs/README.md) - Complete documentation directory
- **Vision & Mission** (./docs/requirements/vision-mission.md)
- **Technical Requirements** (./docs/technical/technical-requirements.md)  
- **Development Roadmap** (./docs/technical/development-roadmap.md)
- **API Documentation** (./docs/api/README.md)