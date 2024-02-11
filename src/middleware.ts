import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "next-auth/middleware";

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
    return response;
  } else {
    return (authMiddleware as any)(req);
  }
}
