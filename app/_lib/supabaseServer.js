import "server-only";

import { createClient } from "@supabase/supabase-js";

export function createServerSupabaseClient(accessToken) {
	if (!accessToken) {
		throw new Error("Supabase access token is required.");
	}

	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
		{
			accessToken: async () => accessToken,
		},
	);
}
