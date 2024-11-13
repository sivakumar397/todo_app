import express from 'express'
import {
  createTask,
  createBulkTasks,
  getTasksByUserId,
  deleteTask,
  updateTask,
} from '../controllers/taskController.js'

const router = express.Router()

// Route for creating a task
router.post('/task', createTask)

// Route for creating tasks in bulk
router.post('/task/bulk_add', createBulkTasks)

// Route for fetching tasks by user_id
router.get('/task', getTasksByUserId)

// Route for deleting a task
router.delete('/task/:task_id', deleteTask)

// Route for updating a task by task_id
router.put('/task/:task_id', updateTask)

export default router
