"use client";

import FileUpload from "@/components/FileUpload";
import { useAuthGuard } from "@/lib/auth/use-auth";
import httpClient from "@/lib/httpClient";
import { Avatar, InputLabel } from "@mantine/core";
import React from "react";
import { toast } from "sonner";

export default function UpdateProfileImageForm() {
  const { user, mutate } = useAuthGuard({middleware: "auth"});

  const handleLogoChange = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    httpClient.patch(`/api/users/${user?.id}/profile-picture`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        toast.success("Profile picture updated successfully");
        mutate();
      })
      .catch((error) => {
        toast.error("Failed to update profile picture");
      });
  };

  return (
    <div className="flex gap-4 flex-col">
      <InputLabel>Logo</InputLabel>
      <FileUpload
        onFileSelect={(file) => handleLogoChange(file)}
        allowedTypes={["image/png", "image/jpg", "image/jpeg"]}
        onValidationError={(err) => {
          toast.error(err);
        }}
      >
        <Avatar name={user?.firstName} src={user?.profileImageUrl} color="initials"></Avatar>
      </FileUpload>
    </div>
  );
}
