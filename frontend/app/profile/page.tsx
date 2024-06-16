"use client";

import React from "react";
import UpdateBasicDetailsForm from "./components/update-basic-details-form";
import UpdatePasswordForm from "./components/update-password-form";
import { useAuthGuard } from "@/lib/auth/use-auth";
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Loading from "@/components/loading";
import Container from "@/components/container";
import UpdateProfileImageForm from "./components/update-profile-image-form";

export default function ProfilePage() {
  const { user } = useAuthGuard({ middleware: "auth" });

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return <FaGoogle />;
      case "github":
        return <FaGithub />;
      case "facebook":
        return <FaFacebook />;
      case "okta":
        return <span>Okta</span>;
      default:
        return <span>{provider}</span>;
    }
  };

  if (!user) return <Loading />;

  return (
    <Container size="sm">
      <div className="flex flex-col gap-y-4">
        <h1 className="text-2xl font-semibold">Welcome back, {user.firstName}</h1>
        
        <UpdateProfileImageForm />
        <Separator />

        <UpdateBasicDetailsForm />
        <Separator />

        <UpdatePasswordForm />
        <Separator />

        <h2 className="text-lg font-semibold mb-2">Connected Accounts</h2>
        <div className="flex flex-col gap-y-2">
          {user?.connectedAccounts.map((account) => (
            <div className="flex w-full max-w-screen-sm justify-between">
              <div className="flex items-center gap-x-2">
                {getProviderIcon(account.provider)}
                <span className="font-bold">{account.provider}</span>
              </div>
              <span className="text-muted-foreground">
                Connected at:{" "}
                <span className="text-foreground font-semibold">
                  {format(new Date(account.connectedAt), "MMM dd, hh:mm")}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
