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

  // Method to create tasks in bulk, including the user_id for each task
  createBulk: async (user_id, tasks) => {
    const query = `
      INSERT INTO tasks (user_id, task_name, description, priority, status, start_date, end_date)
      VALUES ${tasks
        .map(
          (_, index) =>
            `($${index * 7 + 1}, $${index * 7 + 2}, $${index * 7 + 3}, $${index * 7 + 4}, $${index * 7 + 5}, $${index * 7 + 6}, $${index * 7 + 7})`,
        )
        .join(', ')}
      RETURNING *;
    `
    // Flatten the task details along with the user_id
    const values = tasks.flatMap(
      ({ task_name, description, priority, status, start_date, end_date }) => [
        user_id, // Add user_id for each task
        task_name,
        description,
        priority,
        status || 'OPEN',
        start_date,
        end_date,
      ],
    )

    const result = await db.query(query, values)
    return result.rows
  },

  // Fetch tasks by user_id
  getTasksByUserId: async (user_id) => {
    const query = `
      SELECT task_id, task_name, description, priority, status, start_date, end_date
      FROM tasks
      WHERE user_id = $1
    `
    const result = await db.query(query, [user_id])
    return result.rows
  },

  // Fetch a task by task_id
  getTaskById: async (task_id) => {
    const query = `
      SELECT * FROM tasks
      WHERE task_id = $1
    `
    const result = await db.query(query, [task_id])
    return result.rows[0]
  },

  // Update a task by task_id
  update: async (taskData) => {
    const { task_id, task_name, description, priority, status, start_date, end_date } = taskData
    const query = `
      UPDATE tasks
      SET task_name = $1,
          description = $2,
          priority = $3,
          status = $4,
          start_date = $5,
          end_date = $6
      WHERE task_id = $7
      RETURNING *;
    `
    const values = [task_name, description, priority, status, start_date, end_date, task_id]
    const result = await db.query(query, values)
    return result.rows[0]
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
