import Task from '../models/Task.js'

// Controller function to handle task creation
export const createTask = async (req, res) => {
  try {
    const { user_id, task_name, description, priority, status, start_date, end_date } = req.body

    // Validate required fields
    if (!task_name || !user_id) {
      return res.status(400).json({ message: 'Task name and user ID are required.' })
    }

    // Create a new task
    const newTask = await Task.create({
      user_id,
      task_name,
      description,
      priority,
      status,
      start_date,
      end_date,
    })
    return res.status(201).json({ message: 'Task added', task: newTask })
  } catch (error) {
    console.error('Error creating task:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// Controller function to handle fetching tasks by user_id
export const getTasksByUserId = async (req, res) => {
  const { user_id } = req.query

  // Validate that user_id is provided
  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required.' })
  }

  try {
    // Fetch tasks by user_id
    const tasks = await Task.getTasksByUserId(user_id)

    // Format the response to match the required structure
    const formattedTasks = tasks.map((task) => ({
      task_id: task.task_id,
      task_name: task.task_name,
      priority: task.priority,
      status: task.status,
      start_date: task.start_date,
      end_date: task.end_date,
    }))

    return res.status(200).json(formattedTasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const deleteTask = async (req, res) => {
  const { task_id } = req.params

  try {
    const result = await Task.deleteTask(task_id)
    if (result) {
      return res.status(200).json({ message: 'Task removed' })
    } else {
      return res.status(404).json({ message: 'Task not found' })
    }
  } catch (error) {
    console.error('Error deleting task:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}