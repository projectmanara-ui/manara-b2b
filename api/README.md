# Manara API Backend

A comprehensive REST API backend for the Manara employee transportation platform, built with Node.js, Express, and PostgreSQL.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Trip Management**: Book, track, and manage employee transportation
- **Wallet System**: Monthly allowances and transaction tracking
- **Location Services**: Pickup points and office locations with geospatial queries
- **Emergency System**: SOS alerts with real-time notifications
- **Real-time Updates**: Socket.IO for live trip tracking and notifications
- **Multi-organization Support**: Separate data and settings per organization

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Knex.js ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Real-time**: Socket.IO for WebSocket connections
- **Validation**: Joi for request validation
- **Logging**: Winston for structured logging
- **Security**: Helmet, CORS, rate limiting

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Redis (optional, for session storage)

### Installation

1. **Clone and setup**:
```bash
cd api
npm install
```

2. **Environment setup**:
```bash
cp .env.example .env
# Edit .env with your database and other configurations
```

3. **Database setup**:
```bash
# Create PostgreSQL database
createdb manara_db

# Run migrations and seeds
npm run migrate
npm run seed
```

4. **Start development server**:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Core Endpoints

#### Authentication
- `POST /auth/register` - Register new employee
- `POST /auth/login` - Employee login
- `GET /auth/me` - Get current user profile
- `POST /auth/refresh` - Refresh JWT token

#### Trips
- `GET /trips` - Get user's trips (with filters)
- `POST /trips` - Book a new trip
- `GET /trips/:id` - Get specific trip details
- `PATCH /trips/:id/cancel` - Cancel a trip

#### Wallet
- `GET /wallets` - Get user's wallet balance
- `GET /wallets/transactions` - Get transaction history
- `GET /wallets/summary` - Get wallet statistics

#### Locations
- `GET /locations/pickup-points` - Get available pickup locations
- `GET /locations/offices` - Get organization office locations
- `GET /locations/search` - Search locations by name/address

#### Emergency
- `POST /emergency` - Send emergency alert
- `GET /emergency` - Get user's emergency alerts
- `PATCH /emergency/:id/cancel` - Cancel emergency alert

#### Organizations
- `GET /organizations` - Get all organizations (public)
- `GET /organizations/:id` - Get organization details

### Request/Response Examples

#### Register Employee
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@safaricom.co.ke",
  "password": "securepassword",
  "phone": "+254712345678",
  "organization_id": "550e8400-e29b-41d4-a716-446655440001",
  "employee_id": "SAF001234",
  "emergency_contact": {
    "name": "Jane Doe",
    "phone": "+254723456789",
    "relationship": "Spouse"
  }
}
```

#### Book Trip
```bash
POST /api/v1/trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "pickup_location_id": "660e8400-e29b-41d4-a716-446655440001",
  "drop_location_id": "660e8400-e29b-41d4-a716-446655440005",
  "scheduled_time": "2024-01-20T06:30:00Z",
  "trip_type": "to_work",
  "notes": "Please wait at the main entrance"
}
```

#### Emergency Alert
```bash
POST /api/v1/emergency
Authorization: Bearer <token>
Content-Type: application/json

{
  "location": {
    "latitude": -1.2921,
    "longitude": 36.8219
  },
  "message": "Need immediate assistance",
  "type": "security"
}
```

## Real-time Features (Socket.IO)

Connect to Socket.IO endpoint with JWT authentication:

```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your_jwt_token'
  }
});

// Subscribe to trip tracking
socket.emit('subscribe_trip_tracking', 'trip_id');

// Listen for trip updates
socket.on('trip_update', (data) => {
  console.log('Trip update:', data);
});

// Send emergency alert
socket.emit('emergency_alert', {
  latitude: -1.2921,
  longitude: 36.8219,
  message: 'Emergency assistance needed',
  type: 'medical'
});
```

## Database Schema

### Key Tables

- **organizations**: Company/organization details
- **users**: Employee accounts and profiles
- **locations**: Pickup points and office locations
- **trips**: Transportation bookings and tracking
- **wallets**: Employee transport allowances
- **transactions**: Wallet transaction history
- **emergency_alerts**: SOS alerts and responses
- **notifications**: In-app notifications

### Sample Data

The seed files include realistic Kenyan organizations:
- Safaricom PLC (KES 8,000 monthly allowance)
- Equity Bank Kenya (KES 6,500 monthly allowance)
- Kenya Airways (KES 7,500 monthly allowance)
- Nairobi Hospital (KES 5,000 monthly allowance)

Pickup locations around Nairobi:
- Westlands Square
- CBD Bus Station
- Eastlands Terminal
- Karen Shopping Centre

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Joi schemas for all endpoints
- **SQL Injection Protection**: Parameterized queries via Knex
- **CORS Configuration**: Controlled cross-origin access
- **Helmet**: Security headers

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": "Detailed validation errors (if applicable)"
}
```

HTTP status codes follow REST conventions:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Logging

Winston logger with different levels:
- **Error**: System errors and emergency alerts
- **Warn**: Important warnings
- **Info**: General application flow
- **Debug**: Detailed debugging information

Logs are written to:
- `logs/error.log` - Error level and above
- `logs/combined.log` - All log levels
- Console output in development

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Deployment

### Environment Variables

Key production environment variables:
```bash
NODE_ENV=production
DB_HOST=your_production_db_host
DB_PASSWORD=secure_db_password
JWT_SECRET=very_secure_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Production Setup

1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations: `npm run migrate`
4. Start with PM2: `pm2 start src/server.js --name manara-api`

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

## Support

For technical support or questions about the API, please contact the development team.