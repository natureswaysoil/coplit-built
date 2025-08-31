// components/PromoField.tsx
import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onValidChange?: (valid: boolean, details?: any) => void;
};

export default function PromoField({ value, onChange, onValidChange }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle"|"valid"|"invalid"|"checking">("idle");
  const [details, setDetails] = useState<any>(null);
  const timer = useRef<any>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!value) { setSuggestions([]); setStatus("idle"); setDetails(null); onValidChange?.(false); return; }
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/promo/suggest?q=${encodeURIComponent(value)}`);
        const j = await r.json();
        setSuggestions(j.suggestions || []);
      } catch {}
    }, 200);
    return () => timer.current && clearTimeout(timer.current);
  }, [value]);

  async function validate(code: string) {
    setStatus("checking");
    try {
      const r = await fetch(`/api/promo/validate?code=${encodeURIComponent(code)}`);
      const j = await r.json();
      if (j.valid) {
        setStatus("valid");
        setDetails(j);
        onValidChange?.(true, j);
      } else {
        setStatus("invalid");
        setDetails(null);
        onValidChange?.(false);
      }
    } catch {
      setStatus("invalid"); setDetails(null); onValidChange?.(false);
    }
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input className="border p-2 w-64" placeholder="Promo code" value={value}
               onChange={e=>onChange(e.target.value.toUpperCase())}
               onBlur={()=> value && validate(value)} />
        <button type="button" className="px-3 py-2 rounded bg-gray-900 text-white" onClick={()=> validate(value)}>
          {status==="checking" ? "Checking…" : "Apply"}
        </button>
      </div>
      {suggestions.length>0 && (
        <div className="absolute z-10 mt-1 bg-white border rounded shadow w-64">
          {suggestions.map(s => (
            <div key={s} className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                 onMouseDown={()=>{ onChange(s); validate(s); setSuggestions([]); }}>
              {s}
            </div>
          ))}
        </div>
      )}
      {status==="valid" && <div className="text-green-700 text-sm mt-1">Valid code applied.</div>}
      {status==="invalid" && <div className="text-red-600 text-sm mt-1">Invalid or inactive code.</div>}
    </div>
  );
}
