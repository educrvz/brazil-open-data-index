import { geolocation, next } from "@vercel/functions";

const GEO_LANGUAGE_COOKIE = "bodi_default_language";
const USER_LANGUAGE_COOKIE = "bodi_language";

export const config = {
  matcher: "/",
};

function hasCookie(cookieHeader, name) {
  return cookieHeader.split(";").some((cookie) => cookie.trim().startsWith(`${name}=`));
}

export default function middleware(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  if (hasCookie(cookieHeader, USER_LANGUAGE_COOKIE)) {
    return next();
  }

  const country = geolocation(request).country ?? request.headers.get("x-vercel-ip-country");
  const defaultLanguage = country === "BR" ? "pt" : "en";

  return next({
    headers: {
      "set-cookie": `${GEO_LANGUAGE_COOKIE}=${defaultLanguage}; Path=/; Max-Age=86400; SameSite=Lax; Secure`,
    },
  });
}
