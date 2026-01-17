import type { Lang } from "@/lib/i18n";
import { getSite, getReviews } from "@/lib/content";
import { Section } from "@/components/site/section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
import { MapPin, Phone, Mail, Instagram, MessageCircle, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideIn } from "@/components/ui/slide-in";
import { GoogleMap } from "@/components/site/google-map";

export default async function Home({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const site = await getSite(lang);
  const reviews = await getReviews(lang);

  return (
    <div className="py-10">
      <SlideIn index={0}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{site.sections.shopPhotos.title}</h1>
          {site.pageTitles?.insideOutside ? <p className="mt-2 text-muted-foreground">{site.pageTitles.insideOutside}</p> : null}
          <div className="mt-6">
            <Carousel slidesPerView={{ mobile: 1, desktop: 1.5 }}>
              {site.sections.shopPhotos.items.map((p, idx) => (
                <div key={idx} className="overflow-hidden rounded-2xl border border-border bg-card h-[500px]">
                  <img src={p.src} alt={p.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </SlideIn>

      <SlideIn index={1}>
        <div className="scroll-mt-32 md:scroll-mt-24 mt-10">
          <Section title={site.pageTitles?.findUs || "Find us"} subtitle={site.location.addressLine}>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-accent" /> {site.pageTitles?.map || "Map"}</CardTitle>
                    <a href={site.location.mapOpenUrl} target="_blank" rel="noreferrer" className="no-underline">
                      <Button variant="outline" size="sm" className="gap-2">
                        {site.pageTitles?.openInGoogleMaps || "Open in Google Maps"}
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </CardHeader>
                <CardContent>
                  <GoogleMap
                    embedUrl={site.location.mapEmbedUrl}
                    openUrl={site.location.mapOpenUrl}
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

              <Card id="contacts" className="scroll-mt-32 md:scroll-mt-24">
              <CardHeader>
                <CardTitle>{site.pageTitles?.navContacts || "Contacts"}</CardTitle>
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
                <div className="flex items-center gap-2 mt-3">
                  <Clock className="h-4 w-4" />
                  <span>{(site.pageTitles as any)?.hoursLabel || "Время работы:"} {site.hours.value}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
        </div>
      </SlideIn>

      <SlideIn index={2}>
        <div className="mt-10">
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
        </div>
      </SlideIn>

      <SlideIn index={3}>
        <div className="mt-10">
          <h2 className="text-3xl font-semibold tracking-tight">{site.pageTitles?.aboutShop || "About the shop"}</h2>
          <p className="mt-2 text-muted-foreground whitespace-pre-line">{site.location.directions}</p>
        </div>
      </SlideIn>

      <SlideIn index={4}>
        <div className="mt-10">
          <Section title={reviews.title}>
          <Carousel slidesPerView={{ mobile: 1, desktop: 3 }}>
            {reviews.items.map((r, idx) => (
              <Card key={idx} className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">{r.name}</CardTitle>
                  <CardDescription>{"★".repeat(Math.max(1, Math.min(5, r.rating)))}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{r.text}</CardContent>
              </Card>
            ))}
          </Carousel>
        </Section>
        </div>
      </SlideIn>
    </div>
  );
}
