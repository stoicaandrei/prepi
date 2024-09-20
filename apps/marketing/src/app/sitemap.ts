import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  return [
    {
      url: "https://prepi.ro",
      lastModified: currentDate,
    },
    {
      url: "https://prepi.ro/faq",
      lastModified: currentDate,
    },
    {
      url: "https://prepi.ro/contact",
      lastModified: currentDate,
    },
    {
      url: "https://prepi.ro/legal-notice",
      lastModified: currentDate,
    },
    {
      url: "https://prepi.ro/licenses",
      lastModified: currentDate,
    },
    {
      url: "https://prepi.ro/privacy-policy",
      lastModified: currentDate,
    },
    {
      url: "https://prepi.ro/terms-of-service",
      lastModified: currentDate,
    },
  ];
}
