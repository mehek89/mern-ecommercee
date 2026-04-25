import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  images: [{ type: String }],
  video: { type: String, default: '' },
  audio: { type: String, default: '' }
}, { timestamps: true })

const variantSchema = new mongoose.Schema({
  size: { type: String, default: '' },
  color: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  price: { type: Number, default: 0 }
})

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  images: [{ type: String }],
  category: { type: String, required: true },
  brand: { type: String, default: '' },
  stock: { type: Number, required: true, default: 0 },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  variants: [variantSchema],
  sizes: [{ type: String }],
  colors: [{ type: String }]
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)
export default Product