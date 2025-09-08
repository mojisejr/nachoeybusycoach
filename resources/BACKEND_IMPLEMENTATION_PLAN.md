# ⚙️ Backend Implementation Plan: นาเชยไม่เคยมีโค้ชว่าง

## 📋 Overview

แผนการพัฒนา Backend สำหรับแอปพลิเคชัน "นาเชยไม่เคยมีโค้ชว่าง" โดยใช้ Sanity.io เป็น Headless CMS และ Next.js API Routes แบ่งเป็น 6 วัน แต่ละวันแบ่งเป็น sub-phase เช้า-บ่าย

## 🎯 Core Principles

- **API-First Design**: สร้าง API ที่ชัดเจนและใช้งานง่าย
- **Sanity-Powered**: ใช้ Sanity.io สำหรับ data management
- **Security-First**: ใส่ใจเรื่องความปลอดภัยตั้งแต่เริ่มต้น
- **Performance-Optimized**: ออกแบบให้รองรับผู้ใช้จำนวนมาก
- **Self-Testing**: สามารถทดสอบได้ด้วยตัวเองในแต่ละ phase

## 🛠 Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **CMS**: Sanity.io
- **Authentication**: NextAuth.js
- **API**: Next.js API Routes
- **Validation**: Zod
- **Caching**: Redis (optional)
- **Package Manager**: pnpm

---

## 📅 Implementation Timeline

## Phase 1: Foundation & Sanity Setup (วันที่ 1)

### Sub-Phase 1.1: Project Setup & Sanity Configuration (เช้า)
**เป้าหมาย**: ตั้งค่าโปรเจกต์และ Sanity CMS

**งานที่ต้องทำ**:
- ตั้งค่า Next.js project ใน `/apps/backend`
- ติดตั้ง dependencies:
  ```bash
  pnpm add @sanity/client @sanity/image-url
  pnpm add next-auth @auth/sanity-adapter
  pnpm add zod
  pnpm add -D @sanity/cli
  ```
- สร้าง Sanity project:
  ```bash
  npx @sanity/cli init
  ```
- ตั้งค่า environment variables:
  ```bash
  # .env.local
  SANITY_PROJECT_ID=your-project-id
  SANITY_DATASET=production
  SANITY_API_TOKEN=your-api-token
  SANITY_STUDIO_URL=http://localhost:3333
  ```
- สร้าง Sanity client configuration:
  ```typescript
  // lib/sanity.ts
  import { createClient } from '@sanity/client'
  
  export const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET!,
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    apiVersion: '2024-01-01'
  })
  ```

**Manual Testing**:
- รัน `pnpm sanity dev` และเช็คว่า Sanity Studio เข้าถึงได้
- ทดสอบการเชื่อมต่อกับ Sanity API
- ทดสอบ environment variables

### Sub-Phase 1.2: Schema Definition (บ่าย)
**เป้าหมาย**: สร้าง Sanity schemas ตาม PRD

**งานที่ต้องทำ**:
- สร้าง schema files ใน `/sanity/schemas/`:

**User Schema** (`/sanity/schemas/user.ts`):
```typescript
export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Runner', value: 'runner' },
          { title: 'Coach', value: 'coach' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'avatar',
      title: 'Avatar',
      type: 'image'
    },
    {
      name: 'profile',
      title: 'Profile',
      type: 'object',
      fields: [
        { name: 'age', title: 'Age', type: 'number' },
        { name: 'weight', title: 'Weight (kg)', type: 'number' },
        { name: 'height', title: 'Height (cm)', type: 'number' },
        { name: 'experience', title: 'Running Experience', type: 'string' },
        { name: 'goals', title: 'Goals', type: 'text' }
      ]
    },
    {
      name: 'coachId',
      title: 'Coach',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: Rule => Rule.custom((coachId, context) => {
        if (context.document?.role === 'runner' && !coachId) {
          return 'Runner must have a coach'
        }
        return true
      })
    }
  ]
}
```

**TrainingPlan Schema** (`/sanity/schemas/trainingPlan.ts`):
```typescript
export default {
  name: 'trainingPlan',
  title: 'Training Plan',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'runnerId',
      title: 'Runner',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'coachId',
      title: 'Coach',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'weekStart',
      title: 'Week Start Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'weekEnd',
      title: 'Week End Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Active', value: 'active' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' }
        ]
      },
      initialValue: 'draft'
    }
  ]
}
```

**TrainingSession Schema** (`/sanity/schemas/trainingSession.ts`):
```typescript
export default {
  name: 'trainingSession',
  title: 'Training Session',
  type: 'document',
  fields: [
    {
      name: 'planId',
      title: 'Training Plan',
      type: 'reference',
      to: [{ type: 'trainingPlan' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'day',
      title: 'Day of Week',
      type: 'string',
      options: {
        list: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday',
          'Friday', 'Saturday', 'Sunday'
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'type',
      title: 'Session Type',
      type: 'string',
      options: {
        list: [
          { title: 'Easy Run', value: 'easy' },
          { title: 'Interval Training', value: 'interval' },
          { title: 'Tempo Run', value: 'tempo' },
          { title: 'Long Run', value: 'long' },
          { title: 'Recovery Run', value: 'recovery' },
          { title: 'Rest Day', value: 'rest' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'distance',
      title: 'Distance',
      type: 'string'
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'string'
    },
    {
      name: 'pace',
      title: 'Target Pace',
      type: 'string'
    },
    {
      name: 'notes',
      title: 'Notes',
      type: 'text'
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    }
  ]
}
```

