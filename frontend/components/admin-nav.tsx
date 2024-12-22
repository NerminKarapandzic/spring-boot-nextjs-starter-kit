import React from "react";
import Link from "next/link";
import RoleGuard from "./role-guard";
import { Role } from "@/models/user/UserResponse";
import { Button, Menu, MenuItem } from "@mantine/core";

export default function AdminNav() {
  return (
    <RoleGuard rolesAllowed={[Role.ADMIN]}>
      <Menu>
        <Menu.Target>
          <Button variant="subtle" className="relative mx-2">
            Admin
          </Button>
        </Menu.Target>
        <Menu.Dropdown className="w-56">
          <MenuItem>
            <Link href="/admin/users">Users</Link>
          </MenuItem>
          <MenuItem>
            <Link href="/admin/notifications">Notifications</Link>
          </MenuItem>
        </Menu.Dropdown>
      </Menu>
    </RoleGuard>
  );
}
