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
- [ ] Test endpoint health check

Target:

- API berjalan di localhost
- Endpoint `/` dapat diakses

---

## 2. SETUP CODE QUALITY

- [ ] Install ESLint
- [ ] Install Prettier
- [ ] Konfigurasi ESLint
- [ ] Konfigurasi Prettier
- [ ] Tambahkan lint script
- [ ] Tambahkan format script
- [ ] Setup import alias
- [ ] Rapikan struktur folder

Target:

- Konsisten coding style
- Tidak ada warning lint

---

## 3. SETUP DATABASE

- [ ] Install PostgreSQL
- [ ] Buat database
- [ ] Install Prisma
- [ ] Inisialisasi Prisma
- [ ] Setup environment variable
- [ ] Hubungkan Prisma ke PostgreSQL
- [ ] Buat migration pertama
- [ ] Test koneksi database

Target:

- Database berhasil terkoneksi
- Migration berhasil dijalankan

---

## 4. SETUP ENVIRONMENT

- [ ] Buat file `.env`
- [ ] Buat file `.env.example`
- [ ] Setup APP_PORT
- [ ] Setup DATABASE_URL
- [ ] Setup JWT_SECRET
- [ ] Setup validation environment

Target:

- Semua konfigurasi berasal dari environment variable

---

## 5. MEMBUAT MODULE USER

- [ ] Buat schema User
- [ ] Buat migration User
- [ ] Buat repository User
- [ ] Buat service User
- [ ] Buat controller User
- [ ] Buat route User
- [ ] Endpoint get profile
- [ ] Endpoint get user by id

Target:

- User dapat disimpan dan diambil dari database

---

## 6. AUTHENTICATION

- [ ] Install bcrypt
- [ ] Install JWT
- [ ] Endpoint register
- [ ] Hash password
- [ ] Validasi email unik
- [ ] Endpoint login
- [ ] Generate access token
- [ ] Middleware authentication
- [ ] Protected route

Target:

- User dapat login dan mendapatkan JWT

---

## 7. REQUEST VALIDATION

- [ ] Install Zod
- [ ] Buat schema register
- [ ] Buat schema login
- [ ] Buat validation middleware
- [ ] Standardisasi response error

Target:

- Semua request tervalidasi

---

## 8. ERROR HANDLING

- [ ] Buat custom error class
- [ ] Global error handler
- [ ] Handle validation error
- [ ] Handle database error
- [ ] Handle unauthorized error
- [ ] Handle not found error

Target:

- Error response konsisten

---

## 9. MODULE SHORT LINK

- [ ] Buat schema Link
- [ ] Relasi User dan Link
- [ ] Migration Link
- [ ] Endpoint create short link
- [ ] Endpoint get user links
- [ ] Endpoint detail link
- [ ] Endpoint update link
- [ ] Endpoint delete link

Target:

- User dapat mengelola short link

---

## 10. SHORT CODE GENERATOR

- [ ] Buat generator random code
- [ ] Pastikan code unik
- [ ] Validasi collision
- [ ] Simpan ke database

Target:

- Setiap URL memiliki short code unik

---

## 11. REDIRECT SYSTEM

- [ ] Endpoint redirect
- [ ] Cari link berdasarkan short code
- [ ] Redirect ke URL asli
- [ ] Handle link tidak ditemukan

Target:

- Short URL dapat digunakan

---

## 12. CUSTOM SLUG

- [ ] Tambahkan field custom slug
- [ ] Validasi slug unik
- [ ] Endpoint custom slug
- [ ] Update slug

Target:

- User dapat menentukan URL sendiri

Contoh:

`/github`

`/portfolio`

`/linkedin`

---

## 13. ANALYTICS

- [ ] Buat schema LinkVisit
- [ ] Simpan data klik
- [ ] Simpan IP address
- [ ] Simpan user agent
- [ ] Simpan referer
- [ ] Total klik
- [ ] Statistik harian
- [ ] Statistik mingguan
- [ ] Statistik bulanan

Target:

- Setiap klik tercatat

---

## 14. PAGINATION

- [ ] Pagination links
- [ ] Limit
- [ ] Page
- [ ] Metadata pagination

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
