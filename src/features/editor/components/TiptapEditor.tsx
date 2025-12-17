import { useEditor, EditorContent } from '@tiptap/react';
// [SỬA 1] Import đúng đường dẫn cho Menu trong v3 (nếu v2 thì dùng '@tiptap/react')
import { BubbleMenu, FloatingMenu } from '@tiptap/react'; 

// [SỬA 2] Import StarterKit bị thiếu ở code cũ
import StarterKit from '@tiptap/starter-kit';

import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import FloatingMenuExtension from '@tiptap/extension-floating-menu';
import { Bold, Italic, Code, Quote, Image as ImageIcon, Heading1, Heading2 } from 'lucide-react';
import { cn } from '@/ui/utils';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({ content, onChange, placeholder = "Viết câu chuyện của bạn...", className }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      // [SỬA 3] Đảm bảo StarterKit được khai báo ở đây để có Bold, Italic...
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
        emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:pointer-events-none',
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      BubbleMenuExtension,
      FloatingMenuExtension,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-lg focus:outline-none max-w-none min-h-[60vh] leading-relaxed',
          className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Nhập URL hình ảnh:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <>
      {/* [SỬA 4] Bỏ prop tippyOptions (đã bị loại bỏ trong bản mới) */}
      {editor && (
        <BubbleMenu editor={editor}>
          <div className="flex items-center gap-1 p-1 bg-black/80 backdrop-blur-md rounded-lg shadow-xl border border-white/10 text-white">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn("p-2 rounded hover:bg-white/20 transition", editor.isActive('bold') ? 'bg-white/20 text-blue-400' : '')}
              type="button"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn("p-2 rounded hover:bg-white/20 transition", editor.isActive('italic') ? 'bg-white/20 text-blue-400' : '')}
              type="button"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={cn("p-2 rounded hover:bg-white/20 transition", editor.isActive('code') ? 'bg-white/20 text-blue-400' : '')}
              type="button"
            >
              <Code className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-white/20 mx-1" />
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={cn("p-2 rounded hover:bg-white/20 transition", editor.isActive('heading', { level: 2 }) ? 'bg-white/20 text-blue-400' : '')}
              type="button"
            >
              <Heading2 className="w-4 h-4" />
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* [SỬA 5] Bỏ prop tippyOptions */}
      {editor && (
        <FloatingMenu editor={editor}>
          <div className="flex items-center gap-1 p-1 -ml-10"> 
            <div className="flex items-center gap-1 bg-white border shadow-md rounded-lg p-1 overflow-hidden">
                <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-black"
                title="Heading 1"
                type="button"
                >
                <Heading1 className="w-5 h-5" />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-black"
                title="Quote"
                type="button"
                >
                <Quote className="w-5 h-5" />
                </button>
                <button
                onClick={addImage}
                className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-black"
                title="Image"
                type="button"
                >
                <ImageIcon className="w-5 h-5" />
                </button>
            </div>
          </div>
        </FloatingMenu>
      )}

      <EditorContent editor={editor} />
    </>
  );
}