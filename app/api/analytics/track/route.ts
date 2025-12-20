import { NextRequest, NextResponse } from 'next/server';
import { addVisitor } from '@/lib/analytics-storage';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const visitorCookie = cookieStore.get('visitor_session');
    
    let sessionId: string;
    
    if (visitorCookie?.value) {
      sessionId = visitorCookie.value;
    } else {
      // Generate new session ID
      sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      // Set cookie (expires in 1 year)
      const response = NextResponse.json({ success: true, sessionId });
      response.cookies.set('visitor_session', sessionId, {
        maxAge: 365 * 24 * 60 * 60,
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
      });
      
      // Track new visitor
      addVisitor(sessionId);
      
      return response;
    }

    // Existing visitor - check if we should count again
    // We only count once per day per session
    const today = new Date().toISOString().split('T')[0];
    const lastVisitCookie = cookieStore.get(`last_visit_${today}`);
    
    if (!lastVisitCookie) {
      // First visit today for this session
      addVisitor(sessionId);
      
      const response = NextResponse.json({ success: true, sessionId, counted: true });
      response.cookies.set(`last_visit_${today}`, 'true', {
        maxAge: 24 * 60 * 60, // 24 hours
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
      });
      
      return response;
    }

    return NextResponse.json({ success: true, sessionId, counted: false });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json(
      { error: 'Failed to track visitor' },
      { status: 500 }
    );
  }
}

