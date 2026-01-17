import type { Lang } from "@/lib/i18n";
import { getPricing, getSite } from "@/lib/content";
import { Section } from "@/components/site/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { formatPrice } from "@/lib/currency";
import { SlideIn } from "@/components/ui/slide-in";
import { Phone, Clock } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookingButton } from "@/components/ui/booking-button";

export default async function RentalPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const pricing = await getPricing(lang);
  const site = await getSite(lang);
  const exchangeRate = pricing.exchangeRate ?? 2.7;

  return (
    <div className="py-10">
      <SlideIn index={0}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{(site.pageTitles as any)?.rentalPrices || "Rental prices"}</h1>
          <p className="mt-2 text-muted-foreground">{(site.pageTitles as any)?.rentalSubtitle || "Professional gear for any skill level."}</p>
        </div>
      </SlideIn>

      <div className="grid gap-6">
        {pricing.rental.tables.map((t, tableIdx) => (
          <SlideIn key={t.id} index={tableIdx + 1}>
            <Section title={t.title} subtitle={t.subtitle}>
            {["adults", "kids", "accessories"].includes(t.id) ? (
              <>
                {/* Mobile: Card view */}
                <div className="md:hidden">
                  <div className="space-y-3">
                    {t.rows.map((r, rowIdx) => {
                      // Получаем первую цену (1-2 дня)
                      const firstPrice = r.values[0] || "";
                      // Если цена содержит "/", берем первую часть
                      const priceValue = firstPrice.includes("/") 
                        ? firstPrice.split("/")[0].trim() 
                        : firstPrice.trim();
                      
                      // Для Equipment (adults): картинки 1-7, для Accessories: картинки 8-12
                      const imageIndex = t.id === "adults" ? rowIdx + 1 : rowIdx + 8;
                      
                      return (
                        <div key={r.label} className="rounded-xl border border-border bg-card overflow-hidden">
                          {/* Название */}
                          <div className="font-medium text-lg px-4 pt-4 pb-4">{r.label}</div>
                          
                          {/* Картинка */}
                          <div className="px-4 pb-4">
                            <div className="relative w-full aspect-square">
                              <Image
                                src={`/images/rental/${imageIndex}.webp`}
                                alt={r.label}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                          </div>
                          
                          {/* Блок с ценой и кнопкой booking */}
                          <div className="px-4 pb-4 flex flex-col gap-3">
                            {/* Цена */}
                            <div className="font-semibold text-center">
                              <span>{(site.pageTitles as any)?.priceFrom || "От"} </span>
                              <span className="text-lg">{priceValue} GEL</span>
                            </div>
                            
                            {/* Кнопка booking */}
                            <BookingButton className="w-full">
                              {(site.pageTitles as any)?.requestBooking || "Booking"}
                            </BookingButton>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop: Cards */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-1 gap-4">
                    {t.rows.map((r, rowIdx) => {
                      // Получаем первую цену (1-2 дня)
                      const firstPrice = r.values[0] || "";
                      // Если цена содержит "/", берем первую часть
                      const priceValue = firstPrice.includes("/") 
                        ? firstPrice.split("/")[0].trim() 
                        : firstPrice.trim();
                      
                      // Для Equipment (adults): картинки 1-7, для Accessories: картинки 8-12
                      const imageIndex = t.id === "adults" ? rowIdx + 1 : rowIdx + 8;
                      
                      return (
                        <div 
                          key={r.label} 
                          className="flex gap-4 rounded-xl border border-border bg-card overflow-hidden"
                        >
                          {/* Левая колонка: картинка */}
                          <div className="flex-shrink-0 p-4">
                            <div className="relative w-48 h-48">
                              <Image
                                src={`/images/rental/${imageIndex}.webp`}
                                alt={r.label}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                          </div>
                          
                          {/* Правая колонка: название, цена и кнопка */}
                          <div className="flex flex-col justify-between p-4 flex-1 text-right">
                            {/* Название по верхней линии */}
                            <div className="font-medium text-lg">{r.label}</div>
                            
                            {/* Блок с ценой и кнопкой booking */}
                            <div className="flex flex-col gap-3">
                              {/* Цена */}
                              <div className="font-semibold">
                                <span>{(site.pageTitles as any)?.priceFrom || "От"} </span>
                                <span className="text-lg">{priceValue} GEL</span>
                              </div>
                              
                              {/* Кнопка booking */}
                              <div>
                                <BookingButton>
                                  {(site.pageTitles as any)?.requestBooking || "Booking"}
                                </BookingButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
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
            )}
          </Section>
          </SlideIn>
        ))}
      </div>

      <SlideIn index={pricing.rental.tables.length + 1}>
        <div id="booking-form" className="scroll-mt-24">
          <Section title={(site.pageTitles as any)?.equipmentBookingTitle || "Equipment Booking"} subtitle={(site.pageTitles as any)?.equipmentBookingSubtitle || "To book equipment, contact us in any convenient way."} className="pb-0">
            <Card>
              <CardHeader>
                <CardTitle>{site.pageTitles?.footerContacts || "Contacts"}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <a className="hover:underline flex items-center gap-2" href={`tel:${site.contacts.phone}`}>
                    <Phone className="h-4 w-4" />
                    {site.contacts.phone}
                  </a>
                  <span className="text-muted-foreground">
                    {(() => {
                      const phoneAndWhatsApp = site.pageTitles?.phoneAndWhatsApp || "Phone | WhatsApp";
                      const parts = phoneAndWhatsApp.split(' | ');
                      const phonePart = parts[0] || "Phone";
                      const whatsappPart = parts[1] || "WhatsApp";
                      return (
                        <>
                          {phonePart} |{" "}
                          {site.contacts.whatsapp ? (
                            <a
                              href={`https://wa.me/${site.contacts.whatsapp.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline text-foreground"
                            >
                              {whatsappPart}
                            </a>
                          ) : (
                            whatsappPart
                          )}
                        </>
                      );
                    })()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Clock className="h-4 w-4" />
                  <span>{site.pageTitles?.hoursLabel || "Hours:"} {site.hours.value}</span>
                </div>
              </CardContent>
            </Card>
          </Section>
        </div>
      </SlideIn>
    </div>
  );
}
