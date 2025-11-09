# MlogNRoll Frontend

Frontend của dự án **MlogNRoll** – nền tảng chia sẻ blog / nội dung xã hội, xây dựng bằng **React + TypeScript + Vite**, sử dụng **Shadcn UI** làm thư viện giao diện.

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
