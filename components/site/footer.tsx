import Link from "next/link";
import { Phone, Instagram, Clock } from "lucide-react";

export function Footer({
  lang,
  brandName,
  phone,
  instagram,
  whatsapp,
  hours,
  footerLabels
}: {
  lang: string;
  brandName: string;
  phone: string;
  instagram?: string;
  whatsapp?: string;
  hours?: string;
  footerLabels?: {
    description?: string;
    contacts?: string;
    hoursLabel?: string;
    privacyPolicy?: string;
    rights?: string;
    phoneLabel?: string;
  };
}) {
  return (
    <footer className="border-t border-border mt-[80px]">
      <div className="container py-10 grid gap-6 md:grid-cols-2">
        <div>
          <div className="font-semibold">{brandName}</div>
          <div className="text-sm text-muted-foreground mt-2">
            {footerLabels?.description || "Premium rentals & lessons in Bakuriani. Fast, fresh, friendly."}
          </div>
        </div>

        <div className="text-sm md:text-right">
          <div className="font-medium mb-2">{footerLabels?.contacts || "Contacts"}</div>
          <div className="grid gap-2 text-muted-foreground md:justify-items-end">
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <a className="no-underline hover:underline flex items-center gap-2" href={`tel:${phone}`}>
                <Phone className="h-4 w-4" />{phone}
              </a>
              <span className="text-xs">{footerLabels?.phoneLabel || "Phone"} | </span>
              <a className="no-underline hover:underline text-xs text-muted-foreground" href={`https://wa.me/${whatsapp?.replace(/[\s+\-()]/g, '') || phone.replace(/[\s+\-()]/g, '')}`} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
            {instagram ? (
              <a className="no-underline hover:underline flex items-center gap-2 md:justify-end" href={instagram} target="_blank" rel="noreferrer">
                <Instagram className="h-4 w-4" />Instagram
              </a>
            ) : null}
            {hours ? (
              <div className="flex items-center gap-2 md:justify-end mt-2">
                <Clock className="h-4 w-4" />
                <span>{footerLabels?.hoursLabel || "Время работы:"} {hours}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="container pb-8 text-xs text-muted-foreground text-center">
        <div className="flex flex-col items-center gap-2">
          <Link href={`/${lang}/privacy`} className="no-underline hover:underline">
            {footerLabels?.privacyPolicy || "Privacy Policy"}
          </Link>
          <div>© {new Date().getFullYear()} {brandName}. {footerLabels?.rights || "All rights reserved."}</div>
        </div>
      </div>
    </footer>
  );
}
