# 🎨 Frontend Implementation Plan: นาเชยไม่เคยมีโค้ชว่าง

## 📋 Overview

แผนการพัฒนา Frontend สำหรับแอปพลิเคชัน "นาเชยไม่เคยมีโค้ชว่าง" โดยแบ่งเป็น 6 วัน แต่ละวันแบ่งเป็น sub-phase เช้า-บ่าย ที่เชื่อมต่อกับ Backend ที่พัฒนาแล้ว

## 🎯 Core Principles

- **Backend-First Integration**: เชื่อมต่อกับ Backend APIs ที่พัฒนาแล้วเสร็จ
- **Component-Driven**: สร้าง reusable components ที่ใช้ร่วมกันได้
- **Daily Completion**: แต่ละ sub-phase จบภายใน 1 วัน
- **Real-Time Testing**: ทดสอบกับ Backend APIs จริง

## 🛠 Tech Stack (Updated)

- **Framework**: Next.js 15.5.2 with TypeScript 5
- **React**: React 19.1.0 with React DOM 19.1.0
- **Styling**: Tailwind CSS 4 + DaisyUI
- **Charts**: Tremor
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **Authentication**: NextAuth.js 5 (integrated with backend)
- **Package Manager**: pnpm

## 🔗 Backend Integration Status

✅ **Completed Backend APIs**:
- Authentication (NextAuth.js)
- User Profile Management
- Training Plans CRUD
- Training Sessions CRUD
- Workout Logs CRUD
- Feedback System
- Notification System
- Analytics & History APIs

**Available API Endpoints**:
- `/api/auth/[...nextauth]` - Authentication
- `/api/users/profile` - User profile management
- `/api/users/role` - User role management
- `/api/training-plans` - Training plan CRUD
- `/api/sessions` - Training session CRUD
- `/api/workout-logs` - Workout log CRUD
- `/api/feedback` - Feedback system
- `/api/notifications` - Notification system
- `/api/analytics/runner/[id]` - Analytics & history

---

## 📅 Implementation Timeline

## Phase 1: Foundation & Authentication (วันที่ 1)

### Sub-Phase 1.1: Project Setup & UI Foundation (เช้า)
**เป้าหมาย**: ตั้งค่าโปรเจกต์สมัยใหม่และสร้าง UI components พื้นฐานพร้อม brand identity

**งานที่ต้องทำ**:

