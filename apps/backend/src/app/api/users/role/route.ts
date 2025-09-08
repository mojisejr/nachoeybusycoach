import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/lib/sanity';

/**
 * GET /api/users/role
 * Retrieves the authenticated user's role and related permissions
 */
export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session found' },
        { status: 401 }
      );
    }

    // Query Sanity for user role information by email
    const query = `*[_type == "user" && email == $email][0] {
      _id,
      name,
      email,
      role,
      coachId,
      "coach": coachId->{
        _id,
        name,
        email
      },
      "runners": *[_type == "user" && coachId._ref == ^._id] {
        _id,
        name,
        email,
        role
      }
    }`;

    const user = await client.fetch(query, { email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Determine permissions based on role
    let permissions: string[] = [];
    
    switch (user.role) {
      case 'coach':
        permissions = [
          'view_all_runners',
          'create_training_plans',
          'edit_training_plans',
          'view_workout_logs',
          'provide_feedback',
          'manage_runners'
        ];
        break;
      case 'runner':
        permissions = [
          'view_own_profile',
          'edit_own_profile',
          'view_training_plans',
          'log_workouts',
          'view_feedback'
        ];
        break;
      case 'admin':
        permissions = [
          'manage_all_users',
          'view_all_data',
          'system_administration',
          'manage_coaches',
          'manage_runners'
        ];
        break;
      default:
        permissions = ['view_own_profile'];
    }

    // Prepare response data
    const roleData = {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions,
      ...(user.role === 'runner' && user.coach && {
        coach: {
          id: user.coach._id,
          name: user.coach.name,
          email: user.coach.email
        }
      }),
      ...(user.role === 'coach' && user.runners && {
        runners: user.runners.map((runner: any) => ({
          id: runner._id,
          name: runner.name,
          email: runner.email,
          role: runner.role
        }))
      })
    };

    return NextResponse.json({
      success: true,
      data: roleData
    });

  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}