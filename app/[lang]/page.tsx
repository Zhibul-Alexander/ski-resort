import type { Lang } from "@/lib/i18n";
import { getSite, getReviews } from "@/lib/content";
import { Section } from "@/components/site/section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
import { ShopPhotosCarousel } from "@/components/ui/shop-photos-carousel";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
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
          <ShopPhotosCarousel images={site.sections.shopPhotos.items} />
        </Section>
      </SlideIn>

      <SlideIn index={3}>
        <div className="scroll-mt-[120px] lg:scroll-mt-[86px]" id="contacts">
          <Section title={site.pageTitles?.findUs || "Find us"} subtitle={site.location.addressLine}>
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>{site.pageTitles?.navContacts || "Contacts"}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <a className="hover:underline flex items-center gap-2" href={`tel:${site.contacts.phone}`}>
                      <Phone className="h-4 w-4" />
                      {site.contacts.phone}
                    </a>
                    <span className="text-muted-foreground">{site.pageTitles?.phoneAndWhatsApp || "Phone | WhatsApp"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{(site.pageTitles as any)?.hoursLabel || "Время работы:"} {site.hours.value}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{site.pageTitles?.addresses || "Addresses"}</CardTitle>
                </CardHeader>
                <CardContent>
                  {site.location.addresses && site.location.addresses.length > 0 && (
                    <div className="space-y-3">
                      {site.location.addresses.map((address, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                          <span className="flex-1 text-sm">{address.name}</span>
                          <a href={address.mapUrl} target="_blank" rel="noreferrer" className="no-underline">
                            <Button variant="outline" size="sm" className="gap-2">
                              {site.pageTitles?.openInGoogleMaps || "Open in Google Maps"}
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full mb-6">
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
            </div>
          </Section>
        </div>
      </SlideIn>

      <SlideIn index={4}>
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
      </SlideIn>
    </div>
  );
}
