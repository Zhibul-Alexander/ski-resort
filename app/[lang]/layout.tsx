import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import { ScrollToTopOnNavigate } from "@/components/site/scroll-to-top-on-navigate";
import { ScrollUnlockOnRouteChange } from "@/components/site/scroll-unlock";
import { getSite } from "@/lib/content";
import { LANGS, type Lang, langToHtmlLang } from "@/lib/i18n";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!LANGS.includes(lang)) return {};
  const site = await getSite(lang);
  return {
    title: `${site.brand.name} — ${site.brand.tagline}`,
    description: `${site.brand.tagline}`
  };
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
  const site = await getSite(lang);

  return (
    <>
      <Header 
        lang={lang} 
        brandName={site.brand.name} 
        phone={site.contacts.phone}
        navLabels={{
          info: (site.pageTitles as any)?.navInfo,
          rentalPrices: (site.pageTitles as any)?.navRentalPrices,
          lessons: (site.pageTitles as any)?.navLessons,
          services: (site.pageTitles as any)?.navServices,
          contacts: (site.pageTitles as any)?.navContacts,
          requestBooking: (site.pageTitles as any)?.requestBooking
        }}
      />
      <main className="container pt-16">{children}</main>
      <div className="container">
        <div className="mt-0 mb-[48px] rounded-2xl border border-border bg-card p-6">
          <p className="text-center text-base font-medium">{site.pageTitles?.thankYouMessage || "Thank you for trusting us with your vacation!"}</p>
        </div>
      </div>
      <Footer
        lang={lang}
        brandName={site.brand.name}
        phone={site.contacts.phone}
        whatsapp={site.contacts.whatsapp}
        hours={site.hours.value}
        footerLabels={{
          description: (site.pageTitles as any)?.footerDescription,
          contacts: (site.pageTitles as any)?.footerContacts,
          hoursLabel: (site.pageTitles as any)?.hoursLabel,
          privacyPolicy: (site.pageTitles as any)?.footerPrivacyPolicy,
          rights: (site.pageTitles as any)?.footerRights,
          phoneAndWhatsApp: (site.pageTitles as any)?.phoneAndWhatsApp
        }}
      />
      <ScrollToTop />
      <ScrollToTopOnNavigate />
      <ScrollUnlockOnRouteChange />
    </>
  );
}
