# Calendar API Backend

Backend API for the calendaring app with event scheduling and command triggering.

## Features

- RESTful API for event CRUD operations
- SQLite database for persistent storage
- Automatic event scheduler that executes HTTP commands at start/end times
- Background service support via macOS LaunchAgent
- Event status tracking (scheduled, in_progress, completed)

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Install dependencies:
```bash
npm install
```

2. Initialize the database:
```bash
npm run init-db
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3001 (or the PORT environment variable if set).

## API Documentation

See [API.md](./API.md) for complete API documentation.

## macOS LaunchAgent Setup

To run the API as a background service on macOS:

1. Edit the `com.calendar.api.plist` file and update the paths:
   - Replace `/path/to/your/backend` with the actual path to this backend directory
   - Verify the Node.js path (check with `which node`)

2. Copy the plist file to LaunchAgents directory:
```bash
cp com.calendar.api.plist ~/Library/LaunchAgents/
```

3. Load the service:
```bash
launchctl load ~/Library/LaunchAgents/com.calendar.api.plist
```

4. Start the service:
```bash
launchctl start com.calendar.api
```

### Managing the Service

- **Check status:**
```bash
launchctl list | grep calendar
```

- **Stop the service:**
```bash
launchctl stop com.calendar.api
```

- **Unload the service:**
```bash
launchctl unload ~/Library/LaunchAgents/com.calendar.api.plist
```

- **View logs:**
```bash
tail -f /tmp/calendar-api.log
tail -f /tmp/calendar-api-error.log
```

## Event Scheduler

The scheduler runs every minute and checks for:
- Events that should start (status: scheduled, current time >= start_time)
- Events that should end (status: in_progress, current time >= end_time)

When an event starts or ends, the scheduler:
1. Sends an HTTP POST request to `http://{target_ip}:{target_port}`
2. Includes the command payload as JSON in the request body
3. Updates the event status accordingly

## Database Schema

```sql
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  start_command TEXT,
  end_command TEXT,
  target_ip TEXT NOT NULL,
  target_port INTEGER NOT NULL,
  status TEXT DEFAULT 'scheduled',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  modified_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

## Project Structure

```
backend/
├── src/
│   ├── server.js           # Main server file
│   ├── database.js         # Database connection and queries
│   ├── models/
│   │   └── Event.js        # Event model
│   ├── routes/
│   │   └── events.js       # Event API routes
│   ├── services/
│   │   └── scheduler.js    # Event scheduler service
│   └── scripts/
│       └── initDatabase.js # Database initialization script
├── package.json
├── API.md                  # API documentation
├── com.calendar.api.plist  # macOS LaunchAgent configuration
└── README.md
```

## Environment Variables

- `PORT` - Server port (default: 3001)

## Development

The server includes:
- CORS enabled for frontend integration
- Request logging
- Graceful shutdown handling
- Error handling middleware

## License

MIT
