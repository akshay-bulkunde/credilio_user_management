import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(8),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string(),
  })
)

export const createValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(255),
    mobile: vine.string().maxLength(10),
    email: vine.string().email().normalizeEmail(),
    gender: vine.enum(['MALE', 'FEMALE']),
    dateOfBirth: vine.date(),
  })
)

export const viewValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
  })
)

export const updateValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(255).optional(),
    mobile: vine.string().optional(),
    email: vine.string().email().normalizeEmail().optional(),
    gender: vine.enum(['MALE', 'FEMALE']).optional(),
    dateOfBirth: vine.date().optional(),
  })
)

export const deleteValidator = vine.compile(vine.object({ mobile: vine.string() }))
