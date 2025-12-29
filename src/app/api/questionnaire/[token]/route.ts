// GET /api/questionnaire/[token] - Get questionnaire by access token
// PATCH /api/questionnaire/[token] - Save progress

import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { 
  getQuestionnaireByToken, 
  saveQuestionnaireProgress 
} from '@/lib/questionnaire/service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await validateSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await params;
    const result = await getQuestionnaireByToken(token, session.user.id);

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json({
      questionnaire: result.questionnaire,
      sections: result.sections,
      stateConfig: result.stateConfig
    });
  } catch (error) {
    console.error('Get questionnaire error:', error);
    return NextResponse.json(
      { error: 'Failed to get questionnaire' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const { responses, currentSection } = body;

    const result = await saveQuestionnaireProgress(
      token,
      session.user.id,
      responses,
      currentSection
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Save questionnaire progress error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save progress' },
      { status: 500 }
    );
  }
}
