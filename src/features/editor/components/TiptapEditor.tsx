//File nay hien tai khong dung den

import { useState } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import FloatingMenuExtension from '@tiptap/extension-floating-menu';

// Import icon
import { 
  Bold, Italic, Code, Heading1, Heading2, 
  Plus, Image as ImageIcon, Quote, Minus, Link as LinkIcon 
} from 'lucide-react';
import { cn } from '@/ui/utils';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({ content, onChange, placeholder = "Viết câu chuyện của bạn...", className }: TiptapEditorProps) {
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
        emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:pointer-events-none',
      }),
      Image,
      // [QUAN TRỌNG] Cấu hình Link để luôn mở tab mới
      Link.configure({
        openOnClick: true, // Cho phép click trực tiếp để mở link (nếu muốn edit thì dùng phím mũi tên)
        autolink: true,    // Tự động nhận diện khi gõ URL
        defaultProtocol: 'https',
        HTMLAttributes: {
          target: '_blank',            // Luôn mở tab mới
          rel: 'noopener noreferrer',  // Bảo mật
          class: 'text-blue-600 hover:underline cursor-pointer', // Style cho link xanh
        },
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
    onSelectionUpdate: () => {
      setShowPlusMenu(false);
    },
  });

  if (!editor) {
    return null;
  }

  // --- ACTIONS ---

  const addImage = () => {
    const url = window.prompt('Nhập URL hình ảnh:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setShowPlusMenu(false);
  };

  // [MỚI] Hàm thêm Link đơn giản
  const addSimpleLink = () => {
    const url = window.prompt('Nhập đường dẫn (URL):');
    if (url) {
      // Chèn URL vào văn bản và gắn link cho nó
      editor.chain().focus()
        .insertContent({
          type: 'text',
          text: url, // Hiển thị chính URL đó
          marks: [
            {
              type: 'link',
              attrs: {
                href: url,
                target: '_blank', // Đảm bảo mở tab mới
              },
            },
          ],
        })
        .run();
        
      // Thêm dấu cách phía sau để user gõ tiếp không bị dính link
      editor.chain().focus().insertContent(' ').run();
    }
    setShowPlusMenu(false);
  };

  const addDelimiter = () => {
    editor.chain().focus().setHorizontalRule().run();
    setShowPlusMenu(false);
  };

  const toggleQuote = () => {
    editor.chain().focus().toggleBlockquote().run();
    setShowPlusMenu(false);
  };

  return (
    <>
      {/* 1. BUBBLE MENU (Hiện khi bôi đen text) */}
      {editor && (
        <BubbleMenu 
          editor={editor} 
          tippyOptions={{ duration: 100 }}
        >
          <div className="flex items-center gap-1 p-1 bg-black/90 backdrop-blur-md rounded-full shadow-xl border border-white/10 text-white px-3 py-2">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={cn("p-1.5 rounded hover:bg-white/20 transition", editor.isActive('bold') ? 'text-yellow-400' : '')} type="button"><Bold className="w-4 h-4" /></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={cn("p-1.5 rounded hover:bg-white/20 transition", editor.isActive('italic') ? 'text-yellow-400' : '')} type="button"><Italic className="w-4 h-4" /></button>
            <button onClick={() => editor.chain().focus().toggleCode().run()} className={cn("p-1.5 rounded hover:bg-white/20 transition", editor.isActive('code') ? 'text-yellow-400' : '')} type="button"><Code className="w-4 h-4" /></button>
            <div className="w-[1px] h-4 bg-white/20 mx-2" />
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={cn("p-1.5 rounded hover:bg-white/20 transition", editor.isActive('heading', { level: 2 }) ? 'text-yellow-400' : '')} type="button"><Heading2 className="w-4 h-4" /></button>
          </div>
        </BubbleMenu>
      )}

      {/* 2. FLOATING MENU (Dấu cộng ở dòng trống) */}
      {editor && (
        <FloatingMenu 
          editor={editor} 
          tippyOptions={{ duration: 100, placement: 'left-start', offset: [0, 0] }}
          shouldShow={({ state }) => {
            const { $from } = state.selection;
            return $from.parent.content.size === 0;
          }}
        >
          <div className="flex items-center relative -ml-12" style={{ transform: 'translateY(-50%)' }}>
            
            {/* Nút Toggle (+) */}
            <button
              onClick={() => setShowPlusMenu(!showPlusMenu)}
              className={cn(
                "group flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 z-50",
                showPlusMenu 
                  ? "rotate-45 border-gray-400 bg-gray-100 text-gray-600" 
                  : "border-gray-300 bg-white text-gray-400 hover:border-gray-400 hover:text-gray-600"
              )}
              type="button"
              title="Thêm nội dung"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Menu mở rộng */}
            <div 
              className={cn(
                "flex items-center gap-1 bg-white border border-gray-200 shadow-lg rounded-full px-2 py-1 absolute left-10 transition-all duration-300 origin-left overflow-hidden",
                showPlusMenu ? "w-auto opacity-100 scale-100" : "w-0 opacity-0 scale-90 pointer-events-none"
              )}
            >
              <button onClick={addImage} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-green-600" title="Hình ảnh"><ImageIcon className="w-5 h-5" /></button>
              <button onClick={toggleQuote} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-yellow-600" title="Trích dẫn"><Quote className="w-5 h-5" /></button>
              <button onClick={addDelimiter} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-blue-600" title="Đường phân cách"><Minus className="w-5 h-5" /></button>
              
              {/* Nút Link Đơn giản */}
              <button onClick={addSimpleLink} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-purple-600" title="Chèn Link">
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>

          </div>
        </FloatingMenu>
      )}

      <EditorContent editor={editor} />
    </>
  );
}