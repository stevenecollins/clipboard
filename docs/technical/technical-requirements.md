# Technical Requirements

## System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile Apps   │    │ Browser Extensions │    │  Web Dashboard  │
│  (React Native) │    │   (WebExtensions)  │    │     (React)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   REST API      │
                    │  (Node.js)      │
                    └─────────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
        ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
        │ PostgreSQL  │  │   AWS S3    │  │ Redis Cache │
        │ Database    │  │ (Images)    │  │ (Sessions)  │
        └─────────────┘  └─────────────┘  └─────────────┘
```

## Backend Requirements

### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x or Fastify 4.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Image Storage**: AWS S3
- **Authentication**: JWT + Firebase Auth/Auth0

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- nullable for social auth
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    auth_provider VARCHAR(50) DEFAULT 'email', -- email, google, apple
    auth_provider_id VARCHAR(255),
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Boards Table
```sql
CREATE TABLE boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7), -- hex color code
    position INTEGER DEFAULT 0, -- for ordering
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Items Table
```sql
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    title VARCHAR(255),
    source_url TEXT NOT NULL,
    image_url TEXT NOT NULL, -- S3 URL
    image_width INTEGER,
    image_height INTEGER,
    image_size INTEGER, -- bytes
    image_format VARCHAR(10), -- jpg, png, webp
    position INTEGER DEFAULT 0, -- for ordering within board
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Sessions Table (for sync)
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_type VARCHAR(20), -- mobile, web, extension
    device_id VARCHAR(255),
    last_sync TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints

#### Authentication
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/reset-password
POST   /api/auth/verify-email
POST   /api/auth/social/google
POST   /api/auth/social/apple
```

#### User Management
```
GET    /api/user/profile
PATCH  /api/user/profile
DELETE /api/user/account
GET    /api/user/sessions
DELETE /api/user/sessions/:id
```

#### Boards
```
GET    /api/boards                    # Get user's boards
POST   /api/boards                    # Create board
GET    /api/boards/:id                # Get board details
PATCH  /api/boards/:id                # Update board
DELETE /api/boards/:id                # Delete board
POST   /api/boards/:id/reorder        # Reorder boards
```

#### Items
```
GET    /api/boards/:boardId/items     # Get board items
POST   /api/boards/:boardId/items     # Create item
GET    /api/items/:id                 # Get item details
PATCH  /api/items/:id                 # Update item
DELETE /api/items/:id                 # Delete item
POST   /api/items/:id/move            # Move to different board
POST   /api/boards/:boardId/items/reorder # Reorder items
```

#### Sync & Search
```
GET    /api/sync/status               # Get sync status
POST   /api/sync/force                # Force sync
GET    /api/search                    # Search across user content
```

### Performance Requirements

#### Response Times
- Authentication: <500ms
- Board operations: <200ms
- Item creation: <1s (including image processing)
- Search: <300ms
- Sync operations: <2s

#### Throughput
- Support 1000+ concurrent users
- Handle 10,000+ API requests per minute
- Process 1,000+ image uploads per hour

#### Scalability
- Horizontal scaling via load balancers
- Database read replicas for improved performance
- CDN for image delivery
- Redis cluster for session management

## Frontend Requirements

### Mobile App (React Native)

#### Technical Stack
- **React Native**: 0.72+
- **Navigation**: React Navigation 6
- **State Management**: Zustand or Redux Toolkit
- **Networking**: Axios with interceptors
- **Storage**: React Native AsyncStorage
- **Image Handling**: React Native Image Picker
- **Icons**: React Native Vector Icons

#### Platform Requirements
- **iOS**: iOS 13.0+, Xcode 15+
- **Android**: API Level 23+ (Android 6.0+)
- **Device Support**: Phone and tablet layouts

#### Key Features
```typescript
// Share extension integration
interface ShareExtensionProps {
  url: string;
  image?: string;
  title?: string;
}

// Offline storage capability
interface OfflineItem {
  id: string;
  boardId: string;
  imageBase64: string;
  sourceUrl: string;
  title?: string;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
}
```

### Browser Extensions

#### Technical Stack
- **Framework**: Vanilla JavaScript/TypeScript
- **Build Tool**: Webpack 5
- **API**: WebExtensions API (Chrome/Firefox compatible)
- **Storage**: chrome.storage.sync
- **UI Framework**: Lightweight custom components

