import type { Lang } from "@/lib/i18n";

export default async function PrivacyPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  void lang;

  return (
    <div className="py-10 max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
      <p className="mt-3 text-muted-foreground">
        This is a placeholder privacy policy. Replace it before publishing.
      </p>

      <h2 className="mt-8 text-xl font-semibold">What we collect</h2>
      <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground space-y-2">
        <li>Contact details (email, phone) to confirm your request.</li>
        <li>Booking details (dates, requested items) to prepare equipment/instructor.</li>
        <li>Optional messenger handle and comments.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">How we use it</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        We use this data only to process your booking request and communicate with you. We do not sell personal data.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Retention</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        Requests are kept as long as needed for operations and accounting, then removed.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Contact</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        If you want to delete your request data, contact us via the email listed on the website.
      </p>
    </div>
  );
}
