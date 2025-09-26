import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import mongoose from 'mongoose';
import Product, { type IProduct } from '../../../../models/Product';

// GET product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();

  try {
    const product = await Product.findById(id).lean();
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }

    const transformedProduct = {
      ...product,
      id: product._id.toString(),
      _id: product._id.toString()
    };

    return NextResponse.json({ 
      success: true,
      data: transformedProduct 
    });
    
  } catch (error) {
    console.error('Error in GET /api/products/[id]:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch product' 
    }, { status: 500 });
  }
}

// PUT - update product
// PUT - update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();

    try {
        const updateData = await request.json();
        
        const product = await Product.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).lean();
        
        if (!product) {
            return NextResponse.json({ 
                success: false, 
                error: 'Product not found' 
            }, { status: 404 });
        }

        const transformedProduct = {
            ...product,
            id: product._id.toString(),
            _id: product._id.toString()
        };

        return NextResponse.json({ 
            success: true,
            data: transformedProduct 
        });
        
    } catch (error) {
        console.error('Error in PUT /api/products/[id]:', error);
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to update product' 
        }, { status: 500 });
    }
}

// POST is not supported for this endpoint
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }


    return NextResponse.json({ 
      success: true, 
      message: 'Product and its reviews deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error in DELETE /api/products/[id]:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete product' 
    }, { status: 500 });
  }
}