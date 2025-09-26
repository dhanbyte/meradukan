import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const products = await request.json();
    
    // Validate that products is an array
    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Request body must be an array of products' },
        { status: 400 }
      );
    }

    // Insert products in bulk
    const result = await Product.insertMany(products, { ordered: false });
    
    return NextResponse.json({
      success: true,
      message: `Successfully added ${result.length} products`,
      insertedCount: result.length
    });

  } catch (error: any) {
    console.error('Bulk product creation error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      writeErrors: error.writeErrors?.length || 0,
      insertedCount: error.result?.insertedDocs?.length || 0
    });
    
    if (error.code === 11000) {
      // Extract duplicate information
      const duplicates = [];
      const inserted = error.result?.insertedDocs?.length || error.insertedDocs?.length || 0;
      
      console.log('Full error object:', JSON.stringify(error, null, 2));
      
      // Check different possible error structures
      const writeErrors = error.writeErrors || error.result?.writeErrors || [];
      
      for (const writeError of writeErrors) {
        if (writeError.code === 11000) {
          // Try different ways to extract the duplicate key
          const keyValue = writeError.keyValue || 
                          writeError.err?.keyValue || 
                          writeError.errmsg?.match(/dup key: \{ (\w+): "([^"]+)" \}/);
          
          if (keyValue) {
            let slug = keyValue.slug;
            if (!slug && Array.isArray(keyValue)) {
              slug = keyValue[2]; // From regex match
            }
            
            if (slug) {
              duplicates.push({
                slug: slug,
                error: 'Duplicate slug found'
              });
            }
          }
        }
      }
      
      // If no duplicates found in writeErrors, try to extract from error message
      if (duplicates.length === 0 && error.errmsg) {
        const match = error.errmsg.match(/dup key: \{ slug: "([^"]+)" \}/);
        if (match) {
          duplicates.push({
            slug: match[1],
            error: 'Duplicate slug found'
          });
        }
      }
      
      console.log(`✅ Successfully inserted: ${inserted} products`);
      console.log(`❌ Duplicate products found:`, duplicates);
      
      return NextResponse.json({
        error: 'Some products were duplicates and skipped',
        inserted: inserted,
        duplicates: duplicates,
        message: `${inserted} products added successfully, ${duplicates.length} duplicates skipped`
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: 'Failed to add products', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST method to bulk add products' });
}