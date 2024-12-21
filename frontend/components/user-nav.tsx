import { useAuthGuard } from "@/lib/auth/use-auth";
import { ActionIcon, Avatar, Button, Menu, MenuDivider, MenuItem } from "@mantine/core";
import Link from "next/link";

export function UserNav() {
  const { user, logout } = useAuthGuard({ middleware: "auth" });

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="subtle" radius={100}>
          <Avatar name={user?.firstName}></Avatar>
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown className="w-56">
        {user?.email && (
          <>
            <MenuItem className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </MenuItem>
            <MenuDivider />
          </>
        )}
        <MenuItem>
          <Link href="/profile">Profile</Link>
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => logout()}>Log out</MenuItem>
      </Menu.Dropdown>
    </Menu>
  );
}
