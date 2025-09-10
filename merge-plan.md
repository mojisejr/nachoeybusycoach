# Frontend-Backend Merge Plan

## Overview

This document outlines a comprehensive plan to merge the separate frontend and backend Next.js applications into a single fullstack Next.js application. The plan is divided into phases that fit within 200k context windows to prevent context loss during implementation.

## Current State Analysis

### Frontend (`apps/frontend`)
- **Framework**: Next.js 15.5.2
- **Key Dependencies**: Axios, React Hook Form, Zod, Zustand
- **Structure**: App Router with components, hooks, services, store, types, utils
- **Port**: Default (3000)

### Backend (`apps/backend`)
- **Framework**: Next.js 15.5.2
- **Key Dependencies**: Sanity, NextAuth, Zod
- **Structure**: App Router with API routes, auth, dashboard, Sanity studio
- **Port**: 3001
- **Features**: Authentication, Sanity CMS, API endpoints

## Migration Strategy

Use the backend as the base application since it already has:
- Authentication system (NextAuth)
- Database integration (Sanity)
- API infrastructure
- Production-ready configuration

---

## Phase 1: Preparation and Backup (Context: ~50k tokens)

### Objectives
- Create backup of current state
- Analyze dependencies and conflicts
- Prepare merge environment

### Tasks

#### 1.1 Backup Current State
```bash
# Create backup branch
git checkout -b backup-before-merge
git add .
git commit -m "Backup before frontend-backend merge"
git push origin backup-before-merge
```

#### 1.2 Dependency Analysis
- [ ] Compare `package.json` files
- [ ] Identify conflicting dependencies
- [ ] Plan dependency resolution strategy
- [ ] Document version conflicts

#### 1.3 Environment Setup
- [ ] Create new branch for merge: `git checkout -b merge-frontend-backend`
- [ ] Backup environment files
- [ ] Document current environment variables

#### 1.4 Documentation
- [ ] Document current API endpoints
- [ ] List all frontend routes
- [ ] Map component dependencies
- [ ] Identify shared utilities

### Deliverables
- Backup branch created
- Dependency conflict analysis document
- Environment variable mapping
- Component and route inventory

### Success Criteria
- ✅ Complete backup created and verified
- ✅ All dependencies documented with versions
- ✅ Potential conflicts identified and categorized
- ✅ Development branch created and tested
- ✅ Team has access to rollback procedures

### Risk Management
- **Risk**: Incomplete backup
  - *Mitigation*: Verify backup integrity, test restore process
- **Risk**: Missing dependency conflicts
  - *Mitigation*: Use automated tools for dependency analysis
- **Risk**: Development branch corruption
  - *Mitigation*: Create multiple backup branches, use Git tags

---

## Phase 2: Directory Structure Setup (Context: ~75k tokens)

### Objectives
- Create unified directory structure
- Prepare destination folders
- Set up shared packages integration

### Tasks

#### 2.1 Create Unified Structure in Backend
```
apps/backend/src/
├── app/
│   ├── (auth)/          # Auth-related pages
│   ├── (dashboard)/     # Dashboard pages (from frontend)
│   ├── api/             # Existing API routes
│   ├── auth/            # Existing auth pages
│   ├── studio/          # Sanity studio
│   └── globals.css      # Merged styles
├── components/          # Merged UI components
│   ├── ui/              # Shared UI components
│   ├── forms/           # Form components
│   ├── dashboard/       # Dashboard-specific components
│   └── auth/            # Auth components
├── hooks/               # Merged custom hooks
├── lib/                 # Merged utilities
│   ├── auth.ts          # Existing auth config
│   ├── sanity.ts        # Existing Sanity config
│   ├── api.ts           # API utilities (from frontend)
│   ├── validations/     # Existing validations
│   └── utils.ts         # General utilities
├── services/            # API services (from frontend)
├── store/               # State management (from frontend)
├── types/               # Merged type definitions
└── utils/               # Utility functions
```

#### 2.2 Directory Creation
- [ ] Create missing directories in backend
- [ ] Set up proper folder permissions
- [ ] Initialize index files where needed

#### 2.3 Shared Packages Integration
- [ ] Update imports to use shared packages
- [ ] Verify package dependencies
- [ ] Test shared package accessibility

### Deliverables
- Unified directory structure
- Proper folder hierarchy
- Shared packages integration

### Success Criteria
- ✅ All required directories created with proper permissions
- ✅ Path aliases working correctly in TypeScript
- ✅ .gitignore properly excludes unnecessary files
- ✅ Directory structure matches planned architecture
- ✅ No broken imports or path references

