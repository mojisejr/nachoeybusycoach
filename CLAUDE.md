---
## Project Overview

**Project Name**: นาเชยไม่เคยมีโค้ชว่าง (NachoeyBusyCoach)

**Repository**: https://github.com/mojisejr/nachoeybusycoach 

**Description**: แอปพลิเคชันศูนย์กลางการสื่อสารและบริหารจัดการระหว่างนักวิ่งและโค้ชส่วนตัว ที่ช่วยให้การฝึกซ้อมมีประสิทธิภาพและเข้าถึงได้ง่าย โครงการนี้จะเข้ามาแก้ไขปัญหาความยุ่งยากในการใช้แพลตฟอร์มหลายอย่าง เช่น Line, Facebook, หรือการคัดลอกลิงก์จาก Strava/Garmin เพื่อส่งให้โค้ช

**Project Goals**:

- สร้างแพลตฟอร์มที่เชื่อมโยงนักวิ่งกับโค้ชส่วนตัวอย่างมีประสิทธิภาพ
- พัฒนาระบบการสื่อสารแบบเรียลไทม์ระหว่างนักวิ่งและโค้ช
- สร้างเครื่องมือบริหารจัดการแผนการฝึกซ้อมและติดตามผลงาน
- รองรับการใช้งานบนอุปกรณ์มือถือและเว็บแอปพลิเคชัน
- สร้างระบบการแจ้งเตือนและการจัดการตารางเวลา
- ลดขั้นตอนการทำงานและปรับปรุงประสิทธิภาพการสื่อสาร
- สร้างประสบการณ์ที่ดีให้กับผู้ใช้ด้วย UI/UX ที่เรียบง่ายและใช้งานง่าย

---

## 🎯 Target Users & User Stories

### กลุ่มเป้าหมาย

- **นักวิ่ง (Runner)**: นักวิ่งสมัครเล่นที่มีโค้ชส่วนตัว
- **โค้ช (Coach)**: โค้ชผู้ดูแลนักวิ่งหลายคน

### User Stories

#### นักวิ่ง (Runner)

- สามารถสื่อสารกับโค้ชผ่านแชทแบบเรียลไทม์
- ดูแผนการฝึกซ้อมที่โค้ชกำหนดให้
- บันทึกผลการฝึกซ้อมและส่งให้โค้ช
- รับการแจ้งเตือนเกี่ยวกับตารางฝึกซ้อม
- ติดตามความก้าวหน้าของตนเอง

#### โค้ช (Coach)

- จัดการนักวิ่งหลายคนในระบบเดียว
- สร้างและปรับแต่งแผนการฝึกซ้อมสำหรับแต่ละคน
- ติดตามผลงานและความก้าวหน้าของนักวิ่ง
- สื่อสารกับนักวิ่งผ่านระบบแชท
- จัดการตารางเวลาและการนัดหมาย

### User Journeys

#### นักวิ่ง (Runner Journey)

##### 1. การเริ่มต้นใช้งาน
- เข้าสู่ระบบด้วย Google, Facebook หรือ Line
- ตั้งค่าโปรไฟล์เบื้องต้น
- รอโค้ชเพิ่มเข้าระบบและกำหนดแผนการฝึกซ้อม

##### 2. การดูและทำตามแผนการฝึกซ้อม
- เข้าไปดูตารางการฝึกซ้อมประจำสัปดาห์
- คลิกดู Session ในแต่ละวันเพื่อดูรายละเอียด
- ทำการฝึกซ้อมตามแผนที่โค้ชกำหนด

##### 3. การบันทึกผลการฝึกซ้อม
- เลือกสถานะการซ้อม: Completed (Done), DNF, หรือ Undone
- แนบลิงก์จาก Garmin หรือ Strava (ถ้ามี)
- เขียนบันทึกส่วนตัวเกี่ยวกับการซ้อม
- ระบุความรู้สึกและอาการบาดเจ็บ (ถ้ามี)
- ส่งข้อมูลให้โค้ชตรวจสอบ

##### 4. การติดตามและรับ Feedback
- ดูสถานะว่าโค้ชได้ตรวจสอบการซ้อมแล้วหรือยัง
- อ่านคำแนะนำและ Feedback จากโค้ช
- ตอบกลับหรือถามคำถามเพิ่มเติมผ่านระบบ comment

#### โค้ช (Coach Journey)

##### 1. การเริ่มต้นใช้งาน
- เข้าสู่ระบบด้วย Google, Facebook หรือ Line
- ตั้งค่าโปรไฟล์โค้ช
- เพิ่มนักวิ่งเข้าสู่ระบบ

##### 2. การสร้างแผนการฝึกซ้อม
- เลือกนักวิ่งที่ต้องการสร้างแผน
- กำหนดตารางการฝึกซ้อมประจำสัปดาห์
- ระบุรายละเอียดของแต่ละ Session (ระยะทาง, เวลา, ความเข้มข้น, หมายเหตุ)
- บันทึกและส่งแผนให้นักวิ่ง

##### 3. การติดตามและให้คำแนะนำ
- ดูสถานะการซ้อมของนักวิ่งแต่ละคน
- เปิดดูลิงก์จาก Strava หรือ Garmin ที่นักวิ่งส่งมา
- อ่านบันทึกและข้อมูลความรู้สึกของนักวิ่ง
- แสดงความคิดเห็นและให้คำแนะนำ
- เปลี่ยนสถานะเป็น "ตรวจสอบแล้ว"

##### 4. การปรับแผนและจัดการ
- ปรับเปลี่ยนแผนการซ้อมเมื่อจำเป็น
- ดูข้อมูลสรุปของนักวิ่งหลายคน
- วิเคราะห์ความก้าวหน้าและวางแผนระยะยาว

---

## 🏗️ Architecture Overview

### Tech Stack

**Frontend Framework**:
- Next.js 14 with App Router - สำหรับการสร้างแอปพลิเคชันที่มีประสิทธิภาพสูงและรองรับ Server-Side Rendering (SSR)
- TypeScript - สำหรับความปลอดภัยของประเภทข้อมูล
- React Hook Form - สำหรับการจัดการฟอร์ม
- Zustand - สำหรับการจัดการ state

**Styling & UI**:
- Tailwind CSS & DaisyUI - เพื่อความรวดเร็วในการออกแบบ UI/UX โดยไม่ต้องเขียน CSS เอง
- Tremor - เพื่อสร้าง Dashboard และกราฟสำหรับโค้ชและนักวิ่งได้อย่างสวยงาม

**Backend & Data Management**:
- Sanity.io (Headless CMS) - สำหรับการจัดการข้อมูลทั้งหมดและการสร้าง UI สำหรับโค้ชโดยอัตโนมัติ
- Next.js API Routes - สำหรับ backend logic และ API endpoints

