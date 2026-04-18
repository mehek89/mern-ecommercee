import express from 'express'
import {
  registerUser,
  loginUser,
  getUserProfile
} from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import User from '../models/User.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', protect, getUserProfile)

// Temporary admin route - delete after use
router.get('/makeadmin/:email', async (req, res) => {
  await User.findOneAndUpdate({ email: req.params.email }, { role: 'admin' })
  res.json({ message: 'Admin role set!' })
})

export default router