import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Review from '../../../models/Review';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'approved';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ status })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email');

    const totalReviews = await Review.countDocuments({ status });

    return NextResponse.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasNext: page * limit < totalReviews,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, userName, userEmail, rating, title, comment, images = [] } = body;

    // Check if user already reviewed
    const existingReview = await Review.findOne({ userId });
    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already submitted a review' },
        { status: 400 }
      );
    }

    const review = new Review({
      userId,
      userName,
      userEmail,
      rating: parseInt(rating),
      title,
      comment,
      images,
      status: 'approved' // Auto-approve for now
    });

    await review.save();

    return NextResponse.json({
      message: 'Review submitted successfully',
      review
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
