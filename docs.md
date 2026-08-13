# DOCS ACTIVITY - URL SHORTENER API (Node.js + TypeScript)

## 1. INITIALIZE APLIKASI

- [x] Buat folder project
- [x] Jalankan `npm init`
- [x] Install TypeScript
- [x] Install Express
- [x] Install development dependencies
- [x] Generate `tsconfig.json`
- [x] Buat struktur folder awal
- [x] Tambahkan script development
- [x] Tambahkan script build
- [ ] Tambahkan script production
- [x] Jalankan server pertama
- [x] Test endpoint health check

Target:

- API berjalan di localhost
- Endpoint `/` dapat diakses

---

## 2. SETUP CODE QUALITY

- [x] Install ESLint
- [x] Install Prettier
- [x] Konfigurasi ESLint
- [x] Konfigurasi Prettier
- [x] Tambahkan lint script
- [x] Tambahkan format script
- [x] Setup import alias
- [x] Rapikan struktur folder

Target:

- Konsisten coding style
- Tidak ada warning lint

---

## 3. SETUP DATABASE

- [x] Install PostgreSQL
- [x] Buat database
- [x] Install Prisma
- [x] Inisialisasi Prisma
- [x] Setup environment variable
- [x] Hubungkan Prisma ke PostgreSQL
- [x] Buat migration pertama
- [x] Test koneksi database

Target:

- Database berhasil terkoneksi
- Migration berhasil dijalankan

---

## 4. SETUP ENVIRONMENT

- [x] Buat file `.env`
- [x] Buat file `.env.example`
- [x] Setup APP_PORT
- [x] Setup DATABASE_URL
- [x] Setup JWT_SECRET
- [ ] Setup validation environment

Target:

- Semua konfigurasi berasal dari environment variable

---

## 5. MEMBUAT MODULE USER

- [x] Buat schema User
- [x] Buat migration User
- [x] Buat repository User
- [x] Buat service User
- [x] Buat controller User
- [x] Buat route User
- [x] Endpoint get profile
- [x] Endpoint get user by id

Target:

- User dapat disimpan dan diambil dari database

---

## 6. AUTHENTICATION

- [x] Install bcrypt
- [x] Install JWT
- [x] Endpoint register
- [x] Hash password
- [x] Validasi email unik
- [x] Endpoint login
- [x] Generate access token
- [x] Middleware authentication
- [x] Protected route

Target:

- User dapat login dan mendapatkan JWT

---

## 7. REQUEST VALIDATION

- [x] Install Zod
- [x] Buat schema register
- [x] Buat schema login
- [x] Buat validation middleware
- [x] Standardisasi response error

Target:

- Semua request tervalidasi

---

## 8. ERROR HANDLING

- [x] Buat custom error class
- [x] Global error handler
- [x] Handle validation error
- [x] Handle database error
- [x] Handle unauthorized error
- [x] Handle not found error

Target:

- Error response konsisten

---

## 9. MODULE SHORT LINK

- [x] Buat schema Link
- [x] Relasi User dan Link
- [x] Migration Link
- [x] Endpoint create short link
- [x] Endpoint get user links
- [x] Endpoint detail link
- [x] Endpoint update link
- [x] Endpoint delete link

Target:

- User dapat mengelola short link

---

## 10. SHORT CODE GENERATOR

- [x] Buat generator random code
- [x] Pastikan code unik
- [x] Validasi collision
- [x] Simpan ke database

Target:

- Setiap URL memiliki short code unik

---

## 11. REDIRECT SYSTEM

- [x] Endpoint redirect
- [x] Cari link berdasarkan short code
- [x] Redirect ke URL asli
- [x] Handle link tidak ditemukan

Target:

- Short URL dapat digunakan

---

## 12. CUSTOM SLUG

- [x] Tambahkan field custom slug
- [x] Validasi slug unik
- [x] Endpoint custom slug
- [x] Update slug

Target:

- User dapat menentukan URL sendiri

Contoh:

`/github`

`/portfolio`

`/linkedin`

---

## 13. ANALYTICS

- [x] Buat schema LinkVisit
- [x] Simpan data klik
- [x] Simpan IP address
- [x] Simpan user agent
- [x] Simpan referer
- [x] Total klik
- [x] Statistik harian
- [x] Statistik mingguan
- [x] Statistik bulanan

Target:

- Setiap klik tercatat

---

## 14. PAGINATION

- [x] Pagination links
- [x] Limit
- [x] Page
- [x] Metadata pagination

Target:

- Data dapat diambil secara bertahap

---

## 15. SEARCH & FILTER

- [ ] Search berdasarkan URL
- [ ] Search berdasarkan slug
- [ ] Filter berdasarkan tanggal
- [ ] Sorting

Target:

- User mudah mencari link

---

## 16. REDIS CACHE

- [ ] Install Redis
- [ ] Hubungkan Redis
- [ ] Cache short URL
- [ ] Cache analytics
- [ ] Implement cache invalidation

Target:

- Redirect lebih cepat

---

## 17. RATE LIMITING

- [ ] Install rate limiter
- [ ] Limit create link
- [ ] Limit redirect abuse
- [ ] Integrasi Redis

Target:

- API lebih aman

---

## 18. EXPIRED LINK

- [ ] Tambah field expiredAt
- [ ] Validasi expired
- [ ] Handle expired link
- [ ] Endpoint update expired date

Target:

- Link dapat memiliki masa berlaku

---

## 19. LOGGING

- [ ] Install logger
- [ ] Request logging
- [ ] Error logging
- [ ] Save log file

Target:

- Aktivitas API tercatat

---

## 20. TESTING

- [ ] Setup testing framework
- [ ] Test register
- [ ] Test login
- [ ] Test create link
- [ ] Test redirect
- [ ] Test analytics

Target:

- Core feature memiliki test

---

## 21. DOCKERIZATION

- [ ] Buat Dockerfile
- [ ] Buat docker-compose
- [ ] PostgreSQL container
- [ ] Redis container
- [ ] Jalankan aplikasi via Docker

Target:

- Project dapat dijalankan dengan satu command

---

## 22. API DOCUMENTATION

- [ ] Install Swagger
- [ ] Dokumentasi endpoint
- [ ] Dokumentasi request
- [ ] Dokumentasi response

Target:

- API mudah digunakan frontend

---

## 23. DEPLOYMENT

- [ ] Siapkan VPS
- [ ] Setup Nginx
- [ ] Setup PM2
- [ ] Deploy PostgreSQL
- [ ] Deploy Redis
- [ ] Setup SSL
- [ ] Setup domain

Target:

- API online dan dapat diakses publik

---

## 24. BONUS PRODUCTION FEATURES

- [ ] Refresh token
- [ ] Email verification
- [ ] Forgot password
- [ ] QR Code generator
- [ ] Team workspace
- [ ] Public analytics dashboard
- [ ] Admin dashboard API
- [ ] Monitoring dan health check

Target:

- Mendekati aplikasi production grade
