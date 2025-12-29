// GET /api/user/pending-tasks - Get user's pending tasks
// PATCH /api/user/pending-tasks - Update task status (dismiss/snooze)

import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { getUserPendingTasks } from '@/lib/questionnaire/service';

export async function GET() {
  try {
    const session = await validateSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tasks = await getUserPendingTasks(session.user.id);

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Get pending tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to get pending tasks' },
      { status: 500 }
    );
  }
}
