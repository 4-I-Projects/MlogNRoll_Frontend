import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // [MỚI]
import { getTags, createTag, Tag } from "@/features/post/api/tag-api"; // [MỚI]
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../../ui/radio-group";
import { Badge } from "../../../ui/badge";
import { X, Loader2, Check } from "lucide-react";
import { VISIBILITY } from '@/config/constants';
import { toast } from "sonner";

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  onPublish: (settings: PublishSettings) => void;
  initialSettings?: Partial<PublishSettings>;
  isSubmitting?: boolean;
}

export interface PublishSettings {
  visibility: "public" | "unlisted" | "draft";
  tags: Tag[]; // [SỬA] Đổi từ string[] sang Tag[] để lấy được ID
  excerpt: string;
  canonicalUrl?: string;
  series?: string;
  scheduledDate?: string;
}

export function PublishModal({
  open,
  onClose,
  onPublish,
  initialSettings,
  isSubmitting = false,
}: PublishModalProps) {
  const queryClient = useQueryClient();

  const [visibility, setVisibility] = useState<PublishSettings["visibility"]>(
    initialSettings?.visibility || VISIBILITY.PUBLIC
  );
  
  // [SỬA] State lưu danh sách object Tag thay vì mảng string
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    initialSettings?.tags || []
  );
  
  const [tagInput, setTagInput] = useState("");
  const [excerpt, setExcerpt] = useState(initialSettings?.excerpt || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialSettings?.canonicalUrl || "");
  const [series, setSeries] = useState(initialSettings?.series || "");

  // 1. Fetch toàn bộ Tags từ Server
  const { data: allTags = [], isLoading: isLoadingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    enabled: open, // Chỉ fetch khi mở modal
  });

  // 2. Mutation tạo Tag mới
  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] }); // Refresh list
      handleAddTagToSelection(newTag);
      toast.success(`Đã tạo tag mới: ${newTag.name}`);
    },
    onError: () => {
      toast.error("Không thể tạo tag mới. Vui lòng thử lại.");
    }
  });

  // Logic thêm tag vào danh sách đã chọn
  const handleAddTagToSelection = (tagToAdd: Tag) => {
    if (selectedTags.length >= 5) {
      toast.error("Tối đa 5 tags thôi nhé!");
      return;
    }
    if (!selectedTags.some(t => t.id === tagToAdd.id)) {
      setSelectedTags([...selectedTags, tagToAdd]);
    }
    setTagInput("");
  };

  // Xử lý khi bấm nút Add hoặc Enter
  const handleManualAddTag = async () => {
    const trimmedInput = tagInput.trim();
    if (!trimmedInput) return;

    // Kiểm tra xem tag đã có trong DB chưa (so sánh tên không phân biệt hoa thường)
    const existingTag = allTags.find(
      (t) => t.name.toLowerCase() === trimmedInput.toLowerCase()
    );

    if (existingTag) {
      handleAddTagToSelection(existingTag);
    } else {
      // Nếu chưa có -> Gọi API tạo mới
      createTagMutation.mutate({ name: trimmedInput, description: trimmedInput });
    }
  };

  const handleRemoveTag = (tagIdToRemove: number) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagIdToRemove));
  };

  const handlePublish = () => {
    onPublish({
      visibility,
      tags: selectedTags, // Trả về mảng object tags
      excerpt,
      canonicalUrl: canonicalUrl || undefined,
      series: series || undefined,
    });
  };

  // Lọc danh sách gợi ý khi người dùng gõ
  const suggestedTags = tagInput 
    ? allTags.filter(t => 
        t.name.toLowerCase().includes(tagInput.toLowerCase()) && 
        !selectedTags.some(selected => selected.id === t.id)
      ).slice(0, 5) // Chỉ hiện 5 gợi ý
    : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[525px] bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border border-white/10 shadow-2xl"
      >
        <DialogHeader>
          <DialogTitle>Publish Story</DialogTitle>
          <DialogDescription>
            Customize how your story appears to readers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Visibility */}
          <div className="space-y-2">
            <Label>Visibility</Label>
            <RadioGroup
              value={visibility}
              onValueChange={(v: any) => setVisibility(v as any)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={VISIBILITY.PUBLIC} id="public" />
                <Label htmlFor="public" className="cursor-pointer">Public</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unlisted" id="unlisted" />
                <Label htmlFor="unlisted" className="cursor-pointer">Unlisted</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="draft" id="draft" />
                <Label htmlFor="draft" className="cursor-pointer">Draft</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Tags Section [UPDATED] */}
          <div className="space-y-2 relative">
            <Label>Tags (up to 5)</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Search or create a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleManualAddTag();
                    }
                  }}
                  disabled={selectedTags.length >= 5 || createTagMutation.isPending}
                  className="bg-background/50 focus:bg-background transition-colors"
                />
                
                {/* Danh sách gợi ý (Dropdown Suggestion) */}
                {tagInput && suggestedTags.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden">
                    {suggestedTags.map(tag => (
                      <div 
                        key={tag.id}
                        className="px-3 py-2 hover:bg-muted cursor-pointer flex items-center justify-between text-sm"
                        onClick={() => handleAddTagToSelection(tag)}
                      >
                        <span>{tag.name}</span>
                        <Check className="h-3 w-3 opacity-50" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleManualAddTag}
                disabled={selectedTags.length >= 5 || !tagInput.trim() || createTagMutation.isPending}
                variant="secondary"
              >
                {createTagMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
              </Button>
            </div>

            {/* Danh sách Tag đã chọn */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="gap-1 bg-secondary/50 hover:bg-secondary pl-2 pr-1 py-1"
                >
                  {tag.name}
                  <button onClick={() => handleRemoveTag(tag.id)} className="hover:text-destructive transition-colors ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Các trường khác giữ nguyên */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt (optional)</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief description..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="min-h-[80px] bg-background/50 focus:bg-background transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="series">Series (optional)</Label>
            <Input
              id="series"
              placeholder="Add to a series..."
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              className="bg-background/50 focus:bg-background transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="canonical">Canonical URL (optional)</Label>
            <Input
              id="canonical"
              type="url"
              placeholder="https://..."
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              className="bg-background/50 focus:bg-background transition-colors"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="bg-transparent hover:bg-accent/20">
            Cancel
          </Button>
          <Button onClick={handlePublish} disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : visibility === "draft" ? "Save Draft" : "Publish Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}