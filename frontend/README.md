# Calendar App Frontend

React-based frontend for the calendaring app with event scheduling and command triggering.

## Features

- Modern React UI built with Vite
- Calendar view for managing events
- Event creation and editing form
- Real-time event status display (scheduled, in_progress, completed)
- Configure start/end commands and target IP addresses
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm
- Backend API server running (see ../backend/README.md)

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The app will start on http://localhost:3000 with hot reload enabled.

### Production Build
```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Calendar.jsx      # Main calendar component
│   │   └── Calendar.css      # Calendar styles
│   ├── services/
│   │   └── api.js            # API service layer
│   ├── App.jsx               # Root component
│   ├── App.css               # Global styles
│   └── main.jsx              # Application entry point
├── public/                   # Static assets
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── package.json
└── README.md
```

## API Integration

The frontend connects to the backend API via a proxy configured in `vite.config.js`. All requests to `/api` are forwarded to `http://localhost:3001`.

Make sure the backend server is running before starting the frontend.

## Usage

### Creating an Event

1. Click the "+ New Event" button
2. Fill in the event details:
   - **Title** (required): Event name
   - **Description** (optional): Event details
   - **Start Time** (required): When the event starts
   - **End Time** (required): When the event ends
   - **Start Command** (optional): JSON payload to send when event starts
   - **End Command** (optional): JSON payload to send when event ends
   - **Target IP** (required): IP address to send commands to
   - **Target Port** (required): Port number for the target service
3. Click "Save Event"

### Editing an Event

1. Click the "Edit" button on an event card
2. Modify the desired fields
3. Click "Save Event"

### Deleting an Event

1. Click the "Delete" button on an event card
2. Confirm the deletion

### Event Status

Events have three status values:
- **Scheduled** (blue): Event is scheduled but hasn't started yet
- **In Progress** (green): Event has started but hasn't ended yet
- **Completed** (gray): Event has finished

The status is automatically updated by the backend scheduler.

## Command Format

Commands should be in JSON format for proper execution. Examples:

```json
{"action": "power_on", "device": "projector"}
```

```json
{"command": "start_recording", "room": "A", "quality": "high"}
```

If the command is not valid JSON, the backend will wrap it as:
```json
{"command": "your_command_here"}
```

## Development

The frontend uses:
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API requests

## Styling

The app uses vanilla CSS with a modern, clean design. The styles are component-scoped and responsive.

## License

MIT
