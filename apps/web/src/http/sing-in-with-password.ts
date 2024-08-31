import { api } from "./api-client";

interface SignInWithEmailAndPasswordRequest {
  email: string;
  password: string;
}

interface SignInWithEmailAndPasswordResponse {
  token: string;
}

export async function signInWithPassword({
  email,
  password,
}: SignInWithEmailAndPasswordRequest) {
  const result = await api
    .post("auth/authenticate-with-password", {
      json: {
        email,
        password,
      },
    })
    .json<SignInWithEmailAndPasswordResponse>();

  return result;
}
