import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { SiteMetaSync } from './SiteMetaSync';
import { useSiteSettings } from '../hooks/useSiteSettings';

vi.mock('../hooks/useSiteSettings', () => ({
  useSiteSettings: vi.fn(),
}));

const mockedUseSiteSettings = vi.mocked(useSiteSettings);

describe('SiteMetaSync', () => {
  beforeEach(() => {
    document.head.innerHTML = '<link rel="icon" type="image/svg+xml" href="/favicon.svg">';
  });

  it('applies the favicon configured in Admin', async () => {
    mockedUseSiteSettings.mockReturnValue({
      data: { faviconUrl: 'https://cdn.example.com/favicon.png', browserTitle: null },
    } as ReturnType<typeof useSiteSettings>);

    render(<SiteMetaSync />);

    await waitFor(() => {
      const favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
      expect(favicon?.href).toBe('https://cdn.example.com/favicon.png');
      expect(favicon).not.toHaveAttribute('type');
    });
  });

  it('restores the bundled favicon when the Admin favicon is removed', async () => {
    mockedUseSiteSettings.mockReturnValue({
      data: { faviconUrl: null, browserTitle: null },
    } as ReturnType<typeof useSiteSettings>);

    render(<SiteMetaSync />);

    await waitFor(() => {
      const favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
      expect(favicon?.getAttribute('href')).toBe('/favicon.svg');
      expect(favicon).toHaveAttribute('type', 'image/svg+xml');
    });
  });
});
