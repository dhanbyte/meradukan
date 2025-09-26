import { NextResponse } from 'next/server';

// Fallback products data
const fallbackProducts = [
  {
    _id: '1',
    name: 'Sample Product 1',
    category: 'Tech',
    subcategory: 'Electronics',
    price: 999,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    description: 'Sample product description',
    inStock: true,
    quantity: 10
  },
  {
    _id: '2',
    name: 'Sample Product 2',
    category: 'Home',
    subcategory: 'Kitchen',
    price: 599,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
    description: 'Sample home product',
    inStock: true,
    quantity: 5
  }
];

let dbConnect: any;
let Product: any;

try {
  dbConnect = require('@/lib/dbConnect').default;
  Product = require('@/models/Product').default;
} catch (error) {
  console.warn('Database modules not available, using fallback products');
}

// GET all products with filtering support
export async function GET(request: Request) {
    // If database is not available, return fallback products
    if (!dbConnect || !Product) {
      return NextResponse.json(fallbackProducts);
    }

    try {
      await dbConnect();
    } catch (dbError) {
      console.warn('Database connection failed, using fallback products');
      return NextResponse.json(fallbackProducts);
    }

    try {
        const { searchParams } = new URL(request.url);
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');
        const limitParam = searchParams.get('limit');

        let query: any = {};

        // Filter out Ayurvedic products and related categories
        query.$and = [
            { category: { $nin: ['Ayurvedic', 'Food & Drinks', 'Healthy Juice', 'Dhoop', 'Pooja'] } },
            { subcategory: { $nin: ['Ayurvedic', 'Food & Drinks', 'Healthy Juice', 'Dhoop', 'Pooja'] } },
            { name: { $not: { $regex: 'ayurvedic|sharbat|juice|dhoop|pooja', $options: 'i' } } }
        ];

        if (categoryParam) {
            query.$and.push({ category: categoryParam });
        }

        if (searchParam) {
            query.$and.push({
                $or: [
                    { name: { $regex: searchParam, $options: 'i' } },
                    { description: { $regex: searchParam, $options: 'i' } },
                    { brand: { $regex: searchParam, $options: 'i' } },
                    { category: { $regex: searchParam, $options: 'i' } },
                    { subcategory: { $regex: searchParam, $options: 'i' } }
                ]
            });
        }

        let productsQuery = Product.find(query).lean();
        
        // Apply limit if specified (for search suggestions)
        if (limitParam) {
            const limit = parseInt(limitParam, 10);
            if (limit > 0) {
                productsQuery = productsQuery.limit(limit);
            }
        }

        const products = await productsQuery;
        
        // Transform MongoDB _id to id for frontend compatibility
        const transformedProducts = products.map(product => ({
            ...product,
            id: product._id.toString(),
            _id: product._id.toString(),
            shortDescription: product.description?.substring(0, 100) + '...' || '',
            // Ensure all required fields exist for frontend
            extraImages: product.extraImages || [],
            features: product.features || [],
            specifications: product.specifications || {},
            ratings: product.ratings || { average: 0, count: 0 },
            subcategory: product.subcategory || ''
        }));

        return NextResponse.json(transformedProducts);
        
    } catch (error) {
        console.error('Error in GET /api/products:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to fetch products' 
        }, { status: 500 });
    }
}

// POST - create a new product
export async function POST(request: Request) {
    await dbConnect();

    try {
        const productData = await request.json();
        console.log('Received product data:', productData);
        
        // Check for duplicate slug
        const existingProduct = await Product.findOne({ slug: productData.slug });
        if (existingProduct) {
            return NextResponse.json({ 
                success: false, 
                error: 'Product with this slug already exists' 
            }, { status: 400 });
        }
        
        const product = new Product(productData);
        const savedProduct = await product.save();
        console.log('Product saved successfully:', savedProduct._id);
        
        // Transform for frontend compatibility
        const transformedProduct = {
            ...savedProduct.toObject(),
            id: savedProduct._id.toString(),
            _id: savedProduct._id.toString()
        };

        return NextResponse.json({ 
            success: true,
            data: transformedProduct 
        }, { status: 201 });
        
    } catch (error) {
        console.error('Error in POST /api/products:', error);
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to create product' 
        }, { status: 500 });
    }
}