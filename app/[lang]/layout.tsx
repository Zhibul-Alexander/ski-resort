import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import { ScrollToTopOnNavigate } from "@/components/site/scroll-to-top-on-navigate";
import { ScrollUnlockOnRouteChange } from "@/components/site/scroll-unlock";
import { Snowfall } from "@/components/site/snowfall";
import { getSite } from "@/lib/content";
import { LANGS, type Lang, langToHtmlLang } from "@/lib/i18n";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  try {
    const { lang } = await params;
    if (!LANGS.includes(lang)) return {};
    const site = await getSite(lang);
    return {
      title: `${site.brand.name} — ${site.brand.tagline}`,
      description: `Premium rental & lessons in ${site.resort.name}.`
    };
  } catch (error) {
    return {
      title: "Ski №1 Rental — Bakuriani",
      description: "Premium ski rental & lessons in Bakuriani"
    };
  }
}

export default async function LangLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  if (!LANGS.includes(lang)) notFound();
  
  let site;
  try {
    site = await getSite(lang);
  } catch (error) {
    console.error(`Failed to load site data for lang: ${lang}`, error);
    notFound();
  }

  return (
    <>
      <Header 
        lang={lang} 
        brandName={site.brand.name} 
        phone={site.contacts.phone} 
        email={site.contacts.email}
        navLabels={{
          aboutUs: (site.pageTitles as any)?.navAboutUs,
          rentalPrices: (site.pageTitles as any)?.navRentalPrices,
          lessons: (site.pageTitles as any)?.navLessons,
          services: (site.pageTitles as any)?.navServices,
          contacts: (site.pageTitles as any)?.navContacts,
          requestBooking: (site.pageTitles as any)?.requestBooking
        }}
      />
      <main className="container pt-16">{children}</main>
      <Footer
        lang={lang}
        brandName={site.brand.name}
        phone={site.contacts.phone}
        email={site.contacts.email}
        instagram={site.contacts.instagram}
        whatsapp={site.contacts.whatsapp}
        telegram={site.contacts.telegram}
        viber={site.contacts.viber}
        hours={site.hours.value}
        footerLabels={{
          description: (site.pageTitles as any)?.footerDescription,
          contacts: (site.pageTitles as any)?.footerContacts,
          hoursLabel: (site.pageTitles as any)?.hoursLabel,
          privacyPolicy: (site.pageTitles as any)?.footerPrivacyPolicy,
          rights: (site.pageTitles as any)?.footerRights
        }}
      />
      <ScrollToTop />
      <ScrollToTopOnNavigate />
      <ScrollUnlockOnRouteChange />
      <Snowfall count={90} />
    </>
  );
}
