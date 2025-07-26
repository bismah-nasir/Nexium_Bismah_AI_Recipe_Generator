// // middleware.ts
// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//     const res = NextResponse.next();
//     const supabase = createMiddlewareClient({ req, res });

//     await supabase.auth.getSession(); // Refreshes session from cookie if expired
//     return res;
// }

// export const config = {
//     matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };

// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    console.log('Running middleware....');
    const res = NextResponse.next();
    // console.log('REs:', res);
    const supabase = createMiddlewareClient({ req, res });
    // console.log('Supabase:', supabase);

    // This command is critical: it attempts to refresh the session
    // from the cookies and updates them on the response.
    // Ensure this line is always awaited and completes.
    await supabase.auth.getSession();

    // Debugging: Log session status in middleware
    const { data } = await supabase.auth.getSession(); // Re-fetch for logging
    const {session} = data;
    console.log('Maryam session:', session);
    console.log('Middleware: Session data:', session ? session.user.email : 'No session');

    return res;
}

export const config = {
    // This matcher ensures the middleware runs on almost all routes,
    // which is what you want for auth.
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