#### 1. Project Dependencies Update
- ✅ **Already Setup**: Next.js 15.5.2, React 19.1.0, TypeScript 5, Tailwind CSS 4
- **Additional dependencies needed**:
  ```bash
  # UI Components และ Charts
  pnpm add daisyui@4 @tailwindcss/typography
  pnpm add @tremor/react lucide-react
  
  # Form และ Validation
  pnpm add react-hook-form @hookform/resolvers zod
  
  # State Management และ Auth
  pnpm add zustand@4 next-auth@5
  
  # Development Tools
  pnpm add -D prettier @types/bcryptjs
  
  # Backend Integration
  pnpm add axios swr
  ```
  pnpm add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
  pnpm add -D tailwindcss-animate class-variance-authority clsx tailwind-merge
  
  # Testing Setup
  pnpm add -D vitest @testing-library/react @testing-library/jest-dom
  pnpm add -D @vitejs/plugin-react jsdom
  ```

#### 2. Configuration Files Setup
- **Tailwind Config** (`tailwind.config.ts`):
  ```typescript
  import type { Config } from 'tailwindcss'
  
  const config: Config = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      '../../packages/ui/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          thai: ['Sarabun', 'system-ui', 'sans-serif']
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'slide-up': 'slideUp 0.3s ease-out'
        }
      }
    },
    plugins: [
      require('daisyui'),
      require('@tailwindcss/typography')
    ],
    daisyui: {
      themes: [
        {
          nachoeybusycoach: {
            // Brand Colors from COLOR.md
            "primary": "#FF1616",
            "primary-focus": "#E60000", 
            "primary-content": "#FFFFFF",
            "secondary": "#990D0D",
            "secondary-focus": "#7A0A0A",
            "secondary-content": "#FFFFFF",
            "accent": "#FF4444",
            "accent-focus": "#FF2222",
            "accent-content": "#FFFFFF",
            "neutral": "#2A2A2A",
            "neutral-focus": "#1F1F1F",
            "neutral-content": "#FFFFFF",
            "base-100": "#FFFFFF",
            "base-200": "#F8F8F8",
            "base-300": "#E8E8E8",
            "base-content": "#1F1F1F",
            "info": "#3ABFF8",
            "success": "#36D399",
            "warning": "#FBBD23",
            "error": "#F87272"
          }
        }
      ],
      base: true,
      utils: true,
      logs: false,
      rtl: false
    }
  }
  export default config
  ```

- **TypeScript Config** (`tsconfig.json`):
  ```json
  {
    "compilerOptions": {
      "target": "ES2022",
      "lib": ["dom", "dom.iterable", "ES6"],
      "allowJs": true,
      "skipLibCheck": true,
      "strict": true,
      "noEmit": true,
      "esModuleInterop": true,
      "module": "esnext",
      "moduleResolution": "bundler",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "jsx": "preserve",
      "incremental": true,
      "plugins": [{ "name": "next" }],
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"],
        "@/ui": ["../../packages/ui"],
        "@/types": ["../../packages/types"]
      }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
  }
  ```

#### 3. Brand Assets Integration
- สร้าง Brand Components ใน `/packages/ui/brand/`:
  - `Logo.tsx` - component สำหรับแสดง logo พร้อม variants
  - `BrandColors.tsx` - color palette component
  - `BrandIcons.tsx` - custom icons และ brand elements

#### 4. Shared UI Components ใน `/packages/ui`:
- **Core Components**:
  - `Button.tsx` - ปุ่มพร้อม variants และ accessibility
  - `Card.tsx` - การ์ดพร้อม animations และ hover effects
  - `Input.tsx` - input field พร้อม validation และ error states
  - `Modal.tsx` - accessible modal dialog พร้อม focus management
  - `Loading.tsx` - loading states พร้อม skeleton loaders
  - `Toast.tsx` - notification system

- **Layout Components**:
  - `Layout.tsx` - main layout พร้อม responsive design
  - `Header.tsx` - navigation header พร้อม logo integration
  - `Sidebar.tsx` - collapsible sidebar navigation
  - `Footer.tsx` - footer พร้อม brand elements

- **Form Components**:
  - `FormField.tsx` - wrapper สำหรับ form fields
  - `Select.tsx` - custom select dropdown
  - `Checkbox.tsx` - styled checkbox
  - `RadioGroup.tsx` - radio button group

#### 5. TypeScript Types ใน `/packages/types`:
- `User.ts` - user, role, และ authentication types
- `Training.ts` - training plan, session, และ progress types
- `Workout.ts` - workout log, exercise, และ metrics types
- `UI.ts` - component props และ theme types
- `API.ts` - API response และ request types

**File Structure**:
```
/apps/frontend/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   └── lib/
│       ├── utils.ts
│       └── constants.ts
├── public/
│   └── images/
│       ├── block-a-logo.png
│       └── black-tp-logo.png
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json

/packages/ui/
├── brand/
│   ├── Logo.tsx
│   ├── BrandColors.tsx
│   └── BrandIcons.tsx
├── components/
│   ├── core/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Loading.tsx
│   │   └── Toast.tsx
│   ├── layout/
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── forms/
│       ├── FormField.tsx
│       ├── Select.tsx
│       ├── Checkbox.tsx
│       └── RadioGroup.tsx
├── hooks/
│   ├── useTheme.ts
│   └── useBreakpoint.ts
├── utils/
│   ├── cn.ts
│   └── variants.ts
└── index.ts

