"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

import githubIcon from "@/assets/github-icon.svg";
import googleIcon from "@/assets/google-icon.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signUpAction } from "./actions";
import { useFormState } from "@/hooks/use-form-state";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { signInWithGithub } from "../actions";

export function SignUpForm() {
  const router = useRouter();

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signUpAction,
    () => {
      router.push("/auth/sign-in");
    }
  );
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success == false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign in failed!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-1">
          <Label htmlFor="email">Name</Label>
          <Input name="name" id="name" />
        </div>
        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input name="email" type="email" id="email" />
        </div>
        {errors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </p>
        )}

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input name="password" type="password" id="password" />
        </div>
        {errors?.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password[0]}
          </p>
        )}

        <div className="space-y-1">
          <Label htmlFor="password_confirmation">Confirm your password</Label>
          <Input
            name="password_confirmation"
            type="password"
            id="password_confirmation"
          />
        </div>
        {errors?.password_confirmation && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password_confirmation[0]}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : "Sign up"}
        </Button>

        <Button variant="link" className="w-full" size="sm" asChild>
          <Link href="/auth/sign-in">Already registered? Sign in</Link>
        </Button>
      </form>

      <Separator />

      <form action={signInWithGithub}>
        <Button variant="outline" type="submit" className="w-full">
          <Image
            src={githubIcon}
            alt="Sing in with GitHub"
            width={24}
            height={24}
            className="mr-2 size-4 dark:invert"
          />
          Sign up with GitHub
        </Button>
      </form>

      <form action="">
        <Button variant="outline" type="submit" className="w-full">
          <Image
            src={googleIcon}
            alt="Sing in with google"
            width={24}
            height={24}
            className="mr-2 size-4"
          />
          Sign up with Google
        </Button>
      </form>
    </div>
  );
}