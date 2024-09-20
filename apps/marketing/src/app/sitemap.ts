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
      url: "https://prepi.ro/faq",
      lastModified: currentDate,
    },
    {
      url: "https://prepi.ro/faq",
      lastModified: currentDate,
    },
    {
      url: "https://prepi.ro/faq",
      lastModified: currentDate,
    },
    {
      url: "https://prepi.ro/faq",
      lastModified: currentDate,
    },
  ];
}
