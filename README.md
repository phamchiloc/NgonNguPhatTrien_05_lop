# 🎯 User & Role Management System

**Ngôn Ngữ Phát Triển Web - Bài tập 05**

👤 **Sinh viên:** Phạm Chí Lộc  
🆔 **MSSV:** 2280601823  
🏫 **Lớp:** NgonNguPhatTrien_05

---

## 📋 Mô tả dự án

Hệ thống quản lý người dùng (Users) và vai trò (Roles) với giao diện web đẹp, hiện đại. Dự án sử dụng **Node.js + Express** cho backend và **HTML/CSS/JavaScript** cho frontend, với dữ liệu mock (không cần MongoDB).

## ✨ Tính năng chính

### 👥 Quản lý Users
- ✅ **CRUD đầy đủ**: Create, Read (Get All, Get by ID), Update, Delete (soft delete)
- 🔓 **Enable/Disable User**: Kích hoạt/vô hiệu hóa user qua email + username
- 🔍 **Tìm kiếm & lọc**: Tìm theo username/email/fullname, lọc theo status và role
- 📊 **Hiển thị chi tiết**: Avatar, thông tin cá nhân, role, login count, status

### 🔐 Quản lý Roles
- ✅ **CRUD đầy đủ**: Create, Read (Get All, Get by ID), Update, Delete
- 🔍 **Tìm kiếm**: Tìm theo tên role hoặc mô tả
- 📝 **Quản lý quyền**: Gán role cho users

### 🎨 Giao diện web
- 🌈 **Gradient background** đẹp mắt
- 💳 **Card design** hiện đại với hover effects
- 🔔 **Toast notifications** thay vì alert popup
- ⚠️ **Confirmation modal** cho các hành động quan trọng
- 📱 **Responsive design** - tương thích mobile
- 🎯 **Icons trực quan** cho mọi hành động
- ✨ **Smooth animations** mượt mà

## 🏗️ Cấu trúc dự án

```
NgonNguPhatTrien_05_lop/
├── app.js                      # Main application file
├── package.json               # Dependencies
├── bin/
│   └── www                    # Server startup script
├── routes/
│   ├── users.js              # User routes (CRUD + enable/disable)
│   ├── roles.js              # Role routes (CRUD)
│   ├── products.js           # Product routes
│   └── categories.js         # Category routes
├── schemas/
│   ├── users.js              # User schema (Mongoose)
│   ├── roles.js              # Role schema (Mongoose)
│   ├── products.js           # Product schema
│   └── categories.js         # Category schema
├── utils/
│   ├── mockData.js           # Mock data for testing
│   ├── data.js               # Sample data
│   ├── GenToken.js           # Token generation utility
│   └── IncrementalIdHandler.js
└── public/
    ├── index.html            # Main HTML page
    ├── stylesheets/
    │   └── style.css         # Custom CSS styles
    └── javascripts/
        └── app.js            # Frontend JavaScript logic
```

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM (optional)
- **Slugify** - URL slug generation

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, animations
- **Vanilla JavaScript** - Fetch API, DOM manipulation

## 🚀 Cài đặt và chạy

### 1️⃣ Clone repository
```bash
git clone https://github.com/phamchiloc/NgonNguPhatTrien_05_lop.git
cd NgonNguPhatTrien_05_lop
```

### 2️⃣ Cài đặt dependencies
```bash
npm install
```

### 3️⃣ Chạy server
```bash
npm start
```

Server sẽ chạy tại: **http://localhost:3000**

### 4️⃣ Mở giao diện web
Truy cập: **http://localhost:3000/index.html**

## 📡 API Endpoints

### Users API (`/api/v1/users`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Lấy tất cả users (chưa bị xóa) |
| GET | `/:id` | Lấy user theo ID |
| POST | `/` | Tạo user mới |
| PUT | `/:id` | Cập nhật user |
| DELETE | `/:id` | Xóa mềm user |
| POST | `/enable` | Kích hoạt user (require: email, username) |
| POST | `/disable` | Vô hiệu hóa user (require: email, username) |

### Roles API (`/api/v1/roles`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Lấy tất cả roles |
| GET | `/:id` | Lấy role theo ID |
| POST | `/` | Tạo role mới |
| PUT | `/:id` | Cập nhật role |
| DELETE | `/:id` | Xóa role |

## 📦 Data Schema

### User Object
```javascript
{
  _id: String,
  username: String (required, unique),
  password: String (required),
  email: String (required, unique),
  fullName: String (default: ""),
  avatarUrl: String (default: "https://i.sstatic.net/l60Hf.png"),
  status: Boolean (default: false),
  role: ObjectID (ref: Role),
  loginCount: Number (default: 0, min: 0),
  isDeleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Role Object
```javascript
{
  _id: String,
  name: String (required, unique),
  description: String (default: ""),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎮 Dữ liệu mẫu

### Users mặc định:
- **admin** (admin@example.com) - Role: Admin - Status: Active
- **john_doe** (john@example.com) - Role: User - Status: Active
- **jane_smith** (jane@example.com) - Role: Manager - Status: Inactive

### Roles mặc định:
- **Admin** - Administrator with full access
- **User** - Regular user
- **Manager** - Manager role

## 💡 Tính năng nổi bật

### 🔍 Tìm kiếm & Lọc thông minh
- Tìm kiếm real-time khi gõ
- Lọc đa điều kiện (status + role)
- Reset filters nhanh chóng

### 🔔 Toast Notifications
- Thông báo thành công/lỗi đẹp mắt
- Tự động biến mất sau 3 giây
- Không gây phiền toái như alert()

### ⚠️ Confirmation Modal
- Xác nhận trước khi xóa/disable
- Giao diện đẹp, dễ đọc
- Tránh thao tác nhầm

### 🎨 UI/UX Design
- Material Design inspired
- Gradient backgrounds
- Smooth hover effects
- Loading states
- Empty states with icons

## 🔧 Chế độ Mock Data

Hiện tại dự án chạy với **mock data** trong memory (không cần MongoDB):
- ✅ Nhanh chóng, không cần setup database
- ✅ Dữ liệu reset mỗi khi restart server
- ✅ Hoàn hảo cho demo và development

Để chuyển sang MongoDB thực, uncomment các dòng trong `app.js`:
```javascript
// Uncomment these lines to use MongoDB:
let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/NNPTUD-C6');
```

## 📸 Screenshots

### Giao diện Users
![Users Interface](https://via.placeholder.com/800x400?text=Users+Management)

### Giao diện Roles
![Roles Interface](https://via.placeholder.com/800x400?text=Roles+Management)

### Form thêm User
![Add User Form](https://via.placeholder.com/400x500?text=Add+User+Form)

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo **Pull Request** hoặc **Issue** nếu bạn có ý tưởng cải thiện.

## 📝 License

MIT License - Tự do sử dụng cho mục đích học tập

## 👨‍💻 Tác giả

**Phạm Chí Lộc**
- 🆔 MSSV: 2280601823
- 📧 Email: [Your Email]
- 🔗 GitHub: [@phamchiloc](https://github.com/phamchiloc)

---

⭐ **Nếu thấy project hữu ích, hãy cho một star nhé!** ⭐ 
