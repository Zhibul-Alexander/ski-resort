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

function formatOwnerEmail(payload: BookingPayload) {
  const lines: string[] = [];
  lines.push(`New booking request (${payload.type})`);
  lines.push(`Created: ${payload.createdAtIso}`);
  lines.push(`Dates: ${payload.dates.from} → ${payload.dates.to}`);
  lines.push("");
  lines.push("Items:");
  payload.items.forEach((it, idx) => {
    lines.push(`- ${idx + 1}. ${it.itemType} | ${it.segment} | qty: ${it.quantity}${it.note ? ` | note: ${it.note}` : ""}`);
  });
  lines.push("");
  lines.push("Contacts:");
  lines.push(`Email: ${payload.contact.email}`);
  lines.push(`Phone: ${payload.contact.phone}`);
  if (payload.contact.messenger && payload.contact.messenger !== "none") {
    lines.push(`Messenger: ${payload.contact.messenger} (${payload.contact.messengerHandle ?? "-"})`);
  }
  if (payload.comment) {
    lines.push("");
    lines.push("Comment:");
    lines.push(payload.comment);
  }
  return {
    subject: `Booking request: ${payload.type} (${payload.dates.from} → ${payload.dates.to})`,
    text: lines.join("\n")
  };
}

function formatCustomerEmail(payload: BookingPayload) {
  const lines: string[] = [];
  lines.push("✅ Your request has been received");
  lines.push("");
  lines.push(`Dates: ${payload.dates.from} → ${payload.dates.to}`);
  lines.push("");
  lines.push("Requested items:");
  payload.items.forEach((it, idx) => {
    lines.push(`- ${idx + 1}. ${it.itemType} | ${it.segment} | qty: ${it.quantity}`);
  });
  lines.push("");
  lines.push("We will contact you soon to confirm availability.");
  lines.push("");
  lines.push("Ski №1 Rental • Gudauri");
  return {
    subject: "Ski №1 Rental — request received",
    text: lines.join("\n")
  };
}

async function sendResend(env: Env, to: string, subject: string, text: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to,
      subject,
      text
    })
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Resend error: ${res.status} ${errText}`);
  }
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

    try {
      const owner = formatOwnerEmail(payload);
      const customer = formatCustomerEmail(payload);

      await sendResend(env, env.OWNER_EMAIL, owner.subject, owner.text);
      await sendResend(env, payload.contact.email, customer.subject, customer.text);

      return jsonResponse({ ok: true }, 200, corsHeaders);
    } catch (e: any) {
      return jsonResponse({ ok: false, error: e?.message ?? "Send failed" }, 500, corsHeaders);
    }
  }
};
