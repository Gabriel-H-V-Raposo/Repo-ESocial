import { api } from "./api-client";

interface SignInWithEmailAndPasswordRequest {
  name: string;
  email: string;
  password: string;
}

type SignInWithEmailAndPasswordResponse = void;

export async function signUp({
  name,
  email,
  password,
}: SignInWithEmailAndPasswordRequest): Promise<SignInWithEmailAndPasswordResponse> {
  await api.post("auth/create-account", {
    json: {
      name,
      email,
      password,
    },
  });
}
