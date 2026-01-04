import type { Lang } from "@/lib/i18n";
import { getSite } from "@/lib/content";
import Link from "next/link";

export default async function PrivacyPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const site = await getSite(lang);

  return (
    <div className="py-10 max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-3 text-muted-foreground">
        Last updated: {new Date().toLocaleDateString(lang === "ru" ? "ru-RU" : lang === "ka" ? "ka-GE" : lang === "kk" ? "kk-KZ" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">1. Introduction</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {site.brand.name} ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services for ski and snowboard equipment rental and lessons in Gudauri, Georgia.
        </p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          By using our website and services, you consent to the data practices described in this policy. If you do not agree with the practices described, please do not use our services.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">2. Information We Collect</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          We collect information that you provide directly to us when making a booking request or contacting us:
        </p>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground space-y-2 leading-relaxed">
          <li><strong>Contact Information:</strong> Name, email address, phone number, and optional messenger handles (WhatsApp, Telegram, Viber) for communication purposes.</li>
          <li><strong>Booking Details:</strong> Rental dates, requested equipment (skis, snowboards, boots, bindings, clothing, accessories), lesson preferences, number of participants, skill level, and any special requirements or comments.</li>
          <li><strong>Payment Information:</strong> We may collect payment-related information, though actual payment processing may be handled by third-party payment processors. We do not store full credit card details.</li>
          <li><strong>Communication Records:</strong> Correspondence, messages, and feedback you send to us via email, phone, or messaging platforms.</li>
        </ul>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          <strong>Automatically Collected Information:</strong> When you visit our website, we may automatically collect certain information about your device, including IP address, browser type, operating system, referring URLs, pages viewed, time spent on pages, and clickstream data. This information helps us improve our website and services.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          We use the collected information for the following purposes:
        </p>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground space-y-2 leading-relaxed">
          <li><strong>Service Provision:</strong> To process and fulfill your booking requests, prepare equipment, schedule lessons, and provide customer support.</li>
          <li><strong>Communication:</strong> To respond to your inquiries, send booking confirmations, updates, reminders, and important service-related information.</li>
          <li><strong>Business Operations:</strong> To manage our inventory, track bookings, process payments, maintain accounting records, and improve our services.</li>
          <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, legal processes, or governmental requests, and to protect our rights, property, and safety.</li>
          <li><strong>Marketing:</strong> With your consent, we may send you promotional materials, special offers, or newsletters. You can opt-out at any time.</li>
          <li><strong>Analytics:</strong> To analyze website usage, understand user preferences, and improve user experience.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">4. Legal Basis for Processing</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          We process your personal data based on the following legal grounds:
        </p>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground space-y-2 leading-relaxed">
          <li><strong>Contract Performance:</strong> To fulfill our contractual obligations when you make a booking.</li>
          <li><strong>Legitimate Interests:</strong> To operate our business, improve services, and ensure security.</li>
          <li><strong>Consent:</strong> When you provide explicit consent for specific purposes, such as marketing communications.</li>
          <li><strong>Legal Obligations:</strong> To comply with applicable laws and regulations.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">5. Data Sharing and Disclosure</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
        </p>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground space-y-2 leading-relaxed">
          <li><strong>Service Providers:</strong> We may share data with trusted third-party service providers who assist us in operating our website, conducting business, or serving you (e.g., payment processors, email service providers, hosting services). These parties are contractually obligated to keep your information confidential and use it only for specified purposes.</li>
          <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or governmental authority, or to protect our rights, property, or safety, or that of others.</li>
          <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction, subject to the same privacy protections.</li>
          <li><strong>With Your Consent:</strong> We may share information with your explicit consent for specific purposes.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">6. Data Security</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
        </p>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground space-y-2 leading-relaxed">
          <li>Encryption of data in transit using secure protocols (HTTPS/SSL)</li>
          <li>Secure storage of data with access controls</li>
          <li>Regular security assessments and updates</li>
          <li>Limited access to personal data on a need-to-know basis</li>
          <li>Employee training on data protection practices</li>
        </ul>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">7. Data Retention</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Specifically:
        </p>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground space-y-2 leading-relaxed">
          <li><strong>Booking Records:</strong> Retained for operational and accounting purposes, typically for a period of 3-7 years as required by tax and accounting regulations.</li>
          <li><strong>Communication Records:</strong> Retained for customer service and dispute resolution purposes, typically for 2-3 years.</li>
          <li><strong>Marketing Data:</strong> Retained until you opt-out or withdraw consent.</li>
          <li><strong>Analytics Data:</strong> Retained in aggregated, anonymized form for statistical purposes.</li>
        </ul>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          When data is no longer needed, we will securely delete or anonymize it in accordance with our data retention policies.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">8. Your Rights</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Depending on your location, you may have the following rights regarding your personal information:
        </p>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground space-y-2 leading-relaxed">
          <li><strong>Access:</strong> Request access to your personal data and receive a copy of the information we hold about you.</li>
          <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong>Erasure:</strong> Request deletion of your personal data when it is no longer necessary or when you withdraw consent.</li>
          <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances.</li>
          <li><strong>Data Portability:</strong> Request transfer of your data to another service provider in a structured, commonly used format.</li>
          <li><strong>Objection:</strong> Object to processing of your data for certain purposes, such as direct marketing.</li>
          <li><strong>Withdraw Consent:</strong> Withdraw your consent at any time where processing is based on consent.</li>
        </ul>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          To exercise these rights, please contact us using the contact information provided below. We will respond to your request within a reasonable timeframe and in accordance with applicable law.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">9. Cookies and Tracking Technologies</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Our website may use cookies and similar tracking technologies to enhance your experience. Cookies are small text files stored on your device that help us remember your preferences and improve site functionality.
        </p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">10. International Data Transfers</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. We take appropriate safeguards to ensure that your data receives adequate protection in accordance with this Privacy Policy.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">11. Children's Privacy</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately, and we will take steps to delete such information.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">12. Changes to This Privacy Policy</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">13. Contact Us</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
        </p>
        <div className="mt-4 text-sm text-muted-foreground space-y-2">
          <p><strong>{site.brand.name}</strong></p>
          <p>{site.location.addressLine}</p>
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
          {site.contacts.telegram && (
            <p>
              <strong>Telegram:</strong>{" "}
              <a
                href={`https://t.me/${site.contacts.telegram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-foreground"
              >
                {site.contacts.telegram}
              </a>
            </p>
          )}
        </div>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          You can also visit our <Link href={`/${lang}#contacts`} className="hover:underline text-foreground">contact page</Link> for additional ways to reach us.
        </p>
      </section>
    </div>
  );
}
