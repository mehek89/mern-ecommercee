import Wishlist from '../models/Wishlist.js'

// Get wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products')
    
    if (!wishlist) return res.json({ products: [] })
    
    // Filter out any null products (deleted products)
    wishlist.products = wishlist.products.filter(p => p !== null)
    
    res.json(wishlist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body

    let wishlist = await Wishlist.findOne({ user: req.user._id })

    if (!wishlist) {
      wishlist = new Wishlist({ 
        user: req.user._id, 
        products: [productId] 
      })
    } else {
      // Check if already in wishlist
      const alreadyIn = wishlist.products.some(
        p => p.toString() === productId.toString()
      )
      if (alreadyIn) {
        return res.status(400).json({ message: 'Already in wishlist' })
      }
      wishlist.products.push(productId)
    }

    await wishlist.save()
    res.json({ message: 'Added to wishlist' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' })

    wishlist.products = wishlist.products.filter(
      p => p.toString() !== req.params.productId.toString()
    )

    await wishlist.save()
    res.json({ message: 'Removed from wishlist' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}