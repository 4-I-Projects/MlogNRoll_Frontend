import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline'; // [MỚI] Import Underline
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import FloatingMenuExtension from '@tiptap/extension-floating-menu';

import { toast } from 'sonner';
import { uploadImage } from '@/features/post/api/upload-image';

import { 
  Bold, Italic, Code, Heading1, Heading2, 
  Plus, Image as ImageIcon, Quote, Minus, Link as LinkIcon 
} from 'lucide-react';
import { cn } from '@/ui/utils';

export interface TiptapEditorRef {
  triggerImageUpload: () => void;
  editor: any; 
}

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(({ content, onChange, placeholder = "Viết câu chuyện của bạn...", className }, ref) => {
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
        emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:pointer-events-none',
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false, // Để editor dễ click sửa text
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'text-blue-600 hover:underline cursor-pointer',
        },
      }),
      Underline, // [MỚI] Thêm Underline vào đây
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

  // Sync content từ ngoài vào (nếu cần load draft)
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
        // Chỉ set nếu nội dung thực sự khác và editor đang trống (tránh loop)
        if (editor.getText().trim() === '') {
            editor.commands.setContent(content);
        }
    }
  }, [content, editor]);

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  useImperativeHandle(ref, () => ({
    triggerImageUpload,
    editor
  }));

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        toast.error("Vui lòng chỉ chọn file ảnh!");
        return;
    }
    if (file.size > 5 * 1024 * 1024) { 
        toast.error("Ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB.");
        return;
    }

    setIsUploading(true);
    setShowPlusMenu(false); 
    
    const toastId = toast.loading("Đang tải ảnh lên máy chủ...");

    try {
        const realUrl = await uploadImage(file);
        if (editor) {
            editor.chain().focus().setImage({ src: realUrl }).run();
            editor.chain().focus().createParagraphNear().run(); 
        }
        toast.success("Tải ảnh thành công!", { id: toastId });
    } catch (error: any) {
        console.error("Upload failed:", error);
        toast.error("Lỗi upload ảnh.", { id: toastId });
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  const addSimpleLink = () => {
    const url = window.prompt('Nhập đường dẫn (URL):');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
    setShowPlusMenu(false);
  };

  const addDelimiter = () => {
    editor?.chain().focus().setHorizontalRule().run();
    setShowPlusMenu(false);
  };

  const toggleQuote = () => {
    editor?.chain().focus().toggleBlockquote().run();
    setShowPlusMenu(false);
  };

  if (!editor) return null;

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileUpload}
      />

      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex items-center gap-1 p-1 bg-black/90 backdrop-blur-md rounded-full shadow-xl border border-white/10 text-white px-3 py-2">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={cn("p-1.5 rounded hover:bg-white/20 transition", editor.isActive('bold') ? 'text-yellow-400' : '')} type="button"><Bold className="w-4 h-4" /></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={cn("p-1.5 rounded hover:bg-white/20 transition", editor.isActive('italic') ? 'text-yellow-400' : '')} type="button"><Italic className="w-4 h-4" /></button>
            <button onClick={() => editor.chain().focus().toggleCode().run()} className={cn("p-1.5 rounded hover:bg-white/20 transition", editor.isActive('code') ? 'text-yellow-400' : '')} type="button"><Code className="w-4 h-4" /></button>
            <div className="w-[1px] h-4 bg-white/20 mx-2" />
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={cn("p-1.5 rounded hover:bg-white/20 transition", editor.isActive('heading', { level: 2 }) ? 'text-yellow-400' : '')} type="button"><Heading2 className="w-4 h-4" /></button>
          </div>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu editor={editor} tippyOptions={{ duration: 100, placement: 'left-start', offset: [0, 0] }} shouldShow={({ state }) => { const { $from } = state.selection; return $from.parent.content.size === 0; }}>
          <div className="flex items-center relative -ml-12" style={{ transform: 'translateY(-50%)' }}>
            <button onClick={() => setShowPlusMenu(!showPlusMenu)} className={cn("group flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 z-50", showPlusMenu ? "rotate-45 border-gray-400 bg-gray-100 text-gray-600" : "border-gray-300 bg-white text-gray-400 hover:border-gray-400 hover:text-gray-600", isUploading && "animate-spin border-blue-500 border-t-transparent")} type="button">
              <Plus className="w-5 h-5" />
            </button>
            <div className={cn("flex items-center gap-1 bg-white border border-gray-200 shadow-lg rounded-full px-2 py-1 absolute left-10 transition-all duration-300 origin-left overflow-hidden", showPlusMenu ? "w-auto opacity-100 scale-100" : "w-0 opacity-0 scale-90 pointer-events-none")}>
              <button onClick={triggerImageUpload} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-green-600" title="Hình ảnh"><ImageIcon className="w-5 h-5" /></button>
              <button onClick={toggleQuote} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-yellow-600" title="Trích dẫn"><Quote className="w-5 h-5" /></button>
              <button onClick={addDelimiter} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-blue-600" title="Đường phân cách"><Minus className="w-5 h-5" /></button>
              <button onClick={addSimpleLink} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-purple-600" title="Chèn Link"><LinkIcon className="w-5 h-5" /></button>
            </div>
          </div>
        </FloatingMenu>
      )}

      <EditorContent editor={editor} />
    </>
  );
});

TiptapEditor.displayName = "TiptapEditor";