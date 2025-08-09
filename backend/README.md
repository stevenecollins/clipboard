# Clipboards Backend

REST API server for the Clipboards application built with Express.js, TypeScript, and Prisma ORM.

## Features

- **Express.js** with TypeScript for type safety
- **Prisma ORM** with PostgreSQL database
- **JWT Authentication** with bcrypt password hashing
- **Input Validation** using Joi
- **Security Middleware** (Helmet, CORS, Rate Limiting)
- **Docker Support** for local development
- **Comprehensive Error Handling**
- **Request Logging** and Health Checks

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm or yarn

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

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

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
- `email` - User email (unique)
- `passwordHash` - Hashed password
- `name` - User display name
- `avatarUrl` - Profile picture URL
- `authProvider` - Authentication provider (email, google, apple)
- `emailVerified` - Email verification status

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

## Environment Variables

See `.env.example` for all available environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `AWS_*` - AWS S3 configuration for image storage
- `SENDGRID_API_KEY` - Email service configuration
- `GOOGLE_*` / `APPLE_*` - OAuth provider configuration

## Docker Development

The included `docker-compose.yml` provides:
- **PostgreSQL 15** database
- **Redis 7** for caching
- **pgAdmin 4** for database management (optional)

### Start Services
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f postgres
```

### Access pgAdmin
Navigate to `http://localhost:5050` with:
- Email: `admin@clipboards.app`
- Password: `admin123`

## Security Features

- Helmet.js security headers
- CORS configuration
- Rate limiting (100 requests/15 minutes)
- JWT token authentication
- Password hashing with bcrypt
- Input validation with Joi
- SQL injection protection via Prisma

## Error Handling

The API uses consistent error response format:
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

# Generate coverage report
npm run test:coverage
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables
3. Run database migrations:
```bash
npm run db:migrate
```

4. Start the server:
```bash
npm start
```

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

## License

Private - All Rights Reserved