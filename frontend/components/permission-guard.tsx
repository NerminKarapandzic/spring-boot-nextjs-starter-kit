"use client"
import { useAuthGuard } from '@/lib/auth/use-auth'
import { Role } from '@/models/user/UserResponse'
import React from 'react'

/**
 * Component to show a permission denied message if the user does not have the required roles
 * This should be used in combination with the RoleGuard component.
 * The RoleGuard itself isn't made to show errors, it only hides stuff based on roles, but in cases when
 * you want to show a message to the user that they neeed specific permissions, you can use this component.
 */
interface PermissionDeniedProps {
  rolesAllowed: Role[]
}
export default function PermissionGuard({rolesAllowed}: PermissionDeniedProps) {
  const {user} = useAuthGuard({middleware: 'auth'})
  const isAllowed = rolesAllowed.includes(user?.role as Role)

  if (isAllowed) return null
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-semibold">Permission Denied</h1>
      <p className="text-lg">You need to have one of the following roles to access this resource:</p>
      <ul className="text-lg">
        {rolesAllowed.map(role => (
          <li key={role}>{role}</li>
        ))}
      </ul>
    </div>
  )
}