**Authentication**:
- NextAuth.js - รองรับการเข้าสู่ระบบด้วย Google, Facebook, และ Line

**Development & Deployment**:
- pnpm - เพื่อจัดการ Dependency ใน Monorepo ให้มีประสิทธิภาพและประหยัดพื้นที่
- ESLint & Prettier - สำหรับคุณภาพของโค้ด
- Vercel - สำหรับการ Deploy ทั้ง Frontend และ Backend ได้อย่างง่ายดาย
- GitHub Actions - สำหรับ CI/CD

**Package Management**:
- pnpm workspaces - สำหรับจัดการ Monorepo structure

### Monorepo Structure

```
nachoeybusycoach/
├── apps/
│   ├── frontend/          # Next.js สำหรับ UI ของนักวิ่งและโค้ช
│   └── backend/           # Next.js สำหรับ API, การเชื่อมต่อกับ Sanity และ Backend Logic
├── packages/
│   ├── ui/               # แพ็กเกจสำหรับ UI components ที่ใช้ร่วมกัน เช่น ปุ่ม, การ์ด
│   ├── utils/            # แพ็กเกจสำหรับฟังก์ชันยูทิลิตี้ต่างๆ ที่ใช้ร่วมกัน
│   └── types/            # แพ็กเกจสำหรับ Type definitions ของข้อมูล (TypeScript) ที่ใช้ร่วมกัน
├── docs/
│   ├── PRD.md           # Product Requirements Document
│   └── claude-template.md # Development workflow template
├── pnpm-workspace.yaml   # การกำหนด pnpm workspace
├── package.json          # ไฟล์หลักของ Monorepo
└── CLAUDE.md            # This file
```

### การแบ่งหน้าที่ในทีม

**นักพัฒนาคนที่ 1 (Frontend Developer)**:
- รับผิดชอบการพัฒนาส่วน `/apps/frontend` และส่วนประกอบ UI ใน `/packages/ui`
- สร้างหน้า Dashboard, ตารางซ้อม, และฟอร์มต่างๆ สำหรับนักวิ่งและโค้ช

**นักพัฒนาคนที่ 2 (Backend Developer)**:
- รับผิดชอบการพัฒนาส่วน `/apps/backend` และการเชื่อมต่อกับ Sanity Headless CMS
- จัดการข้อมูล, สร้าง API endpoints สำหรับการดึงและบันทึกข้อมูลการซ้อม
- เขียน Logic ที่เกี่ยวข้องกับ Backend ทั้งหมด

## Functional Requirements

### สำหรับนักวิ่ง (Runner Requirements)

1. **การดูตารางการฝึกซ้อม**
   - ดูตารางการฝึกซ้อมที่โค้ชมอบหมายให้ในแต่ละสัปดาห์
   - ดูรายละเอียดของ Session ในแต่ละวัน (ระยะทาง, เวลา, ความเข้มข้น, หมายเหตุ)

2. **การบันทึกการซ้อม**
   - เลือกสถานะการซ้อม: Completed (Done), DNF, หรือ Undone
   - แนบลิงก์จาก Garmin หรือ Strava ได้อย่างง่ายดาย
   - เขียนบันทึกส่วนตัวของการซ้อม
   - ระบุความรู้สึกและอาการบาดเจ็บที่เกิดขึ้นระหว่างการซ้อม

3. **การติดตามความก้าวหน้า**
   - ดูประวัติการซ้อมย้อนหลัง
   - เห็นสถานะของแต่ละ Session ว่าได้ถูกส่งไปแล้วหรือโค้ชตรวจสอบแล้ว
   - ดูคำแนะนำหรือ Feedback จากโค้ชในแต่ละ Session

### สำหรับโค้ช (Coach Requirements)

1. **การจัดการแผนการฝึกซ้อม**
   - สร้างและกำหนดตารางการฝึกซ้อมสำหรับนักวิ่งแต่ละคนในแต่ละสัปดาห์
   - ระบุรายละเอียดของแต่ละ Session (ระยะทาง, เวลา, ความเข้มข้น, หมายเหตุ)
   - ปรับเปลี่ยนแผนการซ้อมของนักวิ่งได้ระหว่างสัปดาห์เมื่อจำเป็น

2. **การตรวจสอบและให้คำแนะนำ**
   - ดูสถานะการซ้อมของนักวิ่งแต่ละคน
   - เปิดดูลิงก์จาก Strava หรือ Garmin ที่นักวิ่งส่งมาได้อย่างรวดเร็ว
   - แสดงความคิดเห็นและให้คำแนะนำในแต่ละ Session ของนักวิ่ง
   - เปลี่ยนสถานะของ Session การซ้อมเพื่อยืนยันว่าได้ตรวจสอบแล้ว

3. **การจัดการนักวิ่งหลายคน**
   - จัดการและดูข้อมูลของนักวิ่งหลายคนในที่เดียว
   - ดูข้อมูลความรู้สึกและอาการเจ็บปวดที่นักวิ่งบันทึกไว้

## Non-Functional Requirements

### Performance Requirements
- หน้าเว็บต้องโหลดภายใน 3 วินาที
- รองรับผู้ใช้พร้อมกันได้อย่างน้อย 100 คน
- ระบบต้องมี uptime อย่างน้อย 99%

### Security Requirements
- การเข้าสู่ระบบผ่าน OAuth providers (Google, Facebook, Line)
- ข้อมูลส่วนตัวของผู้ใช้ต้องได้รับการปกป้อง
- การเข้าถึงข้อมูลต้องผ่านระบบ authorization

### Usability Requirements
- Interface ต้องใช้งานง่ายและเข้าใจง่าย
- รองรับการใช้งานบนมือถือและเดสก์ท็อป
- ระบบต้องมี feedback ที่ชัดเจนเมื่อผู้ใช้ทำการใดๆ

### Compatibility Requirements
- รองรับ browser สมัยใหม่ (Chrome, Firefox, Safari, Edge)
- รองรับการใช้งานบนมือถือ (iOS, Android)
- ใช้งานได้กับ screen reader สำหรับผู้พิการทางสายตา

#### ระบบหลัก (Core Systems)

1. **ระบบผู้ใช้งาน (Authentication)**
   - เข้าสู่ระบบด้วยบัญชี Google, Facebook, และ Line
   - แยกสิทธิ์การเข้าถึงระหว่างโค้ชและนักวิ่ง

