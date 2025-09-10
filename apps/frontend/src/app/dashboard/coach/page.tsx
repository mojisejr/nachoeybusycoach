'use client';

import { useSession } from 'next-auth/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CoachDashboard from '@/components/training/CoachDashboard';
import { TrainingSession } from '@/types/training';

interface Runner {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  totalSessions: number;
  completedSessions: number;
  weeklyDistance: number;
  lastActivity?: string;
  status: 'active' | 'inactive' | 'new';
}

function CoachPageContent() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Mock data for development
  const mockRunners: Runner[] = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      totalSessions: 20,
      completedSessions: 17,
      weeklyDistance: 45,
      lastActivity: '2024-01-15',
      status: 'active'
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      totalSessions: 15,
      completedSessions: 14,
      weeklyDistance: 38,
      lastActivity: '2024-01-14',
      status: 'active'
    },
    {
      _id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      totalSessions: 12,
      completedSessions: 8,
      weeklyDistance: 25,
      lastActivity: '2024-01-12',
      status: 'inactive'
    }
  ];

  const mockSessions: TrainingSession[] = [
    {
      _id: '1',
      planId: 'plan-1',
      date: '2024-01-15',
      title: 'Easy Run',
      type: 'easy_run',
      distance: 5,
      duration: 30,
      intensity: 'easy',
      status: 'completed',
      notes: 'Felt good, steady pace',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      _id: '2',
      planId: 'plan-1',
      date: '2024-01-16',
      title: 'Interval Training',
      type: 'interval',
      distance: 8,
      duration: 45,
      intensity: 'hard',
      status: 'scheduled',
      notes: '4x1km intervals',
      createdAt: '2024-01-16T10:00:00Z',
      updatedAt: '2024-01-16T10:00:00Z'
    },
    {
      _id: '3',
      planId: 'plan-2',
      date: '2024-01-15',
      title: 'Long Run',
      type: 'long_run',
      distance: 15,
      duration: 90,
      intensity: 'moderate',
      status: 'completed',
      notes: 'Long steady run',
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    }
  ];

  const handleViewRunner = (runnerId: string) => {
    console.log('Viewing runner:', runnerId);
    // TODO: Navigate to runner detail page
  };

  const handleCreatePlan = (runnerId: string) => {
    console.log('Creating plan for runner:', runnerId);
    // TODO: Navigate to plan creation page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Coach Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.name || 'Coach'}! Manage your runners and training plans.
        </p>
      </div>

      <div className="space-y-6">
        <CoachDashboard
          runners={mockRunners}
          sessions={mockSessions}
          loading={false}
          onViewRunner={handleViewRunner}
          onCreatePlan={handleCreatePlan}
        />
      </div>
    </div>
  );
}

export default function CoachPage() {
  return (
    <ProtectedRoute requiredRole="coach">
      <CoachPageContent />
    </ProtectedRoute>
  );
}