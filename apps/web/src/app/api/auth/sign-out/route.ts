import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Detectar se estamos em produção ou desenvolvimento
  const baseUrl = "https://esocial.bjsolutions.com.br";

  const redirectUrl = new URL("/auth/sign-in", baseUrl);

  cookies().delete("token");

  return NextResponse.redirect(redirectUrl.toString());
}