2. **ระบบการสื่อสาร (Communication)**
   - ระบบ comment ภายในแต่ละ session เพื่อการสื่อสารโดยตรงระหว่างโค้ชและนักวิ่ง
   - ระบบการแจ้งเตือนเมื่อโค้ชให้ Feedback

3. **ระบบการติดตามความคืบหน้า (Progress Tracking)**
   - หน้าจอสำหรับดูข้อมูลการฝึกซ้อมในอดีตสำหรับทั้งนักวิ่งและโค้ช
   - แสดงกราฟสรุปข้อมูลพื้นฐาน เช่น ระยะทางรวมต่อสัปดาห์/เดือน

---

## 🚀 Development Workflows

### The Two-Issue Pattern

This project uses a Two-Issue Pattern to separate work context from actionable plans, integrating local workflows with GitHub Issues for clarity and traceability.

- **Context Issues (`=fcs`):** Used to record the current state and context of a session on GitHub.
- **Task Issues (`=plan`):** Used to create a detailed and comprehensive plan of action on GitHub. The agent will use information from the latest Context Issue as a reference.

### Shortcut Commands

These commands are standard across all projects and streamline our communication with **AUTOMATED WORKFLOW INTEGRATION**.

- **`=fcs > [message]`**: Updates the `current-focus.md` file on the local machine and creates a **GitHub Context Issue** with the specified `[message]` as the title. **WARNING**: This command will only work if there are no open GitHub issues. If there are, the agent will alert you to clear the backlog before you can save a new context. To bypass this check, use the command `=fcs -f > [message]`.

- **`=plan > [question/problem]`**: Creates a **GitHub Task Issue** with a detailed and comprehensive plan of action. The agent will use all the information from the `current-focus.md` file and previous conversations to create this Issue. If an open Task Issue already exists, the agent will **update** that Issue with the latest information instead of creating a new one.

- **`=impl > [message]`**: **ENHANCED WITH AUTOMATED WORKFLOW** - Instructs the agent to execute the plan contained in the latest **GitHub Task Issue** with full automation:

  1. **Auto-Branch Creation**: Creates feature branch with proper naming (`feature/[issue-number]-[description]`)
  2. **Implementation**: Executes the planned work
  3. **Auto-Commit & Push**: Commits changes with descriptive messages and pushes to remote
  4. **Auto-PR Creation**: Creates Pull Request with proper description and issue references
  5. **Issue Updates**: Updates the plan issue with PR link and completion status
  6. **User Notification**: Provides PR link for review and approval

- **`=rrr > [message]`**: Creates a daily Retrospective file in the `docs/retrospective/` folder and creates a GitHub Issue containing a summary of the work, an AI Diary, and Honest Feedback, allowing you and the team to review the session accurately.

### 🔄 Plan Issue Management Guidelines

**CRITICAL**: For large, multi-phase projects, the agent must **UPDATE** existing plan issues instead of creating new ones.

- **When completing phases**: Update the plan issue to reflect completed phases and mark them as ✅ COMPLETED
- **Progress tracking**: Update the issue description with current status, next steps, and any blockers
- **Phase completion**: When a phase is finished, update the plan issue immediately before moving to the next phase
- **Never create new issues**: For ongoing multi-phase work, always update the existing plan issue
- **Retrospective issues**: Only create retrospective issues for session summaries, not for plan updates

### 🎯 Enhanced Implementation Workflows

#### Multi-Phase Implementation Strategy

**Proven 5-Phase Approach** (from successful 15-34 minute sessions):

```
Phase 1: Analysis & Preparation (5-8 minutes)
├─ Component structure analysis
├─ Integration point identification
├─ Dependency mapping
└─ Success criteria definition

Phase 2: Core Implementation (8-15 minutes)
├─ Primary code changes
├─ Component modifications
├─ API updates
└─ Database operations

Phase 3: Integration & Testing (3-8 minutes)
├─ Build validation
├─ TypeScript compilation
├─ Functional testing
└─ Error resolution

Phase 4: Documentation & PR (2-5 minutes)
├─ Commit preparation
├─ Pull request creation
├─ Issue updates
└─ Documentation

Phase 5: Cleanup & Review (1-2 minutes)
├─ Temporary file cleanup
├─ Final validation
└─ Status communication
```

#### Reference Pattern Implementation

**When Following Proven Patterns** (56% efficiency improvement proven):

1. **Identify Reference Session**: Look for similar work in `/docs/retrospective/`
2. **Extract Implementation Steps**: Follow the proven methodology exactly
3. **Adapt Context-Specific Elements**: Modify only what's necessary for the new context
4. **Track Time Improvements**: Measure and document efficiency gains

#### Branch Management Excellence

**Critical Workflow Adherence** (learned from workflow violations):

```bash
# ALWAYS create feature branches - NEVER work on main
git checkout -b feature/[issue-number]-[description]

# MANDATORY workflow sequence:
1. Analysis & Planning
2. Branch Creation
3. Implementation with TodoWrite tracking
4. Build Validation
5. Commit & Push
6. PR Creation
7. Issue Updates
```

#### TodoWrite Integration Patterns

**High-Impact Usage Scenarios**:

- **Complex refactoring**: 3+ component changes
- **Multi-phase implementations**: API + Frontend work
- **Large system changes**: Database + Application updates
- **Pattern replication**: Following proven approaches

**TodoWrite Best Practices**:

```markdown
1. Create 5-8 specific, actionable todos
2. Mark exactly ONE todo as 'in_progress' at a time
3. Complete todos immediately after finishing each step
4. Update progress before moving to next phase
5. Use for stakeholder visibility and accountability
```

### 🌿 Automated Workflow Implementation

**ENHANCED AUTOMATION**: All development workflows now include full automation to ensure consistent adherence to project guidelines.

#### Enhanced Command Behavior

The following commands now include **FULL WORKFLOW AUTOMATION**:

##### `=impl` Command Enhancement

**Automated Execution Flow:**

```
1. Parse GitHub Task Issue → Extract requirements and scope
2. Auto-Branch Creation → feature/[issue-number]-[sanitized-description]
3. Implementation Phase → Execute planned work with progress tracking
4. Auto-Commit & Push → Descriptive commits with proper formatting
5. Auto-PR Creation → Comprehensive PR with issue linking
6. Issue Updates → Update plan issue with PR link and completion status
7. User Notification → Provide PR URL for review and approval
```

##### TodoWrite Integration Enhancement

**Performance Impact from Retrospectives**: 56% faster implementations when TodoWrite is integrated

**Enhanced Implementation Flow with TodoWrite:**

