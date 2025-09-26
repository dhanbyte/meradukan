
'use client';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert("Message Sent! Thank you for contacting us. We'll get back to you within 24 hours.");
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      alert("Error: Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">We'd Love to Hear From You</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions about our products or services? Our team is here to help and answer any questions you might have.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Email Us</h3>
            <p className="text-gray-600 mb-3">Email us for general queries, including marketing and partnership opportunities.</p>
            <a href="mailto:dhananjay.win2004@gmail.com" className="text-blue-600 hover:text-blue-800 font-medium">dhananjay.win2004@gmail.com</a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Call Us</h3>
            <p className="text-gray-600 mb-3">Call us to speak to a member of our team.</p>
            <p className="text-green-600 font-medium">+91 91574 99884</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
            <p className="text-gray-600 mb-3">Come say hello at our office HQ.</p>
            <p className="text-gray-700">Ahmedabad, Gujarat, India<br />Contact: Dhananjay<br />Email: dhananjay.win2004@gmail.com</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Working Hours</h3>
            <p className="text-gray-600">
              <span className="block">Monday - Friday: 9:00 AM - 6:00 PM</span>
              <span className="block">Saturday: 10:00 AM - 4:00 PM</span>
              <span className="block">Sunday: Closed</span>
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Product Support">Product Support</option>
                    <option value="Billing">Billing</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message <span className="text-red-500">*</span></label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-16 rounded-2xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.263008378896!2d72.83087441539997!3d19.07598398710076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8b4a0a1b8b9%3A0x3c0d5e3e3e3e3e3e!2sMumbai%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
