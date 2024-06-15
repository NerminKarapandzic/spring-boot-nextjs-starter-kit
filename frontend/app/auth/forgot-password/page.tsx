"use client";

import ErrorFeedback from "@/components/error-feedback";
import SuccessFeedback from "@/components/success-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import httpClient from "@/lib/httpClient";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
type Schema = z.infer<typeof forgotPasswordSchema>;
export default function ForgotPasswordPage() {
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>();
  const [success, setSuccess] = React.useState<boolean>(false);

  async function onSubmit(data: Schema) {
    httpClient
      .post("/api/users/forgot-password", data)
      .then(() => {
        setSuccess(true);
      })
      .catch((error) => {
        const errData = error.response.data as HttpErrorResponse;
        setErrors(errData);
      });
  }

  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(forgotPasswordSchema),
    reValidateMode: "onSubmit",
  });

  return (
    <div className="mt-4 md:mt-0 space-y-6 flex flex-col justify-center h-full max-w-screen-sm mx-auto">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we will send you a reset link
        </p>
      </div>

      <div className={"grid gap-6"}>
        <SuccessFeedback show={success} message="Password reset email sent" />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="text"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              {...register("email")}
            />
            {formState.errors.email && (
              <small className="text-red-600">
                {formState.errors.email.message}
              </small>
            )}
          </div>

          <Button type="submit" className="w-full mt-2">
            Send reset email
          </Button>
        </form>

        <ErrorFeedback data={errors} />
      </div>
    </div>
  );
}
