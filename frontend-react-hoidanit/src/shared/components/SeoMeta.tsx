import { useEffect } from 'react';

interface SeoMetaProps {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string | null;
  fallbackTitle?: string | null;
  type?: 'website' | 'product';
}

interface HeadElementDefinition {
  selector: string;
  tagName: 'link' | 'meta';
  attributes: Record<string, string>;
}

const upsertHeadElement = ({ selector, tagName, attributes }: HeadElementDefinition) => {
  const existingElement = document.head.querySelector<HTMLElement>(selector);
  const element = existingElement ?? document.createElement(tagName);
  const previousAttributes = Object.fromEntries(
    Object.keys(attributes).map((name) => [name, element.getAttribute(name)]),
  );

  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  if (!existingElement) document.head.appendChild(element);

  return () => {
    if (!existingElement) {
      element.remove();
      return;
    }

    Object.entries(previousAttributes).forEach(([name, value]) => {
      if (value === null) element.removeAttribute(name);
      else element.setAttribute(name, value);
    });
  };
};

export const SeoMeta = ({
  title,
  description,
  canonicalUrl,
  imageUrl,
  fallbackTitle,
  type = 'website',
}: SeoMetaProps) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const definitions: HeadElementDefinition[] = [
      {
        selector: 'meta[name="description"]',
        tagName: 'meta',
        attributes: { name: 'description', content: description },
      },
      {
        selector: 'link[rel="canonical"]',
        tagName: 'link',
        attributes: { rel: 'canonical', href: canonicalUrl },
      },
      {
        selector: 'meta[property="og:type"]',
        tagName: 'meta',
        attributes: { property: 'og:type', content: type },
      },
      {
        selector: 'meta[property="og:title"]',
        tagName: 'meta',
        attributes: { property: 'og:title', content: title },
      },
      {
        selector: 'meta[property="og:description"]',
        tagName: 'meta',
        attributes: { property: 'og:description', content: description },
      },
      {
        selector: 'meta[property="og:url"]',
        tagName: 'meta',
        attributes: { property: 'og:url', content: canonicalUrl },
      },
      {
        selector: 'meta[name="twitter:card"]',
        tagName: 'meta',
        attributes: { name: 'twitter:card', content: imageUrl ? 'summary_large_image' : 'summary' },
      },
      {
        selector: 'meta[name="twitter:title"]',
        tagName: 'meta',
        attributes: { name: 'twitter:title', content: title },
      },
      {
        selector: 'meta[name="twitter:description"]',
        tagName: 'meta',
        attributes: { name: 'twitter:description', content: description },
      },
    ];

    if (imageUrl) {
      definitions.push(
        {
          selector: 'meta[property="og:image"]',
          tagName: 'meta',
          attributes: { property: 'og:image', content: imageUrl },
        },
        {
          selector: 'meta[name="twitter:image"]',
          tagName: 'meta',
          attributes: { name: 'twitter:image', content: imageUrl },
        },
      );
    }

    const cleanups = definitions.map(upsertHeadElement);

    return () => {
      cleanups.reverse().forEach((cleanup) => cleanup());
      document.title = fallbackTitle || previousTitle;
    };
  }, [canonicalUrl, description, fallbackTitle, imageUrl, title, type]);

  return null;
};
