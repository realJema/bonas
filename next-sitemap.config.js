/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://obilli.com', 
  generateRobotsTxt: true, // (optional) Generate a robots.txt file
  sitemapSize: 5000, // (optional) Limit number of URLs per sitemap file
  changefreq: 'daily', // Frequency of content updates (optional)
  priority: 0.7, // Default priority for pages (optional)
};
