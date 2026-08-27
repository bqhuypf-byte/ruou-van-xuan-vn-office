import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link2,
  ImageIcon,
  Video,
  TableIcon,
  Undo2,
  Redo2,
  Loader2,
  Trash2,
  Rows3,
  Columns3,
} from 'lucide-react';
import { uploadService } from '@/shared/services/upload.service';
import { VideoExtension } from './richTextVideoExtension';
import { VideoInsertModal, type VideoInsertResult } from './VideoInsertModal';

export interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
}

const HEADING_OPTIONS = [
  { label: 'Normal', level: 0 as const },
  { label: 'H1', level: 1 as const },
  { label: 'H2', level: 2 as const },
  { label: 'H3', level: 3 as const },
  { label: 'H4', level: 4 as const },
];

const ToolbarButton = ({
  onClick,
  active = false,
  title,
  children,
  disabled = false,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`w-8 h-8 shrink-0 rounded-md flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
      active
        ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 shrink-0" />;

const Toolbar = ({ editor }: { editor: Editor }) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const currentHeadingLevel = HEADING_OPTIONS.find((h) => h.level > 0 && editor.isActive('heading', { level: h.level }))
    ?.level ?? 0;

  const handleHeadingChange = (level: number) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: level as 1 | 2 | 3 | 4 })
        .run();
    }
  };

  const handleImageFile = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const url = await uploadService.uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleVideoInsert = (result: VideoInsertResult) => {
    editor.chain().focus().insertContent({ type: 'video', attrs: result }).run();
  };

  const handleInsertLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Nhập URL liên kết', previousUrl ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const isInTable = editor.isActive('table');

  return (
    <div className="flex items-center flex-wrap gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40">
      <ToolbarButton title="Hoàn tác" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton title="Làm lại" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo2 className="w-4 h-4" />
      </ToolbarButton>

      <Divider />

      <select
        value={currentHeadingLevel}
        onChange={(e) => handleHeadingChange(Number(e.target.value))}
        className="h-8 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm px-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
      >
        {HEADING_OPTIONS.map((h) => (
          <option key={h.label} value={h.level}>
            {h.label}
          </option>
        ))}
      </select>

      <Divider />

      <ToolbarButton title="In đậm" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton title="In nghiêng" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton title="Gạch chân" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton title="Gạch ngang" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton title="Căn trái" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <AlignLeft className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton title="Căn giữa" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <AlignCenter className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton title="Căn phải" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <AlignRight className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton title="Căn đều" active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
        <AlignJustify className="w-4 h-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton title="Danh sách gạch đầu dòng" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton title="Danh sách số" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton title="Trích dẫn" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton title="Đường kẻ ngang" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton title="Chèn liên kết" active={editor.isActive('link')} onClick={handleInsertLink}>
        <Link2 className="w-4 h-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton title="Chèn ảnh" onClick={() => imageInputRef.current?.click()} disabled={isUploadingImage}>
        {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
      </ToolbarButton>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageFile(file);
          e.target.value = '';
        }}
      />
      <ToolbarButton title="Chèn video (YouTube/Vimeo/kéo thả file)" onClick={() => setIsVideoModalOpen(true)}>
        <Video className="w-4 h-4" />
      </ToolbarButton>
      <VideoInsertModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onInsert={handleVideoInsert}
      />
      <ToolbarButton
        title="Chèn bảng"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        <TableIcon className="w-4 h-4" />
      </ToolbarButton>

      {isInTable && (
        <>
          <Divider />
          <ToolbarButton title="Thêm hàng" onClick={() => editor.chain().focus().addRowAfter().run()}>
            <Rows3 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton title="Thêm cột" onClick={() => editor.chain().focus().addColumnAfter().run()}>
            <Columns3 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton title="Xóa bảng" onClick={() => editor.chain().focus().deleteTable().run()}>
            <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </ToolbarButton>
        </>
      )}
    </div>
  );
};

export const RichTextEditor = ({ label, value, onChange, error, helperText, placeholder }: RichTextEditorProps) => {
  const lastEmittedRef = useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] }, link: false, underline: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full' } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-brand-600 dark:text-brand-400 underline' } }),
      Placeholder.configure({ placeholder: placeholder ?? 'Nhập mô tả chi tiết...' }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      VideoExtension,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastEmittedRef.current = html;
      onChange(html);
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none min-h-[280px] px-4 py-3 focus:outline-none [&_table]:border-collapse [&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_th]:border [&_th]:border-slate-300 [&_th]:p-2 [&_th]:bg-slate-100 dark:[&_td]:border-slate-700 dark:[&_th]:border-slate-700 dark:[&_th]:bg-slate-800',
      },
    },
  });

  // Keep the editor in sync when `value` changes from outside (e.g. form reset on load) —
  // but not when the change came from the editor's own onUpdate (tracked via lastEmittedRef).
  useEffect(() => {
    if (editor && value !== lastEmittedRef.current && value !== editor.getHTML()) {
      lastEmittedRef.current = value;
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <div
        className={`rounded-lg border overflow-hidden bg-white dark:bg-slate-900 ${
          error ? 'border-rose-300 dark:border-rose-800' : 'border-slate-300 dark:border-slate-700'
        }`}
      >
        {editor && <Toolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
      {error ? (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};
