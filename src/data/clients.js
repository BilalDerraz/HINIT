/**
 * Clients shown in the "Vertrouwd door" strip on the home page.
 *
 * Only companies HinIT actually works with belong here — a technical visitor
 * spots a placeholder like "Northwind" instantly and the whole strip stops
 * being believable. While this list is empty the strip is not rendered at all.
 *
 * Put the logo files in public/clients/ and reference them by URL:
 *
 *   {
 *     name: 'Bakkerij Jansen',            // alt text, and the fallback wordmark
 *     logo: '/clients/bakkerij-jansen.svg', // works on a white background
 *     logoDark: '/clients/bakkerij-jansen-dark.svg', // optional, for the dark theme
 *     url: 'https://bakkerijjansen.nl',   // optional, makes the logo a link
 *   }
 *
 * SVG or PNG with a transparent background, roughly 2:1 to 4:1 wide. Without
 * `logoDark` the light logo is inverted on the dark theme, which is fine for
 * a single-colour mark. Leave `logo` out and the name is shown as text.
 */
export const clients = [];
