import express from 'express'
import { createTask, getTasksByUserId, deleteTask } from '../controllers/taskController.js'

const router = express.Router()

// Route for creating a task
router.post('/task', createTask)

// Route for fetching tasks by user_id
router.get('/task', getTasksByUserId)

// Route for deleting a task
router.delete('/task/:task_id', deleteTask)

export default router
