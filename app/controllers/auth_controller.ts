import type { HttpContext } from '@adonisjs/core/http'
import Hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class AuthController {
  // Register a new user
  public async register({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      if (!email || !password) {
        return response.status(400).json({
          message: 'Email and password are required',
        })
      }

      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        return response.status(409).json({
          message: 'User with this email already exists',
        })
      }

      const user = await User.create({
        email,
        password,
      })

      return response.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
        },
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Something went wrong during registration',
        error: error.message,
      })
    }
  }

  //user login
  public async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      if (!email || !password) {
        return response.status(400).json({
          message: 'Email and password are required',
        })
      }

      const user = await User.findBy('email', email)
      if (!user) {
        return response.status(404).json({
          message: 'Invalid credentials',
        })
      }

      const isPasswordValid = await Hash.verify(user.password, password)
      if (!isPasswordValid) {
        return response.status(401).json({
          message: 'Invalid credentials',
        })
      }

      return response.status(200).json({
        message: 'Login successful',
      })
    } catch (error) {
      return response.status(500).json({
        message: 'An error occurred during login',
        error: error.message,
      })
    }
  }

  //user logout
  public async logout({ request, response }: HttpContext) {
    try {
      const { email } = request.only(['email'])

      if (!email) {
        return response.status(400).json({
          message: 'Email required',
        })
      }

      const user = await User.findBy('email', email)
      if (!user) {
        return response.status(404).json({
          message: 'Invalid credentials',
        })
      }

      return response.status(200).json({
        message: 'Logout successful',
      })
    } catch (error) {
      return response.status(500).json({
        message: 'An error occurred during logout',
        error: error.message,
      })
    }
  }
}
