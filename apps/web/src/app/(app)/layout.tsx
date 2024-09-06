import { isAuthenticating } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isAuthenticating()) {
    redirect("/auth/sign-in");
  }

  return <>{children}</>;
}
