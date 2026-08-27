import { Node } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from '@tiptap/react';
import { Trash2 } from 'lucide-react';

interface VideoAttrs {
  src: string | null;
  provider: string;
}

const IFRAME_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

const VideoNodeView = ({ node, deleteNode, selected }: NodeViewProps) => {
  const { src, provider } = node.attrs as VideoAttrs;

  return (
    <NodeViewWrapper
      className={`video-embed group relative w-full aspect-video my-2 rounded-lg overflow-hidden bg-black border ${
        selected ? 'border-brand-500 ring-2 ring-brand-500/40' : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      {provider === 'iframe' ? (
        <iframe
          src={src ?? undefined}
          className="absolute inset-0 w-full h-full"
          frameBorder={0}
          allow={IFRAME_ALLOW}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <video src={src ?? undefined} controls className="absolute inset-0 w-full h-full object-contain" />
      )}
      <button
        type="button"
        contentEditable={false}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteNode();
        }}
        title="Xóa video"
        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-rose-600"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </NodeViewWrapper>
  );
};

/**
 * A minimal video node: renders a YouTube/Vimeo embed as an iframe, or a direct file URL as a
 * native <video> tag, both constrained to a 16:9 box so unusual source aspect ratios can't break
 * the surrounding layout. Inserted via `editor.chain().insertContent({ type: 'video', attrs: {...} })`.
 * Shows a hover delete button in the editor (via a React node view); the exported HTML (renderHTML)
 * is what actually gets saved/displayed on the storefront.
 */
export const VideoExtension = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      provider: { default: 'file' },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-video-provider]',
        getAttrs: (element) => {
          const el = element as HTMLElement;
          const provider = el.getAttribute('data-video-provider');
          if (provider === 'iframe') {
            const iframe = el.querySelector('iframe');
            return iframe ? { provider: 'iframe', src: iframe.getAttribute('src') } : false;
          }
          const video = el.querySelector('video');
          return video ? { provider: 'file', src: video.getAttribute('src') } : false;
        },
      },
      // Backwards-compat with content saved before videos were wrapped in a div for both providers.
      {
        tag: 'video[data-video-provider="file"]',
        getAttrs: (element) => ({
          provider: 'file',
          src: (element as HTMLElement).getAttribute('src'),
        }),
      },
    ];
  },

  renderHTML({ node }) {
    const { src, provider } = node.attrs as VideoAttrs;
    const media =
      provider === 'iframe'
        ? [
            'iframe',
            {
              src,
              frameborder: '0',
              allow: IFRAME_ALLOW,
              allowfullscreen: 'true',
              referrerpolicy: 'strict-origin-when-cross-origin',
              class: 'absolute inset-0 w-full h-full',
            },
          ]
        : ['video', { src, controls: 'true', class: 'absolute inset-0 w-full h-full object-contain' }];

    return [
      'div',
      {
        'data-video-provider': provider,
        class: 'video-embed relative w-full aspect-video my-2 rounded-lg overflow-hidden bg-black',
      },
      media,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoNodeView);
  },
});
