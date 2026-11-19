/*
 * The link-preview card. The root layout picks it up from the image files
 * beside this module. A route that sets its own `openGraph` or `twitter`
 * replaces the root's, image included, so those routes re-attach it from here.
 * Keep the alt text in step with the two `.alt.txt` files.
 */
const alt =
  "Baloch Digital wordmark above the line Venture // Research, set on a measurement grid with a radial field of rays in the lower right.";

export const openGraphShareImages = [
  { url: "/opengraph-image.png", width: 1200, height: 630, alt },
];

export const twitterShare = {
  card: "summary_large_image" as const,
  images: [{ url: "/twitter-image.png", width: 1200, height: 630, alt }],
};
