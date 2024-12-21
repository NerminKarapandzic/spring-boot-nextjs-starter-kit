"use client"

import React from "react";
import { ResetPasswordForm } from "./components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="mt-4 md:mt-0 space-y-6 flex flex-col justify-center h-full max-w-screen-sm mx-auto">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Enter your new password
        </h1>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
