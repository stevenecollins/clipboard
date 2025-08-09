# Clipboards Database Schema

This directory contains the Prisma schema and migrations for the Clipboards application.

## Database Models

### User
Stores user account information and authentication details.

**Fields:**
- `id` - Unique identifier (cuid)
- `firebaseUid` - Firebase Auth UID (optional, unique)
- `email` - User email address (unique)
- `name` - User display name
- `passwordHash` - Hashed password (nullable for social auth)
- `avatarUrl` - Profile picture URL
- `authProvider` - Authentication provider (email, google, apple, firebase)
- `authProviderId` - Provider-specific ID
- `emailVerified` - Email verification status
- `disabled` - Account suspension status
- `lastSignIn` - Last sign-in timestamp
- `createdAt` - Account creation date
- `updatedAt` - Last profile update

**Relationships:**
- Has many `Board`s
- Has many `UserSession`s

**Indexes:**
- `email` - For fast login lookups
- `firebaseUid` - For Firebase authentication
- `createdAt` - For user analytics

### Board
Represents a collection/board that contains items.

**Fields:**
- `id` - Unique identifier (cuid)
- `userId` - Owner reference
- `name` - Board name
- `description` - Optional board description
- `isPrivate` - Privacy setting (default: true)
- `color` - Hex color code for UI theming
- `position` - Display order for user's boards
- `createdAt` - Creation date
- `updatedAt` - Last modification date

**Relationships:**
- Belongs to one `User`
- Has many `Item`s

**Indexes:**
- `userId` - For fetching user's boards
- `createdAt` - For chronological ordering
- `userId, position` - For ordered board display
- `isPrivate` - For public board discovery

### Item
Represents a saved item (image + source URL) within a board.

**Fields:**
- `id` - Unique identifier (cuid)
- `boardId` - Parent board reference
- `title` - Optional item title
- `description` - Optional item description
- `imageUrl` - URL to saved image (S3, CDN, etc.)
- `sourceUrl` - Original source URL
- `imageWidth` - Image width in pixels
- `imageHeight` - Image height in pixels
- `imageSize` - File size in bytes
- `imageFormat` - Image format (jpg, png, webp, etc.)
- `position` - Display order within board
- `createdAt` - Save date
- `updatedAt` - Last modification date

**Relationships:**
- Belongs to one `Board`

**Indexes:**
- `boardId` - For fetching board items
- `createdAt` - For chronological ordering
- `boardId, position` - For ordered item display
- `sourceUrl` - For duplicate detection

### UserSession
Tracks user sessions across different devices for sync purposes.

**Fields:**
- `id` - Unique identifier (cuid)
- `userId` - User reference
- `deviceType` - Device type (mobile, web, extension)
- `deviceId` - Unique device identifier
- `lastSync` - Last synchronization timestamp
- `createdAt` - Session creation date

**Relationships:**
- Belongs to one `User`

**Indexes:**
- `userId` - For fetching user sessions
- `lastSync` - For sync status tracking

## Database Relationships

```
User (1) ──── (many) Board (1) ──── (many) Item
 │
 └── (many) UserSession
```

**Cascade Deletes:**
- Deleting a User deletes all their Boards, Items, and UserSessions
- Deleting a Board deletes all its Items

## Running Migrations

### Development Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Create and run migration (production)
npm run db:migrate

# View database in browser
npm run db:studio
```

### Production Deployment
```bash
# Run pending migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## Seeding Database

The seed file creates demo data for development:

```bash
npm run db:seed
```

**Demo Data Includes:**
- Demo user (demo@clipboards.app / demo123)
- Sample boards (Inspiration, Shopping, Travel Ideas)
- Sample items with Unsplash images
- User session example

## Schema Design Decisions

### Privacy First
- `isPrivate` defaults to `true` for all boards
- Users have full control over board privacy
- No social features enabled by default

### Performance Optimized
- Strategic indexes for common query patterns
- Composite indexes for ordering operations
- Source URL indexing for duplicate detection

### Flexible Authentication
- Supports both Firebase and traditional auth
- Social login provider tracking
- Account suspension capabilities

### Cross-Platform Sync
- User sessions track device synchronization
- Position fields enable consistent ordering
- Timestamps support conflict resolution

### Image Metadata
- Image dimensions for responsive display
- File size tracking for quota management
- Format detection for optimization

## Common Queries

### Get User's Boards
```typescript
const boards = await prisma.board.findMany({
  where: { userId },
  orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
  include: { _count: { select: { items: true } } }
});
```

### Get Board with Items
```typescript
const board = await prisma.board.findUnique({
  where: { id: boardId },
  include: {
    items: {
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }]
    }
  }
});
```

### Search Items by Source
```typescript
const items = await prisma.item.findMany({
  where: {
    sourceUrl: { contains: searchTerm },
    board: { userId }
  },
  include: { board: true }
});
```

## Backup Strategy

### Regular Backups
- Automated daily backups via pg_dump
- Point-in-time recovery enabled
- Cross-region backup replication

### Data Export
- User data export via API endpoints
- GDPR compliance data portability
- JSON format for easy migration

## Environment Variables

Required for database connection:
```bash
DATABASE_URL="postgresql://user:password@host:5432/database"
```

For development with Docker:
```bash
DATABASE_URL="postgresql://clipboards:password@localhost:5432/clipboards"
```