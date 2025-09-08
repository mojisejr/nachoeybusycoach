# 🎨 Frontend Implementation Plan: นาเชยไม่เคยมีโค้ชว่าง

## 📋 Overview

แผนการพัฒนา Frontend สำหรับแอปพลิเคชัน "นาเชยไม่เคยมีโค้ชว่าง" โดยแบ่งเป็น 6 วัน แต่ละวันแบ่งเป็น sub-phase เช้า-บ่าย ที่สามารถทำงานแยกจาก Backend ได้

## 🎯 Core Principles

- **Mock-First Approach**: ใช้ Mock Data ตั้งแต่วันแรกเพื่อไม่ต้องรอ Backend
- **Component-Driven**: สร้าง reusable components ที่ใช้ร่วมกันได้
- **Daily Completion**: แต่ละ sub-phase จบภายใน 1 วัน
- **Self-Testing**: สามารถทดสอบได้ด้วยตัวเองในแต่ละ phase

## 🛠 Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **Charts**: Tremor
- **Forms**: React Hook Form
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **Package Manager**: pnpm

---

## 📅 Implementation Timeline

## Phase 1: Foundation & Authentication (วันที่ 1)

### Sub-Phase 1.1: Project Setup & UI Foundation (เช้า)
**เป้าหมาย**: ตั้งค่าโปรเจกต์และสร้าง UI components พื้นฐาน

**งานที่ต้องทำ**:
- ตั้งค่า Next.js 14 project ใน `/apps/frontend`
- ติดตั้ง dependencies:
  ```bash
  pnpm add tailwindcss daisyui @tremor/react
  pnpm add react-hook-form @hookform/resolvers
  pnpm add zustand next-auth
  pnpm add -D @types/node typescript
  ```
- สร้าง shared UI components ใน `/packages/ui`:
  - `Button.tsx` - ปุ่มพื้นฐานพร้อม variants
  - `Card.tsx` - การ์ดสำหรับแสดงข้อมูล
  - `Input.tsx` - input field พร้อม validation
  - `Modal.tsx` - modal dialog
  - `Loading.tsx` - loading spinner
  - `Layout.tsx` - layout หลักพร้อม Header, Sidebar, Footer
- ตั้งค่า TypeScript types ใน `/packages/types`:
  - `User.ts` - user และ role types
  - `Training.ts` - training plan และ session types
  - `Workout.ts` - workout log types

**File Structure**:
```
/packages/ui/
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Loading.tsx
│   └── Layout.tsx
└── index.ts

/packages/types/
├── User.ts
├── Training.ts
├── Workout.ts
└── index.ts
```

**Manual Testing**:
- รัน `pnpm dev` และเช็คว่า UI components แสดงผลถูกต้อง
- ทดสอบ responsive design บนมือถือและเดสก์ท็อป
- ทดสอบ Tailwind CSS และ DaisyUI themes

### Sub-Phase 1.2: Authentication UI (บ่าย)
**เป้าหมาย**: สร้างหน้า Login และระบบ Authentication UI

**งานที่ต้องทำ**:
- สร้างหน้า Login (`/src/app/login/page.tsx`):
  - OAuth buttons สำหรับ Google, Facebook, Line
  - Loading states
  - Error handling
- ติดตั้งและตั้งค่า NextAuth.js:
  - สร้าง `/src/app/api/auth/[...nextauth]/route.ts`
  - ตั้งค่า providers (ใช้ mock ก่อน)
- สร้าง AuthProvider (`/src/providers/AuthProvider.tsx`)
- สร้าง useAuth hook (`/src/hooks/useAuth.ts`)
- สร้าง Protected Route wrapper (`/src/components/ProtectedRoute.tsx`)
- สร้างหน้า Dashboard พื้นฐาน:
  - `/src/app/dashboard/runner/page.tsx`
  - `/src/app/dashboard/coach/page.tsx`

**Mock Data**:
```typescript
// /src/lib/mockData.ts
export const mockUser = {
  id: '1',
  name: 'นักวิ่งทดสอบ',
  email: 'runner@test.com',
  role: 'runner', // หรือ 'coach'
  avatar: '/images/avatar-placeholder.png'
}

export const mockCoach = {
  id: '2',
  name: 'โค้ชทดสอบ',
  email: 'coach@test.com',
  role: 'coach',
  avatar: '/images/coach-placeholder.png'
}
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

**Mock Data**:
```typescript
export const mockTrainingPlan = {
  id: '1',
  runnerId: '1',
  week: '2024-W20',
  weekStart: '2024-05-13',
  sessions: [
    {
      id: '1',
      day: 'Monday',
      date: '2024-05-13',
      type: 'Easy Run',
      distance: '5km',
      duration: '30min',
      pace: '6:00/km',
      notes: 'วิ่งเบาๆ ผ่อนคลาย อย่าเร่งเครื่อง',
      status: 'pending'
    },
    {
      id: '2',
      day: 'Tuesday',
      date: '2024-05-14',
      type: 'Interval Training',
      distance: '8km',
      duration: '45min',
      pace: '4:30/km',
      notes: '400m x 8 reps, พัก 90 วินาที',
      status: 'pending'
    }
    // ... เพิ่มข้อมูลสำหรับทั้งสัปดาห์
  ]
}
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

**Mock Data**:
```typescript
export const mockWorkoutLog = {
  id: '1',
  sessionId: '1',
  status: 'completed',
  externalLink: 'https://strava.com/activities/123456789',
  actualDistance: 5.2,
  actualDuration: '28:45',
  actualPace: '5:32/km',
  notes: 'วิ่งได้ดีมาก รู้สึกแข็งแรง อากาศเย็นสบาย',
  feeling: 'good',
  injuries: [],
  weather: 'cloudy',
  temperature: 28,
  createdAt: '2024-05-13T18:30:00Z'
}
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

**Mock Data**:
```typescript
export const mockRunners = [
  {
    id: '1',
    name: 'นักวิ่ง A',
    email: 'runner-a@test.com',
    weeklyProgress: 85,
    pendingReviews: 2,
    lastActivity: '2024-05-15',
    totalSessions: 24,
    completedSessions: 20,
    avatar: '/images/runner-a.png'
  },
  {
    id: '2',
    name: 'นักวิ่ง B',
    email: 'runner-b@test.com',
    weeklyProgress: 60,
    pendingReviews: 1,
    lastActivity: '2024-05-14',
    totalSessions: 18,
    completedSessions: 11,
    avatar: '/images/runner-b.png'
  }
]
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

**Feedback Types**:
```typescript
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

**Notification Types**:
```typescript
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