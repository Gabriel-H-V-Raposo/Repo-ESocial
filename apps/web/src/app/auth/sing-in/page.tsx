import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

import githubIcon from "@/assets/github-icon.svg";
import googleIcon from "@/assets/google-icon.svg";
import Image from "next/image";

export default function SignInPage() {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input name="email" type="email" id="email" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Password</Label>
        <Input name="email" type="email" id="email" />

        <Link
          href="/auth/forgot-password"
          className="text-xs font-medium text-foreground hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <Button type="submit" className="w-full">
        Sign in
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
