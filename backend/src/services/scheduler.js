const cron = require('node-cron');
const axios = require('axios');
const Event = require('../models/Event');

class EventScheduler {
  constructor() {
    this.jobs = new Map();
    this.checkInterval = null;
  }

  start() {
    console.log('Starting event scheduler...');
    // Check for events to execute every minute
    this.checkInterval = cron.schedule('* * * * *', async () => {
      await this.checkAndExecuteEvents();
    });
    console.log('Event scheduler started');
  }

  stop() {
    if (this.checkInterval) {
      this.checkInterval.stop();
      console.log('Event scheduler stopped');
    }
  }

  async checkAndExecuteEvents() {
    try {
      const events = await Event.getUpcoming();
      const now = new Date();

      for (const event of events) {
        const startTime = new Date(event.start_time);
        const endTime = new Date(event.end_time);

        // Check if event should start
        if (event.status === 'scheduled' && now >= startTime) {
          await this.executeCommand(event, 'start');
          await Event.updateStatus(event.id, 'in_progress');
        }

        // Check if event should end
        if (event.status === 'in_progress' && now >= endTime) {
          await this.executeCommand(event, 'end');
          await Event.updateStatus(event.id, 'completed');
        }
      }
    } catch (error) {
      console.error('Error checking events:', error);
    }
  }

  async executeCommand(event, type) {
    const command = type === 'start' ? event.start_command : event.end_command;
    
    if (!command) {
      console.log(`No ${type} command for event ${event.id}`);
      return;
    }

    try {
      const url = `http://${event.target_ip}:${event.target_port}`;
      console.log(`Executing ${type} command for event "${event.title}" (ID: ${event.id})`);
      console.log(`Target: ${url}`);
      console.log(`Command: ${command}`);

      // Parse command as JSON and send as POST request
      let payload;
      try {
        payload = JSON.parse(command);
      } catch (e) {
        payload = { command: command };
      }

      const response = await axios.post(url, payload, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`Command executed successfully. Status: ${response.status}`);
    } catch (error) {
      console.error(`Error executing ${type} command for event ${event.id}:`, error.message);
      // Don't throw error - we still want to update the event status
    }
  }
}

module.exports = new EventScheduler();
