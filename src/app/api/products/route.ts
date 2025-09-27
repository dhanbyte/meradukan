import { NextResponse } from 'next/server';
import { TECH_PRODUCTS } from '@/lib/data/tech';
import { HOME_PRODUCTS } from '@/lib/data/home';

// Fallback products data
const fallbackProducts = [
  {
    _id: '1',
    name: 'Wireless Bluetooth Headphones',
    category: 'Tech',
    subcategory: 'Audio',
    brand: 'TechBrand',
    price: 999,
    originalPrice: 1299,
    image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/01_53521c05-9caa-4905-9410-e18e9ee19322.webp',
    description: 'High-quality wireless Bluetooth headphones with noise cancellation',
    inStock: true,
    quantity: 15,
    slug: 'wireless-bluetooth-headphones',
    isNew: true
  },
  {
    _id: '2',
    name: 'LED Desk Lamp',
    category: 'Home',
    subcategory: 'Lighting',
    brand: 'HomeBrand',
    price: 599,
    originalPrice: 799,
    image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/07_4a3ac08b-5f90-4f47-9c6f-a48d0999f3e7.webp',
    description: 'Modern LED desk lamp with adjustable brightness',
    inStock: true,
    quantity: 8,
    slug: 'led-desk-lamp',
    isNew: false
  },
  {
    _id: '3',
    name: 'USB-C Charging Cable',
    category: 'Tech',
    subcategory: 'Cables & Chargers',
    brand: 'TechBrand',
    price: 299,
    originalPrice: 399,
    image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/01_0748acd3-4797-400f-997d-6cecf6b22f5a.webp',
    description: 'Fast charging USB-C cable 2 meter length',
    inStock: true,
    quantity: 25,
    slug: 'usb-c-charging-cable',
    isNew: true
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
    try {
        // Always try to connect to database first
        if (dbConnect && Product) {
            try {
                await dbConnect();
                
                // Simple query without complex filters
                const products = await Product.find({}).lean();
                
                // Transform MongoDB _id to id for frontend compatibility
                const transformedProducts = products.map(product => ({
                    ...product,
                    id: product._id.toString(),
                    _id: product._id.toString(),
                    shortDescription: product.description?.substring(0, 100) + '...' || '',
                    extraImages: product.extraImages || [],
                    features: product.features || [],
                    specifications: product.specifications || {},
                    ratings: product.ratings || { average: 0, count: 0 },
                    subcategory: product.subcategory || ''
                }));

                console.log(`Found ${transformedProducts.length} products in database`);
                return NextResponse.json(transformedProducts);
                
            } catch (dbError) {
                console.error('Database error:', dbError);
                // Fall through to fallback
            }
        }
        
        // Return fallback + JSON products if database fails
        console.log('Using fallback + JSON products - database connection failed or no products found');
        
        // Combine fallback, tech, and home products
        const allProducts = [
            ...fallbackProducts.map(p => ({
                ...p,
                id: p._id,
                price: { original: p.originalPrice, discounted: p.price },
                shortDescription: p.description.substring(0, 100) + '...',
                extraImages: [],
                features: [],
                specifications: {},
                ratings: { average: 0, count: 0 },
                createdAt: new Date().toISOString()
            })),
            ...TECH_PRODUCTS,
            ...HOME_PRODUCTS
        ];
        
        return NextResponse.json(allProducts);
        
    } catch (error) {
        console.error('Error in GET /api/products:', error);
        return NextResponse.json(fallbackProducts.map(p => ({
            ...p,
            id: p._id,
            price: { original: p.originalPrice, discounted: p.price }
        })));
    }
}

// POST - create a new product
export async function POST(request: Request) {
    try {
        if (!dbConnect || !Product) {
            return NextResponse.json({ 
                success: false, 
                error: 'Database not available' 
            }, { status: 500 });
        }

        await dbConnect();
        const productData = await request.json();
        console.log('Received product data:', productData);
        
        const product = new Product(productData);
        const savedProduct = await product.save();
        console.log('Product saved successfully:', savedProduct._id);
        
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