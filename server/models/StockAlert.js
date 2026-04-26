import mongoose from 'mongoose'

const stockAlertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  email: { type: String, required: true },
  notified: { type: Boolean, default: false }
}, { timestamps: true })

const StockAlert = mongoose.model('StockAlert', stockAlertSchema)
export default StockAlert