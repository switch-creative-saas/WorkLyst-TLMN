import { useBrandingStore } from '@/stores/useBrandingStore';

export interface EmailBranding {
  orgName: string;
  orgAcronym: string;
  orgLogoUrl: string | null;
  primaryColor: string;
  address: string | null;
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const interpolate = (template: string, variables: Record<string, string>) =>
  template.replace(/\{\{([^}]+)\}\}/g, (_, key: string) => escapeHtml(variables[key.trim()] ?? ''));

export function currentEmailBranding(): EmailBranding {
  const { settings } = useBrandingStore.getState();
  return {
    orgName: settings.organizationName,
    orgAcronym: settings.organizationAcronym,
    orgLogoUrl: settings.organizationLogo || null,
    primaryColor: settings.primaryColor,
    address: settings.address || null,
  };
}

export async function renderTemplate(
  templateName: string,
  variables: Record<string, string>,
  branding: EmailBranding = currentEmailBranding()
): Promise<string> {
  const content = templateBodies[templateName] ?? templateBodies['forgot-password'];
  const logo = branding.orgLogoUrl
    ? `<img src="${escapeHtml(branding.orgLogoUrl)}" alt="${escapeHtml(branding.orgName)} logo" />`
    : `<div class="email-header-initials">${escapeHtml(branding.orgAcronym.slice(0, 2))}</div>`;
  const html = baseTemplate.replace('{{> content}}', content);
  return interpolate(html, {
    ...variables,
    orgName: branding.orgName,
    orgAcronym: branding.orgAcronym,
    orgLogoUrl: branding.orgLogoUrl ?? '',
    orgAddress: branding.address ?? '',
    primaryColor: branding.primaryColor,
    currentYear: new Date().getFullYear().toString(),
    subject: variables.subject ?? templateName,
    headerLogo: logo,
  });
}