/packages/types/
├── User.ts
├── Training.ts
├── Workout.ts
├── UI.ts
├── API.ts
└── index.ts
```

#### 6. Development Tools Setup
- **ESLint Config** (`.eslintrc.json`):
  ```json
  {
    "extends": [
      "next/core-web-vitals",
      "@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "rules": {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "error"
    }
  }
  ```

- **Prettier Config** (`.prettierrc`):
  ```json
  {
    "semi": false,
    "trailingComma": "es5",
    "singleQuote": true,
    "tabWidth": 2,
    "useTabs": false
  }
  ```

- **Vitest Config** (`vitest.config.ts`):
  ```typescript
  import { defineConfig } from 'vitest/config'
  import react from '@vitejs/plugin-react'
  
  export default defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts']
    }
  })
  ```

#### 7. Logo Integration Examples
- **Logo Component** (`/packages/ui/brand/Logo.tsx`):
  ```typescript
  interface LogoProps {
    variant?: 'default' | 'transparent'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
  }
  
  export function Logo({ variant = 'default', size = 'md', className }: LogoProps) {
    const logoSrc = variant === 'transparent' 
      ? '/images/black-tp-logo.png' 
      : '/images/block-a-logo.png'
    
    const sizeClasses = {
      sm: 'h-8 w-auto',
      md: 'h-12 w-auto', 
      lg: 'h-16 w-auto',
      xl: 'h-24 w-auto'
    }
    
    return (
      <img 
        src={logoSrc}
        alt="NachoeyBusyCoach"
        className={cn(sizeClasses[size], className)}
      />
    )
  }
  ```

**Manual Testing & Quality Assurance**:
- **Development Server**: รัน `pnpm dev` และเช็คว่า UI components แสดงผลถูกต้อง
- **Responsive Design**: ทดสอบบนมือถือ (375px), แท็บเล็ต (768px), และเดสก์ท็อป (1024px+)
- **Theme Testing**: ทดสอบ DaisyUI theme colors และ dark/light mode
- **Logo Integration**: ทดสอบการแสดงผล logo ทั้ง 2 variants ในขนาดต่างๆ
- **Accessibility**: ทดสอบ keyboard navigation และ screen reader compatibility
- **Performance**: เช็ค Core Web Vitals และ bundle size
- **TypeScript**: ตรวจสอบ type safety และ IntelliSense
- **Linting**: รัน `pnpm lint` และ `pnpm type-check`
- **Testing**: รัน `pnpm test` สำหรับ unit tests

**Success Criteria**:
✅ Next.js 15 app รันได้โดยไม่มี error  
✅ DaisyUI theme ใช้งานได้ตาม COLOR.md  
✅ Logo components แสดงผลถูกต้องทั้ง 2 variants  
✅ UI components responsive ทุกขนาดหน้าจอ  
✅ TypeScript strict mode ผ่านทั้งหมด  
✅ ESLint และ Prettier ทำงานได้  
✅ Testing setup พร้อมใช้งาน  
✅ Accessibility standards ผ่าน WCAG 2.1 AA

### Sub-Phase 1.2: Authentication Integration (บ่าย)
**เป้าหมาย**: เชื่อมต่อกับระบบ Authentication ที่พัฒนาแล้วใน Backend

**งานที่ต้องทำ**:
- สร้างหน้า Login (`/src/app/login/page.tsx`):
  - OAuth buttons สำหรับ Google, Facebook, Line
  - Loading states และ Error handling
  - เชื่อมต่อกับ `/api/auth/[...nextauth]` ที่มีอยู่แล้ว
- ✅ **Backend Ready**: NextAuth.js setup ใน `/api/auth/[...nextauth]/route.ts`
- สร้าง Frontend Auth Components:
  - `AuthProvider.tsx` - NextAuth SessionProvider wrapper
  - `useAuth.ts` - Custom hook ใช้ useSession
  - `ProtectedRoute.tsx` - Route protection component
  - `LoginButton.tsx` - OAuth login buttons
- สร้างหน้า Dashboard พื้นฐาน:
  - `/src/app/dashboard/runner/page.tsx`
  - `/src/app/dashboard/coach/page.tsx`
- เชื่อมต่อกับ User Profile API:
  - `/api/users/profile` - Get/Update user profile
  - `/api/users/role` - Role management

**Backend Integration**:
```typescript
// Authentication Service
export const authService = {
  // Get current user profile
  getCurrentUser: () => fetch('/api/users/profile'),
  
  // Update user profile
  updateProfile: (data: UpdateProfileData) => 
    fetch('/api/users/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  
  // Update user role
  updateRole: (data: UpdateRoleData) => 
    fetch('/api/users/role', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
}

// NextAuth.js Integration
import { useSession, signIn, signOut } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()
  
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    signIn,
    signOut
  }
}

