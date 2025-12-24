import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { TiptapEditor, TiptapEditorRef } from '../features/editor/components/TiptapEditor';
import { EditorToolbar } from '../features/editor/components/EditorToolbar';
import { PublishModal, PublishSettings } from '../features/editor/components/PublishModal';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from '@/features/auth/types';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { themes } from '../themes';
import { useTheme } from '@/context/ThemeContext';
import ChatBot from '../components/ChatBot';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { usePost } from '@/features/post/api/get-post';
import { useUpdatePost } from '@/features/post/api/update-post';

interface EditorPageProps {
  currentUser: User;
}

export function EditorPage({ currentUser }: EditorPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');
  const isEditMode = !!postId;

  const { themeId } = useTheme();
  const currentTheme = themes[themeId as keyof typeof themes] || themes.happy;
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const editorRef = useRef<TiptapEditorRef>(null);

  const { data: existingPost, isLoading: isLoadingPost } = usePost(postId || '');

  useEffect(() => {
    if (isEditMode && existingPost) {
      setTitle(existingPost.title || '');
      setSubtitle(existingPost.excerpt || '');
      setContent(existingPost.content || '');
      
      if (editorRef.current?.editor && existingPost.content) {
         if (editorRef.current.editor.getHTML() !== existingPost.content) {
             editorRef.current.editor.commands.setContent(existingPost.content);
         }
      }
    }
  }, [isEditMode, existingPost]);

  const createPostMutation = useMutation({
    mutationFn: (postData: any) => {
      return apiClient.post('/posts', postData) as Promise<any>;
    },
    onSuccess: (data) => {
      toast.success('Đăng bài thành công! 🎉');
      setShowPublishModal(false);
      navigate(`/post/${data.id}`);
    },
    onError: () => toast.error('Có lỗi xảy ra khi đăng bài.')
  });

  const updatePostMutation = useUpdatePost();

  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [content]);

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  useEffect(() => {
    if (!title && !content) return;
    const timer = setTimeout(() => handleSaveDraft(), 5000);
    return () => clearTimeout(timer);
  }, [title, subtitle, content, themeId]);

  const handlePublish = (settings: PublishSettings) => {
    // [FIX 1] Khai báo kiểu tường minh cho status
    const status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED' = settings.visibility === 'draft' ? 'DRAFT' : 'PUBLISHED';
    
    // [FIX 2] Đảm bảo tagIds là mảng số (Backend Long)
    const tagIds = settings.tags.map(tag => Number(tag.id));

    const payload = {
      title: title,
      body: content,
      categoryId: 1,
      status: status, // Bây giờ biến này đã đúng kiểu
      tagIds: tagIds,
    };

    if (isEditMode && postId) {
      updatePostMutation.mutate({
        postId: postId,
        data: payload
      }, {
        onSuccess: () => {
          toast.success('Cập nhật bài viết thành công!');
          setShowPublishModal(false);
          queryClient.invalidateQueries({ queryKey: ['post', postId] });
          navigate(`/post/${postId}`);
        },
        onError: () => toast.error('Cập nhật thất bại.')
      });
    } else {
      createPostMutation.mutate(payload);
    }
  };

  const handleToolbarAction = (action: string) => {
    const editor = editorRef.current?.editor;
    if (!editor) return;

    switch (action) {
      case 'image': editorRef.current?.triggerImageUpload(); break;
      case 'bold': editor.chain().focus().toggleBold().run(); break;
      case 'italic': editor.chain().focus().toggleItalic().run(); break;
      case 'underline': editor.chain().focus().toggleUnderline?.().run(); break;
      case 'h1': editor.chain().focus().toggleHeading({ level: 1 }).run(); break;
      case 'h2': editor.chain().focus().toggleHeading({ level: 2 }).run(); break;
      case 'h3': editor.chain().focus().toggleHeading({ level: 3 }).run(); break;
      case 'quote': editor.chain().focus().toggleBlockquote().run(); break;
      case 'code': editor.chain().focus().toggleCodeBlock().run(); break;
      case 'bulletList': editor.chain().focus().toggleBulletList().run(); break;
      case 'orderedList': editor.chain().focus().toggleOrderedList().run(); break;
      case 'undo': editor.chain().focus().undo().run(); break;
      case 'redo': editor.chain().focus().redo().run(); break;
      case 'link':
         const previousUrl = editor.getAttributes('link').href;
         const url = window.prompt('Nhập URL:', previousUrl);
         if (url === null) return;
         if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
         if (!editor.state.selection.empty) { editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run(); } 
         else { editor.chain().focus().insertContent(`<a href="${url}" target="_blank">${url}</a>`).run(); }
         break;
      default: console.warn('Unknown toolbar action:', action);
    }
  };

  if (isEditMode && isLoadingPost) {
    return <div className="h-screen flex items-center justify-center">Đang tải bài viết...</div>;
  }

  const isSubmitting = createPostMutation.isPending || updatePostMutation.isPending;
  const authorName = currentUser.displayName || currentUser.username || 'User';

  // [FIX 3] Map tags cho initialSettings (ép kiểu ID sang number để khớp với PublishModal)
  const initialSettings = isEditMode && existingPost ? { 
      excerpt: subtitle, 
      visibility: existingPost.status === 'draft' ? 'draft' : 'public' as 'draft' | 'public', 
      tags: existingPost.tags.map(t => ({ ...t, id: Number(t.id) })) 
  } : undefined;

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
      <div className="sticky top-0 z-50 bg-white/40 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40 transition-all duration-500 border-b border-white/10">
        <div className="flex justify-between items-center h-16 px-6 mx-auto w-full max-w-screen-xl">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-black/5 rounded-full">
              <ArrowLeft className="h-6 w-6" style={{ color: currentTheme.text }} />
            </Button>

            <div className="pl-4 border-l border-black/10">
              <ThemeToggle className="hover:bg-black/5" style={{ color: currentTheme.text }} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs font-bold opacity-70" style={{ color: currentTheme.text }}>
                {isSaving || isSubmitting ? 'Saving...' : 'Saved'}
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
              disabled={!title || isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : (isEditMode ? 'Update' : 'Publish')}
            </Button>

            <Avatar className="h-9 w-9 border-2 border-white/50 shadow-sm cursor-pointer hover:rotate-6 transition-transform">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-[740px] mx-auto">
          <EditorToolbar onAction={handleToolbarAction} />
        </div>
      </div>

      <div className="max-w-[740px] mx-auto px-4 pb-32 mt-12">
        <Input
          placeholder="Tiêu đề bài viết..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-0 px-0 mb-4 text-[42px] md:text-[54px] leading-[1.1] font-serif font-bold tracking-tight placeholder:text-current placeholder:opacity-30 focus-visible:ring-0 bg-transparent shadow-none py-10"
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
        initialSettings={initialSettings}
        isSubmitting={isSubmitting}
      />
      <ChatBot content={content} titleSetter={setTitle} />
    </div>
  );
}