// lib/taxCodes.ts
import { supabaseAdmin } from "./supabaseAdmin";

const DEFAULT_TAX_CODE = "txcd_99999999"; // generic tangible goods (replace if needed)

let cache: Record<string, string> | null = null;
let cacheAt = 0;
const TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function loadSkuTaxCodeMap(): Promise<Record<string, string>> {
  const now = Date.now();
  if (cache && (now - cacheAt) < TTL_MS) return cache;
  const table = process.env.SUPABASE_TAXCODE_TABLE || "product_tax_codes";
  const { data, error } = await supabaseAdmin.from(table).select("sku, tax_code");
  if (error) {
    console.warn("Supabase tax-code map fetch failed", error);
    cache = {};
  } else {
    cache = {};
    for (const row of (data || []) as any[]) {
      if ((row as any).sku && (row as any).tax_code) cache[(row as any).sku] = (row as any).tax_code;
    }
  }
  cacheAt = now;
  return cache || {};
}

export async function codeForSKU(sku?: string): Promise<string> {
  const map = await loadSkuTaxCodeMap();
  if (!sku) return DEFAULT_TAX_CODE;
  return map[sku] || DEFAULT_TAX_CODE;
}
