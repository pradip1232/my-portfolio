import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: string;
  content: string;
}

interface RequestBody {
  messages: Message[];
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
      return NextResponse.json(
        { message: 'AI service is currently unavailable. Please try again later.' },
        { status: 200 }
      );
    }

    const body: RequestBody = await req.json();

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { message: 'Invalid request format.' },
        { status: 200 }
      );
    }

    const latestMessage = body.messages[body.messages.length - 1];
    const userMessage = latestMessage.content;

    const systemInstruction = "You are Pradip Mourya's AI assistant. Answer only about his skills, projects, and experience. Be confident and professional.";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemInstruction}\n\nUser: ${userMessage}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: 'AI service is currently unavailable. Please try again later.' },
        { status: 200 }
      );
    }

    const data = await response.json();
    const aiMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiMessage) {
      return NextResponse.json(
        { message: 'AI service is currently unavailable. Please try again later.' },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    return NextResponse.json(
      { message: 'AI service is currently unavailable. Please try again later.' },
      { status: 200 }
    );
  }
}