### Risk Management
- **Risk**: Path alias conflicts
  - *Mitigation*: Test imports after each alias configuration
- **Risk**: Permission issues on directories
  - *Mitigation*: Verify write permissions, use consistent ownership
- **Risk**: .gitignore conflicts
  - *Mitigation*: Merge .gitignore files carefully, test with git status

---

## Phase 3: Component Migration (Context: ~150k tokens)

### Objectives
- Migrate all frontend components to backend
- Resolve component conflicts
- Update import paths

### Tasks

#### 3.1 UI Components Migration
- [ ] Copy `apps/frontend/src/components/ui/` to `apps/backend/src/components/ui/`
- [ ] Update import paths in copied components
- [ ] Resolve styling conflicts
- [ ] Test component rendering

#### 3.2 Feature Components Migration
- [ ] Copy dashboard components
- [ ] Copy form components
- [ ] Copy layout components
- [ ] Update component imports

#### 3.3 Component Integration
- [ ] Merge similar components
- [ ] Remove duplicate components
- [ ] Update component exports
- [ ] Create component index files

#### 3.4 Import Path Updates
```typescript
// Update imports from:
import { Button } from '../../../components/ui/button'
// To:
import { Button } from '@/components/ui/button'
```

### Files to Migrate
- All files from `apps/frontend/src/components/`
- Update all import statements
- Merge with existing backend components

### Deliverables
- All components migrated
- Import paths updated
- Component conflicts resolved
- Working component library

### Success Criteria
- ✅ All components copied without data loss
- ✅ No broken imports or missing dependencies
- ✅ Components render correctly in new location
- ✅ TypeScript compilation successful
- ✅ All component props and interfaces working

### Risk Management
- **Risk**: Component dependency conflicts
  - *Mitigation*: Migrate dependencies incrementally, test each component
- **Risk**: Import path resolution failures
  - *Mitigation*: Use absolute imports, update tsconfig paths
- **Risk**: Component styling issues
  - *Mitigation*: Verify CSS/Tailwind classes, test responsive design

---

## Phase 4: Hooks and Utilities Migration (Context: ~100k tokens)

### Objectives
- Migrate custom hooks
- Merge utility functions
- Update service integrations

### Tasks

#### 4.1 Custom Hooks Migration
- [ ] Copy `apps/frontend/src/hooks/` to `apps/backend/src/hooks/`
- [ ] Update hook dependencies
- [ ] Resolve hook conflicts
- [ ] Test hook functionality

#### 4.2 Utilities Migration
- [ ] Copy `apps/frontend/src/utils/` to `apps/backend/src/utils/`
- [ ] Merge with existing backend utilities
- [ ] Remove duplicate functions
- [ ] Update utility imports

#### 4.3 Services Migration
- [ ] Copy `apps/frontend/src/services/` to `apps/backend/src/services/`
- [ ] Update API base URLs
- [ ] Configure service endpoints
- [ ] Test API connections

#### 4.4 Library Integration
- [ ] Merge `apps/frontend/src/lib/` with `apps/backend/src/lib/`
- [ ] Update configuration files
- [ ] Resolve library conflicts
- [ ] Test library functions

### Deliverables
- All hooks migrated and working
- Utilities merged and functional
- Services configured correctly
- Library integration complete

### Success Criteria
- ✅ All custom hooks working with proper state management
- ✅ Utility functions returning expected results
- ✅ No circular dependencies introduced
- ✅ TypeScript types properly exported and imported
- ✅ Hook dependencies (React, external libs) resolved

### Risk Management
- **Risk**: Hook state management conflicts
  - *Mitigation*: Test hooks in isolation, verify React context providers
- **Risk**: Utility function side effects
  - *Mitigation*: Unit test all utilities, check for global state dependencies
- **Risk**: Circular import dependencies
  - *Mitigation*: Use dependency graph analysis, refactor if needed

---

## Phase 5: State Management and Types (Context: ~125k tokens)

### Objectives
- Migrate Zustand store
- Merge type definitions
- Update state management

### Tasks

#### 5.1 State Store Migration
- [ ] Copy `apps/frontend/src/store/` to `apps/backend/src/store/`
- [ ] Update store configurations
- [ ] Test state persistence
- [ ] Verify store functionality

#### 5.2 Type Definitions
- [ ] Copy `apps/frontend/src/types/` to `apps/backend/src/types/`
- [ ] Merge with existing backend types
- [ ] Remove duplicate type definitions
- [ ] Update type imports

#### 5.3 Type Integration
- [ ] Update shared package types
- [ ] Verify type consistency
- [ ] Fix type conflicts
- [ ] Test TypeScript compilation