```
1. Parse GitHub Task Issue → Extract requirements and scope
2. Initialize TodoWrite → Create 5-8 specific, actionable todos
3. Auto-Branch Creation → feature/[issue-number]-[sanitized-description]
4. Implementation Phase → Execute with real-time todo tracking
   ├─ Mark exactly ONE todo as 'in_progress' at a time
   ├─ Complete todos immediately after finishing each step
   ├─ Update progress visibility for stakeholders
   └─ Ensure accountability for all implementation steps
5. Auto-Commit & Push → Descriptive commits with proper formatting
6. Auto-PR Creation → Comprehensive PR with issue linking
7. Issue Updates → Update plan issue with PR link and completion status
8. TodoWrite Completion → Mark all todos as completed
9. User Notification → Provide PR URL for review and approval
```

**TodoWrite Performance Benefits:**

- **Visibility**: Real-time progress tracking for stakeholders
- **Accountability**: Prevents skipping critical implementation steps
- **Focus**: Reduces context switching during complex implementations
- **Efficiency**: Proven 15-minute implementations vs 34-minute baseline
- **Documentation**: Creates audit trail of implementation progress

**High-Impact TodoWrite Usage Patterns:**

```markdown
✅ Complex multi-component refactoring (3+ files)
✅ Full-stack implementations (API + Frontend)
✅ Multi-phase system changes (Database + Application)
✅ Pattern replication following proven approaches
✅ Large refactoring with dependency management

❌ Single file edits or trivial changes
❌ Simple documentation updates
❌ Quick bug fixes without multiple steps
```

##### Branch Naming Convention

- **Format**: `feature/[issue-number]-[sanitized-description]`
- **Example**: `feature/27-user-authentication-implementation`
- **Auto-sanitization**: Removes special characters, converts to kebab-case

##### Commit Message Standards

- **Format**: `[type]: [description] (#[issue-number])`
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Example**: `feat: implement user authentication system (#25)`

##### Pull Request Automation

- **Title**: Auto-generated from issue title with proper formatting
- **Description**: Includes implementation summary, changes made, and testing notes
- **Issue Linking**: Automatic `Closes #[issue-number]` for proper tracking
- **Labels**: Auto-applied based on implementation type and scope

#### Workflow Safety Measures

- **Branch Protection**: Prevents direct commits to main/master
- **PR Validation**: Ensures all changes go through review process
- **Issue Tracking**: Maintains complete audit trail of work
- **Status Updates**: Real-time progress tracking and notifications

**CRITICAL**: **NEVER** work directly on main/master branch. **ALWAYS** create PRs for review.

### Implementation Guidelines for Automated Workflow

#### Pre-Implementation Checks

- ✅ Verify GitHub Task Issue exists and is properly formatted
- ✅ Ensure no conflicting branches exist
- ✅ Confirm GitHub CLI is authenticated and functional
- ✅ Validate repository permissions for branch creation and PR management

#### Error Handling and Fallbacks

- **Branch Creation Failure**: Falls back to manual branch creation with user guidance
- **Push Failure**: Provides manual push commands and troubleshooting steps
- **PR Creation Failure**: Falls back to manual PR creation with pre-filled templates
- **Issue Update Failure**: Logs error and provides manual update instructions

#### Quality Assurance

- **Code Review**: All PRs require manual review and approval
- **Testing**: Automated tests run on PR creation (if configured)
- **Documentation**: Auto-generated PR descriptions include implementation details
- **Rollback**: Clear instructions for reverting changes if needed

#### Monitoring and Feedback

- **Progress Tracking**: Real-time updates during implementation phases
- **Success Metrics**: PR creation success rate and review completion time
- **User Feedback**: Continuous improvement based on workflow effectiveness
- **Audit Trail**: Complete history of automated actions for debugging

### 🏃‍♂️ 15-Minute Implementation Strategy

**Achieved Results**: Consistent 15-minute implementations vs 34+ minute baseline

#### Prerequisites for High-Speed Implementation

```markdown
✅ Clear reference pattern from previous successful session
✅ TodoWrite tracking system initialized  
✅ Component structure already analyzed
✅ Integration points identified
✅ Success criteria defined
```

#### Speed Optimization Techniques

**1. Pattern Recognition & Replication**

- **Time Savings**: 56% faster when following proven patterns
- **Method**: Use `/docs/retrospective/` files as implementation guides
- **Key**: Adapt existing solutions rather than creating from scratch

**2. Systematic Component Analysis**

```markdown
Phase 1: Quick Analysis (2-3 minutes)
├─ Read target integration area
├─ Identify implementation requirements
├─ Confirm design patterns
└─ Validate consistency approach
```

**3. Build Validation Checkpoints**

```bash
# Critical validation points:
npm run build    # After each major change
npx tsc --noEmit # For type-only validation
```

### Testing Strategy

#### Build Validation Checkpoints

**Critical Validation Points**:

```bash
# After schema changes
npm run build && npx tsc --noEmit

# After API modifications
npm run build 2>&1 | grep -A 5 "error"

# After large refactoring
npx prisma generate && npm run build
```

#### Proactive Testing Strategy

- **Incremental Builds**: Test builds after each major change, not just at the end
- **TypeScript Validation**: Run `npx tsc --noEmit` for pure type checking
- **Dependency Verification**: Check imports and exports after file restructuring
- **Database Sync**: Verify `npx prisma generate` after schema changes

#### Testing Levels

- **Unit Tests**: Business logic and utility functions
- **Integration Tests**: API endpoints and database operations
- **Component Tests**: React component functionality
- **E2E Tests**: Critical user flows (authentication, session logging, coach feedback)
- **Manual Testing**: UI/UX validation and cross-browser compatibility

#### Performance Testing

- **Core Web Vitals**: Monitor LCP (<2.5s), FID (<100ms), CLS (<0.1)
- **API Response Times**: Target <500ms average
- **Database Queries**: Monitor slow queries via Prisma logs
- **Mobile Performance**: Test on various device sizes and network conditions

---

## 🛠️ Development Commands

### Core Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Sanity.io Commands

```bash
# Start Sanity Studio
npm run sanity:dev

# Deploy Sanity Studio
npm run sanity:deploy

# Import data to Sanity
npm run sanity:import

# Export data from Sanity
npm run sanity:export

# Validate Sanity schemas
npm run sanity:validate
```

### Monorepo Commands

```bash
# Install dependencies for all packages
pnpm install

# Run command in specific workspace
pnpm --filter frontend dev
pnpm --filter backend build

# Run command in all workspaces
pnpm -r build
pnpm -r test

# Add dependency to specific workspace
pnpm --filter frontend add react-query
pnpm --filter backend add express
```

### Development Utilities

