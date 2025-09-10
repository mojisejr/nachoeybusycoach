import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/sanity/lib/client';

// Import auth configuration
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }: any) => {
      if (session?.user) {
        (session.user as any).role = token.role || "runner";
        (session.user as any).id = token.sub;
      }
      return session;
    },
    jwt: async ({ user, token }: any) => {
      if (user) {
        token.role = "runner";
      }
      return token;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
};

// GET /api/analytics/runner/[id] - Get comprehensive runner analytics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const runnerId = id;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days
    const timeframe = searchParams.get("timeframe") || "all"; // all, week, month, year

    // Validate period parameter
    const periodDays = parseInt(period);
    if (isNaN(periodDays) || periodDays < 1 || periodDays > 365) {
      return NextResponse.json(
        { error: "Invalid period. Must be between 1-365 days" },
        { status: 400 }
      );
    }

    // Validate timeframe parameter
    const validTimeframes = ['all', 'week', 'month', 'year'];
    if (!validTimeframes.includes(timeframe)) {
      return NextResponse.json(
        { error: `Invalid timeframe. Must be one of: ${validTimeframes.join(', ')}` },
        { status: 400 }
      );
    }

    // Calculate date range based on timeframe
    let dateFilter = '';
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
    }

    if (timeframe !== 'all') {
      dateFilter = ` && _createdAt >= "${startDate.toISOString()}"`;
    }

    // Get comprehensive workout statistics
    const statsQuery = `
      {
        "totalWorkouts": *[_type == "workoutLog" && runnerId._ref == "${runnerId}" && status == "completed"${dateFilter}] | length,
        "completedWorkouts": *[_type == "workoutLog" && runnerId._ref == "${runnerId}" && status == "completed"${dateFilter}] | length,
        "dnfWorkouts": *[_type == "workoutLog" && runnerId._ref == "${runnerId}" && status == "dnf"${dateFilter}] | length,
        "undoneWorkouts": *[_type == "workoutLog" && runnerId._ref == "${runnerId}" && status == "undone"${dateFilter}] | length,
        "totalDistance": *[_type == "workoutLog" && runnerId._ref == "${runnerId}" && status == "completed"${dateFilter} && defined(actualDistance)] | sum(actualDistance),
        "totalDuration": *[_type == "workoutLog" && runnerId._ref == "${runnerId}" && status == "completed"${dateFilter} && defined(actualDuration)] | sum(actualDuration),
        "averageDistance": *[_type == "workoutLog" && runnerId._ref == "${runnerId}" && status == "completed"${dateFilter} && defined(actualDistance)] | avg(actualDistance),
        "averageDuration": *[_type == "workoutLog" && runnerId._ref == "${runnerId}" && status == "completed"${dateFilter} && defined(actualDuration)] | avg(actualDuration),
        "workoutsByType": *[_type == "workoutLog" && runnerId._ref == "${runnerId}" && status == "completed"${dateFilter}] {
          "workoutType": sessionId->workoutType,
          actualDistance,
          actualDuration
        } | group(workoutType) {
          "type": @[0].workoutType,
          "count": length(@),
          "totalDistance": sum(@[].actualDistance),
          "totalDuration": sum(@[].actualDuration)
        },
        "feelingDistribution": *[_type == "workoutLog" && runnerId._ref == "${runnerId}" && status == "completed"${dateFilter} && defined(feeling)] | group(feeling) {
          "feeling": @[0].feeling,
          "count": length(@)
        },
        "injuryCount": *[_type == "workoutLog" && runnerId._ref == "${runnerId}"${dateFilter} && defined(injuries) && length(injuries) > 0] | length,
        "recentWorkouts": *[_type == "workoutLog" && runnerId._ref == "${runnerId}"${dateFilter}] | order(_createdAt desc) [0..4] {
          _id,
          _createdAt,
          status,
          actualDistance,
          actualDuration,
          feeling,
          "session": sessionId->{
            workoutType,
            plannedDistance,
            plannedDuration
          }
        }
      }
    `;

    const stats = await client.fetch(statsQuery);

    // Calculate additional metrics
    const completionRate = stats.totalWorkouts > 0 
      ? (stats.completedWorkouts / stats.totalWorkouts) * 100 
      : 0;

    const averagePace = stats.totalDistance > 0 && stats.totalDuration > 0
      ? stats.totalDuration / stats.totalDistance // minutes per km
      : 0;

    // Get weekly trends for the last 8 weeks
    const weeklyTrendsQuery = `
      *[_type == "workoutLog" && runnerId._ref == "${runnerId}" && status == "completed" && _createdAt >= "${new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000).toISOString()}"] {
        _createdAt,
        actualDistance,
        actualDuration
      } | order(_createdAt asc)
    `;

    const weeklyData = await client.fetch(weeklyTrendsQuery);

    // Group by week
    const weeklyTrends = [];
    const weekMap = new Map();

    weeklyData.forEach((workout: any) => {
      const date = new Date(workout._createdAt);
      const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, {
          week: weekKey,
          totalDistance: 0,
          totalDuration: 0,
          workoutCount: 0
        });
      }

      const weekData = weekMap.get(weekKey);
      weekData.totalDistance += workout.actualDistance || 0;
      weekData.totalDuration += workout.actualDuration || 0;
      weekData.workoutCount += 1;
    });

    weeklyTrends.push(...Array.from(weekMap.values()).sort((a, b) => a.week.localeCompare(b.week)));

    const analytics = {
      summary: {
        totalWorkouts: stats.totalWorkouts,
        completedWorkouts: stats.completedWorkouts,
        dnfWorkouts: stats.dnfWorkouts,
        undoneWorkouts: stats.undoneWorkouts,
        completionRate: Math.round(completionRate * 100) / 100,
        totalDistance: Math.round((stats.totalDistance || 0) * 100) / 100,
        totalDuration: Math.round((stats.totalDuration || 0) * 100) / 100,
        averageDistance: Math.round((stats.averageDistance || 0) * 100) / 100,
        averageDuration: Math.round((stats.averageDuration || 0) * 100) / 100,
        averagePace: Math.round(averagePace * 100) / 100,
        injuryCount: stats.injuryCount
      },
      workoutsByType: stats.workoutsByType || [],
      feelingDistribution: stats.feelingDistribution || [],
      weeklyTrends,
      recentWorkouts: stats.recentWorkouts || [],
      period: {
        timeframe,
        days: periodDays,
        startDate: timeframe !== 'all' ? startDate.toISOString() : null,
        endDate: now.toISOString()
      }
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching runner analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}