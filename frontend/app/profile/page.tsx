"use client";

import Container from "@/components/container";
import { useAuthGuard } from "@/lib/auth/use-auth";
import React from "react";

export default function ProfilePage() {
  const {user} = useAuthGuard({middleware: 'auth'});

  return (
    <Container size="lg">
      <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}</h1>
    </Container>
  );
}
