import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase-server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
        // This exchanges the code for a session and sets the session cookies
        // on the response object that will eventually be returned.
        const supabase = await createSupabaseServerClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    // Redirect to the dashboard using an absolute URL.
    // This resolves the "URL is malformed" error.
    return NextResponse.redirect(new URL("/dashboard", requestUrl));
}
