// lib/stripeConfig.ts
// Centralized helpers to resolve Stripe environment variables robustly

const PUB_CANDIDATES = [
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLIC_KEY',
  'STRIPE_PUBLIC_KEY',
];

// Prefer STRIPE_API_KEY if both are set (often used by platforms/ops)
const SEC_CANDIDATES = [
  'STRIPE_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PRIVATE_KEY',
];

const WH_CANDIDATES = [
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_WEBHOOK_SIGNING_SECRET',
];

export function resolveEnv(nameList: string[]): { name: string; value: string } | null {
  for (const name of nameList) {
    const v = process.env[name];
    // Skip placeholder/dummy keys for security
    if (v && v.trim() && !isPlaceholderKey(v)) return { name, value: v };
  }
  return null;
}

function isPlaceholderKey(key: string): boolean {
  const placeholders = [
    'your_actual_publishable_key_here',
    'your_actual_secret_key_here',
    'your_actual_webhook_secret_here',
    'pk_test_your_actual',
    'sk_test_your_actual',
    'whsec_your_actual'
  ];
  return placeholders.some(placeholder => key.includes(placeholder));
}

export function getPublishableKey(): { key: string; source: string } {
  const hit = resolveEnv(PUB_CANDIDATES);
  if (!hit) {
    throw new Error(
      `Stripe publishable key not configured. Checked: ${PUB_CANDIDATES.join(', ')}`
    );
  }
  return { key: hit.value, source: hit.name };
}

export function getSecretKey(): { key: string; source: string } {
  // 1) Explicit override of which env var to use
  const override = (process.env.STRIPE_SECRET_KEY_SOURCE || '').trim();
  if (override) {
    const v = process.env[override];
    if (v && v.trim()) return { key: v, source: override };
  }

  // 2) Collect all candidates present
  const present = SEC_CANDIDATES
    .map((name) => ({ name, value: (process.env[name] || '').trim() }))
    .filter((e) => !!e.value);

  if (present.length === 0) {
    throw new Error(
      `Stripe secret key not configured. Checked: ${SEC_CANDIDATES.join(', ')}`
    );
  }

  // 3) If we have a publishable key, prefer matching environment (live/test)
  let desiredPrefix: 'sk_live' | 'sk_test' | null = null;
  try {
    const pk = getPublishableKey().key;
    desiredPrefix = pk.startsWith('pk_live') ? 'sk_live' : pk.startsWith('pk_test') ? 'sk_test' : null;
  } catch {}

  if (desiredPrefix) {
    const match = present.find((e) => e.value.startsWith(desiredPrefix!));
    if (match) return { key: match.value, source: match.name };
  }

  // 4) Fallback: return the first in our preferred order (STRIPE_API_KEY, then STRIPE_SECRET_KEY, ...)
  return { key: present[0].value, source: present[0].name };
}

export function getWebhookSecret(): { key: string; source: string } | null {
  const hit = resolveEnv(WH_CANDIDATES);
  return hit ? { key: hit.value, source: hit.name } : null;
}

export function redactKey(k?: string | null, show = 6): string | null {
  if (!k) return null;
  const start = k.slice(0, show);
  const type = k.startsWith('pk_live') || k.startsWith('sk_live') ? 'live' : (k.startsWith('pk_test') || k.startsWith('sk_test') ? 'test' : 'unknown');
  return `${start}… (${type})`;
}

export const STRIPE_API_VERSION = process.env.STRIPE_API_VERSION || '2024-06-20';

// Diagnostics helper: list all candidate env names found with redacted values
export function listSecretKeyCandidates(): Array<{ source: string; redacted: string | null }> {
  return SEC_CANDIDATES.map((name) => ({
    source: name,
    redacted: redactKey(process.env[name] || null),
  }));
}