```bash
# Clear cache and reinstall
rm -rf node_modules .next .cache
pnpm install

# Check for type errors
npx tsc --noEmit

# Find process using port 3000
lsof -i :3000

# Kill process on port 3000
kill -9 $(lsof -t -i:3000)

# Use alternative port
npm run dev -- -p 3001
```

### AI Prompt Management

```bash
# Update AI prompts
npm run prompts:update

# Validate prompt schemas
npm run prompts:validate

# Generate prompt documentation
npm run prompts:docs
```

---

## 📋 Implementation Phases

### Phase 1: โครงสร้างพื้นฐาน (Foundation) - สัปดาห์ที่ 1-2

#### เป้าหมาย
- ตั้งค่าโครงสร้างโปรเจกต์และ monorepo
- ระบบ authentication พื้นฐาน
- Database schema และ Sanity.io setup
- UI components หลัก

#### งานที่ต้องทำ
- [ ] ตั้งค่า Next.js 14 project structure
- [ ] ติดตั้งและกำหนดค่า Sanity.io
- [ ] สร้าง schemas สำหรับ User, TrainingPlan, TrainingSession, WorkoutLog, Feedback
- [ ] ตั้งค่า NextAuth.js สำหรับ Google, Facebook, Line login
- [ ] สร้าง UI components พื้นฐานด้วย Tailwind CSS และ DaisyUI
- [ ] ตั้งค่า pnpm workspaces

### Phase 2: ระบบหลัก (Core Features) - สัปดาห์ที่ 3-6

#### เป้าหมาย
- ระบบจัดการผู้ใช้และสิทธิ์
- การสร้างและจัดการแผนการฝึกซ้อม
- ระบบบันทึกการซ้อมพื้นฐาน
- ความสัมพันธ์ระหว่างโค้ชและนักวิ่ง

#### งานที่ต้องทำ
- [ ] สร้างหน้า Dashboard สำหรับโค้ชและนักวิ่ง
- [ ] ระบบสร้างและแก้ไข Training Plan
- [ ] หน้าแสดงตารางการฝึกซ้อมประจำสัปดาห์
- [ ] ระบบบันทึกผลการซ้อม (status, links, notes, feelings)
- [ ] ระบบเชื่อมโยงโค้ชกับนักวิ่ง
- [ ] API routes สำหรับ CRUD operations

### Phase 3: ระบบการสื่อสาร (Communication) - สัปดาห์ที่ 7-8

#### เป้าหมาย
- ระบบ comment และ feedback
- ระบบการแจ้งเตือน
- การติดตามสถานะการตรวจสอบ

#### งานที่ต้องทำ
- [ ] ระบบ comment ในแต่ละ training session
- [ ] ระบบ feedback จากโค้ชถึงนักวิ่ง
- [ ] ระบบการแจ้งเตือนเมื่อมี feedback ใหม่
- [ ] สถานะการตรวจสอบ (reviewed/pending)
- [ ] หน้าประวัติการสื่อสาร

### Phase 4: Analytics และการปรับปรุง (Analytics & Polish) - สัปดาห์ที่ 9-10

#### เป้าหมาย
- หน้า Dashboard ที่สมบูรณ์
- ระบบวิเคราะห์ความก้าวหน้า
- การปรับปรุง UI/UX
- การทดสอบและแก้ไขบัค

#### งานที่ต้องทำ
- [ ] กราฟแสดงความก้าวหน้าด้วย Tremor
- [ ] สรุปข้อมูลการฝึกซ้อมรายสัปดาห์/เดือน
- [ ] ระบบค้นหาและกรองข้อมูล
- [ ] ปรับปรุง responsive design
- [ ] การทดสอบ end-to-end
- [ ] Performance optimization

### Phase 5: Deployment และ Launch - สัปดาห์ที่ 11-12

#### เป้าหมาย
- Deploy production บน Vercel
- การทดสอบกับผู้ใช้จริง
- เตรียมความพร้อมสำหรับการเปิดตัว

#### งานที่ต้องทำ
- [ ] ตั้งค่า production environment บน Vercel
- [ ] ตั้งค่า Sanity.io production dataset
- [ ] การทดสอบ User Acceptance Testing
- [ ] เตรียมเอกสารการใช้งาน
- [ ] ระบบ monitoring และ error tracking
- [ ] เปิดตัวและรับ feedback จากผู้ใช้

---

## 🔧 Multi-Phase Implementation Approach

### Systematic Phase Breakdown

```
Phase 1: Analysis & Preparation (10-15% of time)
Phase 2: Core Implementation (40-50% of time)
Phase 3: Integration & Testing (25-30% of time)
Phase 4: Documentation & Cleanup (10-15% of time)
```

### Phase Management Best Practices

- **Clear Phase Objectives**: Define specific deliverables for each phase
- **Incremental Testing**: Validate functionality at each phase
- **Documentation Standards**: Maintain comprehensive documentation
- **Progress Tracking**: Use TodoWrite for complex implementations

---

## 🔄 Continuous Improvement Framework

### Session Performance Tracking

```markdown
1. Track implementation time per session type
2. Document efficiency factors (TodoWrite, patterns, tools)
3. Identify workflow violations and their impact
4. Measure pattern replication success rates
```

### Pattern Development Lifecycle

```markdown
1. Novel Implementation → Document approach in retrospective
2. Pattern Recognition → Identify reusable elements
3. Pattern Refinement → Optimize approach in next similar task
4. Pattern Maturation → Achieve consistent sub-20-minute implementations
```

### Retrospective Workflow

#### Session Tracking

**Mandatory Retrospective Creation** after each development session:

```bash
# Create retrospective with session summary
=rrr > [session-summary]
```

**Retrospective File Structure**:

```
docs/retrospective/YYYY-MM-DD-[session-type].md
├─ Session Summary
├─ AI Diary (automated insights)
├─ Honest Feedback
├─ Performance Metrics
└─ Pattern Recognition
```

#### AI Diary Integration

**Automated Session Analysis**:

- **Implementation Efficiency**: Time tracking and bottleneck identification
- **Pattern Recognition**: Successful approaches and reusable patterns
- **Workflow Adherence**: Compliance with established guidelines
- **Quality Metrics**: Code quality, testing coverage, documentation

#### Mandatory Retrospective Sections

```markdown
## Session Summary
- **Duration**: [actual time]
- **Scope**: [what was accomplished]
- **Challenges**: [obstacles encountered]
- **Solutions**: [how challenges were resolved]

## AI Diary
- **Efficiency Factors**: [what made this session fast/slow]
- **Pattern Usage**: [which patterns were applied]
- **Tool Effectiveness**: [TodoWrite, automation, etc.]
- **Workflow Compliance**: [adherence to guidelines]

## Honest Feedback
- **What Worked Well**: [successful approaches]
- **What Could Improve**: [areas for optimization]
- **Lessons Learned**: [key insights]
- **Next Session Prep**: [preparation for future work]
```

