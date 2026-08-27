import DOMPurify from 'dompurify';

const ALLOWED_IFRAME_SRC_PREFIXES = ['https://www.youtube.com/embed/', 'https://player.vimeo.com/video/'];

DOMPurify.addHook('uponSanitizeElement', (node, data) => {
  if (data.tagName === 'iframe' && node instanceof Element) {
    const src = node.getAttribute('src') ?? '';
    if (!ALLOWED_IFRAME_SRC_PREFIXES.some((prefix) => src.startsWith(prefix))) {
      node.remove();
    }
  }
});

/** Sanitizes HTML produced by the admin rich text editor (RichTextEditor.tsx) before rendering it
 * on the storefront — strips any tag/attribute DOMPurify doesn't recognize, while allowing the
 * `<iframe>` embeds our editor generates (restricted to YouTube/Vimeo embed URLs only). */
export const sanitizeRichText = (html: string): string =>
  DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allowfullscreen', 'frameborder', 'allow', 'referrerpolicy'],
  });