**WorkoutLog Schema** (`/sanity/schemas/workoutLog.ts`):
```typescript
export default {
  name: 'workoutLog',
  title: 'Workout Log',
  type: 'document',
  fields: [
    {
      name: 'sessionId',
      title: 'Training Session',
      type: 'reference',
      to: [{ type: 'trainingSession' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'runnerId',
      title: 'Runner',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Completed', value: 'completed' },
          { title: 'Did Not Finish (DNF)', value: 'dnf' },
          { title: 'Undone', value: 'undone' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'externalLink',
      title: 'External Link (Garmin/Strava)',
      type: 'url'
    },
    {
      name: 'actualDistance',
      title: 'Actual Distance (km)',
      type: 'number'
    },
    {
      name: 'actualDuration',
      title: 'Actual Duration',
      type: 'string'
    },
    {
      name: 'actualPace',
      title: 'Actual Pace',
      type: 'string'
    },
    {
      name: 'notes',
      title: 'Notes',
      type: 'text'
    },
    {
      name: 'feeling',
      title: 'Feeling',
      type: 'string',
      options: {
        list: [
          { title: 'Excellent', value: 'excellent' },
          { title: 'Good', value: 'good' },
          { title: 'Okay', value: 'okay' },
          { title: 'Tired', value: 'tired' },
          { title: 'Exhausted', value: 'exhausted' }
        ]
      }
    },
    {
      name: 'injuries',
      title: 'Injuries',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'weather',
      title: 'Weather',
      type: 'string'
    },
    {
      name: 'temperature',
      title: 'Temperature (°C)',
      type: 'number'
    }
  ]
}
```

**Feedback Schema** (`/sanity/schemas/feedback.ts`):
```typescript
export default {
  name: 'feedback',
  title: 'Feedback',
  type: 'document',
  fields: [
    {
      name: 'workoutLogId',
      title: 'Workout Log',
      type: 'reference',
      to: [{ type: 'workoutLog' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'authorId',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'content',
      title: 'Content',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Praise', value: 'praise' },
          { title: 'Suggestion', value: 'suggestion' },
          { title: 'Concern', value: 'concern' },
          { title: 'Question', value: 'question' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'attachments',
      title: 'Attachments',
      type: 'array',
      of: [{ type: 'image' }, { type: 'file' }]
    },
    {
      name: 'parentId',
      title: 'Parent Feedback (for replies)',
      type: 'reference',
      to: [{ type: 'feedback' }]
    }
  ]
}
```

**Manual Testing**:
- ทดสอบการสร้างข้อมูลใน Sanity Studio
- ทดสอบ relationships ระหว่าง documents
- ทดสอบ data validation
- ทดสอบ required fields

## Phase 2: Authentication & User Management (วันที่ 2)

### Sub-Phase 2.1: NextAuth.js Setup (เช้า)
**เป้าหมาย**: ตั้งค่าระบบ Authentication

**งานที่ต้องทำ**:
- ติดตั้งและตั้งค่า NextAuth.js:
  ```bash
  pnpm add next-auth @auth/sanity-adapter
  ```
- สร้าง NextAuth configuration (`/src/app/api/auth/[...nextauth]/route.ts`):
  ```typescript
  import NextAuth from 'next-auth'
  import GoogleProvider from 'next-auth/providers/google'
  import FacebookProvider from 'next-auth/providers/facebook'
  import { SanityAdapter } from '@auth/sanity-adapter'
  import { client } from '@/lib/sanity'
  
  const handler = NextAuth({
    adapter: SanityAdapter(client),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      }),
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
      })
    ],
    callbacks: {
      session: async ({ session, token }) => {
        if (session?.user?.email) {
          const user = await client.fetch(
            `*[_type == "user" && email == $email][0]`,
            { email: session.user.email }
          )
          session.user.role = user?.role || 'runner'
          session.user.id = user?._id
        }
        return session
      }
    },
    pages: {
      signIn: '/login',
      error: '/auth/error'
    }
  })
  
  export { handler as GET, handler as POST }
  ```

- สร้าง middleware สำหรับ authentication (`/src/middleware.ts`):
  ```typescript
  import { withAuth } from 'next-auth/middleware'
  
  export default withAuth(
    function middleware(req) {
      // Add custom logic here
    },
    {
      callbacks: {
        authorized: ({ token, req }) => {
          // Check if user is authenticated
          return !!token
        }
      }
    }
  )
  
  export const config = {
    matcher: ['/api/protected/:path*', '/dashboard/:path*']
  }
  ```

