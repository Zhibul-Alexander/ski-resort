import type { Lang } from "@/lib/i18n";
import type { Metadata } from "next";
import { getSite } from "@/lib/content";
import { SlideIn } from "@/components/ui/slide-in";
import { Phone } from "lucide-react";
import { generateMultilingualMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const site = await getSite(lang);
  const title = (site.pageTitles as any)?.metaTitleLessons || `${site.brand.name} — ${(site.pageTitles as any)?.navLessons || "Lessons"}`;
  const description = (site.pageTitles as any)?.lessonsSubtitle || "Ski and snowboard lessons in Gudauri";
  return generateMultilingualMetadata(lang, 'lessons', { title, description });
}

export default async function LessonsPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const site = await getSite(lang);

  const phone = site.contacts?.phone || "+995 599 180 733";
  
  const text1 = (site.pageTitles as any)?.lessonsText1 || "У нас работает большая команда профессиональных инструкторов с большим опытом — поможем уверенно встать на лыжи или сноуборд и заметно улучшить технику, независимо от вашего уровня подготовки. Мы обучаем взрослых и детей: от самых первых шагов до отработки поворотов, контроля скорости и уверенного катания на разных склонах.";
  const text2 = (site.pageTitles as any)?.lessonsText2 || "Доступны индивидуальные занятия — полностью под ваши цели, темп и уровень, с персональными рекомендациями и вниманием инструктора только к вам. Также есть групповые занятия и детская лыжная школа, где дети учатся в комфортной атмосфере, постепенно развивая технику и уверенность на склоне.";
  const text3 = (site.pageTitles as any)?.lessonsText3 || "Чтобы уточнить стоимость, даты и подобрать формат занятий, позвоните:";

  return (
    <div className="py-10">
      <SlideIn index={0}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{(site.pageTitles as any)?.lessons || "Уроки катания"}</h1>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>{text1}</p>
            <p>{text2}</p>
            <p>
              {text3}{" "}
              <span className="inline-flex flex-wrap items-center gap-2">
                <a className="hover:underline flex items-center gap-2" href={`tel:${phone}`}>
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
                <span className="text-muted-foreground">
                  {(() => {
                    const phoneAndWhatsApp = site.pageTitles?.phoneAndWhatsApp || "Телефон | WhatsApp";
                    const parts = phoneAndWhatsApp.split(' | ');
                    const phonePart = parts[0] || "Телефон";
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
              </span>
            </p>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}
