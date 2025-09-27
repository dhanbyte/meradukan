'use client'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Terms & Conditions</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Return & Replacement Policy</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-red-800 mb-2">⚠️ Important Notice</h3>
                <p className="text-red-700">
                  <strong>NO RETURN POLICY:</strong> हमारे यहाँ कोई return policy नहीं है। 
                  सामान खरीदने से पहले सोच समझकर order करें।
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">✅ Replacement Policy</h3>
                <ul className="list-disc list-inside space-y-2 text-green-700">
                  <li><strong>Damaged/Broken Products:</strong> अगर सामान टूटा हुआ या खराब पहुंचा है तो replacement मिलेगा</li>
                  <li><strong>Wrong Product:</strong> गलत product भेजा गया हो तो replacement होगा</li>
                  <li><strong>Missing Items:</strong> कोई item missing हो तो replacement दिया जाएगा</li>
                  <li><strong>Time Limit:</strong> Delivery के 24 घंटे के अंदर complaint करनी होगी</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <h3 className="font-semibold text-yellow-800 mb-2">⏰ Replacement Conditions</h3>
                <ul className="list-disc list-inside space-y-1 text-yellow-700">
                  <li>Replacement के बाद return नहीं कर सकते</li>
                  <li>सिर्फ एक बार replacement मिलेगा</li>
                  <li>Original packaging में product होना चाहिए</li>
                  <li>Photo/video proof देना होगा</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Payment & Pricing</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>सभी prices में GST और taxes शामिल हैं</li>
                <li>Platform fee 1.8% अलग से लगेगा</li>
                <li>Payment successful होने के बाद order confirm होगा</li>
                <li>COD available नहीं है - सिर्फ online payment</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Shipping & Delivery</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Shipping Charges:</strong> ₹49 flat rate for all orders</li>
                <li><strong>Delivery time:</strong> 3-7 working days</li>
                <li><strong>Free shipping:</strong> Currently not available</li>
                <li><strong>Address change:</strong> Delivery के बाद नहीं हो सकता</li>
                <li><strong>Tracking:</strong> Order confirmation के बाद tracking details मिलेंगे</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Product Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>सभी products की images reference के लिए हैं</li>
                <li>Actual product में slight variation हो सकता है</li>
                <li>Color difference monitor settings के कारण हो सकता है</li>
                <li>Product specifications में changes हो सकते हैं</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Customer Support</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700 mb-2">
                  <strong>Support Contact:</strong> +91 91574 99884
                </p>
                <p className="text-blue-700 mb-2">
                  <strong>Support Hours:</strong> 9 AM - 9 PM (Monday to Saturday)
                </p>
                <p className="text-blue-700">
                  <strong>Response Time:</strong> 24 hours के अंदर reply मिलेगा
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Business Inquiries</h2>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-purple-700 mb-2">
                  <strong>Dropshipping & Wholesale:</strong> +91 91574 99884
                </p>
                <p className="text-purple-700">
                  Business partnerships और bulk orders के लिए WhatsApp करें
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Legal Terms</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>ये terms किसी भी समय बदल सकते हैं</li>
                <li>Order place करने से आप इन terms को accept करते हैं</li>
                <li>Disputes का समाधान Indian law के अनुसार होगा</li>
                <li>Court jurisdiction: Delhi, India</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Last Updated: {new Date().toLocaleDateString('en-IN')}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Questions? Contact us at +91 91574 99884
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}