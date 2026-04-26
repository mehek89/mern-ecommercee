import User from '../models/User.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'

// Get stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()
    const orders = await Order.find({})
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0)
    const paidOrders = orders.filter(o => o.isPaid).length
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
      paidOrders,
      pendingOrders,
      recentOrders
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    order.status = req.body.status
    if (req.body.status === 'delivered') {
      order.isDelivered = true
      order.deliveredAt = Date.now()
    }
    const updated = await order.save()
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}