### Deliverables
- State management migrated
- Type definitions merged
- TypeScript compilation working
- State functionality verified

### Success Criteria
- ✅ All Zustand stores functioning correctly
- ✅ State persistence working (if applicable)
- ✅ TypeScript compilation with no type errors
- ✅ Store subscriptions and updates working
- ✅ Type definitions properly exported and accessible

### Risk Management
- **Risk**: State synchronization issues
  - *Mitigation*: Test state updates across components, verify store isolation
- **Risk**: Type definition conflicts
  - *Mitigation*: Use namespace imports, check for duplicate type names
- **Risk**: Store hydration failures
  - *Mitigation*: Test SSR compatibility, verify client-side hydration

---

## Phase 6: Page and Route Migration (Context: ~175k tokens)

### Objectives
- Migrate frontend pages
- Resolve route conflicts
- Update navigation

### Tasks

#### 6.1 Page Structure Analysis
- [ ] Map frontend routes to backend structure
- [ ] Identify route conflicts
- [ ] Plan route resolution strategy

#### 6.2 Page Migration
- [ ] Copy dashboard pages from frontend
- [ ] Update page imports
- [ ] Resolve layout conflicts
- [ ] Test page rendering

#### 6.3 Route Configuration
- [ ] Update Next.js routing
- [ ] Configure route groups
- [ ] Set up protected routes
- [ ] Test navigation

#### 6.4 Layout Integration
- [ ] Merge layout components
- [ ] Update layout structure
- [ ] Configure nested layouts
- [ ] Test responsive design

### Route Mapping
```
Frontend Routes → Backend Routes
/dashboard → /(dashboard)/dashboard
/profile → /(dashboard)/profile
/workouts → /(dashboard)/workouts
/login → /auth/login (existing)
/register → /auth/register (existing)
```

### Deliverables
- All pages migrated
- Routes configured correctly
- Navigation working
- Layouts integrated

### Success Criteria
- ✅ All routes accessible and rendering correctly
- ✅ No 404 errors on migrated pages
- ✅ Navigation menus updated with correct links
- ✅ Route parameters and dynamic routes working
- ✅ SEO metadata preserved on all pages

### Risk Management
- **Risk**: Route conflicts causing 404s
  - *Mitigation*: Create route mapping document, test all URLs
- **Risk**: Dynamic route parameter issues
  - *Mitigation*: Test with various parameter values, verify type safety
- **Risk**: Navigation state loss
  - *Mitigation*: Test navigation flows, verify breadcrumbs and back buttons

---

## Phase 7: Configuration and Dependencies (Context: ~100k tokens)

### Objectives
- Merge package.json files
- Update configurations
- Resolve dependency conflicts

### Tasks

#### 7.1 Package.json Merge
```json
{
  "dependencies": {
    "next": "15.5.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@sanity/vision": "^3.68.0",
    "next-auth": "5.0.0-beta.25",
    "zod": "^3.24.1",
    "axios": "^1.7.9",
    "react-hook-form": "^7.54.2",
    "zustand": "^5.0.2",
    "@hookform/resolvers": "^3.10.0"
  }
}
```

#### 7.2 Configuration Updates
- [ ] Update `next.config.ts`
- [ ] Merge Tailwind configurations
- [ ] Update TypeScript config
- [ ] Configure ESLint rules

#### 7.3 Environment Variables
- [ ] Merge environment files
- [ ] Update API endpoints
- [ ] Configure authentication
- [ ] Set up Sanity connection

#### 7.4 Build Configuration
- [ ] Update build scripts
- [ ] Configure development server
- [ ] Set up production build
- [ ] Test build process

### Deliverables
- Dependencies merged
- Configurations updated
- Environment variables set
- Build process working

### Success Criteria
- ✅ `pnpm install` completes without errors
- ✅ No dependency version conflicts
- ✅ TypeScript compilation successful
- ✅ ESLint passes with no errors
- ✅ Tailwind CSS classes working correctly
- ✅ Next.js build completes successfully

### Risk Management
- **Risk**: Dependency version conflicts
  - *Mitigation*: Use exact versions, test compatibility matrix
- **Risk**: Configuration merge conflicts
  - *Mitigation*: Backup original configs, merge incrementally
- **Risk**: Build process failures
  - *Mitigation*: Test build after each config change, maintain working state

---

## Phase 8: Testing and Cleanup (Context: ~125k tokens)

### Objectives
- Test merged application
- Fix integration issues
- Clean up unused files

### Tasks

