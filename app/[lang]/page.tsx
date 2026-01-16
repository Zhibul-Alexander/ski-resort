import type { Lang } from "@/lib/i18n";
import { getSite, getReviews, getPricing } from "@/lib/content";
import { Section } from "@/components/site/section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
import { ShopPhotosCarousel } from "@/components/ui/shop-photos-carousel";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideIn } from "@/components/ui/slide-in";
import { GoogleMap } from "@/components/site/google-map";
import { formatPrice } from "@/lib/currency";
import Image from "next/image";
import Link from "next/link";

export default async function Home({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const site = await getSite(lang);
  const reviews = await getReviews(lang);
  const pricing = await getPricing(lang);
  const exchangeRate = pricing.exchangeRate ?? 2.7;

  // Находим таблицу "adults" и извлекаем нужные позиции по индексам
  // Порядок в таблице: 0=Full ski set, 1=Full snowboard set, 4=Skis, 5=Snowboard, 6=Ski boots, 7=Snowboard boots, 8=Poles
  const adultsTable = pricing.rental.tables.find(t => t.id === "adults");
  const rowIndices = [0, 1, 4, 5, 6, 8]; // Индексы нужных строк в таблице "adults" (6=Ski boots для карточки)
  const images = [
    "/images/cards/1.webp",
    "/images/cards/2.webp",
    "/images/cards/3.webp",
    "/images/cards/4.webp",
    "/images/cards/5.webp",
    "/images/cards/6.webp",
  ];
  
  const equipmentItems = rowIndices.map((rowIdx, idx) => {
    const row = adultsTable?.rows[rowIdx];
    return {
      label: row?.label || "",
      price: row?.values[0] || "", // Берем цену за 1-2 дня
      image: images[idx] || "/images/shop/1.webp",
    };
  }).filter(item => item.label); // Фильтруем пустые элементы

  return (
    <div>
      <SlideIn index={0}>
        <Section title={(site.pageTitles as any)?.ourEquipment || "Our equipment"} titleLevel="h1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipmentItems.map((item, idx) => (
              <Link key={idx} href={`/${lang}/rental`} className="no-underline">
                <Card className="w-full cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex-shrink-0 w-32 h-32 relative rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.label}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between text-right">
                      <h3 className="text-lg font-semibold">{item.label}</h3>
                      <span className="text-2xl font-bold">{formatPrice(item.price, exchangeRate)}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Link href={`/${lang}/rental`} className="no-underline">
              <Button>
                {(site.pageTitles as any)?.viewAll || "View all"}
              </Button>
            </Link>
          </div>
        </Section>
      </SlideIn>

      <SlideIn index={1}>
        <Section title={site.sections.shopPhotos.title} subtitle={site.pageTitles?.insideOutside || "Inside & outside"}>
          <ShopPhotosCarousel images={site.sections.shopPhotos.items} />
        </Section>
      </SlideIn>

      <SlideIn index={2}>
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
        <div className="py-10">
          <h1 className="text-3xl font-semibold tracking-tight">{site.pageTitles?.aboutShop || "About the shop"}</h1>
          <p className="mt-2 text-muted-foreground whitespace-pre-line">{site.location.directions}</p>
        </div>
      </SlideIn>

      <SlideIn index={5}>
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
