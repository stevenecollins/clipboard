# Clipboards Backend

REST API server for the Clipboards application built with Express.js, TypeScript, Prisma ORM, and Firebase Authentication.

## Features

- **Express.js** with TypeScript for type safety
- **Prisma ORM** with PostgreSQL database
- **Firebase Authentication** with fallback to JWT
- **Social Login** support (Google, Apple)
- **Input Validation** using Joi
- **Security Middleware** (Helmet, CORS, Rate Limiting)
- **Docker Support** for local development
- **Comprehensive Error Handling**
- **Request Logging** and Health Checks

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm or yarn
- Firebase project (optional, for Firebase Auth)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Database

```bash
npm run docker:up
```

### 4. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

The server will be available at `http://localhost:3001`

## Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

### Docker
- `npm run docker:up` - Start database containers
- `npm run docker:down` - Stop database containers

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## API Endpoints

### Health Check
- `GET /api/health` - Server and database health status

### Authentication (Legacy JWT)
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Firebase Authentication
- `POST /api/auth/firebase/signup` - Register with Firebase
- `POST /api/auth/firebase/signin` - Sign in with Firebase token
- `POST /api/auth/firebase/reset-password` - Request password reset
- `POST /api/auth/firebase/resend-verification` - Resend email verification
- `POST /api/auth/firebase/refresh-token` - Refresh Firebase token
- `DELETE /api/auth/firebase/delete-account` - Delete Firebase user

### Social Authentication
- `POST /api/auth/google` - Google OAuth sign in
- `POST /api/auth/apple` - Apple Sign In
- `POST /api/auth/social` - Generic social auth via Firebase

### Boards
- `GET /api/boards` - Get user's boards
- `POST /api/boards` - Create new board
- `GET /api/boards/:id` - Get specific board with items
- `PATCH /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Items
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get specific item
- `PATCH /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

## Database Schema

### Users
- `id` - Unique identifier
- `firebaseUid` - Firebase Auth UID (optional)
- `email` - User email (unique)
- `passwordHash` - Hashed password (nullable for social auth)
- `name` - User display name
- `avatarUrl` - Profile picture URL
- `authProvider` - Authentication provider (email, google, apple, firebase)
- `authProviderId` - Provider-specific ID
- `emailVerified` - Email verification status
- `disabled` - Account suspension status
- `lastSignIn` - Last sign-in timestamp

### Boards
- `id` - Unique identifier
- `userId` - Owner reference
- `name` - Board name
- `description` - Board description
- `color` - Hex color code
- `position` - Display order

### Items
- `id` - Unique identifier
- `boardId` - Board reference
- `title` - Item title
- `sourceUrl` - Original URL
- `imageUrl` - Image URL (S3)
- `imageWidth/Height` - Image dimensions
- `position` - Display order within board

## Authentication Methods

### 1. Firebase Authentication (Recommended)
Uses Firebase Auth for user management with social login support.

**Setup:**
1. Create Firebase project
2. Enable Authentication providers
3. Add service account credentials to `.env`

### 2. Social Login
Supports Google and Apple Sign In through Firebase or direct OAuth.

### 3. Legacy JWT (Fallback)
Traditional email/password with JWT tokens.

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret

### Firebase (Optional)
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Service account private key
- `FIREBASE_CLIENT_EMAIL` - Service account email
- `FIREBASE_WEB_API_KEY` - Firebase web API key

### AWS S3
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region
- `AWS_S3_BUCKET` - S3 bucket name

### External Services
- `SENDGRID_API_KEY` - Email service
- `GOOGLE_CLIENT_ID/SECRET` - Google OAuth
- `APPLE_CLIENT_ID/SECRET` - Apple Sign In

## Docker Development

The included `docker-compose.yml` provides:
- **PostgreSQL 15** database
- **Redis 7** for caching
- **pgAdmin 4** for database management

### Start Services
```bash
docker-compose up -d
```

### Access pgAdmin
Navigate to `http://localhost:5050` with:
- Email: `admin@clipboards.app`
- Password: `admin123`

## Authentication Flow

### Firebase Auth Flow
1. Client authenticates with Firebase
2. Client sends Firebase ID token to backend
3. Backend verifies token with Firebase Admin SDK
4. Backend creates/updates user in database
5. Returns user data to client

### Social Login Flow
1. Client initiates OAuth flow
2. Client receives access token/ID token
3. Client sends tokens to backend
4. Backend verifies with provider API
5. Backend creates/updates user record
6. Returns user data to client

## Security Features

- Firebase Admin SDK for secure token verification
- Helmet.js security headers
- CORS configuration
- Rate limiting (100 requests/15 minutes)
- Input validation with Joi
- SQL injection protection via Prisma
- Account suspension support
- Password hashing with bcrypt (legacy auth)

## Error Handling

Consistent error response format:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  },
  "timestamp": "2023-12-01T10:00:00Z",
  "path": "/api/endpoint",
  "method": "POST"
}
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Production Deployment

1. Set up Firebase project with Authentication
2. Configure environment variables
3. Build application: `npm run build`
4. Run database migrations: `npm run db:migrate`
5. Start server: `npm start`

## Contributing

1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

## License

Private - All Rights Reserved