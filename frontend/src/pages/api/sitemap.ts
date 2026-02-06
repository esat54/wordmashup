import type { NextApiRequest, NextApiResponse } from "next";

async function generateSitemap() {
  const baseUrl = "https://www.wordmashup.xyz";

  const pages = [
    { loc: "", priority: "1.0", changefreq: "weekly" },
    { loc: "/login", priority: "0.8", changefreq: "yearly" },
    { loc: "/register", priority: "0.8", changefreq: "yearly" },
    { loc: "/dashboard", priority: "0.9", changefreq: "daily" },
    { loc: "/kelimeler", priority: "0.9", changefreq: "daily" },
    { loc: "/sozluk", priority: "0.9", changefreq: "weekly" },
    { loc: "/oxfordliste", priority: "0.95", changefreq: "weekly" },
    { loc: "/gramer", priority: "0.9", changefreq: "monthly" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return xml;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sitemap = await generateSitemap();
    res.setHeader("Content-Type", "text/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate");
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).json({ error: "Sitemap generation failed" });
  }
}