import express from 'express'
import {
  subscribeAlert,
  getMyAlerts,
  unsubscribeAlert
} from '../controllers/stockAlertController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, subscribeAlert)
router.get('/', protect, getMyAlerts)
router.delete('/:id', protect, unsubscribeAlert)

export default router