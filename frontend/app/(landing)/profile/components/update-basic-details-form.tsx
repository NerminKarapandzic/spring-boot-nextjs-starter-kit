"use client"

import ErrorFeedback from "@/components/error-feedback";
import { useAuthGuard } from "@/lib/auth/use-auth";
import httpClient, { restClient } from "@/lib/httpClient";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import { Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2)
});

type Schema = z.infer<typeof schema>;
export default function UpdateBasicDetailsForm() {
  const { user, mutate } = useAuthGuard({ middleware: "auth" });
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(undefined);

  const onSubmit = (data: Schema) => {
    setErrors(undefined);
    restClient.updateUser(user!.id.toString(), data)
      .then(() => {
        toast.success("Profile updated successfully");
        mutate();
      })
      .catch((error) => {
        const errData = error.response.data as HttpErrorResponse;
        setErrors(errData);
      });
  };

  useEffect(() => {
    if (user) {
      form.setFieldValue("firstName", user.firstName || '');
      form.setFieldValue("lastName", user.lastName || '');
    }
  }, [user])

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validate: zodResolver(schema),
  });

  return (
    <div className="max-w-screen-sm">
        <form
          onSubmit={form.onSubmit(onSubmit)}
          className="flex flex-col gap-y-2"
        >
          <TextInput {...form.getInputProps('firstName')} label="First name" />
          <TextInput {...form.getInputProps('lastName')} label="Last name" />

          <Button type="submit">Update profile</Button>
        </form>

      <ErrorFeedback data={errors} />
    </div>
  );
}
