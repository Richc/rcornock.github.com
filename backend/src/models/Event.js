const db = require('../database');

class Event {
  static async getAll() {
    return await db.all('SELECT * FROM events ORDER BY start_time ASC');
  }

  static async getById(id) {
    return await db.get('SELECT * FROM events WHERE id = ?', [id]);
  }

  static async create(eventData) {
    const {
      title,
      description,
      start_time,
      end_time,
      start_command,
      end_command,
      target_ip,
      target_port
    } = eventData;

    const result = await db.run(
      `INSERT INTO events (title, description, start_time, end_time, start_command, end_command, target_ip, target_port)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, start_time, end_time, start_command, end_command, target_ip, target_port]
    );

    return await this.getById(result.id);
  }

  static async update(id, eventData) {
    const {
      title,
      description,
      start_time,
      end_time,
      start_command,
      end_command,
      target_ip,
      target_port,
      status
    } = eventData;

    await db.run(
      `UPDATE events 
       SET title = ?, description = ?, start_time = ?, end_time = ?, 
           start_command = ?, end_command = ?, target_ip = ?, target_port = ?,
           status = ?, modified_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, description, start_time, end_time, start_command, end_command, target_ip, target_port, status, id]
    );

    return await this.getById(id);
  }

  static async delete(id) {
    const result = await db.run('DELETE FROM events WHERE id = ?', [id]);
    return result.changes > 0;
  }

  static async getUpcoming() {
    const now = new Date().toISOString();
    return await db.all(
      'SELECT * FROM events WHERE end_time > ? AND status != ? ORDER BY start_time ASC',
      [now, 'completed']
    );
  }

  static async updateStatus(id, status) {
    await db.run(
      'UPDATE events SET status = ?, modified_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );
    return await this.getById(id);
  }
}

module.exports = Event;
