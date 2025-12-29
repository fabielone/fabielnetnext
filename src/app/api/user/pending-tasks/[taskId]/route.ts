// PATCH /api/user/pending-tasks/[taskId] - Update task (dismiss/snooze/complete)

import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { dismissTask, snoozeTask, completeTask } from '@/lib/questionnaire/service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const session = await validateSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId } = await params;
    const body = await request.json();
    const { action, snoozeUntil } = body;

    let result;

    switch (action) {
      case 'dismiss':
        result = await dismissTask(taskId, session.user.id);
        break;
      case 'snooze':
        if (!snoozeUntil) {
          return NextResponse.json(
            { error: 'snoozeUntil is required for snooze action' },
            { status: 400 }
          );
        }
        result = await snoozeTask(taskId, session.user.id, new Date(snoozeUntil));
        break;
      case 'complete':
        result = await completeTask(taskId, session.user.id);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: dismiss, snooze, or complete' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, task: result });
  } catch (error: any) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update task' },
      { status: 500 }
    );
  }
}
