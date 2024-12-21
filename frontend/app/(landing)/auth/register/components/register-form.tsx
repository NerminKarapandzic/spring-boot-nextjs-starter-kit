"use client";

import ErrorFeedback from "@/components/error-feedback";
import SuccessFeedback from "@/components/success-feedback";
import httpClient, { restClient } from "@/lib/httpClient";
import { cn } from "@/lib/utils";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import { Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type Schema = z.infer<typeof registerSchema>;
export function UserRegisterForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(
    undefined
  );

  async function onSubmit(data: Schema) {
    setErrors(undefined);
    setSuccess(false);
    setIsLoading(true);
    restClient.createUser(data)
      .then(() => {
        toast.success("Account created successfully");
        setSuccess(true);
      })
      .catch((error) => {
        const errData = error.response.data as HttpErrorResponse;
        setErrors(errData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
      firstName: "",
      lastName: "",
    },
    validate: zodResolver(registerSchema),
  });

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <SuccessFeedback
        show={success}
        message="Account created"
        description="Verfication email will be sent to your inbox, please click the link in the email to verify your account"
        action={
          <Link href="/auth/login" className="underline">
            Login
          </Link>
        }
      />

      <form onSubmit={form.onSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-2">
            <TextInput
              id="email"
              placeholder="name@example.com"
              type="text"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              label="Email"
              {...form.getInputProps("email")}
            />

            <TextInput
              id="password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              label="Password"
              {...form.getInputProps("password")}
            />

            <TextInput
              id="passwordConfirmation"
              type="password"
              disabled={isLoading}
              label="Confirm password"
              {...form.getInputProps("passwordConfirmation")}
            />

            <TextInput
              id="firstName"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              label="First name"
              {...form.getInputProps("firstName")}
            />

            <TextInput
              id="lastName"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              label="Last name"
              {...form.getInputProps("lastName")}
            />
          </div>

          <ErrorFeedback data={errors} />

          <Button disabled={isLoading} type="submit">
            {isLoading ? 'Creating account...': 'Create account'}
          </Button>
        </div>
      </form>
    </div>
  );
}
