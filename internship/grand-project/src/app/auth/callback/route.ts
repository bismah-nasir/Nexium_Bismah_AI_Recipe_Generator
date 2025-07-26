// // app/auth/callback/route.ts (for App Router)
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//     const supabase = createRouteHandlerClient({ cookies });
//     const { searchParams } = new URL(request.url);
//     const code = searchParams.get("code");

//     if (code) {
//         await supabase.auth.exchangeCodeForSession(code);
//     }

//     return NextResponse.redirect("/dashboard");
// }

// app/auth/callback/route.ts (for App Router)
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    // Fix 1: Get the cookies store explicitly to resolve the "sync dynamic APIs" error.
    // This ensures that the `cookies()` function is called at the top level.
    const cookieStore = cookies();

    // Fix 2: Pass the cookies store to the Supabase client.
    // The client will then use this store to read and write cookies correctly.
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    if (code) {
        // This exchanges the code for a session and sets the session cookies
        // on the response object that will eventually be returned.
        await supabase.auth.exchangeCodeForSession(code);
    }

    // Fix 3: Redirect to the dashboard using an absolute URL.
    // This resolves the "URL is malformed" error.
    return NextResponse.redirect(new URL("/dashboard", requestUrl));
}
