export interface Env {
  RESEND_API_KEY: string;
  OWNER_EMAIL: string;
  FROM_EMAIL: string;
}

type BookingPayload = {
  type: "rental" | "lesson";
  dates: { from: string; to: string };
  items: { itemType: string; itemLabel?: string; segment: string; quantity: number; note?: string }[];
  contact: { email: string; phone: string; messenger: string; messengerHandle?: string };
  comment?: string;
  locale: string;
  createdAtIso: string;
};

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
  });
}

function textResponse(body: string, status = 200, headers: Record<string, string> = {}) {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", ...headers }
  });
}

function validate(payload: BookingPayload): string[] {
  const errors: string[] = [];
  if (!payload?.contact?.email) errors.push("Missing contact.email");
  if (!payload?.contact?.phone) errors.push("Missing contact.phone");
  if (!payload?.dates?.from || !payload?.dates?.to) errors.push("Missing dates");
  if (!Array.isArray(payload?.items) || payload.items.length === 0) errors.push("Missing items");
  return errors;
}

function getItemTypeLabel(itemType: string, itemLabel?: string): string {
  // Если передан label, используем его
  if (itemLabel) {
    return itemLabel;
  }
  
  // Старые типы (для обратной совместимости)
  const oldLabels: Record<string, string> = {
    ski_set: "Ski set (skis + boots)",
    snowboard_set: "Snowboard set (board + boots)",
    kids_ski_set: "Kids ski set",
    kids_snowboard_set: "Kids snowboard set",
    clothing: "Clothing item",
    accessory: "Accessory"
  };
  
  if (oldLabels[itemType]) {
    return oldLabels[itemType];
  }
  
  // Новые типы - преобразуем ID в читаемый формат
  return itemType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

function getSegmentLabel(segment: string): string {
  const labels: Record<string, string> = {
    economy: "Economy",
    premium: "Premium",
    "n/a": "Not applicable"
  };
  return labels[segment] || segment;
}

function getTypeLabel(type: string): string {
  return type === "rental" ? "Rental" : "Lesson";
}

function getMessengerLabel(messenger: string): string {
  const labels: Record<string, string> = {
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    viber: "Viber",
    none: "None"
  };
  return labels[messenger] || messenger;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatOwnerEmail(payload: BookingPayload) {
  const lines: string[] = [];
  
  // Заголовок
  lines.push(`NEW BOOKING REQUEST - ${getTypeLabel(payload.type).toUpperCase()}`);
  lines.push("");
  
  // Основная информация
  lines.push(`📋 REQUEST DETAILS`);
  lines.push(`─────────────────────────────────────────────────────────`);
  lines.push(`Request Type:     ${getTypeLabel(payload.type)}`);
  lines.push(`Created At:       ${new Date(payload.createdAtIso).toLocaleString()}`);
  lines.push(`Rental Period:    ${payload.dates.from} → ${payload.dates.to}`);
  lines.push("");
  
  // Запрошенные товары
  lines.push(`📦 REQUESTED ITEMS (${payload.items.length} item${payload.items.length !== 1 ? "s" : ""})`);
  lines.push(`─────────────────────────────────────────────────────────`);
  payload.items.forEach((it, idx) => {
    if (idx > 0) lines.push("");
    lines.push(`Item ${idx + 1}:`);
    lines.push(`  • Type:        ${getItemTypeLabel(it.itemType, it.itemLabel)}`);
    lines.push(`  • Segment:     ${getSegmentLabel(it.segment)}`);
    lines.push(`  • Quantity:    ${it.quantity}`);
    if (it.note && it.note.trim()) {
      lines.push(`  • Note:        ${it.note}`);
    }
  });
  lines.push("");
  
  // Контактная информация
  lines.push(`📞 CONTACT INFORMATION`);
  lines.push(`─────────────────────────────────────────────────────────`);
  lines.push(`Email:            ${payload.contact.email}`);
  lines.push(`Phone:            ${payload.contact.phone}`);
  if (payload.contact.messenger && payload.contact.messenger !== "none") {
    lines.push(`Messenger:        ${getMessengerLabel(payload.contact.messenger)}`);
    if (payload.contact.messengerHandle) {
      lines.push(`Messenger Handle: ${payload.contact.messengerHandle}`);
    }
  }
  
  // Дополнительный комментарий
  if (payload.comment && payload.comment.trim()) {
    lines.push("");
    lines.push(`💬 ADDITIONAL COMMENT`);
    lines.push(`─────────────────────────────────────────────────────────`);
    // Переносим длинный текст на несколько строк для читаемости
    const commentLines = payload.comment.split('\n');
    commentLines.forEach(line => {
      if (line.trim()) {
        lines.push(`   ${line.trim()}`);
      }
    });
  }
  
  // HTML версия
  const htmlParts: string[] = [];
  htmlParts.push(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 25px; }
    .header h2 { margin: 0; font-size: 20px; }
    .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #2c3e50; }
    .divider { border-top: 1px solid #e0e0e0; margin: 15px 0; }
    .item { background: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; border-radius: 4px; }
    .field { margin: 8px 0; }
    .field-label { font-weight: bold; display: inline-block; min-width: 150px; color: #555; }
    .comment { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; white-space: pre-wrap; border-radius: 4px; }
  </style>
</head>
<body>`);
  
  htmlParts.push(`<div class="header">
    <h2>NEW BOOKING REQUEST - ${escapeHtml(getTypeLabel(payload.type).toUpperCase())}</h2>
  </div>`);
  
  htmlParts.push(`<div class="section">
    <div class="section-title">📋 REQUEST DETAILS</div>
    <div class="divider"></div>
    <div class="field"><span class="field-label">Request Type:</span> ${escapeHtml(getTypeLabel(payload.type))}</div>
    <div class="field"><span class="field-label">Created At:</span> ${escapeHtml(new Date(payload.createdAtIso).toLocaleString())}</div>
    <div class="field"><span class="field-label">Rental Period:</span> ${escapeHtml(payload.dates.from)} → ${escapeHtml(payload.dates.to)}</div>
  </div>`);
  
  htmlParts.push(`<div class="section">
    <div class="section-title">📦 REQUESTED ITEMS (${payload.items.length} item${payload.items.length !== 1 ? "s" : ""})</div>
    <div class="divider"></div>`);
  
  payload.items.forEach((it, idx) => {
    htmlParts.push(`<div class="item">
      <strong>Item ${idx + 1}:</strong><br>
      <div class="field"><span class="field-label">Type:</span> ${escapeHtml(getItemTypeLabel(it.itemType, it.itemLabel))}</div>
      <div class="field"><span class="field-label">Segment:</span> ${escapeHtml(getSegmentLabel(it.segment))}</div>
      <div class="field"><span class="field-label">Quantity:</span> ${it.quantity}</div>
      ${it.note && it.note.trim() ? `<div class="field"><span class="field-label">Note:</span> ${escapeHtml(it.note)}</div>` : ''}
    </div>`);
  });
  
  htmlParts.push(`</div>`);
  
  htmlParts.push(`<div class="section">
    <div class="section-title">📞 CONTACT INFORMATION</div>
    <div class="divider"></div>
    <div class="field"><span class="field-label">Email:</span> ${escapeHtml(payload.contact.email)}</div>
    <div class="field"><span class="field-label">Phone:</span> ${escapeHtml(payload.contact.phone)}</div>
    ${payload.contact.messenger && payload.contact.messenger !== "none" ? `
    <div class="field"><span class="field-label">Messenger:</span> ${escapeHtml(getMessengerLabel(payload.contact.messenger))}</div>
    ${payload.contact.messengerHandle ? `<div class="field"><span class="field-label">Messenger Handle:</span> ${escapeHtml(payload.contact.messengerHandle)}</div>` : ''}
    ` : ''}
  </div>`);
  
  if (payload.comment && payload.comment.trim()) {
    htmlParts.push(`<div class="section">
      <div class="section-title">💬 ADDITIONAL COMMENT</div>
      <div class="divider"></div>
      <div class="comment">${escapeHtml(payload.comment)}</div>
    </div>`);
  }
  
  htmlParts.push(`</body></html>`);
  
  return {
    subject: `New ${getTypeLabel(payload.type)} Request: ${payload.dates.from} to ${payload.dates.to}`,
    text: lines.join("\n"),
    html: htmlParts.join("\n")
  };
}

function formatCustomerEmail(payload: BookingPayload) {
  const lines: string[] = [];
  lines.push(`✅ YOUR REQUEST HAS BEEN RECEIVED`);
  lines.push("");
  lines.push(`Thank you for your interest in Ski Rental IRISH-GEORGIA!`);
  lines.push("");
  lines.push(`We have received your ${getTypeLabel(payload.type).toLowerCase()} request and will process it shortly.`);
  lines.push("");
  lines.push(`─────────────────────────────────────────────────────────`);
  lines.push(`REQUEST DETAILS`);
  lines.push(`─────────────────────────────────────────────────────────`);
  lines.push(`Request Type: ${getTypeLabel(payload.type)}`);
  lines.push(`Rental Period: From ${payload.dates.from} to ${payload.dates.to}`);
  lines.push("");
  lines.push(`Requested Items:`);
  payload.items.forEach((it, idx) => {
    lines.push(`  ${idx + 1}. ${getItemTypeLabel(it.itemType, it.itemLabel)}`);
    lines.push(`     Segment: ${getSegmentLabel(it.segment)}`);
    lines.push(`     Quantity: ${it.quantity}`);
    if (it.note && it.note.trim()) {
      lines.push(`     Note: ${it.note}`);
    }
    if (idx < payload.items.length - 1) {
      lines.push("");
    }
  });
  lines.push("");
  lines.push(`─────────────────────────────────────────────────────────`);
  lines.push(`WHAT HAPPENS NEXT?`);
  lines.push(`─────────────────────────────────────────────────────────`);
  lines.push(`We will review your request and check availability for the requested dates and items.`);
  lines.push(`You will receive a confirmation email or phone call from us shortly to finalize your booking.`);
  lines.push("");
  lines.push(`If you have any questions or need to make changes to your request, please contact us using the information below.`);
  lines.push("");
  lines.push(`─────────────────────────────────────────────────────────`);
  lines.push(`CONTACT INFORMATION`);
  lines.push(`─────────────────────────────────────────────────────────`);
  lines.push(`Email: ${payload.contact.email}`);
  lines.push(`Phone: ${payload.contact.phone}`);
  if (payload.contact.messenger && payload.contact.messenger !== "none") {
    lines.push(`Messenger: ${getMessengerLabel(payload.contact.messenger)}${payload.contact.messengerHandle ? ` (${payload.contact.messengerHandle})` : ""}`);
  }
  lines.push("");
  lines.push(`Best regards,`);
  lines.push(`Ski Rental IRISH-GEORGIA Team`);
  lines.push(`Gudauri, Georgia`);
  
  // HTML версия
  const htmlParts: string[] = [];
  htmlParts.push(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 25px; text-align: center; border-radius: 8px; margin-bottom: 25px; }
    .header h2 { margin: 0; font-size: 22px; }
    .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #2c3e50; }
    .divider { border-top: 1px solid #e0e0e0; margin: 15px 0; }
    .item { background: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; border-radius: 4px; }
    .field { margin: 8px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; }
  </style>
</head>
<body>`);
  
  htmlParts.push(`<div class="header">
    <h2>✅ YOUR REQUEST HAS BEEN RECEIVED</h2>
  </div>`);
  
  htmlParts.push(`<p>Thank you for your interest in Ski Rental IRISH-GEORGIA!</p>
  <p>We have received your ${escapeHtml(getTypeLabel(payload.type).toLowerCase())} request and will process it shortly.</p>`);
  
  htmlParts.push(`<div class="section">
    <div class="section-title">REQUEST DETAILS</div>
    <div class="divider"></div>
    <div class="field"><strong>Request Type:</strong> ${escapeHtml(getTypeLabel(payload.type))}</div>
    <div class="field"><strong>Rental Period:</strong> From ${escapeHtml(payload.dates.from)} to ${escapeHtml(payload.dates.to)}</div>
    <div class="field"><strong>Requested Items:</strong></div>`);
  
  payload.items.forEach((it, idx) => {
    htmlParts.push(`<div class="item">
      <strong>${idx + 1}. ${escapeHtml(getItemTypeLabel(it.itemType, it.itemLabel))}</strong><br>
      <div class="field">Segment: ${escapeHtml(getSegmentLabel(it.segment))}</div>
      <div class="field">Quantity: ${it.quantity}</div>
      ${it.note && it.note.trim() ? `<div class="field">Note: ${escapeHtml(it.note)}</div>` : ''}
    </div>`);
  });
  
  htmlParts.push(`</div>`);
  
  htmlParts.push(`<div class="section">
    <div class="section-title">WHAT HAPPENS NEXT?</div>
    <div class="divider"></div>
    <p>We will review your request and check availability for the requested dates and items.</p>
    <p>You will receive a confirmation email or phone call from us shortly to finalize your booking.</p>
    <p>If you have any questions or need to make changes to your request, please contact us using the information below.</p>
  </div>`);
  
  htmlParts.push(`<div class="section">
    <div class="section-title">CONTACT INFORMATION</div>
    <div class="divider"></div>
    <div class="field"><strong>Email:</strong> ${escapeHtml(payload.contact.email)}</div>
    <div class="field"><strong>Phone:</strong> ${escapeHtml(payload.contact.phone)}</div>
    ${payload.contact.messenger && payload.contact.messenger !== "none" ? `
    <div class="field"><strong>Messenger:</strong> ${escapeHtml(getMessengerLabel(payload.contact.messenger))}${payload.contact.messengerHandle ? ` (${escapeHtml(payload.contact.messengerHandle)})` : ""}</div>
    ` : ''}
  </div>`);
  
  htmlParts.push(`<div class="footer">
    <p><strong>Best regards,</strong><br>
    Ski Rental IRISH-GEORGIA Team<br>
    Gudauri, Georgia</p>
  </div>`);
  
  htmlParts.push(`</body></html>`);
  
  return {
    subject: `Ski Rental IRISH-GEORGIA — Your ${getTypeLabel(payload.type)} Request Has Been Received`,
    text: lines.join("\n"),
    html: htmlParts.join("\n")
  };
}

function isValidEmail(email: string): boolean {
  // Простая проверка формата email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function sendResend(env: Env, to: string, subject: string, text: string, html?: string) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey || !apiKey.startsWith("re_")) {
    throw new Error(`Invalid API key format. Key should start with "re_"`);
  }

  const fromEmail = env.FROM_EMAIL?.trim();
  if (!fromEmail) {
    throw new Error(`FROM_EMAIL is not set`);
  }
  
  // Проверяем формат email (должен быть либо просто email, либо "Name <email>")
  if (!isValidEmail(fromEmail) && !fromEmail.includes("<") && !fromEmail.includes(">")) {
    throw new Error(`Invalid FROM_EMAIL format: "${fromEmail}". Should be "email@example.com" or "Name <email@example.com>"`);
  }

  const payload: any = {
    from: fromEmail,
    to,
    subject,
    text
  };
  
  if (html) {
    payload.html = html;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    const errorDetails = `Resend error: ${res.status} ${errText}`;
    console.error(`Failed to send email to ${to}:`, errorDetails);
    throw new Error(errorDetails);
  }

  const result = await res.json().catch(() => ({}));
  return result;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS (adjust origin as needed)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname !== "/" && url.pathname !== "/api/booking") {
      return textResponse("Not found", 404, corsHeaders);
    }

    if (request.method !== "POST") {
      return textResponse("Method not allowed", 405, corsHeaders);
    }

    let payload: BookingPayload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ ok: false, error: "Invalid JSON" }, 400, corsHeaders);
    }

    const errors = validate(payload);
    if (errors.length) {
      return jsonResponse({ ok: false, errors }, 400, corsHeaders);
    }

    const owner = formatOwnerEmail(payload);
    const customer = formatCustomerEmail(payload);

    const results: { owner?: string; customer?: string } = {};

    // Отправляем письмо владельцу
    try {
      await sendResend(env, env.OWNER_EMAIL, owner.subject, owner.text, owner.html);
      results.owner = "sent";
    } catch (e: any) {
      results.owner = `error: ${e?.message ?? "Unknown error"}`;
    }

    // Отправляем письмо клиенту
    try {
      await sendResend(env, payload.contact.email, customer.subject, customer.text, customer.html);
      results.customer = "sent";
    } catch (e: any) {
      results.customer = `error: ${e?.message ?? "Unknown error"}`;
    }

    // Если хотя бы письмо владельцу отправилось - считаем успешным
    if (results.owner === "sent") {
      return jsonResponse({ 
        ok: true, 
        results,
        message: results.customer === "sent" 
          ? "Both emails sent" 
          : "Owner email sent, but customer email failed"
      }, 200, corsHeaders);
    }

    // Если оба письма не отправились - ошибка
    return jsonResponse({ 
      ok: false, 
      error: "Failed to send emails",
      results 
    }, 500, corsHeaders);
  }
};
