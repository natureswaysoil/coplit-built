import { Resend } from 'resend'

export interface SendArgs {
  to: string | string[]
  subject: string
  html: string
  fromOverride?: string
  cc?: string[]
  bcc?: string[]
  replyTo?: string
}

let client: Resend | null = null
function getClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!client) client = new Resend(process.env.RESEND_API_KEY)
  return client
}

export async function sendBasicEmail(args: SendArgs) {
  const c = getClient()
  const toArray = Array.isArray(args.to) ? args.to : [args.to]
  if (!c) {
    console.log('[email:mock]', { to: toArray, subject: args.subject, bytes: args.html.length })
    return { id: 'mock' }
  }
  const maxAttempts = 3
  let attempt = 0
  let lastErr: any = null
  while (attempt < maxAttempts) {
    attempt++
    const started = Date.now()
    try {
      const { data, error } = await c.emails.send({
        from: args.fromOverride || process.env.RESEND_FROM || 'Nature\'s Way Soil <no-reply@natureswaysoil.com>',
        to: toArray,
        subject: args.subject,
        html: args.html,
        cc: args.cc,
        bcc: args.bcc,
        reply_to: args.replyTo,
      } as any)
      if (error) throw new Error(error.message || 'Resend send failed')
      if (attempt > 1) {
        console.log(`[email:retry] success on attempt ${attempt} (${Date.now() - started}ms)`)
      }
      return data
    } catch (e: any) {
      lastErr = e
      const msg = String(e?.message || e)
      const transient = /timeout|ECONNRESET|ENOTFOUND|429|5\d\d/.test(msg)
      if (attempt >= maxAttempts || !transient) {
        console.error('[email:error]', { attempt, transient, msg })
        break
      }
      const delayMs = Math.min(2000, 150 * Math.pow(2, attempt - 1)) + Math.random() * 100
      console.warn(`[email:retry] attempt ${attempt} failed (${msg}); retrying in ${Math.round(delayMs)}ms`)
      await new Promise(r => setTimeout(r, delayMs))
    }
  }
  throw lastErr || new Error('Resend send failed (unknown)')
}

export async function listDomains() {
  const c = getClient(); if (!c) return { data: [], error: 'not_configured' }
  return c.domains.list()
}

export async function createDomain(name: string) {
  const c = getClient(); if (!c) throw new Error('Email not configured')
  return c.domains.create({ name })
}

export function isEmailConfigured() {
  return !!process.env.RESEND_API_KEY
}
