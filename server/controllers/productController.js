import Product from '../models/Product.js'
import { upload } from '../config/cloudinary.js'

// Get all products with search & filters
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      sort
    } = req.query

    // Build filter object
    let filter = {}

    // Search by name
    if (search) {
      filter.name = { $regex: search, $options: 'i' }
    }

    // Filter by category
    if (category && category !== 'All') {
      filter.category = category
    }

    // Filter by brand
    if (brand) {
      filter.brand = { $regex: brand, $options: 'i' }
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    // Filter by rating
    if (rating) {
      filter.ratings = { $gte: Number(rating) }
    }

    // Build sort object
    let sortObj = {}
    if (sort === 'price_asc') sortObj.price = 1
    else if (sort === 'price_desc') sortObj.price = -1
    else if (sort === 'rating') sortObj.ratings = -1
    else if (sort === 'newest') sortObj.createdAt = -1
    else sortObj.createdAt = -1

    const products = await Product.find(filter).sort(sortObj)
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create product (admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, stock, images } = req.body

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    const product = await Product.create({
      name, description, price, category, brand, stock, images
    })

    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update product (admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const { name, description, price, category, brand, stock, images } = req.body

    product.name = name || product.name
    product.description = description || product.description
    product.price = price || product.price
    product.category = category || product.category
    product.brand = brand || product.brand
    product.stock = stock || product.stock
    product.images = images || product.images

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete product (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    await product.deleteOne()
    res.json({ message: 'Product removed successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Handle uploaded files
    const images = []
    let video = ''
    let audio = ''

    if (req.files) {
      for (const file of req.files) {
        if (file.mimetype.startsWith('image')) {
          images.push(file.path)
        } else if (file.mimetype.startsWith('video')) {
          video = file.path
        } else if (file.mimetype.startsWith('audio')) {
          audio = file.path
        }
      }
    }

    // Check if user already reviewed — update instead of block
    const existingReviewIndex = product.reviews.findIndex(
      r => r.user.toString() === req.user._id.toString()
    )

    if (existingReviewIndex !== -1) {
      // Update existing review
      product.reviews[existingReviewIndex].rating = Number(rating)
      product.reviews[existingReviewIndex].comment = comment
      if (images.length > 0) product.reviews[existingReviewIndex].images = images
      if (video) product.reviews[existingReviewIndex].video = video
      if (audio) product.reviews[existingReviewIndex].audio = audio
    } else {
      // Add new review
      const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
        images,
        video,
        audio
      }
      product.reviews.push(review)
    }

    product.numReviews = product.reviews.length
    product.ratings = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length

    await product.save()
    res.status(201).json({ message: existingReviewIndex !== -1 ? 'Review updated!' : 'Review added!' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}