### Best Practices from Retrospectives

#### TodoWrite Integration

**Proven High-Impact Scenarios** (from retrospective analysis):

```markdown
✅ Multi-component refactoring (3+ files)
✅ Full-stack feature implementation
✅ Database schema changes with application updates
✅ Complex integration work
✅ Pattern replication from previous sessions

❌ Single file edits
❌ Documentation-only updates
❌ Simple bug fixes
```

#### Pattern Replication Strategy

**Efficiency Gains from Pattern Following**:

- **56% faster implementations** when following proven patterns
- **Consistent sub-20-minute sessions** for similar work
- **Reduced error rates** through established approaches
- **Improved code quality** via tested methodologies

**Pattern Identification Process**:

1. **Search retrospectives** for similar implementation types
2. **Extract successful approaches** from high-performing sessions
3. **Adapt patterns** to current context while maintaining core methodology
4. **Document variations** for future pattern evolution

---

## 🛡️ Critical Safety Rules

### Development Safety

1. **Never work directly on main branch**
2. **Always create feature branches for new work**
3. **Run build validation before committing**
4. **Use TypeScript strict mode**
5. **Implement proper error handling**

### Data Safety

1. **Never commit sensitive data**
2. **Use environment variables for secrets**
3. **Implement proper input validation**
4. **Follow GDPR compliance for user data**
5. **Regular database backups**

### Security Best Practices

1. **Implement proper authentication**
2. **Use HTTPS in production**
3. **Sanitize user inputs**
4. **Implement rate limiting**
5. **Regular security audits**

### Build Validation Checkpoints

**Critical Validation Points**:

```bash
# After schema changes
npm run build && npx tsc --noEmit

# After API modifications
npm run build 2>&1 | grep -A 5 "error"

# After large refactoring
npx prisma generate && npm run build
```

### Performance Benchmarks

**Target Metrics**:

- **Build Time**: < 30 seconds for incremental builds
- **Type Checking**: < 10 seconds for `npx tsc --noEmit`
- **Test Suite**: < 2 minutes for full test run
- **Development Server**: < 5 seconds startup time

**High-Impact Optimization Areas**:

1. **TodoWrite Integration**: 56% efficiency improvement proven
2. **Reference Pattern Utilization**: Consistent sub-20-minute implementations
3. **Tool Optimization**: Automated workflow reduces manual overhead
4. **Workflow Adherence**: Prevents costly rework and debugging

---

## 📚 Project Implementation Learnings

### Key Insights from Development Journey

Based on comprehensive retrospective analysis from the project implementation phases, the following critical learnings have been identified to enhance development efficiency and code quality:

#### 🎯 High-Impact Development Patterns

**Authentication Implementation Excellence**:
- **NextAuth.js Integration**: Proven 15-minute setup when following established patterns
- **Provider Configuration**: Google, Facebook, and Line OAuth setup with standardized approach
- **Session Management**: Robust session handling with proper TypeScript integration
- **Security Best Practices**: Implemented proper CSRF protection and secure cookie handling

**Database Schema & Sanity CMS Mastery**:
- **Schema-First Development**: Define comprehensive schemas before implementation reduces rework by 60%
- **Sanity Studio Optimization**: Custom studio configuration significantly improves content management workflow
- **Type Safety Integration**: Automated TypeScript type generation from Sanity schemas prevents runtime errors
- **Content Modeling**: Proper relationship modeling between Users, Training Plans, and Sessions

**API Development Excellence**:
- **RESTful Design Patterns**: Consistent API structure across all endpoints improves maintainability
- **Error Handling Standards**: Standardized error responses with proper HTTP status codes
- **Validation Middleware**: Zod schema validation prevents data corruption and improves API reliability
- **Performance Optimization**: Proper caching strategies and database query optimization

#### 🚀 Proven Efficiency Multipliers

**TodoWrite Integration (56% Efficiency Gain)**:
- **Multi-Component Refactoring**: Essential for changes affecting 3+ files
- **Full-Stack Feature Implementation**: Critical for coordinated frontend/backend development
- **Database Schema Changes**: Prevents missed application updates when schema evolves
- **Complex Integration Work**: Maintains coherence across multiple system components

**Reference Pattern Utilization**:
- **Pattern Replication**: Following proven patterns achieves consistent sub-20-minute implementations
- **Code Template Library**: Established templates for common components and API endpoints
- **Architecture Consistency**: Standardized folder structure and naming conventions
- **Testing Patterns**: Reusable testing approaches for different component types

#### 🔧 Technical Implementation Insights

**Frontend Development Optimizations**:
- **Component Architecture**: Modular component design with proper prop typing
- **State Management**: Zustand integration for efficient state handling
- **Form Handling**: React Hook Form with Zod validation for robust form management
- **UI Consistency**: DaisyUI component library ensures design system adherence

**Backend Architecture Excellence**:
- **API Route Organization**: Logical grouping and consistent naming conventions
- **Middleware Implementation**: Reusable middleware for authentication, validation, and error handling
- **Database Optimization**: Efficient query patterns and proper indexing strategies
- **Type Safety**: End-to-end TypeScript integration from database to frontend

**Integration & Testing Strategies**:
- **Build Validation Checkpoints**: Critical validation points prevent deployment issues
- **Automated Testing**: Comprehensive test coverage for API endpoints and components
- **Error Boundary Implementation**: Proper error handling and user feedback mechanisms
- **Performance Monitoring**: Real-time performance tracking and optimization

#### 📊 Quality Assurance Learnings

**Code Quality Standards**:
- **TypeScript Strict Mode**: Prevents runtime errors and improves code reliability
- **ESLint Configuration**: Consistent code style and best practice enforcement
- **Prettier Integration**: Automated code formatting reduces review overhead
- **Git Hooks**: Pre-commit validation ensures code quality standards

**Testing Excellence**:
- **Unit Testing**: Comprehensive component and utility function testing
- **Integration Testing**: API endpoint testing with proper mock data
- **E2E Testing**: Critical user journey validation
- **Performance Testing**: Load testing and optimization validation

#### 🔄 Workflow Optimization Insights

**Development Process Improvements**:
- **Branch Management**: Feature branch strategy with proper naming conventions
- **Commit Standards**: Descriptive commit messages with proper categorization
- **Pull Request Automation**: Automated PR creation with comprehensive descriptions
- **Code Review Process**: Structured review checklist and approval workflow

