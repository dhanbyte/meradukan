'use client'

import { useState } from 'react'

export default function TestAddProductPage() {
    const [result, setResult] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const testAddProduct = async () => {
        setIsLoading(true)
        setResult('Testing...')

        const testProduct = {
            name: "Test Product " + Date.now(),
            slug: "test-product-" + Date.now(),
            brand: "Test Brand",
            category: "Tech",
            subcategory: "Mobiles",
            price: {
                original: 999,
                currency: "₹"
            },
            quantity: 10,
            description: "This is a test product created at " + new Date().toLocaleString(),
            image: "/images/placeholder.jpg",
            extraImages: ["/images/placeholder.jpg"],
            features: ["Test feature 1", "Test feature 2"],
            ratings: { average: 0, count: 0 }
        }

        try {
            console.log('Sending product data:', testProduct)
            
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testProduct),
            })

            const responseData = await response.json()
            console.log('Response:', responseData)

            if (response.ok) {
                setResult(`✅ SUCCESS!\nProduct added with ID: ${responseData.data?.id}\nResponse: ${JSON.stringify(responseData, null, 2)}`)
            } else {
                setResult(`❌ FAILED!\nStatus: ${response.status}\nError: ${responseData.error}\nResponse: ${JSON.stringify(responseData, null, 2)}`)
            }
        } catch (error) {
            console.error('Error:', error)
            setResult(`❌ ERROR!\n${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    const testFetchProducts = async () => {
        setIsLoading(true)
        setResult('Fetching products...')

        try {
            const response = await fetch('/api/products')
            const products = await response.json()
            
            if (response.ok) {
                setResult(`✅ FETCH SUCCESS!\nFound ${products.length} products\nFirst few products:\n${JSON.stringify(products.slice(0, 3), null, 2)}`)
            } else {
                setResult(`❌ FETCH FAILED!\nStatus: ${response.status}\nResponse: ${JSON.stringify(products, null, 2)}`)
            }
        } catch (error) {
            console.error('Error:', error)
            setResult(`❌ FETCH ERROR!\n${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-6">Test Add Product Functionality</h1>
                    
                    <div className="space-y-4 mb-6">
                        <button
                            onClick={testAddProduct}
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Testing...' : 'Test Add Product'}
                        </button>
                        
                        <button
                            onClick={testFetchProducts}
                            disabled={isLoading}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-4"
                        >
                            {isLoading ? 'Fetching...' : 'Test Fetch Products'}
                        </button>
                    </div>

                    {result && (
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="font-semibold mb-2">Result:</h3>
                            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                        </div>
                    )}

                    <div className="mt-8 p-4 bg-blue-50 rounded">
                        <h3 className="font-semibold mb-2">Debug Info:</h3>
                        <p><strong>Current Time:</strong> {new Date().toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}