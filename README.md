# YKS İkili Çalışma — Deploy Hazır (Vite + React + Tailwind + Firebase)

## 🚀 Kurulum (Lokal)
```bash
npm i
cp .env.example .env
# .env içindeki Firebase değerlerini doldurun ve allowlist'i ayarlayın
npm run dev
```

## 🔐 Gerekli Firebase Ayarları
1. **Auth → Sign-in method**: Email/Password **aktif**.
2. **Authentication → Users**: Ali, Işıl, admin++ hesaplarını oluşturun.
3. **Firestore**: Aşağıdaki güvenlik kurallarını yükleyin (`firestore.rules`).  
4. **İlk Users dokümanları**: `users/{uid}` içine
   - Ali → `{ displayName:'Ali', role:'admin', side:'left', theme:'macera', email:'ali@...' }`
   - Işıl → `{ displayName:'Işıl', role:'admin', side:'right', theme:'cicek', email:'isil@...' }`
   - admin++ → `{ displayName:'admin++', role:'adminpp', side:'left', theme:'gece', email:'adminpp@...' }`

## 🔧 Çevre Değişkenleri (`.env`)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
# Virgülle ayrılmış email allowlist:
VITE_ALLOWLIST=ali@example.com, isil@example.com, adminpp@example.com
```

## 🧱 Firestore Kuralları
`firebase deploy --only firestore:rules` ile yükleyin.
Ayrıca **Index** gerekecek: `tasks` için (ownerUid ASC, date ASC, order ASC). Firebase konsol uyarısı link verir.