**Documentation Excellence**:
- **Retrospective Documentation**: Systematic session analysis and pattern identification
- **API Documentation**: Comprehensive endpoint documentation with examples
- **Component Documentation**: Storybook integration for component library
- **Deployment Documentation**: Step-by-step deployment and configuration guides

#### 🎯 Performance Optimization Learnings

**Frontend Performance**:
- **Code Splitting**: Proper component lazy loading and route-based splitting
- **Image Optimization**: Next.js Image component with proper sizing and formats
- **Bundle Analysis**: Regular bundle size monitoring and optimization
- **Caching Strategies**: Effective browser and CDN caching implementation

**Backend Performance**:
- **Database Query Optimization**: Efficient query patterns and proper indexing
- **API Response Caching**: Strategic caching for frequently accessed data
- **Connection Pooling**: Proper database connection management
- **Memory Management**: Efficient memory usage and garbage collection optimization

#### 🛡️ Security Implementation Excellence

**Authentication Security**:
- **OAuth Implementation**: Secure OAuth flow with proper token handling
- **Session Security**: Secure session management with proper expiration
- **CSRF Protection**: Comprehensive CSRF attack prevention
- **Input Validation**: Robust input sanitization and validation

**Data Protection**:
- **Environment Variables**: Proper secret management and environment configuration
- **API Security**: Rate limiting and request validation
- **Database Security**: Proper access controls and data encryption
- **Error Handling**: Secure error messages that don't expose sensitive information

#### 📈 Scalability Considerations

**Architecture Scalability**:
- **Monorepo Structure**: Efficient code sharing and dependency management
- **Component Reusability**: Shared component library across applications
- **API Design**: RESTful design that supports future expansion
- **Database Design**: Scalable schema design with proper relationships

**Performance Scalability**:
- **Caching Layers**: Multi-level caching strategy for improved performance
- **Database Optimization**: Query optimization and proper indexing
- **CDN Integration**: Static asset optimization and delivery
- **Monitoring Integration**: Comprehensive performance monitoring and alerting

#### 🔮 Future Development Recommendations

**Technology Evolution**:
- **Framework Updates**: Regular Next.js and dependency updates
- **Performance Monitoring**: Continuous performance optimization
- **Security Updates**: Regular security audit and vulnerability assessment
- **Feature Enhancement**: User feedback-driven feature development

**Team Development**:
- **Knowledge Sharing**: Regular team knowledge sharing sessions
- **Code Review Excellence**: Continuous improvement of review processes
- **Documentation Maintenance**: Regular documentation updates and improvements
- **Pattern Evolution**: Continuous refinement of development patterns and practices

---

## 🔧 Troubleshooting

### Frontend Authentication Errors

**Known Issues from Sub-Phase 1.2 Authentication Integration**:

Based on retrospective analysis from 2025-01-09, the following frontend authentication errors have been identified and require attention:

**NextAuth Configuration Issues**:
- **CLIENT_FETCH_ERROR**: Resolved by adding frontend proxy route at `/apps/frontend/src/app/api/auth/[...nextauth]/route.ts`
- **404 Errors**: Fixed by removing `basePath="/api/auth"` from SessionProvider in AuthProvider.tsx
- **Environment Configuration**: Ensure NEXTAUTH_URL is properly configured in both frontend and backend

**Remaining Frontend Issues to Address**:
- **Session State Management**: Frontend session state may not persist correctly across page refreshes
- **Authentication Flow**: OAuth callback handling needs verification for all providers (Google, Facebook, Line)
- **Error Boundaries**: Implement proper error handling for authentication failures
- **Loading States**: Add proper loading indicators during authentication processes

**Debugging Commands**:
```bash
# Check NextAuth configuration
echo $NEXTAUTH_URL
echo $NEXTAUTH_SECRET

# Verify frontend proxy route exists
ls -la apps/frontend/src/app/api/auth/[...nextauth]/

# Check for authentication errors in browser console
# Look for CLIENT_FETCH_ERROR or 404 errors

# Test authentication endpoints
curl -I http://localhost:3000/api/auth/session
curl -I http://localhost:3001/api/auth/session
```

**Resolution Priority**:
1. **High**: Fix session persistence issues
2. **High**: Verify OAuth provider configurations
3. **Medium**: Implement comprehensive error boundaries
4. **Medium**: Add loading states and user feedback

### Build Failures

**Common Issues and Solutions**:

```bash
# TypeScript compilation errors
npx tsc --noEmit --listFiles | grep error

# Missing dependencies
npm install --force
pnpm install --force

# Cache issues
rm -rf .next node_modules
npm install

# Port conflicts
lsof -i :3000
kill -9 $(lsof -t -i:3000)
```

### Database Issues

**PostgreSQL Sequence Management**:

```sql
-- Reset sequence after manual data insertion
SELECT setval('table_id_seq', (SELECT MAX(id) FROM table));

-- Check sequence current value
SELECT currval('table_id_seq');

-- Fix sequence mismatch
SELECT setval('table_id_seq', COALESCE((SELECT MAX(id) FROM table), 1));
```

**Database Debugging**:

```bash
# Check database connection
npx prisma db pull

# Reset and reseed database
npx prisma migrate reset
npx prisma db seed

# Generate fresh client
npx prisma generate
```

### TypeScript Errors

**Common Resolution Steps**:

```bash
# Clear TypeScript cache
rm -rf .tsbuildinfo

# Restart TypeScript server in IDE
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

# Check for circular dependencies
npx madge --circular src/
```

### Port Conflicts

**Resolution Commands**:

```bash
# Find process using port
lsof -i :3000

# Kill specific process
kill -9 [PID]

# Kill all processes on port
kill -9 $(lsof -t -i:3000)

# Use alternative port
npm run dev -- -p 3001
```

---

## 📊 Performance Monitoring

### Key Metrics

- **Page Load Times**: < 2 seconds
- **API Response Times**: < 500ms
- **Real-time Message Delivery**: < 100ms
- **Mobile Performance**: Lighthouse score > 90
- **Uptime**: > 99.9%

### Monitoring Tools

- **Frontend**: Vercel Analytics, Web Vitals
- **Backend**: API monitoring, Error tracking
- **Database**: Query performance monitoring
- **Real-time**: Connection stability tracking

### Performance Monitoring Metrics

**Core Web Vitals**:

- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1

**API Performance**:

- **Response Time**: 95th percentile < 500ms
- **Throughput**: > 1000 requests/minute
- **Error Rate**: < 0.1%

**Database Performance**:

- **Query Response Time**: 95th percentile < 100ms
- **Connection Pool Utilization**: < 80%
- **Slow Query Threshold**: > 1 second

---

## Monetization Plan

### แผนการหารายได้

