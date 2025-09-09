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

// GET /api/workout-logs/history - Retrieve workout history with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const runnerId = searchParams.get("runnerId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters. Page must be >= 1, limit must be between 1-100" },
        { status: 400 }
      );
    }

    let query = `*[_type == "workoutLog"`;
    const params: any = {};

    if (runnerId) {
      query += ` && runnerId._ref == $runnerId`;
      params.runnerId = runnerId;
    }

    if (startDate) {
      query += ` && _createdAt >= $startDate`;
      params.startDate = startDate;
    }

    if (endDate) {
      query += ` && _createdAt <= $endDate`;
      params.endDate = endDate;
    }

    if (status) {
      // Validate status parameter
      const validStatuses = ['completed', 'dnf', 'undone', 'pending'];
      if (!validStatuses.includes(status.toLowerCase())) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
      query += ` && status == $status`;
      params.status = status;
    }

    const offset = (page - 1) * limit;
    query += `] | order(_createdAt desc) [$offset...$end] {
      _id,
      _createdAt,
      _updatedAt,
      status,
      actualDistance,
      actualDuration,
      feeling,
      notes,
      stravaLink,
      garminLink,
      injuries,
      "runner": runnerId->{
        _id,
        name,
        email
      },
      "session": sessionId->{
        _id,
        plannedDistance,
        plannedDuration,
        workoutType,
        intensity,
        notes
      }
    }`;
    params.offset = offset;
    params.end = offset + limit - 1;

    const logs = await client.fetch(query, params);

    // Get total count for pagination
    let countQuery = `*[_type == "workoutLog"`;
    const countParams: any = {};

    if (runnerId) {
      countQuery += ` && runnerId._ref == $runnerId`;
      countParams.runnerId = runnerId;
    }

    if (startDate) {
      countQuery += ` && _createdAt >= $startDate`;
      countParams.startDate = startDate;
    }

    if (endDate) {
      countQuery += ` && _createdAt <= $endDate`;
      countParams.endDate = endDate;
    }

    if (status) {
      countQuery += ` && status == $status`;
      countParams.status = status;
    }

    countQuery += `] | length`;
    const total = await client.fetch(countQuery, countParams);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching workout history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}