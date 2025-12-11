import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Sparkles, Lightbulb } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const TITLE_SUGGESTIONS: Record<string, string[]> = {
  happy: ["Một ngày rạng rỡ", "Khởi đầu mới", "Niềm vui lan tỏa"],
  sad: ["Chuyện của những cơn mưa", "Ký ức tan vỡ", "Nỗi buồn lặng im"],
  romantic: ["Vị của tình yêu", "Dưới ánh hoàng hôn", "Thư gửi thanh xuân"],
  angry: ["Sự thật đằng sau cơn giận", "Lời chưa nói", "Giới hạn cuối cùng"],
  tired: ["Chạm vào khoảng lặng", "Nghỉ ngơi một chút", "Thế giới mệt mỏi"]
};

export default function ChatBot({ content, titleSetter }: { content?: string, titleSetter?: (t: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Chào bạn! Ngày hôm nay tâm trạng của bạn thế nào?", sender: 'bot' as const }]);
  const { themeId, setThemeId } = useTheme();

  useEffect(() => {
    // 1. Hạ thấp giới hạn: Chỉ cần gõ 2 từ là Bot quét
    if (!content || content.length < 3) return;
    const lower = content.toLowerCase();
    
    // 2. Định nghĩa từ khóa cho trọn bộ 5 theme
    const triggers = [
  { id: 'sad', words: ['buồn', 'mưa', 'khóc', 'tệ'], msg: "Tâm trạng hơi trầm lắng. Đổi sang theme Buồn nhé?" },
  { id: 'romantic', words: ['yêu', 'thương', 'anh', 'em', 'nhớ'], msg: "Trông bạn thật hạnh phúc! Đổi sang theme Lãng mạn không?" },
  { id: 'angry', words: ['ghét', 'bực', 'tức', 'điên'], msg: "Có vẻ bạn đang căng thẳng. Đổi sang theme Giận dữ nhé?" },
  { id: 'tired', words: ['mệt', 'chán', 'oải', 'ngủ'], msg: "Nghỉ ngơi chút thôi. Đổi sang theme Mệt mỏi nhé?" },
  { id: 'happy', words: ['vui', 'tuyệt', 'cười'], msg: "Năng lượng tích cực quá! Đổi sang theme Vui vẻ nhé?" }
];

    for (const t of triggers) {
      // 3. Nếu thấy từ khóa VÀ theme hiện tại chưa phải theme đó
      if (t.words.some(w => lower.includes(w)) && themeId !== t.id) {
        // Chỉ thêm tin nhắn nếu bot chưa nói câu này
        if (!messages.some(m => m.text === t.msg)) {
          setMessages(prev => [...prev, { text: t.msg, sender: 'bot' }]);
        }
        break; 
      }
    }
  }, [content, themeId]); // themeId thay đổi thì bot cũng cập nhật lại

  const suggestTitle = () => {
    const list = TITLE_SUGGESTIONS[themeId] || TITLE_SUGGESTIONS.happy;
    const randomTitle = list[Math.floor(Math.random() * list.length)];
    setMessages(prev => [...prev, { text: `Gợi ý tiêu đề: "${randomTitle}"`, sender: 'bot' }]);
    if (titleSetter) titleSetter(randomTitle);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer border-none"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
          <div className="p-4 bg-black text-white flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
              <Sparkles size={16} className="text-yellow-400" /> Mood Bot
            </div>
            <button onClick={suggestTitle} className="p-1 hover:bg-white/20 rounded transition-colors bg-transparent border-none text-white cursor-pointer">
              <Lightbulb size={18} />
            </button>
          </div>
          
          <div className="h-72 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3 scroll-smooth">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-2xl text-sm max-w-[85%] leading-relaxed ${
                  msg.sender === 'bot' ? 'bg-white border self-start shadow-sm' : 'bg-black text-white self-end'
                }`}
              >
                {msg.text}
                {/* HIỆN NÚT ĐỒNG Ý NGAY TẠI ĐÂY */}
                {msg.text.includes('Đổi sang theme') && (
                  <button 
                    onClick={() => {
                      // Xác định theme ID dựa trên câu của Bot
                      const target = msg.text.includes('Buồn') ? 'sad' : 
                                     msg.text.includes('Lãng mạn') ? 'romantic' : 
                                     msg.text.includes('Giận') ? 'angry' : 
                                     msg.text.includes('Mệt') ? 'tired' : 'happy';
                      setThemeId(target);
                      setMessages(prev => [...prev, { text: "Đã xong! Chúc bạn viết tiếp vui vẻ.", sender: 'bot' }]);
                    }}
                    className="block mt-2 font-bold text-blue-600 hover:underline bg-transparent border-none cursor-pointer p-0 text-xs"
                  >
                    Đồng ý ngay
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}