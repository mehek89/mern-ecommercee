import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import { sendWelcomeEmail } from '../utils/sendEmail.js'

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    // ✅ Send welcome email AFTER user is created
    sendWelcomeEmail(user.name, user.email)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    console.log('Register error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    console.log('Login error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Get profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    console.log('Profile error:', error)
    res.status(500).json({ message: error.message })
  }
}