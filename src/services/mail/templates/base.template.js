// APP_NAME is the single source of truth for templates.
// Set APP_NAME in your .env (or config.js) — falls back to 'App'.
export const APP_NAME = process.env.APP_NAME || 'App'

const year = new Date().getFullYear()

export function baseTemplate(title, body) {
  return `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8"/>
              <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
              <title>${title}</title>
            </head>
            <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f3f4f6;padding:48px 16px">
                <tr>
                  <td align="center">
                    <table width="560" cellpadding="0" cellspacing="0" role="presentation"
                           style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.07)">
                      <!-- Header -->
                      <tr>
                        <td style="background:#4f46e5;padding:32px 40px;text-align:center">
                          <span style="color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.3px">${APP_NAME}</span>
                        </td>
                      </tr>
                      <!-- Body -->
                      <tr>
                        <td style="padding:40px 40px 32px">
                          <h2 style="margin:0 0 20px;color:#111827;font-size:20px;font-weight:600">${title}</h2>
                          ${body}
                        </td>
                      </tr>
                      <!-- Footer -->
                      <tr>
                        <td style="padding:20px 40px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center">
                          <p style="margin:0;color:#9ca3af;font-size:12px">
                            © ${year} ${APP_NAME}. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>`
}

export const p = (text) => `<p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.65">${text}</p>`

export const muted = (text) => `<p style="margin:16px 0 0;color:#9ca3af;font-size:12px;line-height:1.6">${text}</p>`

export const otpBlock = (otp) => {
  return `<div style="margin:24px 0;padding:24px;background:#eef2ff;border-radius:12px;text-align:center">
            <p style="margin:0 0 8px;color:#6366f1;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase">
              One-Time Password
            </p>
            <p style="margin:0;font-size:40px;font-weight:700;letter-spacing:14px;color:#4f46e5;font-variant-numeric:tabular-nums">
              ${otp}
            </p>
            <p style="margin:8px 0 0;color:#6b7280;font-size:13px">
              Valid for <strong>10 minutes</strong>
            </p>
          </div>`
}