ตาม PRD แอปพลิเคชันนี้จะเป็น **Free application with donation button** โดยมีรายละเอียดดังนี้:

#### การใช้งานฟรี
- ผู้ใช้ทุกคนสามารถใช้งานฟีเจอร์ทั้งหมดได้ฟรี
- ไม่มีข้อจำกัดในการใช้งาน
- ไม่มีระบบ subscription หรือ premium features

#### ระบบ Donation
- มีปุ่ม "Support the Project" หรือ "บริจาค" ในแอป
- ผู้ใช้สามารถบริจาคเงินเพื่อสนับสนุนการพัฒนาต่อได้
- การบริจาคเป็นไปด้วยความสมัครใจ 100%
- ไม่มีสิทธิพิเศษใดๆ สำหรับผู้บริจาค

#### เป้าหมายระยะยาว
- สร้างชุมชนผู้ใช้ที่แข็งแกร่ง
- พัฒนาฟีเจอร์ใหม่ๆ ตามความต้องการของผู้ใช้
- รักษาความเป็น open source และฟรีตลอดไป

## 🎯 Success Criteria

### Technical Success

- [ ] All core features implemented and tested
- [ ] Mobile-responsive design
- [ ] Real-time communication working
- [ ] Performance targets met (< 3 วินาที ตาม Non-Functional Requirements)
- [ ] Security requirements satisfied
- [ ] รองรับผู้ใช้พร้อมกันได้อย่างน้อย 100 คน
- [ ] uptime อย่างน้อย 99%

### User Success

- [ ] Intuitive user interface
- [ ] Reliable communication system
- [ ] Effective training plan management
- [ ] Positive user feedback
- [ ] High user engagement
- [ ] Interface ใช้งานง่ายและเข้าใจง่าย
- [ ] รองรับการใช้งานบนมือถือและเดสก์ท็อป

### Business Success

- [ ] Platform ready for production
- [ ] Scalable architecture
- [ ] Maintainable codebase
- [ ] Documentation complete
- [ ] Team trained on system
- [ ] Community growth และการมีส่วนร่วม
- [ ] ระบบ donation ทำงานได้อย่างมีประสิทธิภาพ

---

## Sanity.io Schemas

### User Schema
```javascript
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
          {title: 'Runner', value: 'runner'},
          {title: 'Coach', value: 'coach'}
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image'
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ]
}
```

### TrainingPlan Schema
```javascript
export default {
  name: 'trainingPlan',
  title: 'Training Plan',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Plan Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'runner',
      title: 'Runner',
      type: 'reference',
      to: [{type: 'user'}],
      validation: Rule => Rule.required()
    },
    {
      name: 'coach',
      title: 'Coach',
      type: 'reference',
      to: [{type: 'user'}],
      validation: Rule => Rule.required()
    },
    {
      name: 'weekStartDate',
      title: 'Week Start Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'sessions',
      title: 'Training Sessions',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'trainingSession'}]}]
    },
    {
      name: 'notes',
      title: 'Plan Notes',
      type: 'text'
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ]
}
```

### TrainingSession Schema
```javascript
export default {
  name: 'trainingSession',
  title: 'Training Session',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Session Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'date',
      title: 'Session Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'distance',
      title: 'Distance (km)',
      type: 'number'
    },
    {
      name: 'duration',
      title: 'Duration (minutes)',
      type: 'number'
    },
    {
      name: 'intensity',
      title: 'Intensity',
      type: 'string',
      options: {
        list: [
          {title: 'Easy', value: 'easy'},
          {title: 'Moderate', value: 'moderate'},
          {title: 'Hard', value: 'hard'},
          {title: 'Very Hard', value: 'very_hard'}
        ]
      }
    },
    {
      name: 'description',
      title: 'Session Description',
      type: 'text'
    },
    {
      name: 'notes',
      title: 'Coach Notes',
      type: 'text'
    },
    {
      name: 'trainingPlan',
      title: 'Training Plan',
      type: 'reference',
      to: [{type: 'trainingPlan'}],
      validation: Rule => Rule.required()
    }
  ]
}
```

### WorkoutLog Schema
```javascript
export default {
  name: 'workoutLog',
  title: 'Workout Log',
  type: 'document',
  fields: [
    {
      name: 'session',
      title: 'Training Session',
      type: 'reference',
      to: [{type: 'trainingSession'}],
      validation: Rule => Rule.required()
    },
    {
      name: 'runner',
      title: 'Runner',
      type: 'reference',
      to: [{type: 'user'}],
      validation: Rule => Rule.required()
    },
    {
      name: 'status',
      title: 'Completion Status',
      type: 'string',
      options: {
        list: [
          {title: 'Completed', value: 'completed'},
          {title: 'DNF (Did Not Finish)', value: 'dnf'},
          {title: 'Undone', value: 'undone'}
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'externalLink',
      title: 'Strava/Garmin Link',
      type: 'url'
    },
    {
      name: 'personalNotes',
      title: 'Personal Notes',
      type: 'text'
    },
    {
      name: 'feeling',
      title: 'How did you feel?',
      type: 'string',
      options: {
        list: [
          {title: 'Great', value: 'great'},
          {title: 'Good', value: 'good'},
          {title: 'Okay', value: 'okay'},
          {title: 'Tired', value: 'tired'},
          {title: 'Exhausted', value: 'exhausted'}
        ]
      }
    },
    {
      name: 'injuries',
      title: 'Injuries/Pain',
      type: 'text'
    },
    {
      name: 'reviewedByCoach',
      title: 'Reviewed by Coach',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'loggedAt',
      title: 'Logged At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ]
}
```

### Feedback Schema
```javascript
export default {
  name: 'feedback',
  title: 'Feedback',
  type: 'document',
  fields: [
    {
      name: 'workoutLog',
      title: 'Workout Log',
      type: 'reference',
      to: [{type: 'workoutLog'}],
      validation: Rule => Rule.required()
    },
    {
      name: 'coach',
      title: 'Coach',
      type: 'reference',
      to: [{type: 'user'}],
      validation: Rule => Rule.required()
    },
    {
      name: 'runner',
      title: 'Runner',
      type: 'reference',
      to: [{type: 'user'}],
      validation: Rule => Rule.required()
    },
    {
      name: 'message',
      title: 'Feedback Message',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'type',
      title: 'Feedback Type',
      type: 'string',
      options: {
        list: [
          {title: 'Coach to Runner', value: 'coach_to_runner'},
          {title: 'Runner to Coach', value: 'runner_to_coach'}
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ]
}
```

---

_This document serves as the comprehensive guide for all development work on the นาเชยไม่เคยมีโค้ชว่าง project. All team members should follow these guidelines to ensure consistent, high-quality development._