**Manual Testing**:
- ทดสอบการ login ด้วย OAuth providers (ใช้ test accounts)
- ทดสอบการสร้าง user profile ใน Sanity
- ทดสอบ session persistence
- ทดสอบ middleware protection

### Sub-Phase 2.2: User API Endpoints (บ่าย)
**เป้าหมาย**: สร้าง API endpoints สำหรับจัดการ users

**งานที่ต้องทำ**:
- สร้าง validation schemas (`/src/lib/validations/user.ts`):
  ```typescript
  import { z } from 'zod'
  
  export const userProfileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    role: z.enum(['runner', 'coach']),
    profile: z.object({
      age: z.number().min(1).max(100).optional(),
      weight: z.number().min(1).max(200).optional(),
      height: z.number().min(1).max(250).optional(),
      experience: z.string().optional(),
      goals: z.string().optional()
    }).optional()
  })
  
  export type UserProfile = z.infer<typeof userProfileSchema>
  ```

- สร้าง API endpoints:

**Get User Profile** (`/src/app/api/users/profile/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { client } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await client.fetch(
      `*[_type == "user" && email == $email][0] {
        _id,
        name,
        email,
        role,
        avatar,
        profile,
        "coach": coachId->{
          _id,
          name,
          email
        }
      }`,
      { email: session.user.email }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Update User Profile** (`/src/app/api/users/profile/route.ts`):
```typescript
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = userProfileSchema.parse(body)

    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: session.user.email }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const updatedUser = await client
      .patch(user._id)
      .set(validatedData)
      .commit()

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Get User Role** (`/src/app/api/users/role/route.ts`):
```typescript
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await client.fetch(
      `*[_type == "user" && email == $email][0] { role }`,
      { email: session.user.email }
    )

    return NextResponse.json({ role: user?.role || 'runner' })
  } catch (error) {
    console.error('Error fetching user role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Manual Testing**:
- ทดสอบ API endpoints ด้วย Postman/curl
- ทดสอบ authentication middleware
- ทดสอบ data validation
- ทดสอบ error responses

## Phase 3: Training Plan Management APIs (วันที่ 3)

### Sub-Phase 3.1: Training Plan CRUD (เช้า)
**เป้าหมาย**: สร้าง API สำหรับจัดการแผนการฝึกซ้อม

**งานที่ต้องทำ**:
- สร้าง validation schemas (`/src/lib/validations/trainingPlan.ts`):
  ```typescript
  import { z } from 'zod'
  
  export const trainingPlanSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    runnerId: z.string().min(1, 'Runner ID is required'),
    weekStart: z.string().datetime(),
    weekEnd: z.string().datetime(),
    status: z.enum(['draft', 'active', 'completed', 'cancelled']).default('draft')
  })
  
  export type TrainingPlan = z.infer<typeof trainingPlanSchema>
  ```

- สร้าง API endpoints:

**Get Training Plans** (`/src/app/api/training-plans/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { client } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const runnerId = searchParams.get('runnerId')
    const status = searchParams.get('status')

    let query = `*[_type == "trainingPlan"`
    const params: any = {}

    if (runnerId) {
      query += ` && runnerId._ref == $runnerId`
      params.runnerId = runnerId
    }

    if (status) {
      query += ` && status == $status`
      params.status = status
    }

    query += `] {
      _id,
      title,
      description,
      weekStart,
      weekEnd,
      status,
      "runner": runnerId->{
        _id,
        name,
        email
      },
      "coach": coachId->{
        _id,
        name,
        email
      },
      "sessions": *[_type == "trainingSession" && planId._ref == ^._id] | order(order asc)
    } | order(weekStart desc)`

    const plans = await client.fetch(query, params)

    return NextResponse.json({ plans })
  } catch (error) {
    console.error('Error fetching training plans:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Create Training Plan** (`/src/app/api/training-plans/route.ts`):
```typescript
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is a coach
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0] { role }`,
      { email: session.user.email }
    )

    if (user?.role !== 'coach') {
      return NextResponse.json(
        { error: 'Only coaches can create training plans' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = trainingPlanSchema.parse(body)

    const plan = await client.create({
      _type: 'trainingPlan',
      ...validatedData,
      coachId: {
        _type: 'reference',
        _ref: user._id
      },
      runnerId: {
        _type: 'reference',
        _ref: validatedData.runnerId
      }
    })

    return NextResponse.json({ plan }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating training plan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Manual Testing**:
- ทดสอบการสร้างแผนการฝึกซ้อม
- ทดสอบการ query แผนตาม runner
- ทดสอบ authorization (coach only)
- ทดสอบ data validation

### Sub-Phase 3.2: Training Session APIs (บ่าย)
**เป้าหมาย**: สร้าง API สำหรับจัดการ training sessions

**งานที่ต้องทำ**:
- สร้าง validation schemas (`/src/lib/validations/trainingSession.ts`):
  ```typescript
  export const trainingSessionSchema = z.object({
    planId: z.string().min(1, 'Plan ID is required'),
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    date: z.string().datetime(),
    type: z.enum(['easy', 'interval', 'tempo', 'long', 'recovery', 'rest']),
    distance: z.string().optional(),
    duration: z.string().optional(),
    pace: z.string().optional(),
    notes: z.string().optional(),
    order: z.number().min(0)
  })
  ```

- สร้าง API endpoints สำหรับ sessions:

**Get Sessions** (`/src/app/api/sessions/route.ts`):
```typescript
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('planId')

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      )
    }

    const sessions = await client.fetch(
      `*[_type == "trainingSession" && planId._ref == $planId] {
        _id,
        day,
        date,
        type,
        distance,
        duration,
        pace,
        notes,
        order,
        "plan": planId->{
          _id,
          title
        }
      } | order(order asc)`,
      { planId }
    )

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Create Session** (`/src/app/api/sessions/route.ts`):
```typescript
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = trainingSessionSchema.parse(body)

    const trainingSession = await client.create({
      _type: 'trainingSession',
      ...validatedData,
      planId: {
        _type: 'reference',
        _ref: validatedData.planId
      }
    })

    return NextResponse.json({ session: trainingSession }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Bulk Create Sessions** (`/src/app/api/sessions/bulk/route.ts`):
```typescript
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { planId, sessions } = body

    if (!planId || !Array.isArray(sessions)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const validatedSessions = sessions.map(s => 
      trainingSessionSchema.parse({ ...s, planId })
    )

    const createdSessions = await Promise.all(
      validatedSessions.map(sessionData => 
        client.create({
          _type: 'trainingSession',
          ...sessionData,
          planId: {
            _type: 'reference',
            _ref: planId
          }
        })
      )
    )

    return NextResponse.json({ sessions: createdSessions }, { status: 201 })
  } catch (error) {
    console.error('Error creating bulk sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Manual Testing**:
- ทดสอบการสร้าง/แก้ไข sessions
- ทดสอบ bulk operations
- ทดสอบการ query sessions ตาม plan
- ทดสอบ data validation

## Phase 4: Workout Logging APIs (วันที่ 4)

### Sub-Phase 4.1: Workout Log CRUD (เช้า)
**เป้าหมาย**: สร้าง API สำหรับบันทึกการซ้อม

**งานที่ต้องทำ**:
- สร้าง validation schemas (`/src/lib/validations/workoutLog.ts`):
  ```typescript
  export const workoutLogSchema = z.object({
    sessionId: z.string().min(1, 'Session ID is required'),
    status: z.enum(['completed', 'dnf', 'undone']),
    externalLink: z.string().url().optional(),
    actualDistance: z.number().positive().optional(),
    actualDuration: z.string().optional(),
    actualPace: z.string().optional(),
    notes: z.string().optional(),
    feeling: z.enum(['excellent', 'good', 'okay', 'tired', 'exhausted']).optional(),
    injuries: z.array(z.string()).default([]),
    weather: z.string().optional(),
    temperature: z.number().optional()
  })
  ```

- สร้าง API endpoints:

**Get Workout Logs** (`/src/app/api/workout-logs/route.ts`):
```typescript
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const runnerId = searchParams.get('runnerId')

    let query = `*[_type == "workoutLog"`
    const params: any = {}

    if (sessionId) {
      query += ` && sessionId._ref == $sessionId`
      params.sessionId = sessionId
    }

    if (runnerId) {
      query += ` && runnerId._ref == $runnerId`
      params.runnerId = runnerId
    }

    query += `] {
      _id,
      status,
      externalLink,
      actualDistance,
      actualDuration,
      actualPace,
      notes,
      feeling,
      injuries,
      weather,
      temperature,
      _createdAt,
      _updatedAt,
      "session": sessionId->{
        _id,
        day,
        date,
        type,
        distance,
        duration,
        pace
      },
      "runner": runnerId->{
        _id,
        name,
        email
      }
    } | order(_createdAt desc)`

    const logs = await client.fetch(query, params)

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Error fetching workout logs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Create Workout Log** (`/src/app/api/workout-logs/route.ts`):
```typescript
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: session.user.email }
    )

    const body = await request.json()
    const validatedData = workoutLogSchema.parse(body)

    // Check if log already exists for this session
    const existingLog = await client.fetch(
      `*[_type == "workoutLog" && sessionId._ref == $sessionId && runnerId._ref == $runnerId][0]`,
      { sessionId: validatedData.sessionId, runnerId: user._id }
    )

    if (existingLog) {
      return NextResponse.json(
        { error: 'Workout log already exists for this session' },
        { status: 409 }
      )
    }

    const workoutLog = await client.create({
      _type: 'workoutLog',
      ...validatedData,
      sessionId: {
        _type: 'reference',
        _ref: validatedData.sessionId
      },
      runnerId: {
        _type: 'reference',
        _ref: user._id
      }
    })

    return NextResponse.json({ log: workoutLog }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating workout log:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Manual Testing**:
- ทดสอบการบันทึก workout logs
- ทดสอบการป้องกัน duplicate logs
- ทดสอบ data validation
- ทดสอบการ query logs

### Sub-Phase 4.2: History & Analytics APIs (บ่าย)
**เป้าหมาย**: สร้าง API สำหรับประวัติและการวิเคราะห์

**งานที่ต้องทำ**:
- สร้าง API endpoints:

**Get Workout History** (`/src/app/api/workout-logs/history/route.ts`):
```typescript
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const runnerId = searchParams.get('runnerId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = `*[_type == "workoutLog"`
    const params: any = {}

    if (runnerId) {
      query += ` && runnerId._ref == $runnerId`
      params.runnerId = runnerId
    }

    if (startDate) {
      query += ` && _createdAt >= $startDate`
      params.startDate = startDate
    }

    if (endDate) {
      query += ` && _createdAt <= $endDate`
      params.endDate = endDate
    }

    if (status) {
      query += ` && status == $status`
      params.status = status
    }

    const offset = (page - 1) * limit
    query += `] | order(_createdAt desc) [$offset...$end]`
    params.offset = offset
    params.end = offset + limit - 1

    const logs = await client.fetch(query, params)

    // Get total count for pagination
    const totalQuery = query.replace(/\| order.*$/, '') + '] | length'
    const total = await client.fetch(totalQuery, params)

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching workout history:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Get Runner Analytics** (`/src/app/api/analytics/runner/[id]/route.ts`):
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const runnerId = params.id

    // Get basic stats
    const stats = await client.fetch(
      `{
        "totalSessions": count(*[_type == "trainingSession" && planId->runnerId._ref == $runnerId]),
        "completedLogs": count(*[_type == "workoutLog" && runnerId._ref == $runnerId && status == "completed"]),
        "totalDistance": sum(*[_type == "workoutLog" && runnerId._ref == $runnerId && status == "completed"].actualDistance),
        "averageFeeling": avg(*[_type == "workoutLog" && runnerId._ref == $runnerId && feeling != null] | {
          "feelingScore": select(
            feeling == "excellent" => 5,
            feeling == "good" => 4,
            feeling == "okay" => 3,
            feeling == "tired" => 2,
            feeling == "exhausted" => 1
          )
        }.feelingScore),
        "weeklyStats": *[_type == "workoutLog" && runnerId._ref == $runnerId && _createdAt > now() - 60*60*24*30] {
          _createdAt,
          status,
          actualDistance,
          feeling
        } | order(_createdAt desc)
      }`,
      { runnerId }
    )

    return NextResponse.json({ analytics: stats })
  } catch (error) {
    console.error('Error fetching runner analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Manual Testing**:
- ทดสอบการ query ประวัติ
- ทดสอบ pagination
- ทดสอบ analytics data
- ทดสอบ performance ของ queries

## Phase 5: Feedback & Communication APIs (วันที่ 5)

### Sub-Phase 5.1: Feedback System (เช้า)
**เป้าหมาย**: สร้าง API สำหรับระบบ feedback

**งานที่ต้องทำ**:
- สร้าง validation schemas (`/src/lib/validations/feedback.ts`):
  ```typescript
  export const feedbackSchema = z.object({
    workoutLogId: z.string().min(1, 'Workout log ID is required'),
    content: z.string().min(1, 'Content is required'),
    type: z.enum(['praise', 'suggestion', 'concern', 'question']),
    parentId: z.string().optional()
  })
  ```

- สร้าง API endpoints:

**Get Feedback** (`/src/app/api/feedback/route.ts`):
```typescript
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const workoutLogId = searchParams.get('workoutLogId')

    if (!workoutLogId) {
      return NextResponse.json(
        { error: 'Workout log ID is required' },
        { status: 400 }
      )
    }

    const feedback = await client.fetch(
      `*[_type == "feedback" && workoutLogId._ref == $workoutLogId] {
        _id,
        content,
        type,
        _createdAt,
        _updatedAt,
        "author": authorId->{
          _id,
          name,
          email,
          role,
          avatar
        },
        "parent": parentId->{
          _id,
          content,
          "author": authorId->{
            _id,
            name,
            role
          }
        },
        "replies": *[_type == "feedback" && parentId._ref == ^._id] {
          _id,
          content,
          type,
          _createdAt,
          "author": authorId->{
            _id,
            name,
            email,
            role,
            avatar
          }
        } | order(_createdAt asc)
      } | order(_createdAt asc)`,
      { workoutLogId }
    )

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Create Feedback** (`/src/app/api/feedback/route.ts`):
```typescript
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: session.user.email }
    )

    const body = await request.json()
    const validatedData = feedbackSchema.parse(body)

    const feedback = await client.create({
      _type: 'feedback',
      ...validatedData,
      workoutLogId: {
        _type: 'reference',
        _ref: validatedData.workoutLogId
      },
      authorId: {
        _type: 'reference',
        _ref: user._id
      },
      ...(validatedData.parentId && {
        parentId: {
          _type: 'reference',
          _ref: validatedData.parentId
        }
      })
    })

    // Create notification for the recipient
    await createNotification({
      type: 'new_feedback',
      workoutLogId: validatedData.workoutLogId,
      authorId: user._id
    })

    return NextResponse.json({ feedback }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating feedback:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Manual Testing**:
- ทดสอบการสร้าง/แก้ไข feedback
- ทดสอบ comment threads
- ทดสอบ nested replies
- ทดสอบ notification creation

### Sub-Phase 5.2: Notification System (บ่าย)
**เป้าหมาย**: สร้างระบบแจ้งเตือน

**งานที่ต้องทำ**:
- สร้าง Notification schema (`/sanity/schemas/notification.ts`):
  ```typescript
  export default {
    name: 'notification',
    title: 'Notification',
    type: 'document',
    fields: [
      {
        name: 'userId',
        title: 'User',
        type: 'reference',
        to: [{ type: 'user' }],
        validation: Rule => Rule.required()
      },
      {
        name: 'type',
        title: 'Type',
        type: 'string',
        options: {
          list: [
            { title: 'New Feedback', value: 'new_feedback' },
            { title: 'Plan Assigned', value: 'plan_assigned' },
            { title: 'Workout Completed', value: 'workout_completed' },
            { title: 'Plan Updated', value: 'plan_updated' },
            { title: 'Reminder', value: 'reminder' }
          ]
        },
        validation: Rule => Rule.required()
      },
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: Rule => Rule.required()
      },
      {
        name: 'message',
        title: 'Message',
        type: 'text',
        validation: Rule => Rule.required()
      },
      {
        name: 'read',
        title: 'Read',
        type: 'boolean',
        initialValue: false
      },
      {
        name: 'actionUrl',
        title: 'Action URL',
        type: 'string'
      },
      {
        name: 'metadata',
        title: 'Metadata',
        type: 'object',
        fields: [
          { name: 'workoutLogId', type: 'string' },
          { name: 'planId', type: 'string' },
          { name: 'sessionId', type: 'string' }
        ]
      }
    ]
  }
  ```

- สร้าง notification helper (`/src/lib/notifications.ts`):
  ```typescript
  import { client } from './sanity'
  
  interface CreateNotificationParams {
    type: string
    workoutLogId?: string
    planId?: string
    sessionId?: string
    authorId: string
  }
  
  export async function createNotification(params: CreateNotificationParams) {
    try {
      let title = ''
      let message = ''
      let actionUrl = ''
      let recipientId = ''
  
      switch (params.type) {
        case 'new_feedback':
          if (params.workoutLogId) {
            const workoutLog = await client.fetch(
              `*[_type == "workoutLog" && _id == $id][0] {
                "runner": runnerId->{ _id, name },
                "coach": sessionId->planId->coachId->{ _id, name }
              }`,
              { id: params.workoutLogId }
            )
            
            // Determine recipient (if author is coach, notify runner and vice versa)
            const author = await client.fetch(
              `*[_type == "user" && _id == $id][0] { role, name }`,
              { id: params.authorId }
            )
            
            if (author.role === 'coach') {
              recipientId = workoutLog.runner._id
              title = 'ได้รับ feedback จากโค้ช'
              message = `โค้ช ${author.name} ได้ให้ feedback เกี่ยวกับการซ้อมของคุณ`
            } else {
              recipientId = workoutLog.coach._id
              title = 'ได้รับ feedback จากนักวิ่ง'
              message = `${author.name} ได้ให้ feedback เกี่ยวกับการซ้อม`
            }
            
            actionUrl = `/workout-log/${params.workoutLogId}`
          }
          break
          
        case 'plan_assigned':
          // Handle plan assignment notification
          break
          
        case 'workout_completed':
          // Handle workout completion notification
          break
      }
  
      if (recipientId) {
        await client.create({
          _type: 'notification',
          userId: {
            _type: 'reference',
            _ref: recipientId
          },
          type: params.type,
          title,
          message,
          actionUrl,
          metadata: {
            workoutLogId: params.workoutLogId,
            planId: params.planId,
            sessionId: params.sessionId
          }
        })
      }
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }
  ```

- สร้าง API endpoints:

**Get Notifications** (`/src/app/api/notifications/route.ts`):
```typescript
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: session.user.email }
    )

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = `*[_type == "notification" && userId._ref == $userId`
    
    if (unreadOnly) {
      query += ` && read == false`
    }
    
    query += `] | order(_createdAt desc) [0...$limit]`

    const notifications = await client.fetch(query, {
      userId: user._id,
      limit: limit - 1
    })

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Mark as Read** (`/src/app/api/notifications/[id]/read/route.ts`):
```typescript
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const notificationId = params.id

    const notification = await client
      .patch(notificationId)
      .set({ read: true })
      .commit()

    return NextResponse.json({ notification })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Manual Testing**:
- ทดสอบการสร้าง notifications
- ทดสอบการ mark as read
- ทดสอบ notification queries
- ทดสอบ real-time updates (ถ้ามี)

## Phase 6: Performance & Security (วันที่ 6)

### Sub-Phase 6.1: Performance Optimization (เช้า)
**เป้าหมาย**: ปรับปรุงประสิทธิภาพของ API

**งานที่ต้องทำ**:
- สร้าง caching layer (`/src/lib/cache.ts`):
  ```typescript
  import { client } from './sanity'
  
  // Simple in-memory cache
  const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  
  export async function getCachedData<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 300000 // 5 minutes default
  ): Promise<T> {
    const cached = cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data
    }
    
    const data = await fetcher()
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
    
    return data
  }
  
  export function invalidateCache(pattern?: string) {
    if (pattern) {
      for (const key of cache.keys()) {
        if (key.includes(pattern)) {
          cache.delete(key)
        }
      }
    } else {
      cache.clear()
    }
  }
  ```

- สร้าง rate limiting middleware (`/src/lib/rateLimit.ts`):
  ```typescript
  import { NextRequest, NextResponse } from 'next/server'
  
  const requests = new Map<string, { count: number; resetTime: number }>()
  
  export function rateLimit({
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100 // limit each IP to 100 requests per windowMs
  } = {}) {
    return (request: NextRequest) => {
      const ip = request.ip || 'unknown'
      const now = Date.now()
      const windowStart = now - windowMs
      
      // Clean old entries
      for (const [key, value] of requests.entries()) {
        if (value.resetTime < now) {
          requests.delete(key)
        }
      }
      
      const current = requests.get(ip) || { count: 0, resetTime: now + windowMs }
      
      if (current.resetTime < now) {
        current.count = 1
        current.resetTime = now + windowMs
      } else {
        current.count++
      }
      
      requests.set(ip, current)
      
      if (current.count > max) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        )
      }
      
      return null // Allow request
    }
  }
  ```

- ปรับปรุง API endpoints ให้ใช้ caching:
  ```typescript
  // Example: Cached training plans
  export async function GET(request: NextRequest) {
    const rateLimitResult = rateLimit()(request)
    if (rateLimitResult) return rateLimitResult
    
    const { searchParams } = new URL(request.url)
    const runnerId = searchParams.get('runnerId')
    
    const cacheKey = `training-plans-${runnerId}`
    
    const plans = await getCachedData(
      cacheKey,
      () => client.fetch(/* your query */),
      300000 // 5 minutes
    )
    
    return NextResponse.json({ plans })
  }
  ```

**Manual Testing**:
- ทดสอบ response times
- ทดสอบ caching behavior
- ทดสอบ rate limiting
- ทดสอบ concurrent requests

### Sub-Phase 6.2: Security & Validation (บ่าย)
**เป้าหมาย**: เสริมความปลอดภัยและ validation

**งานที่ต้องทำ**:
- สร้าง security middleware (`/src/lib/security.ts`):
  ```typescript
  import { NextRequest, NextResponse } from 'next/server'
  import { getServerSession } from 'next-auth'
  import { client } from './sanity'
  
  export async function requireAuth(request: NextRequest) {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    return session
  }
  
  export async function requireRole(request: NextRequest, allowedRoles: string[]) {
    const session = await requireAuth(request)
    
    if (session instanceof NextResponse) {
      return session // Return error response
    }
    
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0] { role }`,
      { email: session.user.email }
    )
    
    if (!allowedRoles.includes(user?.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    return { session, user }
  }
  
  export function sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input.trim().replace(/<script[^>]*>.*?<\/script>/gi, '')
    }
    
    if (Array.isArray(input)) {
      return input.map(sanitizeInput)
    }
    
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = sanitizeInput(value)
      }
      return sanitized
    }
    
    return input
  }
  ```

- สร้าง API response wrapper (`/src/lib/apiResponse.ts`):
  ```typescript
  import { NextResponse } from 'next/server'
  
  export function successResponse(data: any, status: number = 200) {
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    }, { status })
  }
  
  export function errorResponse(
    message: string,
    status: number = 500,
    details?: any
  ) {
    return NextResponse.json({
      success: false,
      error: {
        message,
        details,
        timestamp: new Date().toISOString()
      }
    }, { status })
  }
  
  export function validationErrorResponse(errors: any[]) {
    return errorResponse(
      'Validation failed',
      400,
      { validationErrors: errors }
    )
  }
  ```

- สร้าง logging system (`/src/lib/logger.ts`):
  ```typescript
  export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug'
  }
  
  export function log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      meta
    }
    
    // In production, send to external logging service
    if (process.env.NODE_ENV === 'production') {
      // Send to logging service (e.g., Sentry, LogRocket)
    } else {
      console.log(JSON.stringify(logEntry, null, 2))
    }
  }
  
  export const logger = {
    error: (message: string, meta?: any) => log(LogLevel.ERROR, message, meta),
    warn: (message: string, meta?: any) => log(LogLevel.WARN, message, meta),
    info: (message: string, meta?: any) => log(LogLevel.INFO, message, meta),
    debug: (message: string, meta?: any) => log(LogLevel.DEBUG, message, meta)
  }
  ```

**Manual Testing**:
- ทดสอบ authentication/authorization
- ทดสอบ input sanitization
- ทดสอบ error handling
- ทดสอบ logging functionality

---

## 🔗 Integration Points

### API Contracts

**Authentication**:
- `POST /api/auth/signin` - OAuth login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session

**Users**:
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/role` - Get user role

