import mongoose from 'mongoose'

await mongoose.connect('mongodb+srv://mehekmodi8_db_user:mahak1234@cluster0.u2mmc68.mongodb.net/mern-ecommerce?retryWrites=true&w=majority')

const User = (await import('./models/User.js')).default

await User.findOneAndUpdate(
  { email: 'admin@gmail.com' },
  { role: 'admin' }
)

console.log('✅ Admin role set!')
process.exit()