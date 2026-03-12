import type { RoleEnum } from '../enum/role_enum.ts'

export interface CreateUser {
  email: string
  password: string
  role: RoleEnum
}

export interface UpdateUser {
  email?: string
  password?: string
  role?: RoleEnum
}