**Training Plans**:
- `GET /api/training-plans` - Get training plans
- `POST /api/training-plans` - Create training plan (coach only)
- `PUT /api/training-plans/[id]` - Update training plan
- `DELETE /api/training-plans/[id]` - Delete training plan

**Training Sessions**:
- `GET /api/sessions` - Get sessions by plan
- `POST /api/sessions` - Create session
- `POST /api/sessions/bulk` - Create multiple sessions
- `PUT /api/sessions/[id]` - Update session
- `DELETE /api/sessions/[id]` - Delete session

**Workout Logs**:
- `GET /api/workout-logs` - Get workout logs
- `POST /api/workout-logs` - Create workout log
- `PUT /api/workout-logs/[id]` - Update workout log
- `GET /api/workout-logs/history` - Get workout history

**Feedback**:
- `GET /api/feedback` - Get feedback by workout log
- `POST /api/feedback` - Create feedback
- `PUT /api/feedback/[id]` - Update feedback

**Notifications**:
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/[id]/read` - Mark as read

**Analytics**:
- `GET /api/analytics/runner/[id]` - Get runner analytics
- `GET /api/analytics/coach/[id]` - Get coach analytics

### Response Formats

**Success Response**:
```json
{
  "success": true,
  "data": { /* response data */ },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": { /* additional error info */ },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🧪 Testing Strategy

### Manual Testing Checklist

**Day 1 - Foundation**:
- [ ] Sanity Studio accessible
- [ ] Environment variables working
- [ ] Schemas created successfully
- [ ] Basic CRUD operations in Studio

**Day 2 - Authentication**:
- [ ] OAuth login working
- [ ] Session persistence
- [ ] User profile creation
- [ ] Role-based access

**Day 3 - Training Plans**:
- [ ] Create/read training plans
- [ ] Coach-only restrictions
- [ ] Session management
- [ ] Bulk operations

**Day 4 - Workout Logs**:
- [ ] Log creation/updates
- [ ] History queries
- [ ] Analytics calculations
- [ ] Data validation

**Day 5 - Communication**:
- [ ] Feedback system
- [ ] Notification creation
- [ ] Real-time updates
- [ ] Comment threads

**Day 6 - Performance**:
- [ ] Response times < 500ms
- [ ] Rate limiting working
- [ ] Caching effective
- [ ] Security measures active

### API Testing Tools

**Postman Collection**:
```json
{
  "info": {
    "name": "นาเชยไม่เคยมีโค้ชว่าง API",
    "description": "Backend API testing collection"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{auth_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api"
    }
  ]
}
```

---

## 📊 Success Metrics

### Performance Targets
- API response time: < 500ms (95th percentile)
- Database query time: < 200ms
- Concurrent users: 100+
- Uptime: 99.9%

### Security Checklist
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Authentication required for protected routes
- [ ] Role-based authorization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CORS properly configured

### Code Quality
- [ ] TypeScript strict mode
- [ ] Zod validation schemas
- [ ] Error handling in all endpoints
- [ ] Consistent API response format
- [ ] Proper logging implementation

---

## 🚀 Deployment Preparation

### Environment Variables
```bash
# Sanity
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
SANITY_STUDIO_URL=https://your-studio.sanity.studio

# NextAuth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379
```

### Vercel Deployment
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "SANITY_PROJECT_ID": "@sanity-project-id",
    "SANITY_DATASET": "@sanity-dataset",
    "SANITY_API_TOKEN": "@sanity-api-token"
  }
}
```

---

## 📚 Resources

### Documentation
- [Sanity.io Documentation](https://www.sanity.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Zod Validation](https://zod.dev/)

### Useful Commands
```bash
# Development
pnpm dev                    # Start development server
pnpm sanity dev            # Start Sanity Studio
pnpm type-check            # TypeScript checking
pnpm lint                  # ESLint checking

# Production
pnpm build                 # Build for production
pnpm start                 # Start production server
pnpm sanity deploy         # Deploy Sanity Studio

# Database
pnpm sanity dataset export # Export dataset
pnpm sanity dataset import # Import dataset
pnpm sanity migration run  # Run migrations
```

---

**หมายเหตุ**: แผนนี้ออกแบบให้สามารถทำงานแบบ parallel กับ Frontend ได้ โดยใช้ mock data ในช่วงแรก และค่อยๆ integrate เมื่อ Backend APIs พร้อมใช้งาน