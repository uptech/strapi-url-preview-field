import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import { UrlFieldIcon } from './components/UrlFieldIcon';
import { defineMessage } from 'react-intl';

export default {
  register(app: any) {
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    app.customFields.register({
      name: 'url',
      pluginId: PLUGIN_ID, // Use the PLUGIN_ID constant to match server registration
      type: 'string',
      intlLabel: {
        id: 'url-preview-field.url.label',
        defaultMessage: 'URL',
      },
      intlDescription: {
        id: 'url-preview-field.url.description',
        defaultMessage: 'Enter an URL to see a social share card preview.',
      },
      icon: UrlFieldIcon,
      components: {
        Input: async () =>
          import('./components/UrlFieldInput').then((module) => ({
            default: module.UrlFieldInput,
          })),
      },
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
