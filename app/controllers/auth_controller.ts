import type { HttpContext } from '@adonisjs/core/http'
import Hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  // Register a new user
  public async register({ request, response }: HttpContext) {
    try {
      const payload = await registerValidator.validate(request.all())

      const existingUser = await User.findBy('email', payload.email)
      if (existingUser) {
        return response.status(409).json({
          message: 'User with this email already exists',
        })
      }

      // Create the user
      const user = await User.create({
        email: payload.email,
        password: payload.password,
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

  // User login
  public async login({ auth, request, response }: HttpContext) {
    try {
      const payload = await loginValidator.validate(request.all())

      const user = await User.findBy('email', payload.email)
      if (!user) {
        return response.status(404).json({
          message: 'Invalid credentials',
        })
      }

      const isPasswordValid = await Hash.verify(user.password, payload.password)
      if (!isPasswordValid) {
        return response.status(401).json({
          message: 'Invalid credentials',
        })
      }

      const token = await User.accessTokens.create(user)

      return response.status(200).json({
        token: token,
        message: 'Login successful',
      })
    } catch (error) {
      return response.status(500).json({
        message: 'An error occurred during login',
        error: error.message,
      })
    }
  }

  // User logout
  public async logout({ auth, request, response }: HttpContext) {
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

      const token = auth.user?.currentAccessToken.identifier
      if (!token) {
        return response.badRequest({ message: 'Token not found' })
      }
      await User.accessTokens.delete(user, token)

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
