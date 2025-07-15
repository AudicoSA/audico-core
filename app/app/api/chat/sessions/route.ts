
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, categoryId } = await request.json();

    if (!sessionId || !categoryId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Session ID and category ID are required' 
        },
        { status: 400 }
      );
    }

    // Create initial chat session record
    const session = await prisma.chatSession.create({
      data: {
        session_id: sessionId,
        category_id: categoryId,
        message_type: 'system',
        content: 'Chat session initialized',
      }
    });

    return NextResponse.json({
      success: true,
      session: session
    });

  } catch (error) {
    console.error('Error creating chat session:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Session ID is required' 
        },
        { status: 400 }
      );
    }

    const messages = await prisma.chatSession.findMany({
      where: {
        session_id: sessionId
      },
      orderBy: {
        created_at: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      messages: messages || []
    });

  } catch (error) {
    console.error('Error fetching chat session:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
