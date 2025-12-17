import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { TiptapEditor } from '../features/editor/components/TiptapEditor'; // Dùng Tiptap thay Textarea
import { PublishModal, PublishSettings } from '../features/editor/components/PublishModal';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from '@/features/auth/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ThemeSelector from '../components/ThemeSelector';
import { themes } from '../themes'; 
import { useTheme } from '../context/ThemeContext';
import ChatBot from '../components/ChatBot';

interface EditorPageProps {
  currentUser: User;
}

export function EditorPage({ currentUser }: EditorPageProps) {
  const navigate = useNavigate();
  const { themeId, setThemeId } = useTheme();
  const currentTheme = themes[themeId as keyof typeof themes] || themes.happy;
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Logic đếm từ cho HTML content
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, ''); 
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [content]);

  // ... Giữ nguyên logic Auto Save & Publish ...
  const handlePublish = (settings: PublishSettings) => {
      // ... logic cũ
  };

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
          {/* TRÁI */}
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-black/5 rounded-full">
              <ArrowLeft className="h-6 w-6" style={{ color: currentTheme.text }} />
            </Button>
            {/* Hiển thị Mood Picker ngay trên Header cho gọn */}
            <div className="hidden md:block pl-4 border-l border-black/10">
                 <ThemeSelector currentThemeId={themeId} onSelect={setThemeId} />
            </div>
          </div>

          {/* PHẢI */}
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-xs font-bold opacity-70" style={{ color: currentTheme.text }}>
                    {isSaving ? 'Đang lưu...' : 'Đã lưu'}
                </span>
                <span className="text-[10px] opacity-50" style={{ color: currentTheme.text }}>
                    {wordCount} từ
                </span>
             </div>

            <Button 
              size="sm" 
              onClick={() => setShowPublishModal(true)} 
              className="rounded-full px-6 font-bold shadow-lg hover:scale-105 transition-transform"
              style={{ backgroundColor: currentTheme.accent, color: '#fff' }}
              disabled={!title}
            >
              Xuất bản
            </Button>
            <Avatar className="h-9 w-9 border-2 border-white/50 shadow-sm cursor-pointer hover:rotate-6 transition-transform">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* --- EDITOR BODY --- */}
      {/* Căn giữa, giới hạn chiều rộng 740px chuẩn blog */}
      <div className="max-w-[740px] mx-auto px-4 pb-32 mt-12">
        
        {/* Mobile Theme Selector (Chỉ hiện ở mobile) */}
        <div className="md:hidden mb-6 flex justify-center">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-full">
                 <ThemeSelector currentThemeId={themeId} onSelect={setThemeId} />
            </div>
        </div>

        {/* INPUT: TITLE */}
        <Input
          placeholder="Tiêu đề bài viết..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
            border-0 px-0 mb-4 
            text-[42px] md:text-[54px] leading-[1.1] font-serif font-bold tracking-tight
            placeholder:text-current placeholder:opacity-30
            focus-visible:ring-0 bg-transparent shadow-none
          "
          style={{ color: currentTheme.text }}
        />

        {/* INPUT: SUBTITLE */}
        <Input
          placeholder="Mô tả ngắn (không bắt buộc)..."
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="
            border-0 px-0 mb-10 
            text-xl md:text-2xl font-sans font-medium opacity-70
            placeholder:text-current placeholder:opacity-50
            focus-visible:ring-0 bg-transparent shadow-none
          "
          style={{ color: currentTheme.text }}
        />

        {/* EDITOR */}
        <div className="min-h-[500px]">
            <TiptapEditor 
                content={content} 
                onChange={setContent} 
                placeholder="Hãy kể câu chuyện của bạn..."
                className={`text-lg md:text-xl leading-relaxed`} 
            />
        </div>
      </div>

      {/* FOOTER / MODAL */}
      <PublishModal
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublish={handlePublish}
        initialSettings={{ excerpt: subtitle, visibility: 'public', tags: [] }}
      />
      <ChatBot content={content} titleSetter={setTitle} />
    </div>
  );
}