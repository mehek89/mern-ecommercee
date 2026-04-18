import Cart from '../models/Cart.js'

// Get cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.json({ items: [], totalPrice: 0 })
    }
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, name, image, price, quantity } = req.body

    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [], totalPrice: 0 })
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    )

    if (existingItem) {
      existingItem.quantity += quantity || 1
    } else {
      cart.items.push({ product: productId, name, image, price, quantity: quantity || 1 })
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    )

    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    )

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    )

    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Clear cart
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id })
    res.json({ message: 'Cart cleared' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}