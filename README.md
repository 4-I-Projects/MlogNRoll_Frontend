# MlogNRoll Frontend

Frontend của dự án **MlogNRoll** – nền tảng chia sẻ blog / nội dung xã hội, xây dựng bằng **React + TypeScript + Vite**, sử dụng **Shadcn UI** làm thư viện giao diện.

---

## Cấu trúc thư mục dự án

src/
│
├── app/ # Layer khởi tạo ứng dụng (root config)
│ ├── App.tsx # Component gốc
│ ├── main.tsx # Điểm mount ReactDOM
│ └── router.tsx # Khai báo routing
│
├── pages/ # Các "trang" tương ứng với URL (route-level)
│
├── features/ # Tính năng (feature + UI + logic đi kèm)
│ ├── editor/
│ │ ├── EditorToolbar.tsx
│ │ └── PublishModal.tsx
│ ├── post/
│ │ ├── AuthorRow.tsx
│ │ ├── Comment.tsx
│ │ └── CommentsPanel.tsx
│ └── feed/
│ └── PostCard.tsx
│
├── components/ # Component tái sử dụng không thuộc feature cụ thể
│ ├── layout/ # Sidebar, Topbar, Wrapper layout
│ │ ├── Sidebar.tsx
│ │ └── Topbar.tsx
│ └── common/
│   └── ImageWithFallback.tsx
│
├── ui/ # Thư viện UI (Shadcn UI) – KHÔNG chỉnh sửa logic trong đây
│
├── lib/ # Helpers, types, mock data (không chứa UI)
│ ├── mockData.ts
│ └── types.ts
│
├── styles/ # CSS/Tailwind global
│ ├── globals.css
│ └── index.css
│
└── index.html


---

## Vai trò từng thư mục

| Thư mục       | Chức năng                                              |
|---------------|-------------------------------------------------------|
| `app/`        | Khởi tạo ứng dụng: router, providers, App gốc         |
| `pages/`      | Mỗi file là một trang (tương ứng với URL)             |
| `features/`   | Code theo tính năng (gồm UI + logic riêng)            |
| `components/` | Component tái sử dụng chung, không phụ thuộc business |
| `ui/`         | Thư viện giao diện Shadcn UI (dùng lại, không sửa)    |
| `lib/`        | Hàm tiện ích, mock data, khai báo type                |
| `styles/`     | CSS global, style reset, theme                        |

---

## 🚀 Cách chạy dự án

### Cài dependencies
```sh
  npm install
Chạy dev server
  npm run dev

Build
  npm run build

Quy tắc code:
  Component đặt tên PascalCase
  UI core → ui/
  Tính năng riêng → features/
  Layout → components/layout/
  Không viết business logic trong ui/
  Nếu component chỉ dùng trong 1 feature → đặt trong feature đó, không đặt vào components/

Công nghệ sử dụng:
  React + TypeScript
  Vite
  Shadcn UI / Radix primitives
  CSS / Tailwind (nếu dùng)
  React Router v6
