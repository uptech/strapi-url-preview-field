import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi.plugin('url-preview-field').service('service').getWelcomeMessage();
  },
  async fetchMetadata(ctx) {
    const { url } = ctx.request.body;
    ctx.body = await strapi.plugin('url-preview-field').service('service').getUrlMetadata(url);
  },
});

export default controller;
