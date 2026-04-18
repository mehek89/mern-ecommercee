import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

await mongoose.connect(process.env.MONGO_URI)

const User = (await import('./models/User.js')).default

await User.findOneAndUpdate(
  { email: 'admin@gmail.com' },
  { role: 'admin' }
)

console.log('✅ Admin role set!')
process.exit()