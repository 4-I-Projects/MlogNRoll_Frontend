import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Eye, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { EditorToolbar } from '../features/editor/components/EditorToolbar';
import { PublishModal, PublishSettings } from '../features/editor/components/PublishModal';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from '@/features/auth/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ThemeSelector from '../components/ThemeSelector'; // Import component chọn theme
import { themes } from '../themes'; 
import { useTheme } from '../context/ThemeContext';
import ChatBot from '../components/ChatBot';

interface EditorPageProps {
  currentUser: User;
}

export function EditorPage({ currentUser }: EditorPageProps) {
  const navigate = useNavigate();
  const { themeId, setThemeId } = useTheme();
  //const [themeId, setThemeId] = useState('happy');
  const currentTheme = themes[themeId as keyof typeof themes] || themes.happy; // Lấy object màu tương ứng (nếu không tìm thấy thì default là happy)
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setReadTime(Math.ceil(words / 200)); 
  }, [content]);

  useEffect(() => {
    if (!title && !content) return;
    const timer = setTimeout(() => handleSaveDraft(), 5000);
    return () => clearTimeout(timer);
  }, [title, subtitle, content, themeId]);

  const handleSaveDraft = () => {
    setIsSaving(true);
    console.log('Auto saving draft with theme:', themeId);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
      toast.success('Draft saved');
    }, 500);
  };

  const handleToolbarAction = (action: string) => {
    // ... (Logic toolbar giữ nguyên)
    // Để ngắn gọn, tôi lược bỏ phần switch case dài dòng, bạn giữ nguyên logic cũ
    console.log('Action:', action);
  };

  const handlePublish = (settings: PublishSettings) => {
    const postPayload = {
      title,
      subtitle,
      content,
      themeId,
      ...settings
    };

    console.log('Publishing:', settings);
    setGlobalTheme(themeId);
    toast.success('Published successfully!');
    setShowPublishModal(false);
    setTimeout(() => navigate('/stories'), 1000);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    return 'Saved just now';
  };

 return (
    <div 
      className="min-h-screen transition-all duration-700 ease-in-out bg-cover bg-center"
      style={{ 
        backgroundImage: (currentTheme as any).background || currentTheme.background,
        backgroundSize: '200% 200%',
        animation: 'gradientMove 15s ease infinite'
      }}
    >
      {/* --- HEADER (Top Bar) --- */}
      <div 
        className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-white/40 shadow-sm transition-all duration-500 supports-[backdrop-filter]:bg-white/40"
      >
        {/* Dùng Flexbox + justify-between để đẩy 2 bên ra xa nhau nhất có thể */}
        <div className="flex justify-between items-center h-16 px-6 mx-auto w-full">
          
          {/* TRÁI: Nút Quay lại */}
          <div className="flex-shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="hover:bg-white/40 rounded-full transition-all hover:scale-110"
            >
              <ArrowLeft className="h-5 w-5" style={{ color: currentTheme.text }} />
            </Button>
          </div>

          {/* PHẢI: Nút Publish & Avatar (Luôn nằm bên phải) */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="text-xs font-medium opacity-60 hidden md:block" style={{ color: currentTheme.text }}>
                {isSaving ? 'Saving...' : 'Saved'}
            </span>

            <Button 
              size="sm" 
              onClick={() => setShowPublishModal(true)} 
              className="shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold rounded-full px-6"
              style={{ backgroundColor: currentTheme.accent, color: '#fff' }}
            >
              Publish
            </Button>
            
            <Avatar className="h-10 w-10 border-2 border-white/70 shadow-md cursor-pointer hover:rotate-6 transition-transform">
              <AvatarImage 
                src={(currentTheme as any).avatar || currentUser.avatar} 
                alt={currentUser.name} 
              />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* --- PHẦN BODY --- */}
      <div className="max-w-4xl mx-auto px-6 pt-4 pb-12">
        
        {/* --- THANH CÔNG CỤ (Toolbar) --- */}
        {/* - Sticky top-16: Để nó dính ngay dưới header khi cuộn
            - py-2: Khoảng cách trên dưới nhỏ
            - flex justify-center: Căn giữa màn hình
            - Không có bg, border, shadow (Không viên thuốc)
        */}
        <div className="sticky top-16 z-40 flex justify-center py-2 mb-2 transition-all">
           <div className="backdrop-blur-sm rounded-lg px-2"> 
              {/* Thêm backdrop-blur-sm nhẹ để icon không bị chìm nếu trôi qua chữ */}
              <EditorToolbar onAction={handleToolbarAction} />
           </div>
        </div>

        {/* Khung chọn Theme (Vibe) - Nằm ngay dưới Toolbar */}
        <div className="mb-8 p-4 rounded-3xl bg-white/20 backdrop-blur-md border border-white/20 shadow-sm">
            <div className="flex items-center gap-2 mb-2 opacity-80" style={{ color: currentTheme.text }}>
                <span className="text-xs font-bold uppercase tracking-widest">Chọn cảm xúc (Vibe)</span>
            </div>
            <ThemeSelector onSelect={setThemeId} />
        </div>

        {/* Các Input nhập liệu */}
        <Input
          placeholder="Tiêu đề lớn..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-0 text-5xl px-0 mb-4 placeholder:text-black/30 focus-visible:ring-0 bg-transparent font-extrabold tracking-tight"
          style={{ color: currentTheme.text }}
        />
        <Input
          placeholder="Mô tả ngắn..."
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="border-0 text-2xl px-0 mb-8 placeholder:text-black/30 focus-visible:ring-0 bg-transparent font-medium opacity-90"
          style={{ color: currentTheme.text }}
        />
        <Textarea
          ref={contentRef}
          placeholder="Bắt đầu câu chuyện của bạn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-0 px-0 min-h-[60vh] resize-none text-xl placeholder:text-black/30 focus-visible:ring-0 bg-transparent leading-relaxed"
          style={{ color: currentTheme.text }}
        />
      </div>

      <PublishModal
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublish={handlePublish}
        initialSettings={{
          visibility: 'public',
          tags: [],
          excerpt: subtitle,
        }}
      />
      <ChatBot content={content} titleSetter={setTitle} />
    </div>
  );
}