import type { Lang } from "@/lib/i18n";
import { getSite, getFaq, getReviews } from "@/lib/content";
import { Section } from "@/components/site/section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel } from "@/components/ui/carousel";
import { MapPin, Phone, Mail, Instagram, MessageCircle, Clock, ExternalLink, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideIn } from "@/components/ui/slide-in";
import { GoogleMap } from "@/components/site/google-map";
import { ElfsightGoogleReviews } from "@/components/site/elfsight-google-reviews";

export default async function InfoPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const site = await getSite(lang);
  const faq = await getFaq(lang);
  const reviews = await getReviews(lang);

  return (
    <div className="py-10">
      <SlideIn index={0}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{site.pageTitles?.aboutShop || "About the shop"}</h1>
          <p className="mt-2 text-muted-foreground whitespace-pre-line">{site.location.directions}</p>
        </div>
      </SlideIn>

      <SlideIn index={1}>
        <Section title={site.sections.highlights.title} subtitle={site.pageTitles?.whyChooseUs || "Why guests choose us"}>
          <Carousel slidesPerView={{ mobile: 1, desktop: 3 }}>
            {site.sections.highlights.items.map((it, idx) => (
              <Card key={idx} className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">{it.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{it.text}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </Carousel>
        </Section>
      </SlideIn>

      <SlideIn index={2}>
        <Section title={site.sections.shopPhotos.title} subtitle={site.pageTitles?.insideOutside || "Inside & outside"}>
          <Carousel slidesPerView={{ mobile: 1, desktop: 1.5 }}>
            {site.sections.shopPhotos.items.map((p, idx) => (
              <div key={idx} className="overflow-hidden rounded-2xl border border-border bg-card h-[500px]">
                <img src={p.src} alt={p.title} className="w-full h-full object-cover" />
              </div>
            ))}
          </Carousel>
        </Section>
      </SlideIn>

      <SlideIn index={3}>
        <div className="scroll-mt-32 md:scroll-mt-24">
          <Section title={site.pageTitles?.addresses || "Addresses"} subtitle={site.location.addressLine}>
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-accent" /> {site.pageTitles?.map || "Map"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {site.location.points.map((point, index) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <MapPin className="h-5 w-5 text-accent shrink-0" />
                            <span className="text-sm">{point.address}</span>
                          </div>
                          <a href={point.mapOpenUrl} target="_blank" rel="noreferrer" className="no-underline shrink-0">
                            <Button variant="outline" size="sm" className="gap-2">
                              {site.pageTitles?.openInGoogleMaps || "Open in Google Maps"}
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card id="contacts" className="scroll-mt-32 md:scroll-mt-24">
                  <CardHeader>
                    <CardTitle>Contacts</CardTitle>
                    <CardDescription>{site.pageTitles?.contactsDescription || "Phone, email and messengers"}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <a className="hover:underline flex items-center gap-2" href={`tel:${site.contacts.phone}`}>
                        <Phone className="h-4 w-4" />{site.contacts.phone}
                      </a>
                      <span className="text-muted-foreground">WhatsApp | Telegram | Viber</span>
                    </div>
                    <a className="hover:underline flex items-center gap-2" href={`mailto:${site.contacts.email}`}>
                      <Mail className="h-4 w-4" />{site.contacts.email}
                    </a>
                    {site.contacts.instagram ? (
                      <a className="hover:underline flex items-center gap-2" href={site.contacts.instagram} target="_blank" rel="noreferrer">
                        <Instagram className="h-4 w-4" />Instagram
                      </a>
                    ) : null}
                    {site.contacts.telegram ? (
                      <a className="hover:underline flex items-center gap-2" href={`https://t.me/${site.contacts.telegram.replace('@', '')}`} target="_blank" rel="noreferrer">
                        <MessageCircle className="h-4 w-4" />Telegram
                      </a>
                    ) : null}
                    {site.contacts.facebook ? (
                      <a className="hover:underline flex items-center gap-2" href={site.contacts.facebook} target="_blank" rel="noreferrer">
                        <Facebook className="h-4 w-4" />Facebook
                      </a>
                    ) : null}
                    <div className="flex items-center gap-2 mt-3">
                      <Clock className="h-4 w-4" />
                      <span>{(site.pageTitles as any)?.hoursLabel || "Время работы:"} {site.hours.value}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent" /> {site.pageTitles?.map || "Map"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <GoogleMap
                    point={site.location.points[0]}
                    title={site.pageTitles?.map || "Map"}
                    labels={{
                      loading: site.pageTitles?.mapLoading,
                      error: site.pageTitles?.mapError,
                      errorDescription: site.pageTitles?.mapErrorDescription,
                      retry: site.pageTitles?.mapRetry,
                      preparing: site.pageTitles?.mapPreparing,
                      openInGoogleMaps: site.pageTitles?.openInGoogleMaps,
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </Section>
        </div>
      </SlideIn>

      <SlideIn index={4}>
        <Section title={faq.title} subtitle={site.pageTitles?.quickAnswers || "Quick answers"}>
          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {faq.items.map((it, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger>{it.q}</AccordionTrigger>
                    <AccordionContent>{it.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </Section>
      </SlideIn>

      <SlideIn index={5}>
        <Section title={reviews.title}>
          <ElfsightGoogleReviews widgetId="5d1b2428-0a62-4de5-aeae-5315335a978f" />
        </Section>
      </SlideIn>
    </div>
  );
}

