import type { HttpContext } from '@adonisjs/core/http'
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
}
