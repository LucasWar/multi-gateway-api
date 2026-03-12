import vine from '@vinejs/vine'
import { RoleEnum } from '../enum/role_enum.ts'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  fullName: vine.string().nullable(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
})

/**
 * Validator to use before validating user credentials
 * during login
 */
export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})

export const userSchema = vine.create(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6),
    role: vine.enum(Object.values(RoleEnum)),
  })
)

export const userUpdateSchema = vine.create(
  vine.object({
    email: vine.string().email().optional(),
    password: vine.string().minLength(6).optional(),
    role: vine.enum(Object.values(RoleEnum)).optional(),
  })
)
