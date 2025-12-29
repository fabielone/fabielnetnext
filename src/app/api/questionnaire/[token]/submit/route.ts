// POST /api/questionnaire/[token]/submit - Submit completed questionnaire

import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { submitQuestionnaire } from '@/lib/questionnaire/service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await validateSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await params;
    const body = await request.json();
    const { responses } = body;

    const result = await submitQuestionnaire(token, session.user.id, responses);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Submit questionnaire error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit questionnaire' },
      { status: 500 }
    );
  }
}
