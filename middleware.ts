import { NextResponse, type NextRequest } from "next/server";

const LAMINAR_HOST = "laminar.cajaun.com";
const LAMINAR_ROUTES: Record<string, string> = {
  "/": "/laminar",
  "/api": "/laminar/api",
  "/variants": "/laminar/variants",
  "/styling": "/laminar/styling",
  "/motion": "/laminar/motion",
  "/guides": "/laminar/guides",
  "/examples": "/laminar/examples",
};

export function middleware(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host") ?? "";
  const hostname = host.split(":")[0].toLowerCase();

  const rewritePath = LAMINAR_ROUTES[request.nextUrl.pathname];

  if (hostname === LAMINAR_HOST && rewritePath) {
    const url = request.nextUrl.clone();
    url.pathname = rewritePath;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/api", "/variants", "/styling", "/motion", "/guides", "/examples"],
};
