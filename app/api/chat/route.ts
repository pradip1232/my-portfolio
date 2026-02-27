import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are Atul Kumar's AI assistant. Answer only about his skills, projects, and experience. Be professional, concise, and helpful.`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: assistantMessage });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
