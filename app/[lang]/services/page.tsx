import type { Lang } from "@/lib/i18n";
import { getPricing, getSite } from "@/lib/content";
import { Section } from "@/components/site/section";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { formatPrice } from "@/lib/currency";
import { SlideIn } from "@/components/ui/slide-in";

export default async function ServicesPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const pricing = await getPricing(lang);
  const site = await getSite(lang);
  const exchangeRate = pricing.exchangeRate ?? 2.7;
  const services = pricing.services;

  if (!services) {
    return (
      <div className="py-10">
        <SlideIn index={0}>
          <h1 className="text-3xl font-semibold tracking-tight">{(site.pageTitles as any)?.services || "Services"}</h1>
          <p className="mt-3 text-muted-foreground">{(site.pageTitles as any)?.servicesNotAvailable || "Services information is not available."}</p>
        </SlideIn>
      </div>
    );
  }

  return (
    <div className="py-10">
      <SlideIn index={0}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{(site.pageTitles as any)?.services || "Services"}</h1>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>
              {(site.pageTitles as any)?.servicesSubtitle || "We keep your gear in top condition — fast, аккуратно и по стандартам сервиса. We handle everything from routine maintenance to full repairs for skis, snowboards and related equipment. Our workshop can help with base repairs, P-tex filling, edge tuning and sharpening, stone grinding (where available), hot waxing, binding checks and adjustments, and general inspections to make sure your equipment is safe and feels great on snow."}
            </p>
            <p>
              {(site.pageTitles as any)?.servicesSubtitle2 || "Whether you need a quick refresh before the next run or a proper fix after hitting rocks, we'll restore performance, improve glide, and help your gear last longer — with clear recommendations and fair turnaround times."}
            </p>
          </div>
        </div>
      </SlideIn>

      <SlideIn index={1}>
        <Section 
          title={(site.pageTitles as any)?.servicePrices || "Service Prices"} 
          subtitle={services.note ? `${(site.pageTitles as any)?.servicePricesSubtitle || "Equipment maintenance and repair"}. ${services.note}` : ((site.pageTitles as any)?.servicePricesSubtitle || "Equipment maintenance and repair")}
        >
          {/* Mobile: Card view */}
          <div className="px-0 md:px-6 md:hidden">
            <div className="space-y-2 px-3">
              {services.items.map((service, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-card p-2.5">
                  <div className="font-medium text-xs mb-2 break-words leading-snug">{service.name}</div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-muted-foreground text-[11px] shrink-0 leading-tight pt-0.5">{(site.pageTitles as any)?.price || "Price"}:</span>
                    <span className="font-medium text-xs text-right break-words leading-tight">{formatPrice(String(service.price), exchangeRate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Table view */}
          <div className="hidden md:block">
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <Table className="w-full">
                <THead>
                  <TR>
                    <TH>{(site.pageTitles as any)?.service || "Service"}</TH>
                    <TH className="text-right">{(site.pageTitles as any)?.price || "Price"}</TH>
                  </TR>
                </THead>
                <TBody>
                  {services.items.map((service, idx) => (
                    <TR key={idx}>
                      <TD className="font-medium">{service.name}</TD>
                      <TD className="text-right">{formatPrice(String(service.price), exchangeRate)}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          </div>
        </Section>
      </SlideIn>
    </div>
  );
}

