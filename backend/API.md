# Calendar API Documentation

## Base URL
```
http://localhost:3001
```

## Endpoints

### Health Check
**GET** `/health`

Returns the health status of the API.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### Get All Events
**GET** `/api/events`

Returns all events sorted by start time.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Meeting",
    "description": "Team sync",
    "start_time": "2024-01-01T10:00:00.000Z",
    "end_time": "2024-01-01T11:00:00.000Z",
    "start_command": "{\"action\":\"start\",\"room\":\"A\"}",
    "end_command": "{\"action\":\"end\",\"room\":\"A\"}",
    "target_ip": "192.168.1.100",
    "target_port": 8080,
    "status": "scheduled",
    "created_at": "2024-01-01T09:00:00.000Z",
    "modified_at": "2024-01-01T09:00:00.000Z"
  }
]
```

---

### Get Single Event
**GET** `/api/events/:id`

Returns a specific event by ID.

**Response:**
```json
{
  "id": 1,
  "title": "Meeting",
  "description": "Team sync",
  "start_time": "2024-01-01T10:00:00.000Z",
  "end_time": "2024-01-01T11:00:00.000Z",
  "start_command": "{\"action\":\"start\",\"room\":\"A\"}",
  "end_command": "{\"action\":\"end\",\"room\":\"A\"}",
  "target_ip": "192.168.1.100",
  "target_port": 8080,
  "status": "scheduled",
  "created_at": "2024-01-01T09:00:00.000Z",
  "modified_at": "2024-01-01T09:00:00.000Z"
}
```

---

### Create Event
**POST** `/api/events`

Creates a new event.

**Request Body:**
```json
{
  "title": "Meeting",
  "description": "Team sync",
  "start_time": "2024-01-01T10:00:00.000Z",
  "end_time": "2024-01-01T11:00:00.000Z",
  "start_command": "{\"action\":\"start\",\"room\":\"A\"}",
  "end_command": "{\"action\":\"end\",\"room\":\"A\"}",
  "target_ip": "192.168.1.100",
  "target_port": 8080
}
```

**Required Fields:**
- `title` (string)
- `start_time` (ISO 8601 datetime string)
- `end_time` (ISO 8601 datetime string)
- `target_ip` (string)
- `target_port` (integer)

**Optional Fields:**
- `description` (string)
- `start_command` (string, JSON format recommended)
- `end_command` (string, JSON format recommended)

**Response:** Returns the created event with ID and timestamps.

---

### Update Event
**PUT** `/api/events/:id`

Updates an existing event.

**Request Body:** Same as Create Event, all fields optional.

**Response:** Returns the updated event.

---

### Delete Event
**DELETE** `/api/events/:id`

Deletes an event.

**Response:**
```json
{
  "message": "Event deleted successfully"
}
```

---

### Get Upcoming Events
**GET** `/api/events/status/upcoming`

Returns all events that haven't completed yet.

**Response:** Array of events (same format as Get All Events).

---

## Event Status Values

- `scheduled` - Event is scheduled but hasn't started yet
- `in_progress` - Event has started but hasn't ended yet
- `completed` - Event has finished

The scheduler automatically updates event status as events start and end.

---

## Command Execution

When an event reaches its start or end time, the scheduler will:

1. Send an HTTP POST request to `http://{target_ip}:{target_port}`
2. The request body will contain the parsed JSON from `start_command` or `end_command`
3. If the command is not valid JSON, it will be wrapped as `{"command": "<command_string>"}`

**Example:**
If `start_command` is `{"action":"power_on","device":"projector"}`, the scheduler will POST this JSON to the target endpoint.

---

## Error Responses

All endpoints return standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message here"
}
```
