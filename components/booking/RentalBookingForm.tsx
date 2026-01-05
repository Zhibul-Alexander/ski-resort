"use client";

import * as React from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, type SelectOption } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { getBookingEndpoint } from "@/lib/config";

export type RentalItemType = string;
export type Segment = "economy" | "premium" | "n/a";

type Messenger = "none" | "whatsapp" | "telegram" | "viber";

export interface RentalItemOption {
  id: string;
  label: string;
  category: "adults" | "kids" | "accessories";
  segments: Segment[];
  hasSegments: boolean;
}

export type BookingPayload = {
  type: "rental";
  dates: { from: string; to: string };
  items: { itemType: string; segment: Segment; quantity: number; note?: string }[];
  contact: {
    email: string;
    phone: string;
    messenger: Messenger;
    messengerHandle?: string;
  };
  comment?: string;
  locale: string;
  createdAtIso: string;
};

type RentalBookingFormLabels = {
  dates?: string;
  datesDesc?: string;
  from?: string;
  to?: string;
  items?: string;
  itemsDesc?: string;
  addItem?: string;
  remove?: string;
  equipment?: string;
  segment?: string;
  quantity?: string;
  notes?: string;
  notesPlaceholder?: string;
  contacts?: string;
  contactsDesc?: string;
  email?: string;
  phone?: string;
  messenger?: string;
  messengerContact?: string;
  comment?: string;
  commentPlaceholder?: string;
  submit?: string;
  submitNote?: string;
  successTitle?: string;
  successDesc?: string;
  createAnother?: string;
  adults?: string;
  kids?: string;
  accessories?: string;
  none?: string;
  economy?: string;
  premium?: string;
  na?: string;
};

const getSegmentLabel = (segment: Segment, labels?: RentalBookingFormLabels): string => {
  if (segment === "economy") return labels?.economy || "Economy";
  if (segment === "premium") return labels?.premium || "Premium";
  return labels?.na || "N/A";
};


