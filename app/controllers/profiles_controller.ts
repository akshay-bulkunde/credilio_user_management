import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Profile from '#models/profile'
import { DateTime } from 'luxon'
export default class ProfilesController {
  // Create user profile
  public async create({ request, response }: HttpContext) {
    try {
      const { name, mobile, email, gender, dateOfBirth } = request.only([
        'name',
        'mobile',
        'email',
        'gender',
        'dateOfBirth',
      ])

      const existingUser = await User.findBy('email', email)
      if (!existingUser) {
        return response.status(409).json({
          message: 'Provided email does not exist',
        })
      }

      const profile = await Profile.create({
        userId: existingUser.id,
        name,
        mobile,
        email,
        gender,
        dateOfBirth: DateTime.fromISO(dateOfBirth),
      })

      return response.status(201).json({
        message: 'Profile created successfully',
        profile,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error creating profile',
        error: error.message,
      })
    }
  }

  // View all users
  public async view({ response }: HttpContext) {
    try {
      const profiles = await Profile.query()

      if (profiles.length === 0) {
        return response.status(404).json({
          message: 'No profiles found',
        })
      }

      return response.status(200).json({
        data: profiles.map((profile) => ({
          name: profile.name,
          email: profile.email,
          gender: profile.gender,
          dateOfBirth: profile.dateOfBirth?.toISODate(), // Handle nullable fields safely
        })),
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error retrieving profiles',
        error: error.message,
      })
    }
  }

  // Update user profile
  public async update({ request, response }: HttpContext) {
    try {
      const { name, mobile, email, gender, dateOfBirth } = request.only([
        'name',
        'mobile',
        'email',
        'gender',
        'dateOfBirth',
      ])

      const existingUser = await User.findBy('email', email)
      if (!existingUser) {
        return response.status(409).json({
          message: 'Provided email does not exist',
        })
      }

      const profile = await Profile.query().where('userId', existingUser.id).first()

      if (!profile) {
        return response.status(404).json({
          message: 'Profile not found',
        })
      }

      profile.name = name
      profile.mobile = mobile
      profile.email = email
      profile.gender = gender
      profile.dateOfBirth = DateTime.fromISO(dateOfBirth)

      await profile.save()

      return response.status(200).json({
        message: 'Profile updated successfully',
        profile,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error updating profile',
        error: error.message,
      })
    }
  }

  // Delete user profile
  public async delete({ request, response }: HttpContext) {
    try {
      const { email } = request.only(['email'])
      const existingUser = await User.findBy('email', email)
      if (!existingUser) {
        return response.status(409).json({
          message: 'Provided email does not exist',
        })
      }

      const profile = await Profile.query().where('userId', existingUser.id).first()

      if (!profile) {
        return response.status(404).json({
          message: 'Profile not found or mobile number does not match',
        })
      }

      await profile.delete()

      return response.status(200).json({
        message: 'Profile deleted successfully',
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error deleting profile',
        error: error.message,
      })
    }
  }
}
