# Current Focus

**Updated**: 2025-09-08 20:35:55

## Context

From `/Users/non/dev/vibes/nachoeybusycoach/resources/BACKEND_IMPLEMENTATION_PLAN.md` file implement Sub-phase 1.1: Project Setup & Sanity Configuration

## Implementation Focus

**Sub-Phase 1.1: Project Setup & Sanity Configuration (เช้า)**

**เป้าหมาย**: ตั้งค่าโปรเจกต์และ Sanity CMS

**สถานะปัจจุบัน**: 
- ✅ Next.js 15.5.2 project ใน `/apps/backend` (ตั้งค่าแล้ว)
- ✅ TypeScript, Tailwind CSS (ติดตั้งแล้ว)
- ❌ Sanity dependencies (ยังไม่ได้ติดตั้ง)

**งานที่ต้องทำ**:
1. ติดตั้ง dependencies ใน `/apps/backend`:
   - @sanity/client @sanity/image-url
   - next-auth @auth/sanity-adapter
   - zod
   - @sanity/cli (dev dependency)

2. สร้าง Sanity project (แยกจาก Next.js backend):
   - ใช้ existing project ID: u0rtdnil

3. ตั้งค่า environment variables:
   - Copy .env.example to .env.local
   - ตั้งค่า SANITY_PROJECT_ID=u0rtdnil
   - ตั้งค่า NEXTAUTH_URL=http://localhost:3001
   - ตั้งค่า FRONTEND_URL=http://localhost:3000

4. สร้าง Sanity client configuration:
   - สร้างไฟล์ `/apps/backend/src/lib/sanity.ts`
   - ตั้งค่า createClient และ type definitions

**Manual Testing**:
- รัน backend server ที่ port 3001
- รัน Sanity Studio ที่ port 3333
- ทดสอบการเชื่อมต่อกับ Sanity API
- ทดสอบ environment variables