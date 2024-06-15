"use client";

import ErrorFeedback from "@/components/error-feedback";
import SuccessFeedback from "@/components/success-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import httpClient from "@/lib/httpClient";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    passwordResetToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.infer<typeof resetPasswordSchema>;
export function ResetPasswordForm() {
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(
    undefined
  );
  const [success, setSuccess] = React.useState<boolean>(false);

  const token = useSearchParams().get("token");

  function onSubmit(data: Schema) {
    httpClient
      .patch("/api/users/reset-password", data)
      .then(() => {
        setSuccess(true);
      })
      .catch((error) => {
        const errData = error.response.data as HttpErrorResponse;
        setErrors(errData);
      });
  }

  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(resetPasswordSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      passwordResetToken: token || undefined,
    },
  });

  return (
    <div className={"grid gap-6"}>
      <SuccessFeedback
        show={success}
        message="Password updated succesfully"
        action={
          <Link href={"/auth/login"} className="underline">
            Login
          </Link>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
            />
            {formState.errors.password && (
              <small className="text-red-600">
                {formState.errors.password.message}
              </small>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            {formState.errors.confirmPassword && (
              <small className="text-red-600">
                {formState.errors.confirmPassword.message}
              </small>
            )}
          </div>

          <ErrorFeedback data={errors} />

          <Button type="submit">
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
