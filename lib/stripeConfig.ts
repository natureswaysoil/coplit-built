// lib/stripeConfig.ts
// Centralized helpers to resolve Stripe environment variables robustly

const PUB_CANDIDATES = [
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLIC_KEY',
  'STRIPE_PUBLIC_KEY',
];

const SEC_CANDIDATES = [
  'STRIPE_SECRET_KEY',
  'STRIPE_API_KEY',
  'STRIPE_PRIVATE_KEY',
];

const WH_CANDIDATES = [
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_WEBHOOK_SIGNING_SECRET',
];

export function resolveEnv(nameList: string[]): { name: string; value: string } | null {
  for (const name of nameList) {
    const v = process.env[name];
    if (v && v.trim()) return { name, value: v };
  }
  return null;
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
  const hit = resolveEnv(SEC_CANDIDATES);
  if (!hit) {
    throw new Error(
      `Stripe secret key not configured. Checked: ${SEC_CANDIDATES.join(', ')}`
    );
  }
  return { key: hit.value, source: hit.name };
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
