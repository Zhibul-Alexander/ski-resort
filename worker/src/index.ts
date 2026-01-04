export interface Env {
  RESEND_API_KEY: string;
  OWNER_EMAIL: string;
  FROM_EMAIL: string;
}

type BookingPayload = {
  type: "rental" | "lesson";
  dates: { from: string; to: string };
  items: { itemType: string; segment: string; quantity: number; note?: string }[];
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

function getItemTypeLabel(itemType: string): string {
  const labels: Record<string, string> = {
    ski_set: "Ski set (skis + boots)",
    snowboard_set: "Snowboard set (board + boots)",
    kids_ski_set: "Kids ski set",
    kids_snowboard_set: "Kids snowboard set",
    clothing: "Clothing item",
    accessory: "Accessory"
  };
  return labels[itemType] || itemType;
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

function formatOwnerEmail(payload: BookingPayload) {
  const lines: string[] = [];
  lines.push(`═══════════════════════════════════════════════════════`);
  lines.push(`NEW BOOKING REQUEST - ${getTypeLabel(payload.type).toUpperCase()}`);
  lines.push(`═══════════════════════════════════════════════════════`);
  lines.push("");
  lines.push(`Request Type: ${getTypeLabel(payload.type)}`);
  lines.push(`Created At: ${new Date(payload.createdAtIso).toLocaleString()}`);
  lines.push(`Rental Period: From ${payload.dates.from} to ${payload.dates.to}`);
  lines.push("");
  lines.push(`───────────────────────────────────────────────────────`);
  lines.push(`REQUESTED ITEMS (${payload.items.length} item${payload.items.length !== 1 ? "s" : ""})`);
  lines.push(`───────────────────────────────────────────────────────`);
  payload.items.forEach((it, idx) => {
    lines.push("");
    lines.push(`Item ${idx + 1}:`);
    lines.push(`  Type: ${getItemTypeLabel(it.itemType)}`);
    lines.push(`  Segment: ${getSegmentLabel(it.segment)}`);
    lines.push(`  Quantity: ${it.quantity}`);
    if (it.note && it.note.trim()) {
      lines.push(`  Note: ${it.note}`);
    }
  });
  lines.push("");
  lines.push(`───────────────────────────────────────────────────────`);
  lines.push(`CONTACT INFORMATION`);
  lines.push(`───────────────────────────────────────────────────────`);
  lines.push(`Email Address: ${payload.contact.email}`);
  lines.push(`Phone Number: ${payload.contact.phone}`);
  if (payload.contact.messenger && payload.contact.messenger !== "none") {
    lines.push(`Messenger: ${getMessengerLabel(payload.contact.messenger)}`);
    if (payload.contact.messengerHandle) {
      lines.push(`Messenger Contact: ${payload.contact.messengerHandle}`);
    }
  }
  if (payload.comment && payload.comment.trim()) {
    lines.push("");
    lines.push(`───────────────────────────────────────────────────────`);
    lines.push(`ADDITIONAL COMMENT`);
    lines.push(`───────────────────────────────────────────────────────`);
    lines.push(payload.comment);
  }
  lines.push("");
  lines.push(`═══════════════════════════════════════════════════════`);
  return {
    subject: `New ${getTypeLabel(payload.type)} Request: ${payload.dates.from} to ${payload.dates.to}`,
    text: lines.join("\n")
  };
}

function formatCustomerEmail(payload: BookingPayload) {
  const lines: string[] = [];
  lines.push(`✅ YOUR REQUEST HAS BEEN RECEIVED`);
  lines.push("");
  lines.push(`Thank you for your interest in Ski №1 Rental!`);
  lines.push("");
  lines.push(`We have received your ${getTypeLabel(payload.type).toLowerCase()} request and will process it shortly.`);
  lines.push("");
  lines.push(`───────────────────────────────────────────────────────`);
  lines.push(`REQUEST DETAILS`);
  lines.push(`───────────────────────────────────────────────────────`);
  lines.push(`Request Type: ${getTypeLabel(payload.type)}`);
  lines.push(`Rental Period: From ${payload.dates.from} to ${payload.dates.to}`);
  lines.push("");
  lines.push(`Requested Items:`);
  payload.items.forEach((it, idx) => {
    lines.push(`  ${idx + 1}. ${getItemTypeLabel(it.itemType)}`);
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
  lines.push(`───────────────────────────────────────────────────────`);
  lines.push(`WHAT HAPPENS NEXT?`);
  lines.push(`───────────────────────────────────────────────────────`);
  lines.push(`We will review your request and check availability for the requested dates and items.`);
  lines.push(`You will receive a confirmation email or phone call from us shortly to finalize your booking.`);
  lines.push("");
  lines.push(`If you have any questions or need to make changes to your request, please contact us using the information below.`);
  lines.push("");
  lines.push(`───────────────────────────────────────────────────────`);
  lines.push(`CONTACT INFORMATION`);
  lines.push(`───────────────────────────────────────────────────────`);
  lines.push(`Email: ${payload.contact.email}`);
  lines.push(`Phone: ${payload.contact.phone}`);
  if (payload.contact.messenger && payload.contact.messenger !== "none") {
    lines.push(`Messenger: ${getMessengerLabel(payload.contact.messenger)}${payload.contact.messengerHandle ? ` (${payload.contact.messengerHandle})` : ""}`);
  }
  lines.push("");
  lines.push(`───────────────────────────────────────────────────────`);
  lines.push(`Best regards,`);
  lines.push(`Ski №1 Rental Team`);
  lines.push(`Gudauri, Georgia`);
  lines.push(`───────────────────────────────────────────────────────`);
  return {
    subject: `Ski №1 Rental — Your ${getTypeLabel(payload.type)} Request Has Been Received`,
    text: lines.join("\n")
  };
}

async function sendResend(env: Env, to: string, subject: string, text: string) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey || !apiKey.startsWith("re_")) {
    throw new Error(`Invalid API key format. Key should start with "re_"`);
  }

  const payload = {
    from: env.FROM_EMAIL,
    to,
    subject,
    text
  };

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

    if (url.pathname !== "/api/booking") {
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
      await sendResend(env, env.OWNER_EMAIL, owner.subject, owner.text);
      results.owner = "sent";
    } catch (e: any) {
      results.owner = `error: ${e?.message ?? "Unknown error"}`;
    }

    // Отправляем письмо клиенту
    try {
      await sendResend(env, payload.contact.email, customer.subject, customer.text);
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
