import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from './pluginId';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'url',
    plugin: PLUGIN_ID,
    type: 'string',
    inputSize: {
      default: 4,
      isResizable: true,
    },
  });
};

export default register;
