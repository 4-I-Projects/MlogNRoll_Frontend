import { useState } from "react";
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
import { X } from "lucide-react";

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  onPublish: (settings: PublishSettings) => void;
  initialSettings?: Partial<PublishSettings>;
}

export interface PublishSettings {
  visibility: "public" | "unlisted" | "draft";
  tags: string[];
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
}: PublishModalProps) {
  const [visibility, setVisibility] = useState<
    PublishSettings["visibility"]
  >(initialSettings?.visibility || "public");
  const [tags, setTags] = useState<string[]>(
    initialSettings?.tags || [],
  );
  const [tagInput, setTagInput] = useState("");
  const [excerpt, setExcerpt] = useState(
    initialSettings?.excerpt || "",
  );
  const [canonicalUrl, setCanonicalUrl] = useState(
    initialSettings?.canonicalUrl || "",
  );
  const [series, setSeries] = useState(
    initialSettings?.series || "",
  );

  const handleAddTag = () => {
    if (
      tagInput.trim() &&
      tags.length < 5 &&
      !tags.includes(tagInput.trim())
    ) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handlePublish = () => {
    onPublish({
      visibility,
      tags,
      excerpt,
      canonicalUrl: canonicalUrl || undefined,
      series: series || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
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
                <RadioGroupItem value="public" id="public" />
                <Label
                  htmlFor="public"
                  className="cursor-pointer"
                >
                  Public — anyone can see this story
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="unlisted"
                  id="unlisted"
                />
                <Label
                  htmlFor="unlisted"
                  className="cursor-pointer"
                >
                  Unlisted — only people with the link
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="draft" id="draft" />
                <Label
                  htmlFor="draft"
                  className="cursor-pointer"
                >
                  Draft — save for later
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (up to 5)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                disabled={tags.length >= 5}
              />
              <Button
                onClick={handleAddTag}
                disabled={tags.length >= 5 || !tagInput.trim()}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1"
                >
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt (optional)</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief description of your story..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Series */}
          <div className="space-y-2">
            <Label htmlFor="series">Series (optional)</Label>
            <Input
              id="series"
              placeholder="Add to a series..."
              value={series}
              onChange={(e) => setSeries(e.target.value)}
            />
          </div>

          {/* Canonical URL */}
          <div className="space-y-2">
            <Label htmlFor="canonical">
              Canonical URL (optional)
            </Label>
            <Input
              id="canonical"
              type="url"
              placeholder="https://..."
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePublish}>
            {visibility === "draft"
              ? "Save Draft"
              : "Publish Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}