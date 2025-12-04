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
import { themes } from '../themes'; // Import bộ màu

interface EditorPageProps {
  currentUser: User;
}

export function EditorPage({ currentUser }: EditorPageProps) {
  const navigate = useNavigate();
  const [themeId, setThemeId] = useState('happy');
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
      className="min-h-screen transition-colors duration-500 ease-in-out"
      style={{ backgroundColor: currentTheme.background }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-50 border-b transition-colors duration-500"
        style={{ backgroundColor: currentTheme.background }}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            {/* ... */}
          </div>
          <div className="flex items-center gap-2">
             {/* ... */}
             <Button size="sm" onClick={() => setShowPublishModal(true)}>
              Publish
            </Button>
             {/* ... */}
            <Avatar className="h-9 w-9">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <EditorToolbar onAction={handleToolbarAction} />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>
                Post Vibe (Theme)
            </label>
            <ThemeSelector onSelect={setThemeId} />
        </div>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-0 text-4xl px-0 mb-4 placeholder:text-black focus-visible:ring-0 bg-transparent"
          style={{ color: currentTheme.text }}
        />
        <Input
          placeholder="Subtitle (optional)"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="border-0 text-xl px-0 mb-8 placeholder:text-black focus-visible:ring-0 bg-transparent"
          style={{ color: currentTheme.text }}
        />
        <Textarea
          ref={contentRef}
          placeholder="Tell your story..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-0 px-0 min-h-[500px] resize-none text-lg placeholder:text-black focus-visible:ring-0 bg-transparent"
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
    </div>
  );
}