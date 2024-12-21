"use client";

import ErrorFeedback from "@/components/error-feedback";
import SuccessFeedback from "@/components/success-feedback";
import httpClient from "@/lib/httpClient";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import { Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
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

  const form = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
      passwordResetToken: token || "",
    },
    validate: zodResolver(resetPasswordSchema),
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

      <form onSubmit={form.onSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-2">
            <TextInput
              id="password"
              type="password"
              label="Password"
              {...form.getInputProps("password")}
            />
          </div>

          <div className="grid gap-2">
            <TextInput
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              {...form.getInputProps("confirmPassword")}
            />
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
