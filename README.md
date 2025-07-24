# url-preview-field

A custom field plugin for Strapi that allows you to preview a URL with a social share card, similar to what you see when sharing a link on social media.

## Features

- **Custom URL Field:** Adds a new custom field type (`url`) to Strapi content types.
- **Live Preview:** When entering a URL, the field fetches and displays a preview card with the page’s title, image, and domain.
- **Social Card Style:** The preview mimics the appearance of social media link previews.
- **Advanced Settings:** Optionally mark the field as required in the content type builder (UI only).
- **Backend Metadata Fetching:** Uses a Strapi backend route to fetch Open Graph and Twitter card metadata for the given URL.

## Installation

```bash
# In your Strapi project root
npm install url-preview-field
# or
yarn add url-preview-field
```

You will need to add the following to your `config/middlewares.ts` to ensure the image from the URL can be displayed. In the img-src add the nessecary domains, otherwise Strapi will not display the image.

```
{
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        directives: {
          'script-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", 'data:', 'strapi.io'],
        },
      },
    },
  },
  ```

Then, enable the plugin in your Strapi project as you would with any other plugin.

## Usage

1. **Add the Field to a Content Type:**
   - In the Strapi admin panel, edit or create a content type.
   - Add a new field, select Custom then select the “URL” custom field (provided by this plugin).

2. **Enter a URL:**
   - In the content manager, enter a URL in the field.
   - The plugin will fetch and display a preview card with the page’s metadata (title, image, domain, etc.).

## How It Works

- **Admin UI:**  
  The plugin registers a custom field with a React component that handles user input and displays the preview card.
- **Backend:**  
  The plugin exposes a POST endpoint (`/url-preview-field/url-metadata`) that fetches the target URL, parses its HTML for Open Graph/Twitter metadata, and returns the relevant information to the frontend.

## Development

### Scripts

- `npm run build` – Build the plugin for production.
- `npm run watch` – Watch for changes and rebuild automatically.
- `npm run verify` – Verify the plugin.
- `npm run test:ts:front` – Type-check the admin (frontend) code.
- `npm run test:ts:back` – Type-check the server (backend) code.

## Limitations

- The plugin fetches metadata using the backend; the server must be able to access the target URLs.

## License

MIT
