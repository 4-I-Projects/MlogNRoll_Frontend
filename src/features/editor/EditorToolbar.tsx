import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';

interface EditorToolbarProps {
  onAction: (action: string) => void;
}

interface ToolbarButton {
  icon: React.ReactNode;
  action: string;
  label: string;
}

const toolbarGroups: ToolbarButton[][] = [
  [
    { icon: <Undo className="h-4 w-4" />, action: 'undo', label: 'Undo' },
    { icon: <Redo className="h-4 w-4" />, action: 'redo', label: 'Redo' },
  ],
  [
    { icon: <Heading1 className="h-4 w-4" />, action: 'h1', label: 'Heading 1' },
    { icon: <Heading2 className="h-4 w-4" />, action: 'h2', label: 'Heading 2' },
    { icon: <Heading3 className="h-4 w-4" />, action: 'h3', label: 'Heading 3' },
  ],
  [
    { icon: <Bold className="h-4 w-4" />, action: 'bold', label: 'Bold' },
    { icon: <Italic className="h-4 w-4" />, action: 'italic', label: 'Italic' },
    { icon: <Underline className="h-4 w-4" />, action: 'underline', label: 'Underline' },
  ],
  [
    { icon: <List className="h-4 w-4" />, action: 'bulletList', label: 'Bullet List' },
    { icon: <ListOrdered className="h-4 w-4" />, action: 'orderedList', label: 'Ordered List' },
  ],
  [
    { icon: <Quote className="h-4 w-4" />, action: 'quote', label: 'Quote' },
    { icon: <Code className="h-4 w-4" />, action: 'code', label: 'Code Block' },
  ],
  [
    { icon: <Link className="h-4 w-4" />, action: 'link', label: 'Link' },
    { icon: <Image className="h-4 w-4" />, action: 'image', label: 'Image' },
  ],
  [
    { icon: <AlignLeft className="h-4 w-4" />, action: 'alignLeft', label: 'Align Left' },
    { icon: <AlignCenter className="h-4 w-4" />, action: 'alignCenter', label: 'Align Center' },
    { icon: <AlignRight className="h-4 w-4" />, action: 'alignRight', label: 'Align Right' },
  ],
];

export function EditorToolbar({ onAction }: EditorToolbarProps) {
  return (
    <div className="sticky top-16 z-10 flex flex-wrap items-center gap-1 border-b bg-white p-2">
      <TooltipProvider>
        {toolbarGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex items-center">
            {group.map((button) => (
              <Tooltip key={button.action}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onAction(button.action)}
                  >
                    {button.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{button.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            {groupIndex < toolbarGroups.length - 1 && (
              <Separator orientation="vertical" className="mx-1 h-6" />
            )}
          </div>
        ))}
      </TooltipProvider>
    </div>
  );
}
