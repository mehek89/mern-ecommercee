import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resource_type = 'image'
    if (file.mimetype.startsWith('video')) resource_type = 'video'
    if (file.mimetype.startsWith('audio')) resource_type = 'video'

    return {
      folder: 'shopmern/reviews',
      resource_type,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'mp3', 'wav'],
    }
  }
})

export const upload = multer({ storage })
export default cloudinary