import StockAlert from '../models/StockAlert.js'
import Product from '../models/Product.js'

// Subscribe to stock alert
export const subscribeAlert = async (req, res) => {
  try {
    const { productId } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (product.stock > 0) {
      return res.status(400).json({ message: 'Product is already in stock!' })
    }

    // Check if already subscribed
    const existing = await StockAlert.findOne({
      user: req.user._id,
      product: productId
    })

    if (existing) {
      return res.status(400).json({ message: 'Already subscribed to this alert' })
    }

    const alert = await StockAlert.create({
      user: req.user._id,
      product: productId,
      email: req.user.email
    })

    res.status(201).json({ 
      message: `✅ You will be notified at ${req.user.email} when this product is back in stock!` 
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get my alerts
export const getMyAlerts = async (req, res) => {
  try {
    const alerts = await StockAlert.find({ 
      user: req.user._id,
      notified: false 
    }).populate('product', 'name images price stock')
    
    res.json(alerts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Unsubscribe alert
export const unsubscribeAlert = async (req, res) => {
  try {
    await StockAlert.findByIdAndDelete(req.params.id)
    res.json({ message: 'Alert removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Check and notify users when stock is updated (called when admin updates product)
export const checkAndNotify = async (productId) => {
  try {
    const product = await Product.findById(productId)
    if (!product || product.stock === 0) return

    const alerts = await StockAlert.find({ 
      product: productId, 
      notified: false 
    }).populate('user', 'name email')

    if (alerts.length > 0) {
      console.log(`📧 ${alerts.length} users should be notified about ${product.name}`)
      
      // Mark as notified
      await StockAlert.updateMany(
        { product: productId, notified: false },
        { notified: true }
      )
    }
  } catch (error) {
    console.log('Stock alert error:', error)
  }
}