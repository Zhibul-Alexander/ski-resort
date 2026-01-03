import type { Lang } from "@/lib/i18n";
import { getPricing } from "@/lib/content";
import { Section } from "@/components/site/section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function LessonsPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const pricing = await getPricing(lang);

  const coaches = [
    { 
      name: "Nika", 
      title: "Сертифицированный инструктор • 7+ лет опыта", 
      text: "Отлично работает с новичками и уверенными карвингистами.",
      experience: "Ника — опытный инструктор с международной сертификацией, специализируется на обучении базовой технике и совершенствовании навыков карвинга. Её подход основан на терпении и индивидуальном внимании к каждому ученику. Помогает преодолеть страх первых спусков и уверенно освоить склоны Гудаури.",
      specialties: ["Обучение новичков", "Техника карвинга", "Построение уверенности на склоне"]
    },
    { 
      name: "Sandro", 
      title: "Фрирайд-коуч • 10+ лет опыта", 
      text: "Техника вне трасс, безопасность и уверенность.",
      experience: "Сандро — профессиональный фрирайд-инструктор с более чем десятилетним стажем. Прошёл обучение по лавинной безопасности и технике катания вне подготовленных трасс. Его страсть — показать красоту нетронутого снега и научить безопасному катанию в горах. Работает как с продвинутыми райдерами, так и с теми, кто только начинает осваивать фрирайд.",
      specialties: ["Фрирайд техника", "Лавинная безопасность", "Катание вне трасс"]
    },
    { 
      name: "Mariam", 
      title: "Детский инструктор • 6+ лет опыта", 
      text: "Дружелюбная, терпеливая и структурированная подача материала.",
      experience: "Мариам — специализированный инструктор по работе с детьми. Имеет специальную подготовку по детской психологии и методике обучения. Создаёт безопасную и весёлую атмосферу на уроках, где дети не только учатся кататься, но и получают удовольствие от процесса. Её уроки структурированы, понятны и адаптированы под возраст каждого ребёнка.",
      specialties: ["Обучение детей", "Безопасность для детей", "Игровая методика"]
    }
  ];

  return (
    <div className="py-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Уроки катания</h1>
        <div className="mt-4 space-y-3 text-muted-foreground">
          <p>
            Наша команда профессиональных инструкторов поможет вам освоить горные лыжи и сноуборд или улучшить свои навыки, независимо от вашего уровня подготовки. Мы работаем с детьми и взрослыми, новичками и продвинутыми райдерами.
          </p>
          <p>
            <strong className="text-foreground">Индивидуальные уроки:</strong> Продолжительность — {pricing.lessons.duration}. Каждый урок адаптирован под ваши цели и уровень подготовки. Инструктор уделяет внимание только вам, что позволяет максимально быстро прогрессировать и получать персональные рекомендации.
          </p>
          <p>
            <strong className="text-foreground">Групповые тренировки:</strong> Доступны по предварительному согласованию. Для уточнения расписания, состава группы и стоимости свяжитесь с нами по телефону или через мессенджеры.
          </p>
          <p>
            Все наши инструкторы имеют международные сертификаты и многолетний опыт работы. Мы гарантируем безопасность, профессиональный подход и индивидуальное внимание к каждому ученику.
          </p>
        </div>
      </div>

      <Section title="Стоимость" subtitle="Пакеты уроков">
        <div className="grid gap-4 md:grid-cols-3">
          {pricing.lessons.packages.map((p, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{p.label}</CardTitle>
                <CardDescription>{p.note ?? "Private lesson package"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{p.price}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Наша команда инструкторов" subtitle="Профессионалы с опытом и страстью к горным лыжам">
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
                  <p className="text-sm font-medium mb-2">Специализация:</p>
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
    </div>
  );
}
