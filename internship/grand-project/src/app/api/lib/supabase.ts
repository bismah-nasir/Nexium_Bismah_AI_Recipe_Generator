import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
// Returns the logged-in user's email, or null if there is no session.
// Works for both password login and the email confirmation link.
export async function getUserEmail() {
    const { data } = await supabase.auth.getSession();
    return data.session?.user.email ?? null;
}

// Signs out this browser only. Supabase's default ("global") would also end the
// user's sessions on every other device and browser.
export async function signOut() {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    // If the server already ended the session, Supabase returns "session_not_found"
    // and leaves the saved session in place, so remove it ourselves.
    if (error && typeof window !== "undefined") {
        Object.keys(localStorage)
            .filter((key) => key.startsWith("sb-") && key.includes("-auth-token"))
            .forEach((key) => localStorage.removeItem(key));
    }
}

// fetch() that sends the user's access token so API routes can verify who is calling.
export async function authFetch(input: string, init: RequestInit = {}) {
    const { data } = await supabase.auth.getSession();
    const headers = new Headers(init.headers);
    if (data.session) {
        headers.set("Authorization", `Bearer ${data.session.access_token}`);
    }
    const res = await fetch(input, { ...init, headers });

    // The server rejected the token (e.g. the session was ended elsewhere or expired),
    // so the session saved in this browser is dead: clear it and send the user to sign in.
    if (res.status === 401 && typeof window !== "undefined") {
        await signOut();
        window.location.href = "/signin";
    }
    return res;
}
