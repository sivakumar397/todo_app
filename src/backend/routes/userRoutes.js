import express from 'express'
import { findUserIdByUsername } from '../controllers/userController.js'

const router = express.Router()

// Define the route and ensure it's a POST route
router.post('/users/findUserId', findUserIdByUsername)

export default router
