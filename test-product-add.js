// Simple test script to check product addition
const testProduct = {
    name: "Test Product",
    slug: "test-product",
    brand: "Test Brand",
    category: "Tech",
    subcategory: "Mobiles",
    price: {
        original: 999,
        currency: "₹"
    },
    quantity: 10,
    description: "This is a test product",
    image: "/images/placeholder.jpg",
    extraImages: ["/images/placeholder.jpg"],
    features: ["Test feature 1", "Test feature 2"],
    ratings: { average: 0, count: 0 }
};

async function testAddProduct() {
    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testProduct),
        });

        const result = await response.json();
        console.log('Response status:', response.status);
        console.log('Response:', result);

        if (response.ok) {
            console.log('✅ Product added successfully!');
        } else {
            console.log('❌ Failed to add product:', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the test
testAddProduct();