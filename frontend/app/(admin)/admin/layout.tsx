"use client";

import Loading from "@/components/loading";
import Navbar from "@/components/Navbar";
import PermissionGuard from "@/components/permission-guard";
import RoleGuard from "@/components/role-guard";
import { useAuthGuard } from "@/lib/auth/use-auth";
import { Role } from "@/models/user/UserResponse";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthGuard({ middleware: "auth" });
  const [opened, { toggle }] = useDisclosure(false);

  if (!user) return <Loading />;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" className="w-full max-w-screen-xl mx-auto">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Navbar className="w-full" />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <Navbar className="w-full" orientation="vertical" />
      </AppShell.Navbar>

      <AppShell.Main>
        <PermissionGuard rolesAllowed={[Role.ADMIN]}></PermissionGuard>
        <RoleGuard rolesAllowed={[Role.ADMIN]}>{children}</RoleGuard>
      </AppShell.Main>
    </AppShell>
  );
}
