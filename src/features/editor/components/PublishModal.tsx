import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTags, createTag, Tag } from "@/features/post/api/tag-api";
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
import { Badge } from "../../../ui/badge"; // Vẫn dùng Badge nhưng custom style
import { X, Loader2, Check, Plus } from "lucide-react";
import { VISIBILITY } from '@/config/constants';
import { toast } from "sonner";
import { cn } from "@/ui/utils";

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  onPublish: (settings: PublishSettings) => void;
  initialSettings?: Partial<PublishSettings>;
  isSubmitting?: boolean;
}

export interface PublishSettings {
  visibility: "public" | "unlisted" | "draft";
  tags: Tag[];
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
  
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    initialSettings?.tags || []
  );
  
  const [tagInput, setTagInput] = useState("");
  const [excerpt, setExcerpt] = useState(initialSettings?.excerpt || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialSettings?.canonicalUrl || "");
  const [series, setSeries] = useState(initialSettings?.series || "");

  // Fetch Tags (Lấy hết hoặc phân trang tùy API, ở đây giả sử lấy hết)
  const { data: allTags = [], isLoading: isLoadingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    enabled: open, 
  });

  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: (newTag) => {
      // Invalidate để fetch lại list mới nhất từ server
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      // Tự động select tag vừa tạo
      toggleTagSelection(newTag);
      toast.success(`Tag created: ${newTag.name}`);
      setTagInput(""); // Reset input
    },
    onError: () => {
      toast.error("Failed to create tag.");
    }
  });

  // Hàm toggle (chọn/bỏ chọn) logic chung cho cả list và input
  const toggleTagSelection = (tag: Tag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);

    if (isSelected) {
      // Unselect
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      // Select (Check limit)
      if (selectedTags.length >= 5) {
        toast.error("Limit 5 tags");
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Xử lý khi Enter/Add từ Input
  const handleManualCreateTag = async () => {
    const trimmedInput = tagInput.trim();
    if (!trimmedInput) return;

    // Check trùng tên trong list đã fetch
    const existingTag = allTags.find(
      (t) => t.name.toLowerCase() === trimmedInput.toLowerCase()
    );

    if (existingTag) {
      // Nếu có rồi -> Toggle chọn nó luôn
      if (!selectedTags.some(t => t.id === existingTag.id)) {
          toggleTagSelection(existingTag);
      }
      setTagInput("");
    } else {
      // Nếu chưa có -> Tạo mới
      createTagMutation.mutate({ name: trimmedInput, description: trimmedInput });
    }
  };

  const handlePublish = () => {
    onPublish({
      visibility,
      tags: selectedTags,
      excerpt,
      canonicalUrl: canonicalUrl || undefined,
      series: series || undefined,
    });
  };

  // Filter tags để hiển thị (nếu đang gõ search thì filter, không thì hiện hết)
  // Sắp xếp: Selected lên đầu, sau đó đến A-Z
  const displayTags = allTags
    .filter(t => t.name.toLowerCase().includes(tagInput.toLowerCase()))
    .sort((a, b) => {
       const aSelected = selectedTags.some(s => s.id === a.id);
       const bSelected = selectedTags.some(s => s.id === b.id);
       if (aSelected && !bSelected) return -1;
       if (!aSelected && bSelected) return 1;
       return a.name.localeCompare(b.name);
    });

  // Styles
  const inputClass = "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-black focus-visible:border-transparent transition-all";
  const labelClass = "text-zinc-700 font-medium text-sm";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="
          sm:max-w-[600px] 
          bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 
          border border-zinc-200 
          shadow-2xl 
          p-6
          text-zinc-900
          max-h-[90vh] overflow-y-auto
        "
      >
        <DialogHeader className="mb-2">
          <DialogTitle className="text-2xl font-bold tracking-tight text-zinc-900">Publish Story</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Review your story settings before publishing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          
          {/* 1. Visibility */}
          <div className="space-y-3">
            <Label className={labelClass}>Who can see this?</Label>
            <RadioGroup
              value={visibility}
              onValueChange={(v: any) => setVisibility(v as any)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {[
                { value: VISIBILITY.PUBLIC, label: "Public", icon: "🌍" },
                { value: "unlisted", label: "Unlisted", icon: "🔗" },
                { value: "draft", label: "Draft", icon: "🔒" },
              ].map((option) => (
                <div key={option.value} className="relative">
                  <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                  <Label
                    htmlFor={option.value}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-zinc-50 h-full",
                      visibility === option.value 
                        ? "border-black bg-zinc-50 text-black" 
                        : "border-zinc-200 text-zinc-600"
                    )}
                  >
                    <span className="text-xl mb-1">{option.icon}</span>
                    <span className="font-semibold">{option.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 2. Tags Section [UPDATED UI] */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
               <Label className={labelClass}>
                 Topics <span className="text-zinc-400 font-normal ml-1">(Select up to 5)</span>
               </Label>
               <span className={cn("text-xs font-medium", selectedTags.length >= 5 ? "text-red-500" : "text-zinc-400")}>
                 {selectedTags.length}/5
               </span>
            </div>
            
            {/* Input Search/Create */}
            <div className="flex gap-2">
              <Input
                placeholder="Search tags or create new..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleManualCreateTag();
                  }
                }}
                disabled={selectedTags.length >= 5 && !tagInput} // Disable only if limit reached AND input empty
                className={inputClass}
              />
              <Button
                onClick={handleManualCreateTag}
                disabled={!tagInput.trim() || createTagMutation.isPending}
                className="bg-zinc-100 text-zinc-900 border border-zinc-300 hover:bg-zinc-200 min-w-[80px]"
                variant="secondary"
              >
                {createTagMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
              </Button>
            </div>

            {/* Tags List Area */}
            <div className="border border-zinc-200 rounded-lg p-3 bg-zinc-50/50 min-h-[100px] max-h-[200px] overflow-y-auto">
                {isLoadingTags ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                    </div>
                ) : displayTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {displayTags.map(tag => {
                            const isSelected = selectedTags.some(s => s.id === tag.id);
                            return (
                                <button
                                    key={tag.id}
                                    onClick={() => toggleTagSelection(tag)}
                                    disabled={!isSelected && selectedTags.length >= 5}
                                    className={cn(
                                        "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                                        isSelected 
                                            ? "bg-black text-white border-black shadow-sm" 
                                            : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50",
                                        (!isSelected && selectedTags.length >= 5) && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {tag.name}
                                    {isSelected ? (
                                        <Check className="ml-1.5 h-3.5 w-3.5" />
                                    ) : (
                                        <Plus className="ml-1.5 h-3.5 w-3.5 text-zinc-400" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-4 text-sm text-zinc-500">
                        {tagInput ? (
                            <span>No tags found. Press <b>Add</b> to create "{tagInput}"</span>
                        ) : (
                            "No tags available."
                        )}
                    </div>
                )}
            </div>
          </div>

          {/* 3. Meta Info (Excerpt & Canonical) */}
          <div className="grid grid-cols-1 gap-4">
             <div className="space-y-2">
                <Label htmlFor="excerpt" className={labelClass}>Short Description</Label>
                <Textarea
                  id="excerpt"
                  placeholder="What is this story about?"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className={cn(inputClass, "min-h-[80px] resize-none leading-relaxed")}
                />
             </div>
             
             {/* Collapsible Advanced Settings (Optional - ở đây mình để hiển thị luôn cho dễ test) */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="series" className={labelClass}>Series Name</Label>
                    <Input
                      id="series"
                      placeholder="e.g. Java Basics"
                      value={series}
                      onChange={(e) => setSeries(e.target.value)}
                      className={inputClass}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="canonical" className={labelClass}>Original URL</Label>
                    <Input
                      id="canonical"
                      type="url"
                      placeholder="https://..."
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      className={inputClass}
                    />
                </div>
             </div>
          </div>

        </div>

        <DialogFooter className="mt-4 gap-3 sm:gap-0 border-t border-zinc-100 pt-4">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={isSubmitting} 
            className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePublish} 
            disabled={isSubmitting}
            className="bg-black text-white hover:bg-zinc-800 font-medium px-8 min-w-[140px]"
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</>
            ) : visibility === "draft" ? "Save Draft" : "Publish Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}