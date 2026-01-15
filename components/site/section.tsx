import { cn } from "@/lib/utils";

export function Section({
  title,
  subtitle,
  children,
  className,
  titleLevel = "h2"
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  titleLevel?: "h1" | "h2";
}) {
  const TitleTag = titleLevel;
  return (
    <section className={cn("py-10", className)}>
      <div className="mb-6">
        <TitleTag className={cn(
          "font-semibold tracking-tight",
          titleLevel === "h1" ? "text-3xl" : "text-2xl"
        )}>{title}</TitleTag>
        {subtitle ? <p className="text-sm text-muted-foreground mt-1">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
