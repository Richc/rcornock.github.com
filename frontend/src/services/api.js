import axios from 'axios';

const API_URL = '/api/events';

export const eventService = {
  // Get all events
  getAllEvents: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Get single event
  getEvent: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Create event
  createEvent: async (eventData) => {
    const response = await axios.post(API_URL, eventData);
    return response.data;
  },

  // Update event
  updateEvent: async (id, eventData) => {
    const response = await axios.put(`${API_URL}/${id}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  // Get upcoming events
  getUpcomingEvents: async () => {
    const response = await axios.get(`${API_URL}/status/upcoming`);
    return response.data;
  },
};
