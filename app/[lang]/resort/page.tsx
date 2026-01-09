import type { Lang } from "@/lib/i18n";
import { getSite } from "@/lib/content";
import { Section } from "@/components/site/section";
import { Carousel } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { ImageZoom } from "@/components/ui/image-zoom";
import { SlideIn } from "@/components/ui/slide-in";

export default async function ResortPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const site = await getSite(lang);

  let sectionIndex = 0;

  return (
    <div className="py-10">
      <SlideIn index={sectionIndex++}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{site.resort.name}</h1>
          {site.resort.description && (
            <p className="mt-2 text-muted-foreground whitespace-pre-line">
              {site.resort.description}
            </p>
          )}
        </div>
      </SlideIn>

      {site.sections.resortMap && (
        <SlideIn index={sectionIndex++}>
          <Section title={site.sections.resortMap.title}>
            <ImageZoom src={site.sections.resortMap.src} alt={site.sections.resortMap.alt} lang={lang}>
              <div />
            </ImageZoom>
          </Section>
        </SlideIn>
      )}

      {site.sections.resortLifts && (
        <SlideIn index={sectionIndex++}>
          <Section title={site.sections.resortLifts.title} subtitle={site.pageTitles?.liftsSubtitle || "14 working lines of Doppelmayr (Austria) and Poma (France) cable way"}>
            <Carousel slidesPerView={{ mobile: 1, desktop: 3 }}>
              {site.sections.resortLifts.items.map((lift, idx) => (
                <Card key={idx} className="h-full">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{lift.name}</h3>
                      <p className="text-sm text-muted-foreground">{lift.type}</p>
                      {lift.capacity && (
                        <p className="text-sm"><span className="font-medium">{site.pageTitles?.capacity || "Capacity:"}</span> {lift.capacity}</p>
                      )}
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">{site.pageTitles?.start || "Start:"}</span> {lift.startAltitude}</p>
                        <p><span className="font-medium">{site.pageTitles?.verticalDrop || "Vertical drop:"}</span> {lift.verticalDrop}</p>
                        <p><span className="font-medium">{site.pageTitles?.length || "Length:"}</span> {lift.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </Carousel>
          </Section>
        </SlideIn>
      )}

      {site.sections.liveStream && (
        <SlideIn index={sectionIndex++}>
          <Section title={site.sections.liveStream.title}>
            <div className="grid gap-6 lg:grid-cols-2">
              {site.sections.liveStream.youtubeUrl && (
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <iframe
                    width="100%"
                    height="400"
                    src={site.sections.liveStream.youtubeUrl}
                    title="YouTube live stream"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full"
                  />
                </div>
              )}
              {site.sections.liveStream.videoUrl && (
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <iframe
                    width="100%"
                    height="400"
                    src={site.sections.liveStream.videoUrl}
                    title="Live stream video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </Section>
        </SlideIn>
      )}

      {site.sections.resortPhotos && (
        <SlideIn index={sectionIndex++}>
          <Section title={site.sections.resortPhotos.title}>
            <Carousel slidesPerView={{ mobile: 1, desktop: 1.5 }}>
              {site.sections.resortPhotos.items.map((photo, idx) => (
                <div key={idx} className="overflow-hidden rounded-2xl border border-border bg-card flex items-center justify-center h-[600px]">
                  <img src={photo.src} alt={photo.title} className="max-h-full max-w-full object-cover w-full h-full" />
                </div>
              ))}
            </Carousel>
          </Section>
        </SlideIn>
      )}
    </div>
  );
}
