import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'; // [QUAN TRỌNG] Import NodeViewProps chuẩn
import { ExternalLink } from 'lucide-react';

// Xóa interface LinkCardViewProps cũ tự định nghĩa vì nó gây xung đột
// Hoặc giữ lại nhưng không dùng làm type chính cho props của component

export function LinkCardView(props: NodeViewProps) {
  // [FIX LỖI] Ép kiểu attrs tại đây để TypeScript hiểu cấu trúc dữ liệu của bạn
  const { href, title, description, image, domain } = props.node.attrs as {
    href: string;
    title: string;
    description: string;
    image: string;
    domain: string;
  };

  return (
    <NodeViewWrapper className="link-card-component my-4">
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 transition-colors no-underline group h-32 md:h-40"
        contentEditable={false} 
      >
        {/* Phần ảnh thumbnail */}
        {image && (
          <div 
            className="w-1/3 md:w-1/4 bg-cover bg-center bg-no-repeat flex-shrink-0 border-r border-gray-100"
            style={{ backgroundImage: `url(${image})` }}
          />
        )}

        {/* Phần nội dung */}
        <div className="flex-1 p-3 md:p-4 flex flex-col justify-center min-w-0">
          <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 line-clamp-2 md:line-clamp-3 mb-2 leading-relaxed">
            {description}
          </p>
          <div className="mt-auto flex items-center gap-1 text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-wider">
            <ExternalLink className="w-3 h-3" />
            <span>{domain}</span>
          </div>
        </div>
      </a>
    </NodeViewWrapper>
  );
}