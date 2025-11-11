import React, { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import './Calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    start_command: '',
    end_command: '',
    target_ip: '127.0.0.1',
    target_port: '8080',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const eventData = {
        ...formData,
        target_port: parseInt(formData.target_port)
      };

      if (selectedEvent) {
        await eventService.updateEvent(selectedEvent.id, eventData);
      } else {
        await eventService.createEvent(eventData);
      }

      await loadEvents();
      handleCancelForm();
    } catch (err) {
      setError('Failed to save event: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      start_time: formatDateTimeForInput(event.start_time),
      end_time: formatDateTimeForInput(event.end_time),
      start_command: event.start_command || '',
      end_command: event.end_command || '',
      target_ip: event.target_ip,
      target_port: event.target_port.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await eventService.deleteEvent(id);
      await loadEvents();
    } catch (err) {
      setError('Failed to delete event: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      start_command: '',
      end_command: '',
      target_ip: '127.0.0.1',
      target_port: '8080',
    });
  };

  const handleNewEvent = () => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      start_command: '',
      end_command: '',
      target_ip: '127.0.0.1',
      target_port: '8080',
    });
    setShowForm(true);
  };

  const formatDateTimeForInput = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#007bff';
      case 'in_progress': return '#28a745';
      case 'completed': return '#6c757d';
      default: return '#000';
    }
  };

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <h1>Calendar App</h1>
        <button onClick={handleNewEvent} className="btn btn-primary">
          + New Event
        </button>
      </header>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={handleCancelForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEvent ? 'Edit Event' : 'New Event'}</h2>
              <button onClick={handleCancelForm} className="close-btn">×</button>
            </div>
            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Event title"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Event description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time *</label>
                  <input
                    type="datetime-local"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Time *</label>
                  <input
                    type="datetime-local"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Start Command (JSON)</label>
                <textarea
                  name="start_command"
                  value={formData.start_command}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder='{"action": "start", "device": "projector"}'
                />
              </div>

              <div className="form-group">
                <label>End Command (JSON)</label>
                <textarea
                  name="end_command"
                  value={formData.end_command}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder='{"action": "end", "device": "projector"}'
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Target IP *</label>
                  <input
                    type="text"
                    name="target_ip"
                    value={formData.target_ip}
                    onChange={handleInputChange}
                    required
                    placeholder="192.168.1.100"
                  />
                </div>

                <div className="form-group">
                  <label>Target Port *</label>
                  <input
                    type="number"
                    name="target_port"
                    value={formData.target_port}
                    onChange={handleInputChange}
                    required
                    placeholder="8080"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancelForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="events-container">
        {loading && events.length === 0 ? (
          <div className="loading">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <p>No events yet. Create your first event!</p>
          </div>
        ) : (
          <div className="events-list">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <span 
                    className="event-status" 
                    style={{ backgroundColor: getStatusColor(event.status) }}
                  >
                    {event.status}
                  </span>
                </div>

                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}

                <div className="event-details">
                  <div className="detail-row">
                    <strong>Start:</strong> {formatDateTime(event.start_time)}
                  </div>
                  <div className="detail-row">
                    <strong>End:</strong> {formatDateTime(event.end_time)}
                  </div>
                  <div className="detail-row">
                    <strong>Target:</strong> {event.target_ip}:{event.target_port}
                  </div>
                </div>

                {(event.start_command || event.end_command) && (
                  <div className="event-commands">
                    {event.start_command && (
                      <div className="command-box">
                        <strong>Start Command:</strong>
                        <code>{event.start_command}</code>
                      </div>
                    )}
                    {event.end_command && (
                      <div className="command-box">
                        <strong>End Command:</strong>
                        <code>{event.end_command}</code>
                      </div>
                    )}
                  </div>
                )}

                <div className="event-actions">
                  <button 
                    onClick={() => handleEdit(event)} 
                    className="btn btn-small btn-secondary"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)} 
                    className="btn btn-small btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
