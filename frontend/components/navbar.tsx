"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Logo from "./logo";
import ModeToggle from "./mode-toggle";
import Container from "./container";

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {}
export default function Navbar({ className, ...props}: NavbarProps) {
  return (
    <div className={cn(
      className
    )} {...props}>
      <Container size="lg" className="flex justify-between items-center bg-card py-2 px-4 z-10">
        <Logo />
        
        <div className="flex gap-x-2 items-center">
          <ModeToggle />

          <Link href={"/auth/login"}>
            <Button variant={"outline"}>Login</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
