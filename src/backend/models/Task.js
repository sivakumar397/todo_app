import db from '../config/db.js'

// Define the Task model
const Task = {
  create: async (taskData) => {
    const { user_id, task_name, description, priority, status, start_date, end_date } = taskData
    const query = `
      INSERT INTO tasks (user_id, task_name, description, priority, status, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `
    const values = [
      user_id,
      task_name,
      description,
      priority,
      status || 'OPEN',
      start_date,
      end_date,
    ]
    const result = await db.query(query, values)
    return result.rows[0]
  },

  // Fetch tasks by user_id
  getTasksByUserId: async (user_id) => {
    const query = `
      SELECT task_id, task_name, priority, status, start_date, end_date
      FROM tasks
      WHERE user_id = $1
    `
    const result = await db.query(query, [user_id])
    return result.rows
  },

  // Delete a task by task_id
  deleteTask: async (task_id) => {
    const query = `
      DELETE FROM tasks
      WHERE task_id = $1
      RETURNING *;
    `
    const result = await db.query(query, [task_id])
    return result.rowCount > 0 // Return true if a row was deleted
  },
}

export default Task
