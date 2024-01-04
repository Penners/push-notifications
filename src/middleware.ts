import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const today = new Date();
  const expires = new Date(today.setFullYear(new Date().getFullYear() + 2));
  if (!request.cookies.get("x-id")?.value) {
    const id = crypto.randomUUID();
    response.cookies.set({
      value: id,
      httpOnly: true,
      expires: expires,
      name: "x-id",
    });
  } else {
    response.cookies.set({
      httpOnly: true,
      expires: expires,
      name: "x-id",
      value: request.cookies.get("x-id")?.value as string,
    });
  }
  return response;
}
