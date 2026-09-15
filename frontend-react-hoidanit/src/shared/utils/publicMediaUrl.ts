const LOCAL_MEDIA_ORIGIN = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i;

const isLocalBrowser = () =>
  typeof window === 'undefined' ||
  /^(?:localhost|127\.0\.0\.1)$/i.test(window.location.hostname);

export const normalizePublicMediaUrl = (value: string) =>
  isLocalBrowser() ? value : value.replace(LOCAL_MEDIA_ORIGIN, window.location.origin);

export const normalizePublicMediaHtml = (html: string) =>
  isLocalBrowser()
    ? html
    : html.replace(
        /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?=\/uploads\/)/gi,
        window.location.origin,
      );
