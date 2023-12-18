import { withAuth } from "next-auth/middleware";

export default withAuth({
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
  ],
};
