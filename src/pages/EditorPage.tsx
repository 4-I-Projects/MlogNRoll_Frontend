import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Eye, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { PublishModal, PublishSettings } from '../components/editor/PublishModal';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { User } from '../lib/types';
import { toast } from 'sonner';

interface EditorPageProps {
  onNavigate: (page: string) => void;
  currentUser: User;
}

export function EditorPage({ onNavigate, currentUser }: EditorPageProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Calculate word count and read time
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setReadTime(Math.ceil(words / 200)); // Average reading speed: 200 words/min
  }, [content]);

  // Auto-save
  useEffect(() => {
    if (!title && !content) return;

    const timer = setTimeout(() => {
      handleSaveDraft();
    }, 5000);

    return () => clearTimeout(timer);
  }, [title, subtitle, content]);

  const handleSaveDraft = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
      toast.success('Draft saved');
    }, 500);
  };

  const handleToolbarAction = (action: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = content;
    let newCursorPos = end;

    switch (action) {
      case 'bold':
        newText = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newText = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
        newCursorPos = end + 2;
        break;
      case 'h1':
        newText = content.substring(0, start) + `# ${selectedText}` + content.substring(end);
        newCursorPos = end + 2;
        break;
      case 'h2':
        newText = content.substring(0, start) + `## ${selectedText}` + content.substring(end);
        newCursorPos = end + 3;
        break;
      case 'quote':
        newText = content.substring(0, start) + `> ${selectedText}` + content.substring(end);
        newCursorPos = end + 2;
        break;
      case 'code':
        newText = content.substring(0, start) + `\`\`\`\n${selectedText}\n\`\`\`` + content.substring(end);
        newCursorPos = end + 8;
        break;
      case 'link':
        newText = content.substring(0, start) + `[${selectedText}](url)` + content.substring(end);
        newCursorPos = end + 7;
        break;
      case 'image':
        newText = content.substring(0, start) + `![alt text](image-url)` + content.substring(end);
        newCursorPos = end + 22;
        break;
      default:
        return;
    }

    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handlePublish = (settings: PublishSettings) => {
    console.log('Publishing with settings:', settings);
    toast.success(
      settings.visibility === 'draft' 
        ? 'Draft saved successfully' 
        : 'Story published successfully!'
    );
    setShowPublishModal(false);
    // Navigate back to stories after publish
    setTimeout(() => {
      onNavigate('stories');
    }, 1000);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    if (seconds < 60) return 'Saved just now';
    if (seconds < 120) return 'Saved 1 minute ago';
    return `Saved ${Math.floor(seconds / 60)} minutes ago`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Editor Topbar */}
      <div className="sticky top-0 z-50 border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => onNavigate('home')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              {isSaving ? (
                <span className="text-sm text-gray-500">Saving...</span>
              ) : lastSaved ? (
                <span className="text-sm text-gray-500">{formatLastSaved()}</span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500 mr-4">
              {wordCount} words · {readTime} min read
            </div>

            <Button variant="ghost" size="sm" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>

            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            <Button size="sm" onClick={() => setShowPublishModal(true)}>
              Publish
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Delete draft</DropdownMenuItem>
                <DropdownMenuItem>Version history</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Avatar className="h-9 w-9">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <EditorToolbar onAction={handleToolbarAction} />
      </div>

      {/* Editor Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-0 text-4xl px-0 mb-4 placeholder:text-gray-300 focus-visible:ring-0"
        />

        <Input
          placeholder="Subtitle (optional)"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="border-0 text-xl px-0 mb-8 text-gray-600 placeholder:text-gray-300 focus-visible:ring-0"
        />

        <Textarea
          ref={contentRef}
          placeholder="Tell your story..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-0 px-0 min-h-[500px] resize-none text-lg placeholder:text-gray-300 focus-visible:ring-0"
        />
      </div>

      {/* Publish Modal */}
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
