import type { Lang } from "@/lib/i18n";
import { getSite, getPrivacy } from "@/lib/content";
import Link from "next/link";

export default async function PrivacyPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const site = await getSite(lang);
  const privacy = await getPrivacy(lang);

  return (
    <div className="py-10 max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">{privacy.title}</h1>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{privacy.sections.introduction.title}</h2>
        {privacy.sections.introduction.paragraphs.map((para, idx) => (
          <p key={idx} className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {para.replace("{brandName}", site.brand.name)}
          </p>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{privacy.sections.informationWeCollect.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {privacy.sections.informationWeCollect.intro}
        </p>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground space-y-2 leading-relaxed">
          {privacy.sections.informationWeCollect.items.map((item, idx) => (
            <li key={idx}><strong>{item.title}</strong> {item.text}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          <strong>{privacy.sections.informationWeCollect.automaticallyCollected.title}</strong> {privacy.sections.informationWeCollect.automaticallyCollected.text}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{privacy.sections.howWeUse.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {privacy.sections.howWeUse.intro}
        </p>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground space-y-2 leading-relaxed">
          {privacy.sections.howWeUse.items.map((item, idx) => (
            <li key={idx}><strong>{item.title}</strong> {item.text}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{privacy.sections.legalBasis.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {privacy.sections.legalBasis.intro}
        </p>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground space-y-2 leading-relaxed">
          {privacy.sections.legalBasis.items.map((item, idx) => (
            <li key={idx}><strong>{item.title}</strong> {item.text}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{privacy.sections.dataSharing.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {privacy.sections.dataSharing.intro}
        </p>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground space-y-2 leading-relaxed">
          {privacy.sections.dataSharing.items.map((item, idx) => (
            <li key={idx}><strong>{item.title}</strong> {item.text}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{privacy.sections.dataSecurity.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {privacy.sections.dataSecurity.intro}
        </p>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground space-y-2 leading-relaxed">
          {privacy.sections.dataSecurity.items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          {privacy.sections.dataSecurity.disclaimer}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{privacy.sections.dataRetention.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {privacy.sections.dataRetention.intro}
        </p>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground space-y-2 leading-relaxed">
          {privacy.sections.dataRetention.items.map((item, idx) => (
            <li key={idx}><strong>{item.title}</strong> {item.text}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          {privacy.sections.dataRetention.conclusion}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{privacy.sections.yourRights.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {privacy.sections.yourRights.intro}
        </p>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground space-y-2 leading-relaxed">
          {privacy.sections.yourRights.items.map((item, idx) => (
            <li key={idx}><strong>{item.title}</strong> {item.text}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          {privacy.sections.yourRights.conclusion}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{privacy.sections.cookies.title}</h2>
        {privacy.sections.cookies.paragraphs.map((para, idx) => (
          <p key={idx} className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {para}
          </p>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{privacy.sections.internationalTransfers.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {privacy.sections.internationalTransfers.text}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{privacy.sections.childrenPrivacy.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {privacy.sections.childrenPrivacy.text}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{privacy.sections.changes.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {privacy.sections.changes.text}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{privacy.sections.contactUs.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {privacy.sections.contactUs.intro}
        </p>
        <div className="mt-4 text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${site.contacts.email}`} className="hover:underline text-foreground">
              {site.contacts.email}
            </a>
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            <a href={`tel:${site.contacts.phone}`} className="hover:underline text-foreground">
              {site.contacts.phone}
            </a>
          </p>
        </div>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          {privacy.sections.contactUs.contactPage.includes("{contactLink}") ? (
            <>
              {privacy.sections.contactUs.contactPage.split("{contactLink}")[0]}
              <Link href={`/${lang}#contacts`} className="hover:underline text-foreground">contact page</Link>
              {privacy.sections.contactUs.contactPage.split("{contactLink}")[1]}
            </>
          ) : (
            privacy.sections.contactUs.contactPage
          )}
        </p>
      </section>
    </div>
  );
}
