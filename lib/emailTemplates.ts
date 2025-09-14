const baseStyles = `
  body{font-family:Arial,Helvetica,sans-serif;color:#1a202c;margin:0;padding:0}
  .container{max-width:640px;margin:0 auto;padding:24px}
  .card{border:1px solid #e2e8f0;border-radius:12px;padding:16px}
  .brand{color:#174F2E}
  .btn{display:inline-block;background:#174F2E;color:#fff;text-decoration:none;padding:10px 14px;border-radius:6px}
  .muted{color:#64748b;font-size:12px}
  table{width:100%;border-collapse:collapse}
  th,td{text-align:left;padding:8px;border-bottom:1px solid #e2e8f0}
  .logo{max-width:180px;height:auto;display:block;margin-bottom:12px}
`;

export function renderBrandedShell(opts: { title?: string; bodyHtml: string; footerHtml?: string }) {
  const host = process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'
  const logoUrl = host + '/screenshots/logo-with-tagline.png'
  const year = new Date().getFullYear()
  const title = escapeHtml(opts.title || "Nature's Way Soil")
  const footer = opts.footerHtml || `<p class="muted">© ${year} Nature's Way Soil</p>`
  return `<!doctype html><html><head><meta charSet='utf-8'/><style>${baseStyles}</style></head><body><div class="container">
    <img src="${logoUrl}" alt="Nature's Way Soil" class="logo"/>
    <h1 class="brand" style="margin:0 0 4px">${title}</h1>
    <div class="card">${opts.bodyHtml}</div>
    ${footer}
  </div></body></html>`
}

export function orderConfirmationHTML(params: {
  orderId: string;
  name: string;
  email: string;
  items: Array<{ title: string; size: string; qty: number; price: number; sku: string }>;
  subtotal: number;
  tax?: number;
  total?: number;
  shipping?: { address1?: string; address2?: string; city?: string; state?: string; zip?: string; county?: string };
}) {
  const { orderId, name, items, subtotal } = params;
  const tax = Number(params.tax || 0);
  const total = Number(params.total || subtotal + tax);
  const s = params.shipping || {};
  const rows = items.map(it => `
    <tr>
      <td>${escapeHtml(it.title)}<div class="muted">${escapeHtml(it.size)} • SKU: ${escapeHtml(it.sku)}</div></td>
      <td>${it.qty}</td>
      <td>$${Number(it.price).toFixed(2)}</td>
      <td style="text-align:right">$${(Number(it.price) * Number(it.qty)).toFixed(2)}</td>
    </tr>
  `).join('');
  return `<!doctype html>
  <html><head><meta charSet="utf-8"/><style>${baseStyles}</style></head>
  <body>
    <div class="container">
      <img src="${process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'}/screenshots/logo-with-tagline.png" alt="Logo" class="logo"/>
      <h1 class="brand">Nature's Way Soil</h1>
      <div class="card">
        <h2>Thanks for your order, ${escapeHtml(name)}!</h2>
        <p><b>Order ID:</b> ${escapeHtml(orderId)}</p>
        <table>
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Price</th><th style="text-align:right">Total</th></tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align:right"><b>Subtotal</b></td>
              <td style="text-align:right"><b>$${Number(subtotal).toFixed(2)}</b></td>
            </tr>
            <tr>
              <td colspan="3" style="text-align:right">Sales Tax</td>
              <td style="text-align:right">$${tax.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align:right"><b>Total</b></td>
              <td style="text-align:right"><b>$${total.toFixed(2)}</b></td>
            </tr>
          </tfoot>
        </table>
        <div style="margin-top:12px" class="muted">
          <div><b>Ship To:</b></div>
          <div>${escapeHtml(s.address1 || '')} ${escapeHtml(s.address2 || '')}</div>
          <div>${escapeHtml(s.city || '')}${s.city ? ',' : ''} ${escapeHtml(s.state || '')} ${escapeHtml(s.zip || '')}</div>
          ${s.county ? `<div>${escapeHtml(s.county)} County</div>` : ''}
        </div>
        <p class="muted">If you have any questions, just reply to this email.</p>
      </div>
      <p class="muted">© ${new Date().getFullYear()} Nature's Way Soil</p>
    </div>
  </body></html>`;
}

export function contactHTML(params: { name: string; email: string; message: string; department?: string }) {
  const { name, email, message, department } = params;
  return `<!doctype html>
  <html><head><meta charSet="utf-8"/><style>${baseStyles}</style></head>
  <body>
    <div class="container">
      <h1 class="brand">New ${escapeHtml(department || 'support')} contact</h1>
      <div class="card">
        <p><b>From:</b> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
      <p class="muted">This message was sent from your website contact form.</p>
    </div>
  </body></html>`;
}

export function simpleOrderConfirmationHTML(params: {
  orderId: string;
  name?: string;
  email?: string;
  subtotal?: number; // dollars
  tax?: number; // dollars
  total?: number; // dollars
  shipping?: { address1?: string; address2?: string; city?: string; state?: string; zip?: string; county?: string };
}) {
  const { orderId } = params;
  const name = params.name || 'Customer';
  const subtotal = Number(params.subtotal ?? 0);
  const tax = Number(params.tax ?? 0);
  const total = Number(params.total ?? subtotal + tax);
  const s = params.shipping || {};
  return `<!doctype html>
  <html><head><meta charSet="utf-8"/><style>${baseStyles}</style></head>
  <body>
    <div class="container">
      <img src="${process.env.PUBLIC_SITE_URL || 'https://natureswaysoil.com'}/screenshots/logo-with-tagline.png" alt="Logo" class="logo"/>
      <h1 class="brand">Nature's Way Soil</h1>
      <div class="card">
        <h2>Thanks for your order, ${escapeHtml(name)}!</h2>
        <p><b>Order ID:</b> ${escapeHtml(orderId)}</p>
        <table>
          <tbody>
            <tr><td><b>Subtotal</b></td><td style="text-align:right">$${subtotal.toFixed(2)}</td></tr>
            <tr><td>Sales Tax</td><td style="text-align:right">$${tax.toFixed(2)}</td></tr>
            <tr><td><b>Total</b></td><td style="text-align:right"><b>$${total.toFixed(2)}</b></td></tr>
          </tbody>
        </table>
        <div style="margin-top:12px" class="muted">
          <div><b>Ship To:</b></div>
          <div>${escapeHtml(s.address1 || '')} ${escapeHtml(s.address2 || '')}</div>
          <div>${escapeHtml(s.city || '')}${s.city ? ',' : ''} ${escapeHtml(s.state || '')} ${escapeHtml(s.zip || '')}</div>
          ${s.county ? `<div>${escapeHtml(s.county)} County</div>` : ''}
        </div>
        <p class="muted">If you have any questions, just reply to this email.</p>
        <a class="btn" href="https://natureswaysoil.com/" target="_blank" rel="noopener noreferrer">Visit our store</a>
      </div>
      <p class="muted">© ${new Date().getFullYear()} Nature's Way Soil</p>
    </div>
  </body></html>`;
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
