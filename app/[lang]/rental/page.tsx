import type { Lang } from "@/lib/i18n";
import { getPricing } from "@/lib/content";
import { Section } from "@/components/site/section";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { formatPrice } from "@/lib/currency";
import { RentalBookingForm } from "@/components/booking/RentalBookingForm";
import { extractRentalItemOptions } from "@/lib/rental-items-simple";

export default async function RentalPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const pricing = await getPricing(lang);
  const exchangeRate = pricing.exchangeRate ?? 2.7;
  const itemOptions = extractRentalItemOptions(pricing);

  return (
    <div className="py-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Rental prices</h1>
        <p className="mt-2 text-muted-foreground">Professional gear for any skill level.</p>
      </div>

      <div className="grid gap-6">
        {pricing.rental.tables.map((t) => (
          <Section key={t.id} title={t.title} subtitle={t.subtitle}>
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto rounded-2xl border border-border">
                  <Table>
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
        <Section title="Request booking" subtitle="Fill out the form to request equipment rental">
          <RentalBookingForm lang={lang} itemOptions={itemOptions} />
        </Section>
      </div>
    </div>
  );
}
