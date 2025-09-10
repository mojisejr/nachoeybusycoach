# นาเชยไม่เคยมีโค้ชว่าง (NachoeyBusyCoach)

แอปพลิเคชันศูนย์กลางการสื่อสารและบริหารจัดการระหว่างนักวิ่งและโค้ชส่วนตัว ที่ช่วยให้การฝึกซ้อมมีประสิทธิภาพและเข้าถึงได้ง่าย

## 🏗️ Monorepo Structure

```
nachoeybusycoach/
├── apps/
│   ├── frontend/          # Next.js UI for runners and coaches
│   └── backend/           # Next.js API and backend logic
├── packages/
│   ├── ui/               # Shared UI components
│   ├── utils/            # Shared utility functions
│   └── types/            # Shared TypeScript type definitions
├── docs/
├── .github/workflows/    # CI/CD workflows
├── pnpm-workspace.yaml   # pnpm workspace configuration
└── package.json          # Root package.json with shared dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mojisejr/nachoeybusycoach.git
cd nachoeybusycoach
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Copy environment files for both apps
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/backend/.env.example apps/backend/.env.local
```

4. Build all packages:
```bash
pnpm build
```

## 🛠️ Development

### Running Development Servers

```bash
# Start both frontend and backend development servers
pnpm dev

# Or run individually:
pnpm --filter frontend dev    # Frontend only (http://localhost:3000)
pnpm --filter backend dev     # Backend only (http://localhost:3001)
```

### Available Scripts

```bash
# Development
pnpm dev              # Start all development servers
pnpm build            # Build all apps and packages
pnpm lint             # Lint all code
pnpm type-check       # Run TypeScript type checking
pnpm test             # Run all tests

# Package-specific commands
pnpm --filter frontend [script]   # Run script in frontend app
pnpm --filter backend [script]    # Run script in backend app
pnpm --filter @repo/ui [script]   # Run script in UI package
```

### Working with Packages

This monorepo uses pnpm workspaces to manage shared packages:

- **@repo/ui**: Shared UI components (buttons, cards, forms)
- **@repo/utils**: Shared utility functions
- **@repo/types**: Shared TypeScript type definitions

#### Adding Dependencies

```bash
# Add to root (shared across all packages)
pnpm add [package]

# Add to specific app/package
pnpm --filter frontend add [package]
pnpm --filter @repo/ui add [package]
```

#### Using Shared Packages

```typescript
// In apps/frontend or apps/backend
import { Button } from '@repo/ui'
import { formatDate } from '@repo/utils'
import type { User } from '@repo/types'
```

## 🏛️ Architecture

### Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, DaisyUI
- **Backend**: Next.js API Routes, Sanity.io (Headless CMS)
- **Authentication**: NextAuth.js (Google, Facebook, Line)
- **Package Manager**: pnpm with workspaces
- **Deployment**: Vercel

### Key Features

- **For Runners**: View training schedules, log workouts, track progress
- **For Coaches**: Manage multiple runners, create training plans, provide feedback
- **Real-time Communication**: Comment system for coach-runner interaction
- **Progress Tracking**: Visual dashboards and analytics

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for specific package
pnpm --filter frontend test
```

## 📝 Code Quality

```bash
# Lint all code
pnpm lint

# Type check all TypeScript
pnpm type-check

# Format code (if prettier is configured)
pnpm format
```

## 🚀 Deployment

This project uses GitHub Actions for CI/CD:

1. **On Pull Request**: Runs tests, linting, and type checking
2. **On Merge to Main**: Deploys to Vercel automatically

### Manual Deployment

```bash
# Build for production
pnpm build

# Deploy to Vercel (requires Vercel CLI)
vercel --prod
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and ensure tests pass: `pnpm test`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use shared packages for common functionality
- Write tests for new features
- Follow the existing code style and conventions
- Update documentation when adding new features

## 📚 Documentation

- [Product Requirements Document](docs/PRD.md)
- [Development Workflows](docs/claude-template.md)
- [API Documentation](apps/backend/README.md)
- [Frontend Guide](apps/frontend/README.md)

## 🐛 Troubleshooting

### Common Issues

1. **pnpm install fails**: Make sure you're using Node.js 18+
2. **Type errors**: Run `pnpm type-check` to see detailed TypeScript errors
3. **Build fails**: Ensure all packages build successfully with `pnpm build`
4. **Development server issues**: Check that ports 3000 and 3001 are available

### Getting Help

- Check existing [GitHub Issues](https://github.com/mojisejr/nachoeybusycoach/issues)
- Create a new issue with detailed reproduction steps
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.