// Data fetching with SWR
const { data: userProfile } = useSWR('/api/users/profile', fetcher)
```

**Manual Testing**:
- ทดสอบการ Login/Logout (ใช้ mock)
- ทดสอบการ redirect ไป Dashboard ตาม role
- ทดสอบ Protected Routes
- ทดสอบ responsive design

## Phase 2: Runner Dashboard & Training Plan View (วันที่ 2)

### Sub-Phase 2.1: Training Plan Display (เช้า)
**เป้าหมาย**: สร้างหน้าแสดงตารางการฝึกซ้อมสำหรับนักวิ่ง

**งานที่ต้องทำ**:
- สร้างหน้า Runner Dashboard (`/src/app/dashboard/runner/page.tsx`)
- สร้าง components:
  - `WeeklyTrainingPlan.tsx` - แสดงตารางซ้อมรายสัปดาห์
  - `TrainingSessionCard.tsx` - การ์ดแสดงข้อมูล session
  - `ProgressSummary.tsx` - สรุปความคืบหน้า
- ใช้ Tremor สำหรับแสดงกราฟ:
  - Weekly progress chart
  - Monthly overview
  - Performance trends

**Backend Integration**:
```typescript
// Training Plan API Service
export const trainingPlanService = {
  // Get training plans for user
  getTrainingPlans: (userId: string) => 
    fetch(`/api/training-plans?userId=${userId}`),
  
  // Get specific training plan
  getTrainingPlan: (id: string) => 
    fetch(`/api/training-plans/${id}`),
  
  // Create new training plan
  createTrainingPlan: (data: CreateTrainingPlanData) => 
    fetch('/api/training-plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  
  // Update training plan
  updateTrainingPlan: (id: string, data: UpdateTrainingPlanData) => 
    fetch(`/api/training-plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
}

// Training Session API Service
export const sessionService = {
  // Get sessions for training plan
  getSessions: (trainingPlanId: string) => 
    fetch(`/api/sessions?trainingPlanId=${trainingPlanId}`),
  
  // Create bulk sessions
  createBulkSessions: (data: CreateBulkSessionsData) => 
    fetch('/api/sessions/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
}

// Data fetching with SWR
const { data: trainingPlans } = useSWR(`/api/training-plans?userId=${userId}`, fetcher)
const { data: sessions } = useSWR(`/api/sessions?trainingPlanId=${planId}`, fetcher)
```

**Manual Testing**:
- ทดสอบการแสดงตารางซ้อมรายสัปดาห์
- ทดสอบการคลิกดู session details
- ทดสอบ responsive design
- ทดสอบ Tremor charts

### Sub-Phase 2.2: Session Detail & Status (บ่าย)
**เป้าหมาย**: สร้างหน้าดูรายละเอียด session และแสดงสถานะ

**งานที่ต้องทำ**:
- สร้าง components:
  - `SessionDetailModal.tsx` - modal แสดงรายละเอียด session
  - `StatusBadge.tsx` - badge แสดงสถานะ (Pending, Completed, DNF, Undone)
  - `SessionNavigation.tsx` - navigation ระหว่าง sessions
  - `WeekSelector.tsx` - เลือกดูสัปดาห์ต่างๆ
- เพิ่ม state management ด้วย Zustand:
  - `useTrainingStore.ts` - จัดการ state ของ training plan
  - `useUIStore.ts` - จัดการ UI state (modal, loading)

**Status Types**:
```typescript
type SessionStatus = 'pending' | 'completed' | 'dnf' | 'undone'

const statusConfig = {
  pending: { color: 'yellow', text: 'รอการซ้อม' },
  completed: { color: 'green', text: 'เสร็จสิ้น' },
  dnf: { color: 'orange', text: 'ไม่จบ (DNF)' },
  undone: { color: 'red', text: 'ไม่ได้ซ้อม' }
}
```

**Manual Testing**:
- ทดสอบการเปิด session details
- ทดสอบการแสดงสถานะต่างๆ
- ทดสอบ navigation ระหว่าง sessions
- ทดสอบ week selector

## Phase 3: Workout Logging System (วันที่ 3)

### Sub-Phase 3.1: Workout Log Form (เช้า)
**เป้าหมาย**: สร้างฟอร์มบันทึกการซ้อม

**งานที่ต้องทำ**:
- สร้างหน้า WorkoutLog (`/src/app/workout-log/[sessionId]/page.tsx`)
- สร้าง components:
  - `WorkoutLogForm.tsx` - ฟอร์มหลักสำหรับบันทึก
  - `StatusSelector.tsx` - เลือกสถานะการซ้อม
  - `LinkInput.tsx` - input สำหรับ Garmin/Strava link
  - `FeelingSelector.tsx` - เลือกความรู้สึกหลังซ้อม
  - `InjuryIndicator.tsx` - ระบุอาการบาดเจ็บ
- ใช้ React Hook Form สำหรับ form validation
- เพิ่ม rich text editor สำหรับ notes

**Form Schema**:
```typescript
interface WorkoutLogForm {
  sessionId: string
  status: 'completed' | 'dnf' | 'undone'
  externalLink?: string
  actualDistance?: number
  actualDuration?: string
  actualPace?: string
  notes: string
  feeling: 'excellent' | 'good' | 'okay' | 'tired' | 'exhausted'
  injuries: string[]
  weather?: string
  temperature?: number
}
```

**Backend Integration**:
```typescript
// Workout Log API Service
export const workoutLogService = {
  // Create workout log
  createWorkoutLog: (data: CreateWorkoutLogData) => 
    fetch('/api/workout-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  
  // Get workout logs for user
  getWorkoutLogs: (userId: string, params?: QueryParams) => 
    fetch(`/api/workout-logs?userId=${userId}&${new URLSearchParams(params)}`),
  
  // Get workout log history
  getWorkoutHistory: (userId: string) => 
    fetch(`/api/workout-logs/history?userId=${userId}`),
  
  // Update workout log
  updateWorkoutLog: (id: string, data: UpdateWorkoutLogData) => 
    fetch(`/api/workout-logs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  
  // Delete workout log
  deleteWorkoutLog: (id: string) => 
    fetch(`/api/workout-logs/${id}`, { method: 'DELETE' })
}

// Data fetching with SWR
const { data: workoutLogs } = useSWR(`/api/workout-logs?userId=${userId}`, fetcher)
const { data: workoutHistory } = useSWR(`/api/workout-logs/history?userId=${userId}`, fetcher)

// Form submission with mutation
const { trigger: createWorkoutLog } = useSWRMutation('/api/workout-logs', 
  (url, { arg }: { arg: CreateWorkoutLogData }) => 
    workoutLogService.createWorkoutLog(arg)
)
```

**Manual Testing**:
- ทดสอบการกรอกฟอร์มทุก field
- ทดสอบ form validation
- ทดสอบการ submit (ใช้ console.log)
- ทดสอบ rich text editor

### Sub-Phase 3.2: Workout History (บ่าย)
**เป้าหมาย**: สร้างหน้าประวัติการซ้อม

**งานที่ต้องทำ**:
- สร้างหน้า WorkoutHistory (`/src/app/history/page.tsx`)
- สร้าง components:
  - `WorkoutHistoryList.tsx` - รายการประวัติการซ้อม
  - `WorkoutHistoryCard.tsx` - การ์ดแสดงข้อมูลแต่ละครั้ง
  - `FilterControls.tsx` - filter by date, status, type
  - `SearchBar.tsx` - ค้นหาในประวัติ
  - `Pagination.tsx` - แบ่งหน้า
- ใช้ Tremor สำหรับ charts:
  - Monthly distance chart
  - Weekly consistency chart
  - Performance trends

**Backend Integration for Analytics**:
```typescript
// Analytics API Service
export const analyticsService = {
  // Get runner analytics
  getRunnerAnalytics: (runnerId: string) => 
    fetch(`/api/analytics/runner/${runnerId}`),
  
  // Get workout history with pagination
  getWorkoutHistory: (params: HistoryParams) => {
    const searchParams = new URLSearchParams(params)
    return fetch(`/api/workout-logs/history?${searchParams}`)
  },
  
  // Get performance trends
  getPerformanceTrends: (runnerId: string, period: string) => 
    fetch(`/api/analytics/runner/${runnerId}?period=${period}`)
}

// Analytics Types (matching backend schema)
interface RunnerAnalytics {
  totalSessions: number
  completedLogs: number
  totalDistance: number
  averageFeeling: number
  weeklyStats: {
    _createdAt: string
    status: string
    actualDistance: number
    feeling: string
  }[]
}

interface HistoryParams {
  runnerId?: string
  page?: string
  limit?: string
  startDate?: string
  endDate?: string
  status?: string
}

// Data fetching with SWR
const { data: analytics } = useSWR(
  `/api/analytics/runner/${runnerId}`, 
  fetcher
)
const { data: history } = useSWR(
  `/api/workout-logs/history?runnerId=${runnerId}`, 
  fetcher
)
```

**Manual Testing**:
- ทดสอบการแสดงประวัติ
- ทดสอบ filter และ search
- ทดสอบ pagination
- ทดสอบ charts

## Phase 4: Coach Dashboard & Management (วันที่ 4)

### Sub-Phase 4.1: Coach Dashboard (เช้า)
**เป้าหมาย**: สร้าง Dashboard สำหรับโค้ช

**งานที่ต้องทำ**:
- สร้างหน้า Coach Dashboard (`/src/app/dashboard/coach/page.tsx`)
- สร้าง components:
  - `RunnersList.tsx` - รายชื่อนักวิ่งทั้งหมด
  - `RunnerCard.tsx` - การ์ดแสดงข้อมูลนักวิ่งแต่ละคน
  - `PendingReviews.tsx` - รายการที่รอการตรวจสอบ
  - `CoachOverview.tsx` - ภาพรวมของโค้ช
- ใช้ Tremor สำหรับ overview charts:
  - Total runners chart
  - Weekly activity chart
  - Completion rates

**Backend Integration for Coach Analytics**:
```typescript
// Coach Analytics API Service
export const coachAnalyticsService = {
  // Get coach overview analytics
  getCoachAnalytics: (coachId: string) => 
    fetch(`/api/analytics/coach/${coachId}`),
  
  // Get all runners under coach
  getCoachRunners: () => 
    fetch('/api/users/profile?role=runner'),
  
  // Get aggregated runner performance
  getRunnerPerformance: (runnerId: string) => 
    fetch(`/api/analytics/runner/${runnerId}`)
}

// Coach Analytics Types
interface CoachAnalytics {
  totalRunners: number
  activeRunners: number
  completionRate: number
  weeklyActivity: {
    week: string
    completedSessions: number
    totalSessions: number
  }[]
  topPerformers: {
    runnerId: string
    name: string
    completionRate: number
  }[]
}

// Data fetching for coach dashboard
const { data: coachAnalytics } = useSWR(
  `/api/analytics/coach/${coachId}`, 
  fetcher
)
const { data: runners } = useSWR(
  '/api/users/profile?role=runner', 
  fetcher
)
```

**Backend Integration**:
```typescript
// API Service for Runner Management
export const runnerService = {
  // Get all runners for coach
  getRunners: () => fetch('/api/users/profile?role=runner'),
  
  // Get runner analytics
  getRunnerAnalytics: (runnerId: string) => 
    fetch(`/api/analytics/runner/${runnerId}`),
  
  // Get runner's training sessions
  getRunnerSessions: (runnerId: string) => 
    fetch(`/api/sessions?userId=${runnerId}`),
  
  // Get pending feedback for runner
  getPendingFeedback: (runnerId: string) => 
    fetch(`/api/feedback?userId=${runnerId}&status=pending`)
}

// Data fetching with SWR
const { data: runners, error } = useSWR('/api/users/profile?role=runner', fetcher)
const { data: analytics } = useSWR(`/api/analytics/runner/${runnerId}`, fetcher)
```

**Manual Testing**:
- ทดสอบการแสดงรายชื่อนักวิ่ง
- ทดสอบการคลิกดูข้อมูลนักวิ่ง
- ทดสอบ overview charts
- ทดสอบ pending reviews

### Sub-Phase 4.2: Runner Profile Management (บ่าย)
**เป้าหมาย**: สร้างหน้าจัดการข้อมูลนักวิ่ง

**งานที่ต้องทำ**:
- สร้างหน้า RunnerProfile (`/src/app/coach/runner/[id]/page.tsx`)
- สร้าง components:
  - `RunnerInfo.tsx` - ข้อมูลพื้นฐานของนักวิ่ง
  - `RunnerTrainingHistory.tsx` - ประวัติการซ้อมของนักวิ่ง
  - `RunnerProgress.tsx` - ความคืบหน้าและสถิติ
  - `QuickActions.tsx` - การกระทำด่วน (create plan, send message)
  - `RunnerNotes.tsx` - บันทึกของโค้ชเกี่ยวกับนักวิ่ง

**Manual Testing**:
- ทดสอบการดูข้อมูลนักวิ่ง
- ทดสอบการดูประวัติการซ้อม
- ทดสอบ quick actions
- ทดสอบการเขียน notes

## Phase 5: Training Plan Management (วันที่ 5)

### Sub-Phase 5.1: Training Plan Creation (เช้า)
**เป้าหมาย**: สร้างระบบสร้างแผนการฝึกซ้อม

**งานที่ต้องทำ**:
- สร้างหน้า CreateTrainingPlan (`/src/app/coach/create-plan/page.tsx`)
- สร้าง components:
  - `TrainingPlanForm.tsx` - ฟอร์มสร้างแผน
  - `SessionBuilder.tsx` - สร้าง session แต่ละวัน
  - `WeeklyPlanPreview.tsx` - preview แผนรายสัปดาห์
  - `SessionTemplates.tsx` - template sessions ที่ใช้บ่อย
  - `PlanMetadata.tsx` - ข้อมูลพื้นฐานของแผน
- ใช้ drag-and-drop สำหรับจัดเรียง sessions
- เพิ่ม session templates (Easy Run, Interval, Long Run, etc.)

**Session Templates**:
```typescript
export const sessionTemplates = [
  {
    id: 'easy-run',
    name: 'Easy Run',
    type: 'easy',
    defaultDistance: '5km',
    defaultDuration: '30min',
    defaultPace: '6:00/km',
    notes: 'วิ่งเบาๆ ผ่อนคลาย'
  },
  {
    id: 'interval',
    name: 'Interval Training',
    type: 'speed',
    defaultDistance: '8km',
    defaultDuration: '45min',
    defaultPace: '4:30/km',
    notes: '400m x 8 reps, พัก 90 วินาที'
  }
]
```

**Manual Testing**:
- ทดสอบการสร้างแผนการซ้อม
- ทดสอบการเพิ่ม/ลบ sessions
- ทดสอบ drag-and-drop
- ทดสอบ session templates
- ทดสอบ preview และ save

### Sub-Phase 5.2: Plan Editing & Management (บ่าย)
**เป้าหมาย**: สร้างระบบแก้ไขและจัดการแผน

**งานที่ต้องทำ**:
- สร้างหน้า EditTrainingPlan (`/src/app/coach/edit-plan/[id]/page.tsx`)
- สร้าง components:
  - `PlanVersionHistory.tsx` - ประวัติการแก้ไขแผน
  - `BulkActions.tsx` - การกระทำแบบ bulk (copy week, template)
  - `PlanAssignment.tsx` - assign แผนให้นักวิ่ง
  - `PlanComparison.tsx` - เปรียบเทียบ versions
  - `PlanClone.tsx` - copy แผนไปใช้กับนักวิ่งคนอื่น

**Manual Testing**:
- ทดสอบการแก้ไขแผน
- ทดสอบ version history
- ทดสอบ bulk actions
- ทดสอบการ assign แผนให้นักวิ่ง
- ทดสอบการ clone แผน

## Phase 6: Feedback & Communication (วันที่ 6)

### Sub-Phase 6.1: Feedback System (เช้า)
**เป้าหมาย**: สร้างระบบให้ feedback

**งานที่ต้องทำ**:
- สร้าง components:
  - `FeedbackForm.tsx` - ฟอร์มเขียน feedback
  - `FeedbackDisplay.tsx` - แสดง feedback ที่มีอยู่
  - `CommentThread.tsx` - thread การสนทนา
  - `FeedbackHistory.tsx` - ประวัติ feedback
- เพิ่ม rich text editor สำหรับ feedback
- สร้าง emoji reactions
- เพิ่ม file attachments (images, videos)

**Backend Integration for Feedback**:
```typescript
// Feedback API Service
export const feedbackService = {
  // Create new feedback
  createFeedback: (data: CreateFeedbackData) => 
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  
  // Get feedback for workout log
  getFeedback: (workoutLogId: string) => 
    fetch(`/api/feedback?workoutLogId=${workoutLogId}`),
  
  // Update feedback
  updateFeedback: (id: string, data: UpdateFeedbackData) => 
    fetch(`/api/feedback/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
}

// Feedback Types (matching backend schema)
interface Feedback {
  id: string
  workoutLogId: string
  authorId: string
  authorRole: 'coach' | 'runner'
  content: string
  type: 'praise' | 'suggestion' | 'concern' | 'question'
  attachments?: string[]
  reactions?: { emoji: string; userId: string }[]
  createdAt: string
  updatedAt?: string
}
```

**Manual Testing**:
- ทดสอบการเขียน feedback
- ทดสอบการแสดง feedback
- ทดสอบ comment thread
- ทดสอบ emoji reactions
- ทดสอบ file attachments

### Sub-Phase 6.2: Notifications & Real-time Updates (บ่าย)
**เป้าหมาย**: สร้างระบบแจ้งเตือน

**งานที่ต้องทำ**:
- สร้าง components:
  - `NotificationCenter.tsx` - ศูนย์รวมการแจ้งเตือน
  - `NotificationBadge.tsx` - badge แสดงจำนวนการแจ้งเตือน
  - `NotificationItem.tsx` - รายการแจ้งเตือนแต่ละอัน
  - `ToastNotification.tsx` - popup notifications
- ใช้ React Query สำหรับ real-time updates
- เพิ่ม notification preferences
- สร้าง notification sounds (optional)

**Backend Integration for Notifications**:
```typescript
// Notification API Service
export const notificationService = {
  // Get user notifications
  getNotifications: () => fetch('/api/notifications'),
  
  // Mark notification as read
  markAsRead: (id: string) => 
    fetch(`/api/notifications/${id}/read`, { method: 'POST' }),
  
  // Create new notification
  createNotification: (data: CreateNotificationData) => 
    fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
}

// Notification Types (matching backend schema)
type NotificationType = 
  | 'new_feedback'
  | 'plan_assigned'
  | 'workout_completed'
  | 'plan_updated'
  | 'reminder'

interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: string
}
```

**Manual Testing**:
- ทดสอบการแสดงการแจ้งเตือน
- ทดสอบ real-time updates (ใช้ mock)
- ทดสอบ toast notifications
- ทดสอบ notification preferences
- ทดสอบการ mark as read

---

## 🔗 Integration Points

### API Endpoints ที่ Frontend จะใช้:

```typescript
// Authentication
POST /api/auth/signin
POST /api/auth/signout
GET /api/auth/session

// Users
GET /api/users/profile
PUT /api/users/profile
GET /api/users/role

// Training Plans
GET /api/training-plans?runnerId=xxx
POST /api/training-plans
PUT /api/training-plans/:id
DELETE /api/training-plans/:id

// Training Sessions
GET /api/sessions?planId=xxx
POST /api/sessions
PUT /api/sessions/:id
DELETE /api/sessions/:id

// Workout Logs
GET /api/workout-logs?sessionId=xxx
POST /api/workout-logs
PUT /api/workout-logs/:id
GET /api/workout-logs/history?runnerId=xxx

// Feedback
GET /api/feedback?workoutLogId=xxx
POST /api/feedback
PUT /api/feedback/:id

// Notifications
GET /api/notifications
PUT /api/notifications/:id/read
```

### State Management Strategy:

```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

// stores/trainingStore.ts
interface TrainingState {
  currentPlan: TrainingPlan | null
  sessions: TrainingSession[]
  workoutLogs: WorkoutLog[]
  fetchPlan: (runnerId: string) => Promise<void>
  updateSession: (sessionId: string, data: Partial<TrainingSession>) => Promise<void>
}

// stores/uiStore.ts
interface UIState {
  modals: { [key: string]: boolean }
  loading: { [key: string]: boolean }
  notifications: Notification[]
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
}
```

---

## 🧪 Testing Strategy

### Manual Testing Checklist:

#### Phase 1 Testing:
- [ ] UI Components render correctly
- [ ] Tailwind CSS styles apply properly
- [ ] DaisyUI themes work
- [ ] Authentication flow works with mock data
- [ ] Protected routes redirect correctly
- [ ] Responsive design on mobile/desktop

#### Phase 2 Testing:
- [ ] Training plan displays correctly
- [ ] Session cards show proper information
- [ ] Status badges display correct colors
- [ ] Navigation between sessions works
- [ ] Tremor charts render properly

#### Phase 3 Testing:
- [ ] Workout log form validation works
- [ ] All form fields accept input correctly
- [ ] Form submission logs to console
- [ ] History page displays mock data
- [ ] Filters and search function properly

#### Phase 4 Testing:
- [ ] Coach dashboard shows runner list
- [ ] Runner cards display correct information
- [ ] Navigation to runner profiles works
- [ ] Quick actions are accessible
- [ ] Overview charts display data

#### Phase 5 Testing:
- [ ] Training plan creation form works
- [ ] Session builder functions properly
- [ ] Drag-and-drop reordering works
- [ ] Plan preview displays correctly
- [ ] Plan editing preserves data

#### Phase 6 Testing:
- [ ] Feedback form accepts rich text
- [ ] Comment threads display properly
- [ ] Notifications appear correctly
- [ ] Toast notifications work
- [ ] Real-time updates simulate properly

### Performance Testing:
- [ ] Page load times < 3 seconds
- [ ] Component rendering is smooth
- [ ] Large lists (100+ items) perform well
- [ ] Image loading is optimized
- [ ] Bundle size is reasonable

---

## 📱 Responsive Design Guidelines

### Breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach:
```css
/* Mobile first */
.component {
  @apply flex flex-col gap-2;
}

/* Tablet */
@screen md {
  .component {
    @apply flex-row gap-4;
  }
}

/* Desktop */
@screen lg {
  .component {
    @apply gap-6;
  }
}
```

### Key Responsive Features:
- Collapsible sidebar on mobile
- Stack cards vertically on mobile
- Horizontal scroll for tables on mobile
- Touch-friendly button sizes (min 44px)
- Readable font sizes (min 16px on mobile)

---

## 🎨 Design System

### Colors (DaisyUI):
```css
:root {
  --primary: #3b82f6;      /* Blue */
  --secondary: #10b981;    /* Green */
  --accent: #f59e0b;       /* Amber */
  --neutral: #374151;      /* Gray */
  --base-100: #ffffff;     /* White */
  --info: #0ea5e9;         /* Sky */
  --success: #22c55e;      /* Green */
  --warning: #f59e0b;      /* Amber */
  --error: #ef4444;        /* Red */
}
```

### Typography:
```css
.text-heading-1 { @apply text-3xl font-bold; }
.text-heading-2 { @apply text-2xl font-semibold; }
.text-heading-3 { @apply text-xl font-medium; }
.text-body { @apply text-base; }
.text-caption { @apply text-sm text-gray-600; }
```

### Spacing:
```css
.spacing-xs { @apply p-2; }
.spacing-sm { @apply p-4; }
.spacing-md { @apply p-6; }
.spacing-lg { @apply p-8; }
.spacing-xl { @apply p-12; }
```

---

## 🚀 Deployment Preparation

### Environment Variables:
```bash
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
LINE_CLIENT_ID=your-line-client-id
LINE_CLIENT_SECRET=your-line-client-secret
```

### Build Commands:
```bash
# Development
pnpm dev

# Build
pnpm build

# Start production
pnpm start

# Lint
pnpm lint

# Type check
pnpm type-check
```

### Vercel Deployment:
1. Connect GitHub repository
2. Set environment variables
3. Configure build settings:
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

---

## 📚 Resources & Documentation

### Official Documentation:
- [Next.js 14](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [DaisyUI](https://daisyui.com/)
- [Tremor](https://tremor.so/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [NextAuth.js](https://next-auth.js.org/)

### Useful Tools:
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
- [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)

---

*หมายเหตุ: แผนนี้ออกแบบมาให้ Frontend Developer สามารถทำงานได้อย่างอิสระโดยใช้ Mock Data ตั้งแต่วันแรก และค่อยๆ เชื่อมต่อกับ Backend API ในภายหลัง*