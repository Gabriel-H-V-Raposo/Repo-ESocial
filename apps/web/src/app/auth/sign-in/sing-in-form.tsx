"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

import githubIcon from "@/assets/github-icon.svg";
import googleIcon from "@/assets/google-icon.svg";
import Image from "next/image";
import { signInWithEmailAndPassword } from "./actions";
import { useActionState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SignInForm() {
  const [{ errors, message, success }, formAction, isPending] = useActionState(
    signInWithEmailAndPassword,
    { success: false, message: null, errors: null }
  );
  return (
    <form action={formAction} className="space-y-4">
      {success == false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sing in failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input name="email" type="email" id="email" />

        {errors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />

        {errors?.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password[0]}
          </p>
        )}

        <Link
          href="/auth/forgot-password"
          className="text-xs font-medium text-foreground hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
      </Button>

      <Button variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-up">Create new account</Link>
      </Button>

      <Separator />

      <Button variant="outline" type="submit" className="w-full">
        <Image
          src={githubIcon}
          alt="Sing in with GitHub"
          width={24}
          height={24}
          className="mr-2 size-4 dark:invert"
        />
        Sing in with GitHub
      </Button>

      <Button variant="outline" type="submit" className="w-full">
        <Image
          src={googleIcon}
          alt="Sing in with google"
          width={24}
          height={24}
          className="mr-2 size-4"
        />
        Sing in with Google
      </Button>
    </form>
  );
}