#### Manifest V3 Requirements
```json
{
  "manifest_version": 3,
  "permissions": [
    "contextMenus",
    "activeTab",
    "storage",
    "identity"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "action": {
    "default_popup": "popup.html"
  },
  "background": {
    "service_worker": "background.js"
  }
}
```

### Web Dashboard (React)

#### Technical Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite or Create React App
- **Routing**: React Router 6
- **State Management**: Zustand or Context API
- **UI Framework**: Tailwind CSS or Material-UI
- **Image Handling**: React Image with lazy loading

#### Responsive Design
- **Breakpoints**:
  - Mobile: <768px
  - Tablet: 768px-1024px
  - Desktop: >1024px
- **Grid System**: CSS Grid for board layouts
- **Touch Support**: Touch-friendly interface for tablets

## Infrastructure Requirements

### Development Environment
- **Version Control**: Git with conventional commits
- **CI/CD**: GitHub Actions or GitLab CI
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- **Testing**: Jest, React Testing Library, Cypress
- **Documentation**: TypeScript JSDoc, OpenAPI specs

### Production Infrastructure

#### Hosting & Deployment
- **API**: AWS EC2/ECS or Heroku
- **Database**: AWS RDS PostgreSQL with Multi-AZ
- **Cache**: AWS ElastiCache Redis
- **Storage**: AWS S3 with CloudFront CDN
- **Web App**: Vercel, Netlify, or AWS S3/CloudFront

#### Monitoring & Logging
- **Application Monitoring**: New Relic or DataDog
- **Error Tracking**: Sentry
- **Logging**: Winston (Node.js) + CloudWatch
- **Uptime Monitoring**: UptimeRobot or Pingdom
- **Performance**: Google PageSpeed, Core Web Vitals

#### Security Requirements
- **HTTPS**: SSL/TLS certificates for all endpoints
- **Authentication**: JWT with refresh tokens
- **Rate Limiting**: Express-rate-limit or similar
- **Input Validation**: Joi or Yup schemas
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CORS**: Properly configured CORS policies

### Backup & Recovery
- **Database**: Daily automated backups with point-in-time recovery
- **Images**: S3 cross-region replication
- **Code**: Git repositories with multiple remotes
- **Configuration**: Infrastructure as Code (Terraform/CDK)

## Third-Party Services

### Required Services
- **Authentication**: Firebase Auth or Auth0
- **Cloud Storage**: AWS S3
- **Database**: AWS RDS PostgreSQL
- **CDN**: AWS CloudFront
- **Email**: SendGrid or AWS SES
- **Push Notifications**: Firebase Cloud Messaging

### Optional Services
- **Analytics**: Google Analytics or Mixpanel
- **Crash Reporting**: Crashlytics (mobile)
- **Customer Support**: Intercom or Zendesk
- **Payment Processing**: Stripe (for premium features)

## Development Tools & Setup

### Required Software
- Node.js 18+ with npm/yarn
- PostgreSQL 15+ for local development
- Redis for local caching
- Git for version control
- Docker & Docker Compose for containerization

### IDE & Extensions
- VS Code with recommended extensions:
  - TypeScript and JavaScript Language Features
  - Prettier Code Formatter
  - ESLint
  - REST Client
  - PostgreSQL Explorer

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/clipboards
REDIS_URL=redis://localhost:6379

# AWS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=clipboards-images

# Authentication
JWT_SECRET=your_jwt_secret
FIREBASE_CONFIG=your_firebase_config

# External Services
SENDGRID_API_KEY=your_sendgrid_key
```

## Performance & Scalability Targets

### Initial Targets (MVP)
- Support 1,000 concurrent users
- 99.9% uptime
- <2s image save time
- <5s cross-platform sync

### Growth Targets (12 months)
- Support 10,000+ concurrent users
- 99.95% uptime
- <1s image save time
- <3s cross-platform sync
- Global CDN with <200ms image load times

### Monitoring Metrics
- API response times (p50, p95, p99)
- Error rates by endpoint
- User session duration
- Image processing times
- Database query performance
- Mobile app crash rates
- Extension installation/usage rates