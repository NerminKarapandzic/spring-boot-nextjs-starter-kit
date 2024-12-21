"use client";

import ErrorFeedback from "@/components/error-feedback";
import { useAuthGuard } from "@/lib/auth/use-auth";
import httpClient from "@/lib/httpClient";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import { Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    oldPassword: z.string().optional(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.infer<typeof schema>;
export default function UpdatePasswordForm() {
  const { user, mutate } = useAuthGuard({ middleware: "auth" });
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(
    undefined
  );

  const onSubmit = (data: Schema) => {
    setErrors(undefined);
    httpClient
      .patch("/api/users/password", data)
      .then(() => {
        toast.success("Password updated successfully");
        mutate();
      })
      .catch((error) => {
        const errData = error.response.data as HttpErrorResponse;
        setErrors(errData);
      });
  };

  const form = useForm({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(schema),
  });

  return (
    <div className="max-w-screen-sm">
        <form
          onSubmit={form.onSubmit(onSubmit)}
          className="flex flex-col gap-y-2"
        >
          <TextInput type="password" {...form.getInputProps('oldPassword')} label="Old password"></TextInput>
          <TextInput type="password" {...form.getInputProps('password')} label="New password"></TextInput>
          <TextInput type="password" {...form.getInputProps('confirmPassword')} label="Confirm password"></TextInput>

          <Button type="submit">Update password</Button>
        </form>

      <ErrorFeedback data={errors} className="mt-2"/>
    </div>
  );
}
