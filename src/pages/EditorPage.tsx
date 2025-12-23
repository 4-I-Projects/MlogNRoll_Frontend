import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { TiptapEditor, TiptapEditorRef } from '../features/editor/components/TiptapEditor';
import { EditorToolbar } from '../features/editor/components/EditorToolbar';
import { PublishModal, PublishSettings } from '../features/editor/components/PublishModal';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from '@/features/auth/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { themes } from '../themes';
import { useTheme } from '../context/ThemeContext';
import ChatBot from '../components/ChatBot';
// [MỚI] Import thư viện gọi API
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface EditorPageProps {
  currentUser: User;
}

export function EditorPage({ currentUser }: EditorPageProps) {
  const navigate = useNavigate();
  const { themeId } = useTheme();
  const currentTheme = themes[themeId as keyof typeof themes] || themes.happy;

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const editorRef = useRef<TiptapEditorRef>(null);

  // [MỚI] Mutation để gọi API tạo bài viết (POST)
  const createPostMutation = useMutation({
    mutationFn: (postData: any) => {
      // [FIX] Thêm 'as Promise<any>' để Typescript hiểu kết quả trả về là object dữ liệu (có id)
      return apiClient.post('/posts', postData) as Promise<any>;
      // return apiClient.post('/../posts', postData) as Promise<any>;
    },
    onSuccess: (data) => {
      toast.success('Đăng bài thành công! 🎉');
      setShowPublishModal(false);
      // Lúc này 'data' được hiểu là any, nên truy cập .id thoải mái
      navigate(`/post/${data.id}`);
    },
    onError: (error) => {
      console.error('Lỗi khi đăng bài:', error);
      toast.error('Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.');
    }
  });

  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [content]);

  const handleSaveDraft = () => {
    // Logic lưu nháp tự động (có thể implement API riêng sau này)
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  useEffect(() => {
    if (!title && !content) return;
    const timer = setTimeout(() => handleSaveDraft(), 5000);
    return () => clearTimeout(timer);
  }, [title, subtitle, content, themeId]);

  // [SỬA] Hàm xử lý khi bấm Publish thật
  const handlePublish = (settings: PublishSettings) => {
    // Mapping dữ liệu từ Form sang format Backend yêu cầu
    // Backend Java thường nhận object: { title, content, status, tags, visibility, ... }

    // Mapping trạng thái
    let status = 'PUBLISHED';
    if (settings.visibility === 'draft') {
        status = 'DRAFT';
    } else if (settings.visibility === 'unlisted') {
        // Nếu Backend có hỗ trợ UNLISTED hoặc ARCHIVED thì dùng, không thì map về PUBLISHED hoặc DRAFT tùy logic
        status = 'PUBLISHED'; 
    }
    const authorId = Number(currentUser.id) || 1; // Giả sử currentUser.id là string số

    const payload = {
      title: title,
      body: content,          // [QUAN TRỌNG] Đổi 'content' thành 'body'
      authorId: "c3aee945-3658-44fc-b7a1-d748e62a50ac",     // [BẮT BUỘC] Backend @NotNull
      categoryId: 1,          // [BẮT BUỘC] Tạm thời hardcode Category = 1 (cần UI chọn category sau này)
      status: status,
      tagIds: [1],
    };

    // Gọi API
    createPostMutation.mutate(payload);
  };

  const handleToolbarAction = (action: string) => {
    const editor = editorRef.current?.editor;
    if (!editor) return;

    switch (action) {
      case 'image':
        editorRef.current?.triggerImageUpload();
        break;
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'underline':
        editor.chain().focus().toggleUnderline?.().run();
        break;
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'quote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'code':
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'undo':
        editor.chain().focus().undo().run();
        break;
      case 'redo':
        editor.chain().focus().redo().run();
        break;
      default:
        console.warn('Unknown toolbar action:', action);
    }
  };

  const authorName = currentUser.displayName || currentUser.username || 'User';

  return (
    <div
      className="min-h-screen transition-all duration-700 ease-in-out bg-cover bg-center"
      style={{
        backgroundImage: (currentTheme as any).background || currentTheme.background,
        backgroundSize: '200% 200%',
        animation: 'gradientMove 15s ease infinite',
        color: currentTheme.text
      }}
    >
      {/* --- HEADER --- */}
      <div className="sticky top-0 z-50 bg-white/40 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40 transition-all duration-500 border-b border-white/10">
        <div className="flex justify-between items-center h-16 px-6 mx-auto w-full max-w-screen-xl">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-black/5 rounded-full">
              <ArrowLeft className="h-6 w-6" style={{ color: currentTheme.text }} />
            </Button>

            <div className="pl-4 border-l border-black/10">
              <ThemeToggle
                className="hover:bg-black/5"
                style={{ color: currentTheme.text }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs font-bold opacity-70" style={{ color: currentTheme.text }}>
                {/* Hiển thị Saving... nếu đang auto-save HOẶC đang gọi API publish */}
                {isSaving || createPostMutation.isPending ? 'Saving...' : 'Saved'}
              </span>
              <span className="text-[10px] opacity-50" style={{ color: currentTheme.text }}>
                {wordCount} words
              </span>
            </div>

            <Button
              size="sm"
              onClick={() => setShowPublishModal(true)}
              className="rounded-full px-6 font-bold shadow-lg hover:scale-105 transition-transform"
              style={{ backgroundColor: currentTheme.accent, color: '#fff' }}
              disabled={!title || createPostMutation.isPending} // Disable khi chưa có title hoặc đang publish
            >
              Publish
            </Button>

            <Avatar className="h-9 w-9 border-2 border-white/50 shadow-sm cursor-pointer hover:rotate-6 transition-transform">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-[740px] mx-auto">
          <EditorToolbar onAction={handleToolbarAction} />
        </div>
      </div>

      {/* --- EDITOR BODY --- */}
      <div className="max-w-[740px] mx-auto px-4 pb-32 mt-12">
        <Input
          placeholder="Tiêu đề bài viết..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-0 px-0 mb-4 text-[42px] md:text-[54px] leading-[1.1] font-serif font-bold tracking-tight placeholder:text-current placeholder:opacity-30 focus-visible:ring-0 bg-transparent shadow-none"
          style={{ color: currentTheme.text }}
        />

        <Input
          placeholder="Mô tả ngắn (không bắt buộc)..."
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="border-0 px-0 mb-10 text-xl md:text-2xl font-sans font-medium opacity-70 placeholder:text-current placeholder:opacity-50 focus-visible:ring-0 bg-transparent shadow-none"
          style={{ color: currentTheme.text }}
        />

        <div className="min-h-[500px]">
          <TiptapEditor
            ref={editorRef}
            content={content}
            onChange={setContent}
            placeholder="Hãy kể câu chuyện của bạn..."
            className={`text-lg md:text-xl leading-relaxed`}
          />
        </div>
      </div>

      <PublishModal
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublish={handlePublish}
        initialSettings={{ excerpt: subtitle, visibility: 'public', tags: [] }}
        // [MỚI] Truyền trạng thái loading vào modal
        isSubmitting={createPostMutation.isPending}
      />
      <ChatBot content={content} titleSetter={setTitle} />
    </div>
  );
}