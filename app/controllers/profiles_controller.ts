import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Profile from '#models/profile'
import { DateTime } from 'luxon'
import { createValidator, updateValidator, deleteValidator } from '../validators/auth.ts'

export default class ProfilesController {
  // Create user profile
  public async create({ auth, request, response }: HttpContext) {
    try {
      const payload = await createValidator.validate(request.all())
      const user = auth.user
      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }
      const existingUser = await User.findBy('email', user.email)
      if (!existingUser) {
        return response.status(409).json({
          message: 'Provided email does not exist',
        })
      }

      const dateOfBirthISO =
        payload.dateOfBirth instanceof Date
          ? payload.dateOfBirth.toISOString()
          : payload.dateOfBirth

      const profile = await Profile.create({
        userId: existingUser.id,
        name: payload.name,
        mobile: payload.mobile,
        email: existingUser.email,
        gender: payload.gender,
        dateOfBirth: DateTime.fromISO(dateOfBirthISO),
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

  // View profile
  public async view({ auth, response }: HttpContext) {
    try {
      const email = auth.user?.email

      const profile = await Profile.findBy('email', email)
      if (!profile) {
        return response.status(409).json({
          message: 'Provided email does not exist',
        })
      }

      return response.status(200).json({
        data: {
          name: profile.name,
          email: profile.email,
          gender: profile.gender,
          dateOfBirth: profile.dateOfBirth?.toISODate(),
        },
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error retrieving profiles',
        error: error.message,
      })
    }
  }

  // Update user profile
  public async update({ auth, request, response }: HttpContext) {
    try {
      const payload = await updateValidator.validate(request.all())

      const email = auth.user?.email

      const existingUser = await User.findBy('email', email)

      if (!existingUser) {
        return response.status(409).json({
          message: 'Provided email does not exist',
        })
      }
      console.log('Found user:', existingUser)

      const profile = await Profile.query().where('userId', existingUser.id).first()

      if (!profile) {
        return response.status(404).json({
          message: 'Profile not found',
        })
      }

      if (payload.name !== undefined) {
        profile.name = payload.name
      }
      if (payload.mobile !== undefined) {
        profile.mobile = payload.mobile
      }
      if (payload.email !== undefined) {
        profile.email = payload.email
      }
      if (payload.gender !== undefined) {
        profile.gender = payload.gender
      }
      if (payload.dateOfBirth !== undefined) {
        if (payload.dateOfBirth instanceof Date) {
          profile.dateOfBirth = DateTime.fromJSDate(payload.dateOfBirth)
        } else {
          return response.status(400).json({ message: 'Invalid date format for dateOfBirth' })
        }
      }
      await profile.save()

      // let dateOfBirthISO: string | undefined
      // if (payload.dateOfBirth) {
      //   if (payload.dateOfBirth instanceof Date) {
      //     dateOfBirthISO = payload.dateOfBirth.toISOString()
      //   } else {
      //     return response.status(400).json({ message: 'Invalid date format for dateOfBirth' })
      //   }
      // }

      // profile.name = payload.name || profile.name
      // profile.mobile = payload.mobile || profile.mobile
      // profile.email = payload.email || profile.email
      // profile.gender = payload.gender || profile.gender
      // profile.dateOfBirth = dateOfBirthISO ? DateTime.fromISO(dateOfBirthISO) : profile.dateOfBirth

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
      const { mobile } = await deleteValidator.validate(request.all())
      const existingUser = await Profile.findBy('mobile', mobile)
      if (!existingUser) {
        return response.status(409).json({
          message: 'Provided mobile does not exist',
        })
      }

      const profile = await Profile.query().where('id', existingUser.id).first()

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
