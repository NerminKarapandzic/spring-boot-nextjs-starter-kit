"use client";

import * as React from "react";

import * as z from "zod";
import { toast } from "sonner";
import { useAuthGuard } from "@/lib/auth/use-auth";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import ErrorFeedback from "@/components/error-feedback";
import Link from "next/link";
import { FaGithub, FaGoogle} from "react-icons/fa";
import { Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type Schema = z.infer<typeof loginFormSchema>;
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const {login} = useAuthGuard({middleware: 'guest', redirectIfAuthenticated: '/profile'});
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(undefined);

  async function onSubmit(data: Schema) {
    login({
      onError: (errors) => {
        setErrors(errors)
        if (errors) {
          toast.error("Authentication failed");
        }
      },
      props: data,
    })
  }

  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: zodResolver(loginFormSchema),
  })

  function getProviderLoginUrl(provider: 'google' | 'facebook' | 'github' | 'okta') {
    return process.env.NEXT_PUBLIC_BASE_URL + `/oauth2/authorization/${provider}`
  }

  return (
    <div className="grid gap-6">
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
          </div>

          <ErrorFeedback data={errors} />
          
          <Button disabled={isLoading} type="submit">
            {isLoading && 'Logging in...'}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <Link href={getProviderLoginUrl('github')}>
          <Button variant="default" type="button" disabled={isLoading} className="w-full" fullWidth>
            <FaGithub className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </Link>
        
        <Link href={getProviderLoginUrl('google')}>
          <Button variant="default" type="button" disabled={isLoading} className="w-full" fullWidth>
            <FaGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
        </Link>
      </div>
    </div>
  );
}
