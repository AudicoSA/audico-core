
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Create a new quote
export async function POST(request: NextRequest) {
  try {
    const { sessionId, categoryId, customerEmail } = await request.json();

    if (!sessionId || !categoryId) {
      return NextResponse.json(
        { error: 'Session ID and category ID are required' },
        { status: 400 }
      );
    }

    // Check if quote already exists for this session
    let quote = await prisma.quote.findFirst({
      where: {
        session_id: sessionId,
        category_id: categoryId,
      },
      include: {
        quote_items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!quote) {
      // Create new quote
      quote = await prisma.quote.create({
        data: {
          session_id: sessionId,
          category_id: categoryId,
          customer_email: customerEmail,
          status: 'draft',
          total_amount: 0,
        },
        include: {
          quote_items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      quote,
    });

  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    );
  }
}

// Get quote for a session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const quote = await prisma.quote.findFirst({
      where: {
        session_id: sessionId,
      },
      include: {
        quote_items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      quote,
    });

  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    );
  }
}