const baseTemplate = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>{{subject}}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#f4f4f5;color:#18181b;-webkit-font-smoothing:antialiased}.email-wrapper{width:100%;padding:40px 16px;background-color:#f4f4f5}.email-container{max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.04)}.email-header{background-color:{{primaryColor}};padding:32px 40px;text-align:center}.email-header img{height:48px;width:auto;object-fit:contain;margin:0 auto 12px;display:block}.email-header-initials{display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;background-color:rgba(255,255,255,.2);border-radius:12px;color:#fff;font-size:22px;font-weight:700;margin-bottom:12px}.email-header h1{color:#fff;font-size:18px;font-weight:600}.email-body{padding:40px 40px 32px}.email-icon{width:56px;height:56px;border-radius:50%;background-color:{{primaryColor}}18;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:28px}.email-body h2{font-size:22px;font-weight:700;color:#18181b;margin-bottom:12px;text-align:center}.email-body p{font-size:15px;line-height:1.7;color:#52525b;margin-bottom:16px}.btn-wrapper{text-align:center;margin:28px 0}.btn-primary{display:inline-block;background-color:{{primaryColor}};color:#fff!important;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px}.info-box{background:#f4f4f5;border-radius:8px;padding:16px 20px;margin:20px 0}.warning-box{background:#fefce8;border:1px solid #fde047;border-radius:8px;padding:14px 18px;margin:20px 0}.credentials-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px 24px;margin:20px 0}.cred-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #dcfce7}.cred-row:last-child{border-bottom:none}.cred-label{font-size:13px;color:#15803d;font-weight:600;text-transform:uppercase}.cred-value{font-size:15px;color:#14532d;font-weight:700;font-family:'Courier New',Courier,monospace;background:#dcfce7;padding:2px 10px;border-radius:4px}.divider{border:none;border-top:1px solid #f1f1f1;margin:24px 0}.url-fallback{font-size:12px;color:#a1a1aa;word-break:break-all;text-align:center;margin-top:8px}.email-footer{background:#fafafa;border-top:1px solid #f1f1f1;padding:24px 40px;text-align:center}.email-footer p{font-size:12px;color:#a1a1aa;line-height:1.6;margin-bottom:4px}.email-footer a{color:{{primaryColor}};text-decoration:none}@media(max-width:600px){.email-body{padding:28px 24px}.email-header{padding:24px}.email-footer{padding:20px 24px}.email-body h2{font-size:20px}}</style></head>
<body><div class="email-wrapper"><div class="email-container"><div class="email-header">{{headerLogo}}<h1>{{orgName}}</h1></div><div class="email-body">{{> content}}</div><div class="email-footer"><p>This email was sent by <strong>{{orgName}}</strong></p><p>{{orgAddress}}</p><p style="margin-top:12px;">If you did not expect this email, you can safely ignore it.</p><p style="margin-top:8px;">&copy; {{currentYear}} {{orgName}}. All rights reserved.</p></div></div><p style="text-align:center;font-size:11px;color:#a1a1aa;margin-top:16px;">This is an automated message. Please do not reply to this email.</p></div></body></html>`;

const templateBodies: Record<string, string> = {
  'forgot-password': `<div class="email-icon">🔐</div><h2>Reset Your Password</h2><p>Hi <strong>{{firstName}}</strong>,</p><p>We received a request to reset the password for your <strong>{{orgName}}</strong> account. Click the button below to choose a new password.</p><div class="btn-wrapper"><a href="{{resetUrl}}" class="btn-primary">Reset My Password</a></div><p class="url-fallback">Or copy this link into your browser:<br/>{{resetUrl}}</p><div class="warning-box"><p>⏱ <strong>This link expires in 1 hour</strong> and can only be used once. If it expires, you can request a new one.</p></div><hr class="divider" /><p style="font-size:13px;color:#a1a1aa;text-align:center;">If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>`,
  'password-reset-success': `<div class="email-icon">✅</div><h2>Password Changed Successfully</h2><p>Hi <strong>{{firstName}}</strong>,</p><p>Your password for your <strong>{{orgName}}</strong> account was successfully changed on <strong>{{changedAt}}</strong>.</p><div class="info-box"><strong>Account</strong><p>{{username}}</p></div><p>You can now log in with your new password.</p><div class="btn-wrapper"><a href="{{loginUrl}}" class="btn-primary">Go to Login</a></div>`,
  'welcome-staff': `<div class="email-icon">👋</div><h2>Welcome to {{orgName}}!</h2><p>Hi <strong>{{firstName}}</strong>,</p><p>Your staff account has been created on the <strong>{{orgName}} Operations Platform</strong>.</p><div class="credentials-box"><div class="cred-row"><span class="cred-label">Username</span><span class="cred-value">{{username}}</span></div><div class="cred-row"><span class="cred-label">Temporary Password</span><span class="cred-value">{{tempPassword}}</span></div><div class="cred-row"><span class="cred-label">Your Role</span><span class="cred-value">{{role}}</span></div></div><div class="btn-wrapper"><a href="{{loginUrl}}" class="btn-primary">Log In to Your Dashboard</a></div>`,
  'admin-password-reset': `<div class="email-icon">🔑</div><h2>Your Password Has Been Reset</h2><p>Hi <strong>{{firstName}}</strong>,</p><p>Your password on the <strong>{{orgName}}</strong> platform has been reset by an administrator.</p><div class="credentials-box"><div class="cred-row"><span class="cred-label">Username</span><span class="cred-value">{{username}}</span></div><div class="cred-row"><span class="cred-label">Temporary Password</span><span class="cred-value">{{tempPassword}}</span></div></div><div class="btn-wrapper"><a href="{{loginUrl}}" class="btn-primary">Log In Now</a></div>`,
  'request-status': `<div class="email-icon">{{statusIcon}}</div><h2>Request {{statusLabel}}</h2><p>Hi <strong>{{firstName}}</strong>,</p><p>Your request has been <strong>{{statusLabel}}</strong> by <strong>{{reviewerName}}</strong>.</p><div class="info-box"><strong>Request Details</strong><p><strong>Reference:</strong> {{requestCode}}<br/><strong>Title:</strong> {{requestTitle}}</p></div><div class="btn-wrapper"><a href="{{requestUrl}}" class="btn-primary">View Request</a></div>`,
  'safeguarding-notification': `<div class="email-icon">🛡️</div><h2>New Safeguarding Report</h2><p>Hi <strong>{{firstName}}</strong>,</p><p>A new safeguarding report has been submitted and requires your attention.</p><div class="info-box"><strong>Report Summary</strong><p><strong>Report ID:</strong> {{reportCode}}<br/><strong>Issue Type:</strong> {{issueType}}<br/><strong>Reporter:</strong> {{reporterDisplay}}</p></div><div class="btn-wrapper"><a href="{{reportUrl}}" class="btn-primary">Review Report</a></div>`,
};
