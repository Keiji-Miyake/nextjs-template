import {
  RequestCookies,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "next-auth/middleware";

/**
 * Copy cookies from the Set-Cookie header of the response to the Cookie header of the request,
 * so that it will appear to SSR/RSC as if the user already has the new cookies.
 */
function applySetCookie(req: NextRequest, res: NextResponse): void {
  // parse the outgoing Set-Cookie header
  const setCookies = new ResponseCookies(res.headers);
  // Build a new Cookie header for the request by adding the setCookies
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));
  // set “request header overrides” on the outgoing response
  NextResponse.next({
    request: { headers: newReqHeaders },
  }).headers.forEach((value, key) => {
    if (
      key === "x-middleware-override-headers" ||
      key.startsWith("x-middleware-request-")
    ) {
      res.headers.set(key, value);
    }
  });
}

const authMiddleware = withAuth({
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/member/:path*",
    "/profile/:path*",
    "/password/:path*",
    "/sample/:path*",
  ],
};

export function middleware(req: NextRequest) {
  // /sample ページはログイン不要
  if (req.nextUrl.pathname.startsWith("/sample")) {
    console.log("sampleページ");
    const response = NextResponse.next();
    // URLパスを取得
    const path = req.nextUrl.pathname;

    // パスが /user/[id]/edit の形式に一致するか確認
    // const match = path.match(/^\/user\/(.+)\/edit$/);
    const match = path.match(/^\/sample\/cookie$/);
    // /sample/cookieページではCookieを設定
    if (match) {
      const middlewareCookie = req.cookies.get("middleware")?.value;
      if (!middlewareCookie) {
        const cookieOptions = {
          name: "middleware",
          value: "middlewareで設定",
          options: {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            // sameSite: "lax",
            secure: true,
            httpOnly: true,
          },
        };
        response.cookies.set(cookieOptions);
      }
    }

    applySetCookie(req, response);
    return response;
  } else {
    return (authMiddleware as any)(req);
  }
}
