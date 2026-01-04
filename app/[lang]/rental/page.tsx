import type { Lang } from "@/lib/i18n";
import { getPricing, getSite } from "@/lib/content";
import { Section } from "@/components/site/section";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { formatPrice } from "@/lib/currency";
import { RentalBookingForm } from "@/components/booking/RentalBookingForm";
import { extractRentalItemOptions } from "@/lib/rental-items-simple";

export default async function RentalPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const pricing = await getPricing(lang);
  const site = await getSite(lang);
  const exchangeRate = pricing.exchangeRate ?? 2.7;
  const itemOptions = extractRentalItemOptions(pricing);

  return (
    <div className="py-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{(site.pageTitles as any)?.rentalPrices || "Rental prices"}</h1>
        <p className="mt-2 text-muted-foreground">{(site.pageTitles as any)?.rentalSubtitle || "Professional gear for any skill level."}</p>
      </div>

      <div className="grid gap-6">
        {pricing.rental.tables.map((t) => (
          <Section key={t.id} title={t.title} subtitle={t.subtitle}>
            <Card>
              {/* Mobile: Card view */}
              <CardContent className="pt-6 px-0 md:px-6 md:hidden">
                <div className="space-y-2 px-3">
                  {t.rows.map((r) => (
                    <div key={r.label} className="rounded-xl border border-border bg-card p-2.5">
                      <div className="font-medium text-xs mb-2 break-words leading-snug">{r.label}</div>
                      <div className="space-y-1.5">
                        {t.columns.slice(1).map((col, idx) => (
                          <div key={idx} className="flex items-start justify-between gap-2">
                            <span className="text-muted-foreground text-[11px] shrink-0 leading-tight pt-0.5">{col}:</span>
                            <span className="font-medium text-xs text-right break-words leading-tight">{formatPrice(r.values[idx], exchangeRate)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Desktop: Table view */}
              <CardContent className="pt-6 hidden md:block">
                <div className="overflow-x-auto rounded-2xl border border-border">
                  <Table className="w-full">
                    <THead>
                      <TR>
                        <TH>{t.columns[0]}</TH>
                        {t.columns.slice(1).map((c) => (
                          <TH key={c}>{c}</TH>
                        ))}
                      </TR>
                    </THead>
                    <TBody>
                      {t.rows.map((r) => (
                        <TR key={r.label}>
                          <TD className="font-medium">{r.label}</TD>
                          {r.values.map((v, idx) => (
                            <TD key={idx}>{formatPrice(v, exchangeRate)}</TD>
                          ))}
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </Section>
        ))}
      </div>

      <div id="booking-form" className="scroll-mt-24">
        <Section title={(site.pageTitles as any)?.requestBooking || "Booking"} subtitle={(site.pageTitles as any)?.requestBookingSubtitle || "Fill out the form to request equipment rental"}>
          <RentalBookingForm 
            lang={lang} 
            itemOptions={itemOptions}
            labels={{
              dates: (site.pageTitles as any)?.bookingFormDates,
              datesDesc: (site.pageTitles as any)?.bookingFormDatesDesc,
              from: (site.pageTitles as any)?.bookingFormFrom,
              to: (site.pageTitles as any)?.bookingFormTo,
              items: (site.pageTitles as any)?.bookingFormItems,
              itemsDesc: (site.pageTitles as any)?.bookingFormItemsDesc,
              addItem: (site.pageTitles as any)?.bookingFormAddItem,
              remove: (site.pageTitles as any)?.bookingFormRemove,
              equipment: (site.pageTitles as any)?.bookingFormEquipment,
              segment: (site.pageTitles as any)?.bookingFormSegment,
              quantity: (site.pageTitles as any)?.bookingFormQuantity,
              notes: (site.pageTitles as any)?.bookingFormNotes,
              notesPlaceholder: (site.pageTitles as any)?.bookingFormNotesPlaceholder,
              contacts: (site.pageTitles as any)?.bookingFormContacts,
              contactsDesc: (site.pageTitles as any)?.bookingFormContactsDesc,
              email: (site.pageTitles as any)?.bookingFormEmail,
              phone: (site.pageTitles as any)?.bookingFormPhone,
              messenger: (site.pageTitles as any)?.bookingFormMessenger,
              messengerContact: (site.pageTitles as any)?.bookingFormMessengerContact,
              comment: (site.pageTitles as any)?.bookingFormComment,
              commentPlaceholder: (site.pageTitles as any)?.bookingFormCommentPlaceholder,
              submit: (site.pageTitles as any)?.bookingFormSubmit,
              submitNote: (site.pageTitles as any)?.bookingFormSubmitNote,
              successTitle: (site.pageTitles as any)?.bookingFormSuccessTitle,
              successDesc: (site.pageTitles as any)?.bookingFormSuccessDesc,
              createAnother: (site.pageTitles as any)?.bookingFormCreateAnother,
              adults: (site.pageTitles as any)?.bookingFormAdults,
              kids: (site.pageTitles as any)?.bookingFormKids,
              accessories: (site.pageTitles as any)?.bookingFormAccessories,
              none: (site.pageTitles as any)?.bookingFormNone,
              economy: (site.pageTitles as any)?.bookingFormEconomy,
              premium: (site.pageTitles as any)?.bookingFormPremium,
              na: (site.pageTitles as any)?.bookingFormNa
            }}
          />
        </Section>
      </div>
    </div>
  );
}
