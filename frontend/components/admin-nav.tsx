import React from 'react'
import Link from "next/link";
import RoleGuard from './role-guard';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Role } from '@/models/user/UserResponse';

export default function AdminNav() {
  return (
    <RoleGuard rolesAllowed={[Role.ADMIN]}>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative mx-2">
          Admin
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/admin/users">Users</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    </RoleGuard>
  )
}
