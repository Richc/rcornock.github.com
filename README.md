# Calendar App - Proof of Concept

A full-stack calendaring application with event scheduling and automated command triggering. The system executes HTTP commands at event start and end times, making it ideal for automation scenarios like controlling IoT devices, triggering workflows, or managing scheduled tasks.

## Features

### Backend (Node.js/Express)
- RESTful API for event management (CRUD operations)
- SQLite database for persistent event storage
- Automated event scheduler using cron
- Executes HTTP POST requests at event start/end times
- Background service support via macOS LaunchAgent
- Real-time event status tracking

### Frontend (React)
- Modern, responsive calendar UI
- Event creation and editing forms
- Visual event status indicators (scheduled, in_progress, completed)
- Configuration for HTTP commands and target endpoints
- Real-time updates

### Event Model
- Event ID, title, description
- Start and end times
- Customizable start/end command payloads (JSON)
- Target IP address and port configuration
- Automatic status management
- Creation and modification timestamps

## Architecture

```
┌─────────────────┐
│  React Frontend │ ← User interacts with calendar UI
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Express API    │ ← Manages events, provides REST endpoints
│   (Port 3001)   │
└────────┬────────┘
         │
         ├──────────┐
         ▼          ▼
┌──────────────┐  ┌──────────────┐
│   SQLite DB  │  │  Scheduler   │ ← Monitors events
│              │  │  (Cron)      │ ← Executes commands
└──────────────┘  └──────┬───────┘
                         │ HTTP POST
                         ▼
                  ┌──────────────┐
                  │ Target Device│ ← IoT device, service, etc.
                  │  (Configurable│
                  │    IP:Port)  │
                  └──────────────┘
```

## Prerequisites

- Node.js v14 or higher
- npm
- macOS (for LaunchAgent background service)

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm run init-db
npm start
```

The API server will start on http://localhost:3001

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The web app will start on http://localhost:3000

### 3. Access the Application

Open your browser to http://localhost:3000 and start creating events!

## Project Structure

```
.
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── server.js          # Main server file
│   │   ├── database.js        # SQLite database connection
│   │   ├── models/
│   │   │   └── Event.js       # Event data model
│   │   ├── routes/
│   │   │   └── events.js      # Event API endpoints
│   │   ├── services/
│   │   │   └── scheduler.js   # Event scheduler service
│   │   └── scripts/
│   │       └── initDatabase.js # DB initialization
│   ├── package.json
│   ├── API.md                 # API documentation
│   ├── com.calendar.api.plist # macOS LaunchAgent config
│   └── README.md
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Calendar.jsx   # Main calendar component
│   │   │   └── Calendar.css   # Styles
│   │   ├── services/
│   │   │   └── api.js         # API client
│   │   ├── App.jsx            # Root component
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   ├── vite.config.js         # Vite configuration
│   └── README.md
│
└── README.md                   # This file
```

## Usage Example

### Creating an Event

1. Open the web app
2. Click "+ New Event"
3. Fill in the details:
   - Title: "Turn on lights"
   - Start Time: 2024-01-15 08:00
   - End Time: 2024-01-15 18:00
   - Start Command: `{"action":"on","room":"office"}`
   - End Command: `{"action":"off","room":"office"}`
   - Target IP: 192.168.1.100
   - Target Port: 8080
4. Save

When 8:00 AM arrives, the scheduler will POST the start command to http://192.168.1.100:8080.
When 6:00 PM arrives, it will POST the end command to the same endpoint.

## macOS Background Service

To run the backend as a persistent background service on macOS:

1. Edit `backend/com.calendar.api.plist` and update the paths
2. Copy to LaunchAgents:
   ```bash
   cp backend/com.calendar.api.plist ~/Library/LaunchAgents/
   ```
3. Load and start:
   ```bash
   launchctl load ~/Library/LaunchAgents/com.calendar.api.plist
   launchctl start com.calendar.api
   ```

See `backend/README.md` for detailed instructions.

## API Documentation

Full API documentation is available in `backend/API.md`.

Key endpoints:
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/status/upcoming` - Get upcoming events

## Event Scheduler

The scheduler runs every minute and:
1. Checks for events that should start (current time >= start_time, status = scheduled)
2. Checks for events that should end (current time >= end_time, status = in_progress)
3. Executes the appropriate HTTP command
4. Updates the event status

Commands are sent as HTTP POST requests with JSON payloads to the configured target endpoint.

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Uses Vite with HMR
```

## Testing

To test command execution without actual target devices:

1. Start a simple HTTP server to receive commands:
   ```bash
   # In a new terminal
   python3 -c "from http.server import HTTPServer, BaseHTTPRequestHandler; \
   import json; \
   class Handler(BaseHTTPRequestHandler): \
     def do_POST(self): \
       content_length = int(self.headers['Content-Length']); \
       body = self.rfile.read(content_length); \
       print('Received:', body.decode()); \
       self.send_response(200); \
       self.end_headers(); \
   HTTPServer(('', 8080), Handler).serve_forever()"
   ```

2. Create events with target IP: `127.0.0.1` and port: `8080`
3. Watch the server receive commands when events start/end

## Use Cases

- **Smart Home Automation**: Turn lights on/off at scheduled times
- **Meeting Room Management**: Control AV equipment based on calendar events
- **IoT Device Control**: Schedule device operations
- **Workflow Automation**: Trigger CI/CD pipelines or scripts
- **Data Collection**: Start/stop logging or monitoring at specific times

## Technologies Used

- **Backend**: Node.js, Express, SQLite, node-cron, axios
- **Frontend**: React 18, Vite, axios
- **Database**: SQLite3
- **Scheduling**: node-cron

## License

MIT

## Future Enhancements

Potential features for future versions:
- User authentication and multi-user support
- Recurring events
- Event templates
- Webhook notifications
- Calendar import/export (iCal)
- Web-based log viewer
- Command retry logic
- Multiple command targets per event
- Event dependencies and chains
