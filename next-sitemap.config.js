/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://obilli.com", // Replace with your domain
  generateRobotsTxt: true, // Ensures robots.txt is generated
  sitemapSize: 5000, // Max URLs per sitemap file
  changefreq: "daily", // Optional: Sets change frequency
  priority: 0.7, // Optional: Sets default priority
  exclude: ["/api/*", "/server-sitemap.xml"], // Exclude paths if necessary
};
