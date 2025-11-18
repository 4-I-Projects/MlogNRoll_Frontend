# MlogNRoll Frontend

Frontend của dự án **MlogNRoll** – nền tảng chia sẻ blog, xây dựng bằng **React + TypeScript + Vite**.
Hệ thống UI sử dụng **Shadcn UI** và **Tailwind CSS**.

---

## wm Cấu trúc dự án (Project Structure)

Chúng ta tuân thủ kiến trúc **Feature-based** (hướng tính năng). Mọi thứ liên quan đến một nghiệp vụ cụ thể sẽ nằm chung một chỗ.

| Thư mục | Vai trò & Quy tắc |
| :--- | :--- |
| **`src/app/`** | Chứa cấu hình khởi tạo app, router, providers (Context, QueryClient...). |
| **`src/features/`** | **Quan trọng nhất.** Chứa logic nghiệp vụ. Mỗi folder là một tính năng (VD: `auth`, `post`, `editor`). |
| **`src/pages/`** | Các trang đích (Route views). Nhiệm vụ duy nhất là lấy dữ liệu và sắp xếp các components từ `features`. **Không viết logic phức tạp tại đây.** |
| **`src/ui/`** | Chứa các component cơ bản từ **Shadcn UI** (Button, Input, Sheet...). <br>⚠️ **Lưu ý:** Hạn chế sửa logic trong này, chỉ chỉnh style nếu cần. |
| **`src/components/`** | Các component dùng chung toàn app nhưng *không phải* là Shadcn UI (VD: `PageLoader`, `Logo`, `Sidebar`). |
| **`src/lib/`** | Các hàm tiện ích (utils), cấu hình thư viện (axios), định nghĩa types chung. |

---

## 🧱 Cấu trúc một Feature (Feature Structure)

Trong `src/features/`, mỗi tính năng (ví dụ `post`) nên được tổ chức như sau:

```
src/features/post/
├── api/           # Các hàm gọi API (getPosts, createPost...)
├── components/    # Các component chỉ dùng riêng cho Post (PostCard, CommentList...)
├── hooks/         # Các custom hooks riêng (useLikePost...)
├── types.ts       # TypeScript types riêng cho feature này
└── index.ts       # (Optional) Export các phần cần thiết ra bên ngoài
```

---

## 📏 Quy tắc phát triển (Development Guidelines)

### 1. Quy tắc Import
Sử dụng Absolute Path (`@/`) thay vì Relative Path (`../../`) để code dễ đọc hơn.
* ✅ `import { Button } from "@/ui/button"`
* ❌ `import { Button } from "../../../ui/button"`

### 2. Phân loại Component
* **UI Components (`src/ui`)**: Là các nguyên tử (atoms). Chỉ nhận props và render. Không chứa logic business (gọi API, check role...).
* **Feature Components (`src/features`)**: Chứa logic nghiệp vụ. Có thể gọi API, xử lý state phức tạp.
* **Page Components (`src/pages`)**: Là nơi kết nối. Gọi API lấy data rồi truyền xuống Feature Components.

### 3. Quản lý State & Data
* Sử dụng **React Query** (hoặc tương đương) để quản lý Server State (data từ API).
* Sử dụng **Context API** hoặc **Zustand** cho Global Client State (Theme, User Session).
* Hạn chế `useEffect` nếu có thể thay thế bằng event handlers hoặc derived state.

---

## 🚀 Bắt đầu (Getting Started)

### Cài đặt
```bash
npm install
```

### Môi trường phát triển
```bash
npm run dev
```
Server sẽ chạy tại: `http://localhost:3000`

### Build Production
```bash
npm run build
```

---

## 🎨 Styling
Dự án sử dụng **Tailwind CSS**.
* File config: `tailwind.config.js`
* Global styles: `src/styles/globals.css`
* Các biến màu (CSS Variables) được định nghĩa theo chuẩn của Shadcn UI trong `globals.css`.

## 🛠️ Tech Stack
* **Core:** React 18, TypeScript, Vite
* **UI:** Shadcn UI, Radix Primitives, Lucide React (Icons)
* **Styling:** Tailwind CSS
* **Form:** React Hook Form + Zod (Khuyên dùng)
* **Routing:** React Router DOM