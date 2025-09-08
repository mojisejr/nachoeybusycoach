# 🔐 Google OAuth Setup Guide

## การตั้งค่า Google OAuth Project สำหรับ NextAuth.js

คู่มือนี้จะแนะนำวิธีการสร้าง Google OAuth project และการได้รับ Google Client ID และ Google Client Secret สำหรับใช้ใน NextAuth.js authentication

## 📋 ขั้นตอนการตั้งค่า

### Step 1: เข้าสู่ Google Cloud Console

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. เข้าสู่ระบบด้วย Google Account ของคุณ
3. หากยังไม่มี project ให้สร้าง project ใหม่:
   - คลิก "Select a project" ที่ด้านบน
   - คลิก "New Project"
   - ตั้งชื่อ project เป็น "NachoeyBusyCoach" หรือชื่อที่ต้องการ
   - คลิก "Create"

### Step 2: เปิดใช้งาน Google+ API

1. ใน Google Cloud Console ไปที่ "APIs & Services" > "Library"
2. ค้นหา "Google+ API" หรือ "People API"
3. คลิกเลือก API และคลิก "Enable"
4. รอให้ API เปิดใช้งานเสร็จสิ้น

### Step 3: สร้าง OAuth 2.0 Credentials

1. ไปที่ "APIs & Services" > "Credentials"
2. คลิก "+ CREATE CREDENTIALS" > "OAuth client ID"
3. หากยังไม่ได้ตั้งค่า OAuth consent screen:
   - คลิก "CONFIGURE CONSENT SCREEN"
   - เลือก "External" (สำหรับ testing) หรือ "Internal" (หากเป็น Google Workspace)
   - คลิก "Create"

### Step 4: ตั้งค่า OAuth Consent Screen

1. **OAuth consent screen setup:**
   - **App name**: "นาเชยไม่เคยมีโค้ชว่าง" หรือ "NachoeyBusyCoach"
   - **User support email**: อีเมลของคุณ
   - **App logo**: (ไม่จำเป็น สำหรับ testing)
   - **App domain**: 
     - Application home page: `http://localhost:3000` (สำหรับ development)
     - Privacy policy: `http://localhost:3000/privacy` (ไม่จำเป็นสำหรับ testing)
     - Terms of service: `http://localhost:3000/terms` (ไม่จำเป็นสำหรับ testing)
   - **Developer contact information**: อีเมลของคุณ
   - คลิก "SAVE AND CONTINUE"

2. **Scopes:**
   - คลิก "ADD OR REMOVE SCOPES"
   - เลือก scopes ที่จำเป็น:
     - `../auth/userinfo.email`
     - `../auth/userinfo.profile`
     - `openid`
   - คลิก "UPDATE" และ "SAVE AND CONTINUE"

3. **Test users** (สำหรับ External apps):
   - เพิ่มอีเมลของคุณและทีมงานที่จะทำการทดสอบ
   - คลิก "SAVE AND CONTINUE"

4. **Summary:**
   - ตรวจสอบข้อมูลและคลิก "BACK TO DASHBOARD"

### Step 5: สร้าง OAuth Client ID

1. กลับไปที่ "Credentials" > "+ CREATE CREDENTIALS" > "OAuth client ID"
2. เลือก **Application type**: "Web application"
3. ตั้งค่าดังนี้:
   - **Name**: "NachoeyBusyCoach Web Client"
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     http://localhost:3001
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/callback/google
     http://localhost:3001/api/auth/callback/google
     ```
4. คลิก "CREATE"

### Step 6: รับ Client ID และ Client Secret

1. หลังจากสร้างเสร็จ จะมี popup แสดง:
   - **Client ID**: เก็บค่านี้ไว้
   - **Client Secret**: เก็บค่านี้ไว้
2. คลิก "OK"
3. คุณสามารถดู credentials เหล่านี้ได้ในหน้า "Credentials" ได้ตลอดเวลา

## 🔧 การตั้งค่าใน Project

### ใส่ค่าใน Environment Variables

เพิ่มค่าต่อไปนี้ใน `/apps/backend/.env.local`:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### สร้าง NextAuth Secret

รัน command นี้เพื่อสร้าง NextAuth secret:

```bash
openssl rand -base64 32
```

หรือใช้ online generator: https://generate-secret.vercel.app/32

## 🚀 การทดสอบ

### ทดสอบ OAuth Flow

1. รัน backend server:
   ```bash
   cd apps/backend
   pnpm dev
   ```

2. ไปที่ `http://localhost:3001/api/auth/signin`
3. คลิก "Sign in with Google"
4. ทำการ authorize app
5. ตรวจสอบว่า redirect กลับมาที่ app ได้สำเร็จ

### การแก้ไขปัญหาที่พบบ่อย

**Error: redirect_uri_mismatch**
- ตรวจสอบว่า redirect URI ใน Google Console ตรงกับที่ใช้ใน app
- ตรวจสอบ port number (3000 สำหรับ frontend, 3001 สำหรับ backend)

**Error: access_denied**
- ตรวจสอบว่าได้เพิ่ม test users ใน OAuth consent screen แล้ว
- ตรวจสอบว่า app ยังอยู่ใน testing mode

**Error: invalid_client**
- ตรวจสอบ Client ID และ Client Secret ใน environment variables
- ตรวจสอบว่าไม่มี space หรือ special characters ที่ไม่ต้องการ

## 📝 หมายเหตุสำคัญ

1. **สำหรับ Development**: ใช้ `http://localhost` URLs
2. **สำหรับ Production**: จะต้องเปลี่ยน URLs เป็น production domain
3. **OAuth Consent Screen**: สำหรับ production จะต้องผ่าน Google verification process
4. **Test Users**: ใน development mode จะมีข้อจำกัดจำนวน test users
5. **API Quotas**: ตรวจสอบ API quotas และ rate limits ใน Google Cloud Console

## 🔄 การอัพเดทสำหรับ Production

เมื่อพร้อม deploy production:

1. เพิ่ม production domain ใน "Authorized JavaScript origins"
2. เพิ่ม production callback URL ใน "Authorized redirect URIs"
3. อัพเดท OAuth consent screen ให้เป็น production-ready
4. ส่งขอ verification จาก Google (หากจำเป็น)

---

**ขั้นตอนต่อไป**: หลังจากได้ Google Client ID และ Secret แล้ว สามารถไปต่อที่ Sub-Phase 2.1 ใน Backend Implementation Plan เพื่อตั้งค่า NextAuth.js ต่อได้เลย