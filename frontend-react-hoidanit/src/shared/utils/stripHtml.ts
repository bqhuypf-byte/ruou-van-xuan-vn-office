/** Strips HTML tags down to plain text — for short previews (product cards, meta descriptions)
 * where the full rich text (headings, images, video, tables) from RichTextEditor.tsx isn't wanted. */
export const stripHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
};
