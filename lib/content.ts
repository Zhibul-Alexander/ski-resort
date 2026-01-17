import type { Lang } from "./i18n";
import { toLocaleKey } from "./i18n";

export type SiteContent = {
  brand: { name: string; tagline: string; };
  resort: { name: string; description?: string; };
  contacts: {
    phone: string;
    email: string;
    whatsapp?: string;
    telegram?: string;
    viber?: string;
    instagram?: string;
  };
  hours: { label: string; value: string; };
  location: {
    addressLine: string;
    directions: string;
    mapEmbedUrl: string;
    mapOpenUrl: string;
  };
  pageTitles?: {
    aboutShop?: string;
    findUs?: string;
    quickAnswers?: string;
    reviews?: string;
    whyChooseUs?: string;
    insideOutside?: string;
    map?: string;
    openMapDescription?: string;
    openInGoogleMaps?: string;
    contactsDescription?: string;
    resortMap?: string;
    resortPhotos?: string;
    capacity?: string;
    start?: string;
    verticalDrop?: string;
    length?: string;
    liftsSubtitle?: string;
    [key: string]: string | undefined;
  };
  sections: {
    highlights: { title: string; items: { title: string; text: string }[] };
    shopPhotos: { title: string; items: { title: string; src: string }[] };
    certificates: { title: string; items: { title: string; text: string }[] };
    resortPhotos?: { title: string; items: { title: string; src: string }[] };
    resortMap?: { title: string; src: string; alt: string };
    resortLifts?: { title: string; items: { name: string; type: string; capacity: string; startAltitude: string; verticalDrop: string; length: string }[] };
    liveStream?: { title: string; youtubeUrl?: string; videoUrl?: string };
    instructors?: { title: string; subtitle: string; items: { name: string; title: string; experience: string; specialties: string[] }[] };
  };
};

export type PricingContent = {
  exchangeRate?: number;
  rental: {
    tables: {
      id: string;
      title: string;
      subtitle?: string;
      columns: string[];
      rows: { label: string; values: string[] }[];
      note?: string;
    }[];
    extras: { title: string; items: { name: string; price: string }[] }[];
  };
  lessons: {
    duration: string;
    packages: { label: string; price: string; note?: string }[];
  };
  services?: {
    items: { name: string; price: number }[];
    note?: string;
  };
};

export type FaqContent = { title: string; items: { q: string; a: string }[] };
export type ReviewsContent = { title: string; items: { name: string; text: string; rating: number }[] };

export type PrivacyContent = {
  title: string;
  lastUpdated: string;
  sections: {
    introduction: {
      title: string;
      paragraphs: string[];
    };
    informationWeCollect: {
      title: string;
      intro: string;
      items: { title: string; text: string }[];
      automaticallyCollected: { title: string; text: string };
    };
    howWeUse: {
      title: string;
      intro: string;
      items: { title: string; text: string }[];
    };
    legalBasis: {
      title: string;
      intro: string;
      items: { title: string; text: string }[];
    };
    dataSharing: {
      title: string;
      intro: string;
      items: { title: string; text: string }[];
    };
    dataSecurity: {
      title: string;
      intro: string;
      items: string[];
      disclaimer: string;
    };
    dataRetention: {
      title: string;
      intro: string;
      items: { title: string; text: string }[];
      conclusion: string;
    };
    yourRights: {
      title: string;
      intro: string;
      items: { title: string; text: string }[];
      conclusion: string;
    };
    cookies: {
      title: string;
      paragraphs: string[];
    };
    internationalTransfers: {
      title: string;
      text: string;
    };
    childrenPrivacy: {
      title: string;
      text: string;
    };
    changes: {
      title: string;
      text: string;
    };
    contactUs: {
      title: string;
      intro: string;
      contactPage: string;
    };
  };
};

async function readJson<T>(path: string): Promise<T> {
  // Static export safe: JSON files are bundled at build time.
  return (await import(`../content/${path}`)).default as T;
}

export async function getSite(lang: Lang) {
  const key = toLocaleKey(lang);
  return await readJson<SiteContent>(`${key}/site.json`);
}

export async function getPricing(lang: Lang) {
  const key = toLocaleKey(lang);
  return await readJson<PricingContent>(`${key}/pricing.json`);
}

export async function getFaq(lang: Lang) {
  const key = toLocaleKey(lang);
  return await readJson<FaqContent>(`${key}/faq.json`);
}

export async function getReviews(lang: Lang) {
  const key = toLocaleKey(lang);
  return await readJson<ReviewsContent>(`${key}/reviews.json`);
}

export async function getPrivacy(lang: Lang) {
  const key = toLocaleKey(lang);
  return await readJson<PrivacyContent>(`${key}/privacy.json`);
}
