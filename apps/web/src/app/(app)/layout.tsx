import { isAuthenticating } from "@/auth/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AppLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode;
  sheet: React.ReactNode;
}>) {
  if (!isAuthenticating()) {
    redirect("/auth/sign-in");
  }

  return (
    <>
      {children}
      {sheet}
    </>
  );
}
