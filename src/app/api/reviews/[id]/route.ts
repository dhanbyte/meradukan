import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Review from '../../../../models/Review';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await req.json();
    const { status } = body;

    const review = await Review.findByIdAndUpdate(id, { status }, { new: true });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Review updated successfully',
      review
    });

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
