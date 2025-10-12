// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Create a safe Supabase client. If env vars are missing, expose a minimal shim
// so call sites can gracefully fallback without crashing or causing Edge warnings.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function createShim() {
	let warned = false;
	const warn = () => {
		if (!warned) {
			console.warn('[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Using no-op client.');
			warned = true;
		}
	};
	const chain = {
		select() { warn(); return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); },
		eq() { return chain; },
		order() { return chain; },
		limit() { return chain; },
		or() { return chain; },
	} as any;
	return {
		from() { warn(); return chain; },
	} as any;
}

export const supabase = (supabaseUrl && supabaseKey)
	? createClient<Database>(supabaseUrl, supabaseKey)
	: createShim();