export function RentalBookingForm({
  lang,
  itemOptions,
  bookingEndpoint,
  formId = "booking-form",
  labels
}: {
  lang: string;
  itemOptions: RentalItemOption[];
  bookingEndpoint?: string;
  formId?: string;
  labels?: RentalBookingFormLabels;
}) {
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [items, setItems] = React.useState<BookingPayload["items"]>([
    { itemType: itemOptions[0]?.id || "", segment: itemOptions[0]?.segments[0] || "n/a", quantity: 1 }
  ]);
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [messenger, setMessenger] = React.useState<Messenger>("none");
  const [messengerHandle, setMessengerHandle] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorText, setErrorText] = React.useState<string>("");

  const canSubmit =
    Boolean(from && to && email && phone) &&
    items.length > 0 &&
    items.every(i => i.quantity > 0 && i.itemType) &&
    (messenger === "none" || Boolean(messengerHandle));

  function addItem() {
    setItems(prev => [...prev, { itemType: itemOptions[0]?.id || "", segment: itemOptions[0]?.segments[0] || "n/a", quantity: 1 }]);
  }

  function removeItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, patch: Partial<BookingPayload["items"][number]>) {
    setItems(prev => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorText("");

    const payload: BookingPayload = {
      type: "rental",
      dates: { from, to },
      items,
      contact: { email, phone, messenger, messengerHandle: messenger === "none" ? undefined : messengerHandle },
      comment: comment || undefined,
      locale: lang,
      createdAtIso: new Date().toISOString()
    };

    const endpoint = bookingEndpoint || getBookingEndpoint() || "";
    if (!endpoint) {
      setStatus("error");
      setErrorText("Booking endpoint is not configured. Set NEXT_PUBLIC_BOOKING_ENDPOINT.");
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorText(err?.message ?? "Something went wrong");
    }
  }

  // Группируем опции по категориям
  const itemsByCategory = React.useMemo(() => {
    const grouped: Record<string, RentalItemOption[]> = { adults: [], kids: [], accessories: [] };
    itemOptions.forEach(opt => {
      grouped[opt.category].push(opt);
    });
    return grouped;
  }, [itemOptions]);

  if (status === "success") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{labels?.successTitle || "Request received"}</CardTitle>
          <CardDescription>
            {labels?.successDesc || "We've sent a confirmation email. We'll contact you soon to confirm availability."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button variant="secondary" onClick={() => setStatus("idle")}>{labels?.createAnother || "Create another request"}</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form id={formId} onSubmit={onSubmit} className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{labels?.dates || "Dates"}</CardTitle>
          <CardDescription>{labels?.datesDesc || "Pick your rental dates."}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">{labels?.from || "From"}</label>
            <DatePicker
              value={from}
              onChange={(value) => setFrom(value)}
              required
              minDate={new Date()}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">{labels?.to || "To"}</label>
            <DatePicker
              value={to}
              onChange={(value) => setTo(value)}
              required
              minDate={from ? new Date(from) : new Date()}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>{labels?.items || "Items"}</CardTitle>
              <CardDescription>{labels?.itemsDesc || "Add multiple items (for family / friends)."}</CardDescription>
            </div>
            <Button type="button" variant="secondary" onClick={addItem}>
              <Plus className="h-4 w-4" /> {labels?.addItem || "Add item"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          {items.map((it, idx) => {
            const option = itemOptions.find(o => o.id === it.itemType) || itemOptions[0];
            const allowedSegments = option?.segments || ["n/a"];
            const seg = allowedSegments.includes(it.segment) ? it.segment : allowedSegments[0];

            if (seg !== it.segment && option) {
              // keep state consistent
              queueMicrotask(() => updateItem(idx, { segment: seg }));
            }

            return (
              <div key={idx} className="rounded-2xl border border-border p-4 grid gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">#{idx + 1}</Badge>
                  </div>
                  {items.length > 1 ? (
                    <Button type="button" variant="ghost" onClick={() => removeItem(idx)}>
                      <Trash2 className="h-4 w-4" /> {labels?.remove || "Remove"}
                    </Button>
                  ) : null}
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="grid gap-2 md:col-span-2 min-w-0">
                    <label className="text-sm font-medium">{labels?.equipment || "Equipment"}</label>
                    <div className="min-w-0">
                      <Select
                        value={it.itemType}
                        onChange={(value) => {
                          const newOption = itemOptions.find(o => o.id === value);
                          updateItem(idx, { 
                            itemType: value, 
                            segment: newOption?.segments[0] || "n/a" 
                          });
                        }}
                        options={[
                          ...itemsByCategory.adults.map(opt => ({ value: opt.id, label: opt.label, group: labels?.adults || "Adults" })),
                          ...itemsByCategory.kids.map(opt => ({ value: opt.id, label: opt.label, group: labels?.kids || "Kids" })),
                          ...itemsByCategory.accessories.map(opt => ({ value: opt.id, label: opt.label, group: labels?.accessories || "Accessories & Clothing" }))
                        ]}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {option?.hasSegments && (
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">{labels?.segment || "Segment"}</label>
                      <Select
                        value={seg}
                        onChange={(value) => updateItem(idx, { segment: value as Segment })}
                        options={allowedSegments.map(s => ({ value: s, label: getSegmentLabel(s, labels) }))}
                      />
                    </div>
                  )}

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">{labels?.quantity || "Quantity"}</label>
                    <Input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) => updateItem(idx, { quantity: Math.max(1, Number(e.target.value || 1)) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">{labels?.notes || "Notes (optional)"}</label>
                  <Input
                    placeholder={labels?.notesPlaceholder || "e.g. shoe size 42, height 175cm, skill level..."}
                    value={it.note ?? ""}
                    onChange={(e) => updateItem(idx, { note: e.target.value })}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{labels?.contacts || "Contacts"}</CardTitle>
          <CardDescription>{labels?.contactsDesc || "We'll use this to confirm your request."}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">{labels?.email || "Email"}</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">{labels?.phone || "Phone"}</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">{labels?.messenger || "Messenger (optional)"}</label>
              <Select
                value={messenger}
                onChange={(value) => setMessenger(value as Messenger)}
                options={[
                  { value: "none", label: labels?.none || "None" },
                  { value: "whatsapp", label: "WhatsApp" },
                  { value: "telegram", label: "Telegram" },
                  { value: "viber", label: "Viber" }
                ]}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">{labels?.messengerContact || "Messenger contact"}</label>
              <Input
                value={messengerHandle}
                onChange={(e) => setMessengerHandle(e.target.value)}
                placeholder={messenger === "telegram" ? "@username" : ""}
                disabled={messenger === "none"}
                required={messenger !== "none"}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">{labels?.comment || "Comment (optional)"}</label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder={labels?.commentPlaceholder || "Any extra details..."} />
          </div>

          {status === "error" ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {errorText}
            </div>
          ) : null}

          <Button type="submit" disabled={!canSubmit || status === "submitting"} className="w-full sm:w-auto">
            {status === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {labels?.submit || "Submit request"}
          </Button>

          <p className="text-xs text-muted-foreground">
            {labels?.submitNote || "This is a request, not an instant reservation. We'll confirm availability by email/phone."}
          </p>
        </CardContent>
      </Card>
    </form>
  );
}

