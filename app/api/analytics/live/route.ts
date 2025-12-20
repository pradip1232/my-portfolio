import { NextRequest } from 'next/server';
import {
  addLiveVisitor,
  removeLiveVisitor,
  readLiveVisitors,
  cleanupStaleLiveVisitors,
} from '@/lib/analytics-storage';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const visitorCookie = cookieStore.get('visitor_session');
    
    if (!visitorCookie?.value) {
      return new Response('Session required', { status: 400 });
    }

    const sessionId = visitorCookie.value;

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        let interval: NodeJS.Timeout | null = null;
        
        try {
          // Add visitor to live list
          addLiveVisitor(sessionId);
          cleanupStaleLiveVisitors();

          // Send initial data
          const liveCount = readLiveVisitors().length;
          const data = JSON.stringify({ liveVisitors: liveCount });
          controller.enqueue(`data: ${data}\n\n`);

          // Set up interval to send updates
          interval = setInterval(() => {
            try {
              cleanupStaleLiveVisitors();
              const liveCount = readLiveVisitors().length;
              const data = JSON.stringify({ liveVisitors: liveCount });
              controller.enqueue(`data: ${data}\n\n`);
            } catch (error) {
              console.error('Error in SSE interval:', error);
              if (interval) clearInterval(interval);
              controller.close();
            }
          }, 5000); // Update every 5 seconds

          // Clean up on client disconnect
          request.signal.addEventListener('abort', () => {
            if (interval) clearInterval(interval);
            removeLiveVisitor(sessionId);
            try {
              controller.close();
            } catch (e) {
              // Ignore errors on close
            }
          });
        } catch (error) {
          console.error('Error in SSE stream:', error);
          if (interval) clearInterval(interval);
          removeLiveVisitor(sessionId);
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('Error setting up SSE:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

