import express from 'express'
import {
  getAdminStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  deleteUser
} from '../controllers/adminController.js'
import { protect } from '../middleware/authMiddleware.js'
import { admin } from '../middleware/adminMiddleware.js'

const router = express.Router()

router.get('/stats', protect, admin, getAdminStats)
router.get('/orders', protect, admin, getAllOrders)
router.put('/orders/:id', protect, admin, updateOrderStatus)
router.get('/users', protect, admin, getAllUsers)
router.delete('/users/:id', protect, admin, deleteUser)

export default router