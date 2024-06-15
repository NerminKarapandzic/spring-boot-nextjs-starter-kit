import useSWR from "swr";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import httpClient from "../httpClient";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import { UserResponse } from "@/models/user/UserResponse";

interface AuthProps {
  middleware?: "auth" | "guest";
  redirectIfAuthenticated?: string;
}

export const useAuthGuard = ({
  middleware,
  redirectIfAuthenticated,
}: AuthProps) => {
  const router = useRouter();

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/auth/me", () =>
    httpClient.get<UserResponse>("/api/auth/me").then((res) => res.data)
  );

  const login = async ({
    onError,
    props,
  }: {
    onError: (errors: HttpErrorResponse | undefined) => void;
    props: any;
  }) => {
    onError(undefined);
    //await csrf();
    httpClient
      .post<HttpErrorResponse>("/api/auth/login", {
        email: props.email,
        password: props.password,
      })
      .then(() => mutate())
      .catch((err) => {
        const errors = err.response.data as HttpErrorResponse;
        onError(errors);
      });
  };

  // const csrf = async () => {
  //   await httpClient.get("/api/auth/csrf")
  // }

  const logout = async () => {
    if (!error) {
      await httpClient.post("/api/auth/logout").then(() => mutate());
    }

    window.location.pathname = "/auth/login";
  };

  useEffect(() => {
    // If middleware is 'guest' and we have a user, redirect
    if (middleware === "guest" && redirectIfAuthenticated && user) {
      router.push(redirectIfAuthenticated);
    }

    // If middleware is 'auth' and we have an error, logout
    if (middleware === "auth" && error) {
      logout();
    }
  }, [user, error]);

  return {
    user,
    login,
    logout,
    mutate
  };
};
