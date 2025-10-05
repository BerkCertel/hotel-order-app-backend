# 🏨 Hotel Order App - Tam Kapsamlı Proje

Modern otel sipariş yönetim sistemi - Backend (Node.js/Express) ve Frontend (Next.js 15)

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
- [Proje Yapısı](#proje-yapısı)
- [Frontend Mimarisi](#frontend-mimarisi)
- [Kullanım](#kullanım)

## 🎯 Genel Bakış

Bu proje, otel misafirleri ve personeli için modern bir sipariş yönetim sistemidir. Misafirler QR kod ile sipariş verebilir, personel siparişleri yönetebilir ve gerçek zamanlı güncellemeler alabilir.

### Özellikler

- ✅ Kullanıcı kimlik doğrulama (JWT)
- ✅ Rol tabanlı yetkilendirme (USER, ADMIN, SUPERADMIN)
- ✅ Gerçek zamanlı sipariş güncellemeleri (Socket.io)
- ✅ QR kod ile sipariş sistemi
- ✅ Kategori ve alt kategori yönetimi
- ✅ Lokasyon yönetimi
- ✅ Görsel yönetimi (Cloudinary)
- ✅ Dark mode desteği
- ✅ Responsive tasarım

## 🚀 Teknolojiler

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (jsonwebtoken)
- **Real-time**: Socket.io
- **File Upload**: Multer + Cloudinary
- **Validation**: Custom middlewares
- **Security**: bcryptjs, cookie-parser, cors

### Frontend

- **Framework**: Next.js 15.4.1 (App Router)
- **UI Library**: React 19.1.0
- **Language**: TypeScript
- **State Management**: Redux Toolkit 2.9.0 + Redux Persist 6.0.0
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: shadcn/ui (Radix UI)
- **Forms**: Formik 2.4.6 + Yup 1.6.1
- **HTTP Client**: Axios 1.10.0
- **Real-time**: Socket.io Client 4.8.1
- **Icons**: Lucide React + React Icons
- **Notifications**: Sonner
- **Theme**: next-themes (Dark mode)
- **Tables**: TanStack Table

## 📦 Kurulum

### Gereksinimler

- Node.js 18+
- MongoDB (local veya cloud)
- npm veya yarn

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/BerkCertel/hotel-order-app-backend.git
cd hotel-order-app-backend
```

### 2. Backend Kurulumu

```bash
# Backend dependencies kurulumu
npm install

# .env dosyası oluşturun
touch .env
```

`.env` dosyasını düzenleyin:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hotel-order-app
JWT_SECRET=your-secret-key-here
CLIENT_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

```bash
# Backend'i başlatın
npm run dev
# Backend çalışıyor: http://localhost:5000
```

### 3. Frontend Kurulumu

```bash
# Frontend dizinine gidin
cd frontend

# Dependencies kurulumu
npm install

# Environment dosyası oluşturun
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin (opsiyonel, default değerler yeterli):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

```bash
# Frontend'i başlatın
npm run dev
# Frontend çalışıyor: http://localhost:3000
```

## 📁 Proje Yapısı

```
hotel-order-app-backend/
│
├── 🔙 Backend (Root)
│   ├── config/              # Veritabanı ve Cloudinary config
│   ├── controllers/         # Route controller'ları
│   ├── middlewares/         # Auth, upload, rate limiting
│   ├── models/              # MongoDB modelleri
│   ├── routes/              # API route tanımları
│   ├── utils/               # Yardımcı fonksiyonlar
│   ├── cron/                # Zamanlanmış görevler
│   ├── server.js            # Ana server dosyası
│   └── package.json
│
└── 🎨 Frontend (frontend/)
    ├── src/
    │   ├── app/             # Next.js sayfalar (App Router)
    │   ├── components/      # React bileşenleri
    │   │   ├── ui/         # shadcn/ui bileşenleri
    │   │   └── providers/  # Context provider'lar
    │   ├── store/          # Redux store ve slice'lar
    │   ├── services/       # API servisleri
    │   ├── lib/            # Utilities (axios, socket)
    │   ├── hooks/          # Custom React hook'ları
    │   ├── types/          # TypeScript tipleri
    │   └── constants/      # Uygulama sabitleri
    ├── public/             # Statik dosyalar
    └── package.json
```

## 🏗️ Frontend Mimarisi

### State Management (Redux Toolkit + Persist)

Frontend, Redux Toolkit ile merkezi state yönetimi kullanır ve Redux Persist ile state'i localStorage'da saklar.

```typescript
// State kullanımı
import { useAppSelector, useAppDispatch } from '@/store/hooks';

const { user, isAuthenticated } = useAppSelector((state) => state.auth);
const dispatch = useAppDispatch();
```

### API Layer (Axios)

Merkezi API istemcisi ile tüm backend istekleri yapılır:

```typescript
import { authService } from '@/services/authService';

// Login
await authService.login({ email, password });

// Get user
const user = await authService.getUser();
```

### Real-time (Socket.io)

Gerçek zamanlı sipariş güncellemeleri için Socket.io kullanılır:

```typescript
import { useSocket } from '@/hooks/useSocket';

const { socket, isConnected } = useSocket();

socket?.on('newOrder', (order) => {
  // Yeni sipariş geldi
});
```

### UI Components (shadcn/ui)

Modern, erişilebilir UI bileşenleri:

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

<Button variant="default">Tıkla</Button>
```

### Forms (Formik + Yup)

Tip güvenli form yönetimi:

```typescript
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});

<Formik
  initialValues={{ email: '', password: '' }}
  validationSchema={schema}
  onSubmit={handleSubmit}
>
  {/* Form alanları */}
</Formik>
```

## 📖 Kullanım

### Backend API Endpoints

```
Auth:
- POST   /api/v1/auth/register          # Kayıt ol
- POST   /api/v1/auth/login             # Giriş yap
- POST   /api/v1/auth/logout            # Çıkış yap
- GET    /api/v1/auth/user              # Kullanıcı bilgisi
- POST   /api/v1/auth/forgot-password   # Şifre sıfırlama
- POST   /api/v1/auth/reset-password/:token

Categories:
- GET    /api/v1/category/get-all-categories
- POST   /api/v1/category/create-category
- PUT    /api/v1/category/update-category/:id
- DELETE /api/v1/category/delete-category/:id

Orders:
- GET    /api/v1/order/get-all-orders
- GET    /api/v1/order/user-orders
- POST   /api/v1/order/create-order
- PUT    /api/v1/order/update-order-status/:id
- DELETE /api/v1/order/delete-order/:id

Locations:
- GET    /api/v1/location/get-all-locations
- POST   /api/v1/location/create-location
- PUT    /api/v1/location/update-location/:id
- DELETE /api/v1/location/delete-location/:id

QR Codes:
- GET    /api/v1/qrcode/get-all-qrcodes
- POST   /api/v1/qrcode/create-qrcode
- DELETE /api/v1/qrcode/delete-qrcode/:id
```

### Frontend Sayfalar

- `/` - Ana sayfa
- `/login` - Giriş sayfası
- `/dashboard` - Dashboard (giriş gerekli)
- `/guest` - Misafir sipariş sayfası (eklenecek)
- `/admin` - Admin paneli (eklenecek)

## 🛠️ Geliştirme

### Backend Komutları

```bash
npm run dev          # Development mode (nodemon)
npm start           # Production mode
```

### Frontend Komutları

```bash
cd frontend
npm run dev         # Development server
npm run build       # Production build
npm run start       # Production server
npm run lint        # ESLint
```

## 📚 Dokümantasyon

Frontend için detaylı dokümantasyon:

- **[Frontend README](./frontend/README.md)** - Kapsamlı kullanım kılavuzu
- **[Architecture](./frontend/ARCHITECTURE.md)** - Mimari detayları
- **[Quick Start](./frontend/QUICKSTART.md)** - Hızlı başlangıç
- **[Folder Structure](./frontend/FOLDER_STRUCTURE.md)** - Klasör yapısı

## 🔐 Güvenlik

- JWT tabanlı kimlik doğrulama
- HTTP-only cookie'ler
- Bcrypt ile şifre hashleme
- Rate limiting
- CORS yapılandırması
- Input validation
- XSS koruması

## 🚀 Production Deployment

### Backend

```bash
# Build için özel bir adım gerekmez
npm install --production
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run start
```

Vercel'de deploy (önerilen):
1. GitHub'a push edin
2. Vercel'de import edin
3. Environment variable'ları ekleyin
4. Deploy edin

## 📝 Önemli Notlar

1. **MongoDB**: Önce MongoDB'nin çalıştığından emin olun
2. **Environment Variables**: Tüm gerekli değişkenleri ayarlayın
3. **Cloudinary**: Görsel yönetimi için Cloudinary hesabı gereklidir
4. **Ports**: Backend 5000, Frontend 3000 portunda çalışır
5. **CORS**: Frontend URL'ini backend .env'de belirtin

## 🐛 Sorun Giderme

### Backend bağlanamıyor
- MongoDB'nin çalıştığını kontrol edin
- .env dosyasındaki MONGO_URI'yi kontrol edin
- Port 5000'in kullanılmadığını kontrol edin

### Frontend API'ye erişemiyor
- Backend'in çalıştığını kontrol edin
- CORS ayarlarını kontrol edin
- .env.local'daki API URL'lerini kontrol edin

### Socket bağlantısı yok
- Backend'in çalıştığını kontrol edin
- CORS ayarlarını kontrol edin
- Browser console'da hata olup olmadığını kontrol edin

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altındadır.

## 👨‍💻 Geliştirici

**Berk Certel**
- GitHub: [@BerkCertel](https://github.com/BerkCertel)

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.io](https://socket.io/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

---

**Not**: Bu proje, modern web geliştirme best practice'lerini kullanarak oluşturulmuştur. Frontend mimarisi özellikle ölçeklenebilir, sürdürülebilir ve TypeScript ile tip güvenli olacak şekilde tasarlanmıştır.

Herhangi bir sorunuz için issue açabilir veya iletişime geçebilirsiniz! 🚀
