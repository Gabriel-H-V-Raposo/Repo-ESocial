import { isAuthenticating } from "@/auth/auth";
import { Header } from "@/components/header";
import { redirect } from "next/navigation";
import React from "react";

export default async function AppLayout({
  children,
  teste,
}: Readonly<{
  children: React.ReactNode;
  teste: React.ReactNode;
}>) {
  if (!isAuthenticating()) {
    redirect("/auth/sign-in");
  }

  return (
    <>
      {children}
      {teste}
    </>
  );
}