#### 8.1 Integration Testing
- [ ] Test authentication flow
- [ ] Verify API endpoints
- [ ] Test page navigation
- [ ] Check component rendering

#### 8.2 Functionality Testing
- [ ] Test dashboard features
- [ ] Verify form submissions
- [ ] Check state management
- [ ] Test responsive design

#### 8.3 Performance Testing
- [ ] Check build performance
- [ ] Test page load times
- [ ] Verify bundle size
- [ ] Optimize if needed

#### 8.4 Cleanup
- [ ] Remove unused files
- [ ] Clean up import statements
- [ ] Remove duplicate code
- [ ] Update documentation

### Deliverables
- Fully functional merged application
- All tests passing
- Clean codebase
- Updated documentation

### Success Criteria
- ✅ All automated tests passing
- ✅ Manual testing completed without critical issues
- ✅ Performance metrics meet requirements
- ✅ No unused dependencies or dead code
- ✅ Documentation updated and accurate
- ✅ Code quality metrics maintained

### Risk Management
- **Risk**: Critical bugs discovered late
  - *Mitigation*: Implement staged testing, maintain rollback capability
- **Risk**: Performance degradation
  - *Mitigation*: Monitor bundle size, use performance profiling tools
- **Risk**: Incomplete cleanup causing issues
  - *Mitigation*: Use automated tools for dead code detection, peer review

---

## Phase 9: Final Migration and Deployment (Context: ~75k tokens)

### Objectives
- Finalize migration
- Update workspace configuration
- Prepare for deployment

### Tasks

#### 9.1 Workspace Updates
- [ ] Update `pnpm-workspace.yaml`
- [ ] Remove frontend app reference
- [ ] Update root package.json scripts
- [ ] Test workspace commands

#### 9.2 Documentation Updates
- [ ] Update README files
- [ ] Document new structure
- [ ] Update development guide
- [ ] Create migration notes

#### 9.3 Deployment Preparation
- [ ] Update deployment scripts
- [ ] Configure production environment
- [ ] Test production build
- [ ] Verify deployment process

#### 9.4 Final Cleanup
- [ ] Remove `apps/frontend` directory
- [ ] Update git ignore files
- [ ] Clean up unused dependencies
- [ ] Final code review

### Deliverables
- Single fullstack application
- Updated workspace configuration
- Deployment-ready application
- Complete documentation

### Success Criteria
- ✅ Staging deployment successful with no critical issues
- ✅ Production deployment completed without downtime
- ✅ All external integrations working (OAuth, APIs)
- ✅ Performance metrics within acceptable ranges
- ✅ Monitoring and alerting systems active
- ✅ User acceptance testing passed

### Risk Management
- **Risk**: Production deployment failures
  - *Mitigation*: Blue-green deployment strategy, immediate rollback plan
- **Risk**: External service integration issues
  - *Mitigation*: Test all integrations in staging, have fallback options
- **Risk**: Performance issues under load
  - *Mitigation*: Load testing in staging, gradual traffic rollout
- **Risk**: Data loss or corruption
  - *Mitigation*: Database backups before deployment, data validation checks

---

## Post-Migration Structure

```
/nachoeybusycoach
├── apps/
│   └── fullstack/          # Merged application
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── services/
│       │   ├── store/
│       │   ├── types/
│       │   └── utils/
│       ├── package.json
│       └── ...
├── packages/
│   ├── types/
│   ├── ui/
│   └── utils/
├── docs/
└── package.json
```

## Benefits After Merge

1. **Simplified Architecture**: Single application to maintain
2. **Better Developer Experience**: No need to run multiple servers
3. **Shared Dependencies**: Reduced bundle size and complexity
4. **Unified Routing**: Consistent navigation and URL structure
5. **Easier Deployment**: Single build and deployment process
6. **Better Performance**: Optimized builds and reduced overhead

## Risk Mitigation

- **Backup Strategy**: Complete backup before starting
- **Incremental Migration**: Phase-by-phase approach
- **Testing at Each Phase**: Verify functionality before proceeding
- **Rollback Plan**: Ability to revert to backup if needed
- **Context Management**: Each phase fits within 200k token limit

## Success Criteria

- [ ] Single working Next.js application
- [ ] All frontend features preserved
- [ ] All backend functionality maintained
- [ ] Authentication working correctly
- [ ] API endpoints functional
- [ ] Responsive design preserved
- [ ] Performance maintained or improved
- [ ] Clean, maintainable codebase

---

*This merge plan ensures a systematic approach to combining the frontend and backend applications while maintaining functionality and avoiding context loss during implementation.*