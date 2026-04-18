import Product from '../models/Product.js'

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
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
      name,
      description,
      price,
      category,
      brand,
      stock,
      images
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