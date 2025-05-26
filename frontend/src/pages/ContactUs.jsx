import { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBook,
  FaHeart,
  FaUsers,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the feedback to your backend
      // For now, we'll just show a success message
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Thank you for your feedback! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Our team is
            here to help and would appreciate your input.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-12 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                About Our Library
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <FaBook className="text-red-600 w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Our Mission</h3>
                    <p className="text-gray-600">
                      We're dedicated to making quality books accessible to
                      everyone. Our platform connects readers with their next
                      favorite book.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaHeart className="text-red-600 w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      What We Offer
                    </h3>
                    <p className="text-gray-600">
                      A vast collection of books, personalized recommendations,
                      and a seamless reading experience for all book lovers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaUsers className="text-red-600 w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Our Community
                    </h3>
                    <p className="text-gray-600">
                      Join our growing community of readers, share your
                      thoughts, and discover new perspectives through the power
                      of books.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info and Form Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Get in Touch */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Get in Touch
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <FaEnvelope className="text-red-600 w-5 h-5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">
                        support@libraryofheaven.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <FaPhone className="text-red-600 w-5 h-5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <FaMapMarkerAlt className="text-red-600 w-5 h-5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Location</h3>
                      <p className="text-gray-600">
                        123 Book Street, Reading City, RC 12345
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      placeholder="Your message here..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-red-700 hover:shadow-lg"
                    }`}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
