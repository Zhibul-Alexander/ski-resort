import type { Lang } from "@/lib/i18n";
import { getPricing, getSite } from "@/lib/content";
import { Section } from "@/components/site/section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SlideIn } from "@/components/ui/slide-in";

export default async function LessonsPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const pricing = await getPricing(lang);
  const site = await getSite(lang);

  // Используем данные об инструкторах из контента, если они есть, иначе fallback на русский
  const coaches = site.sections.instructors?.items || [
    { 
      name: "Nika", 
      title: "Сертифицированный инструктор • 7+ лет опыта", 
      experience: "Ника — опытный инструктор с международной сертификацией, специализируется на обучении базовой технике и совершенствовании навыков карвинга. Её подход основан на терпении и индивидуальном внимании к каждому ученику. Помогает преодолеть страх первых спусков и уверенно освоить склоны Бакуриани.",
      specialties: ["Обучение новичков", "Техника карвинга", "Построение уверенности на склоне"]
    },
    { 
      name: "Sandro", 
      title: "Фрирайд-коуч • 10+ лет опыта", 
      experience: "Сандро — профессиональный фрирайд-инструктор с более чем десятилетним стажем. Прошёл обучение по лавинной безопасности и технике катания вне подготовленных трасс. Его страсть — показать красоту нетронутого снега и научить безопасному катанию в горах. Работает как с продвинутыми райдерами, так и с теми, кто только начинает осваивать фрирайд.",
      specialties: ["Фрирайд техника", "Лавинная безопасность", "Катание вне трасс"]
    },
    { 
      name: "Mariam", 
      title: "Детский инструктор • 6+ лет опыта", 
      experience: "Мариам — специализированный инструктор по работе с детьми. Имеет специальную подготовку по детской психологии и методике обучения. Создаёт безопасную и весёлую атмосферу на уроках, где дети не только учатся кататься, но и получают удовольствие от процесса. Её уроки структурированы, понятны и адаптированы под возраст каждого ребёнка.",
      specialties: ["Обучение детей", "Безопасность для детей", "Игровая методика"]
    }
  ];

  const individualText = (site.pageTitles as any)?.lessonsIndividualText?.replace("{duration}", pricing.lessons.duration) || `Продолжительность — ${pricing.lessons.duration}. Каждый урок адаптирован под ваши цели и уровень подготовки. Инструктор уделяет внимание только вам, что позволяет максимально быстро прогрессировать и получать персональные рекомендации.`;

  return (
    <div className="py-10">
      <SlideIn index={0}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{(site.pageTitles as any)?.lessons || "Уроки катания"}</h1>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>
              {(site.pageTitles as any)?.lessonsSubtitle || "Наша команда профессиональных инструкторов поможет вам освоить горные лыжи и сноуборд или улучшить свои навыки, независимо от вашего уровня подготовки. Мы работаем с детьми и взрослыми, новичками и продвинутыми райдерами."}
            </p>
            <p>
              <strong className="text-foreground">{(site.pageTitles as any)?.lessonsIndividual || "Индивидуальные уроки:"}</strong> {individualText}
            </p>
            <p>
              <strong className="text-foreground">{(site.pageTitles as any)?.lessonsGroup || "Групповые тренировки:"}</strong> {(site.pageTitles as any)?.lessonsGroupText || "Доступны по предварительному согласованию. Для уточнения расписания, состава группы и стоимости свяжитесь с нами по телефону или через мессенджеры."}
            </p>
            <p>
              {(site.pageTitles as any)?.lessonsGuarantee || "Все наши инструкторы имеют международные сертификаты и многолетний опыт работы. Мы гарантируем безопасность, профессиональный подход и индивидуальное внимание к каждому ученику."}
            </p>
          </div>
        </div>
      </SlideIn>

      <SlideIn index={1}>
        <Section title={(site.pageTitles as any)?.lessonsPricing || "Стоимость"} subtitle={(site.pageTitles as any)?.lessonsPricingSubtitle || "Пакеты уроков"}>
          <div className="grid gap-4 md:grid-cols-3">
            {pricing.lessons.packages.map((p, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>{p.label}</CardTitle>
                  <CardDescription>{p.note || "Private lesson package"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold">{p.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      </SlideIn>

      <SlideIn index={2}>
        <Section 
          title={site.sections.instructors?.title || (site.pageTitles as any)?.lessonsTeam || "Наша команда инструкторов"} 
          subtitle={site.sections.instructors?.subtitle || (site.pageTitles as any)?.lessonsTeamSubtitle || "Профессионалы с опытом и страстью к горным лыжам"}
        >
          <div className="grid gap-6 md:grid-cols-3">
            {coaches.map((c, idx) => (
              <Card key={idx} className="flex flex-col">
                <CardHeader>
                  <div className="h-16 w-16 rounded-2xl bg-secondary grid place-items-center font-semibold text-xl">
                    {c.name.slice(0,1)}
                  </div>
                  <CardTitle className="mt-4">{c.name}</CardTitle>
                  <CardDescription className="text-sm font-medium">{c.title}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.experience}</p>
                  <div>
                    <p className="text-sm font-medium mb-2">{(site.pageTitles as any)?.lessonsSpecialization || "Специализация:"}</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {c.specialties.map((spec, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      </SlideIn>
    </div>
  );
}
