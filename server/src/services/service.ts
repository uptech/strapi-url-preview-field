import type { Core } from '@strapi/strapi';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },
  async getUrlMetadata(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }
      const html = await response.text();
      const $ = cheerio.load(html);

      // Try Open Graph first
      const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
      const image =
        $('meta[property="og:image"]').attr('content') ||
        $('meta[name="twitter:image"]').attr('content') ||
        '';
      const domain = (() => {
        try {
          return new URL(url).hostname.replace(/^www\./, '');
        } catch {
          return '';
        }
      })();

      console.log(
        `Found Data: ${JSON.stringify({
          title,
          image,
          url,
          domain,
        })}`
      );

      return {
        title,
        image,
        url,
        domain,
      };
    } catch (err) {
      console.error('Error fetching URL metadata:', err);
      return {
        title: '',
        image: '',
        url,
        domain: '',
        error: (err as Error).message,
      };
    }
  },
});

export default service;
