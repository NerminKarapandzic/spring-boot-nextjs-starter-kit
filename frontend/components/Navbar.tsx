"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Logo from "./Logo";
import ModeToggle from "./ModeToggle";
import Container from "./Container";
import { useAuthGuard } from "@/lib/auth/use-auth";
import { UserNav } from "./user-nav";
import AdminNav from "./admin-nav";
import { Button } from "@mantine/core";

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}
export default function Navbar({ className, ...props }: NavbarProps) {
  const { user } = useAuthGuard({ middleware: "guest" });

  return (
    <div className={cn(className)} {...props}>
      <Container
        size="xl"
        className={cn(
          "flex justify-between items-center bg-card py-2 px-4 z-10",
          props.orientation === "vertical" ? "flex-col" : "flex-row"
        )}
      >
        <Logo />

        <div className="flex gap-x-2 items-center">
          <ModeToggle />

          <AdminNav />
          {user && (
            <UserNav />
          )}
          {user?.authorities.includes("ROLE_PREVIOUS_ADMINISTRATOR") && (
            <a href={"/api/auth/impersonate/exit"}>
              <Button>Exit switch</Button>
            </a>
          )}

          {!user && (
            <Link href={"/auth/login"}>
              <Button variant={"outline"}>Login</Button>
            </Link>
          )}
        </div>
      </Container>
    </div>
  );
}
