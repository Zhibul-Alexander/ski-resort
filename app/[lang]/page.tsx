import Link from "next/link";
import { ArrowRight, MapPin, Snowflake, ShieldCheck, Timer } from "lucide-react";
import { getSite, getPricing, getReviews } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function Home({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const site = await getSite(lang);
  const pricing = await getPricing(lang);
  const reviews = await getReviews(lang);

  return (
    <div className="py-10">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 p-10">
        <div className="max-w-2xl">
          <Badge variant="secondary">Gudauri • Premium</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            {site.brand.name}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            {site.brand.tagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/${lang}/rental#booking-form`} className="no-underline">
              <Button size="lg">
                Request booking <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/${lang}/rental`} className="no-underline">
              <Button size="lg" variant="outline">View rental prices</Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <Snowflake className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <div className="text-sm font-medium">Fresh gear</div>
                <div className="text-xs text-muted-foreground">Economy & premium sets</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Timer className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <div className="text-sm font-medium">Fast pickup</div>
                <div className="text-xs text-muted-foreground">Simple request form</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <div className="text-sm font-medium">Trusted service</div>
                <div className="text-xs text-muted-foreground">Great reviews</div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute right-8 top-8 bottom-8 w-[380px] rounded-3xl border border-border bg-white/60 backdrop-blur p-5">
          <div className="text-sm font-medium">Hours</div>
          <div className="text-sm text-muted-foreground mt-1">{site.hours.value}</div>

          <div className="mt-4 flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 text-accent" />
            Find us on the map
          </div>
          <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-white">
            <iframe
              title="Google map"
              src={site.location.mapEmbedUrl}
              width="100%"
              height="240"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-3 text-xs text-muted-foreground">{site.location.addressLine}</div>
          <a className="text-xs" href={site.location.mapOpenUrl} target="_blank" rel="noreferrer">
            Open in Google Maps
          </a>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{site.pageTitles?.aboutShop || "About Us"}</CardTitle>
            <CardDescription>Learn more about our shop, services and team.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/${lang}/about-us`} className="no-underline">
              <Button variant="secondary" className="w-full">Learn more</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rental Prices</CardTitle>
            <CardDescription>Skis, snowboards, kids gear, clothing & accessories.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/${lang}/rental`} className="no-underline">
              <Button variant="secondary" className="w-full">Explore prices</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lessons</CardTitle>
            <CardDescription>Private coaching (1.5h). Packages available.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/${lang}/lessons`} className="no-underline">
              <Button variant="secondary" className="w-full">View lesson pricing</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ski Resort</CardTitle>
            <CardDescription>Map, photos and quick tips for {site.resort.name}.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/${lang}/resort`} className="no-underline">
              <Button variant="secondary" className="w-full">Open resort page</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">{reviews.title}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {reviews.items.slice(0, 6).map((r, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-base">{r.name}</CardTitle>
                <CardDescription>{"★".repeat(Math.max(1, Math.min(5, r.rating)))}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{r.text}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
