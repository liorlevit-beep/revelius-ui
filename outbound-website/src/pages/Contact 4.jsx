import { useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import GlossyButton from "../components/GlossyButton";
import { CheckCircle2, Mail, Building2, User, MessageSquare } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mlgbzjnj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          role: formData.role,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      company: "",
      role: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <AnimatedBackground />
        <div className="max-w-5xl mx-auto px-6 py-20 relative z-10 text-center">
          <h1 className="hero-headline text-5xl md:text-6xl mb-6 text-white leading-tight" data-text="Get in touch">
            Get in touch
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
            Tell us what you're building and we'll show how Revelius fits your payment infrastructure.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="max-w-4xl mx-auto px-6">
          {submitted ? (
            // Success State
            <div 
              className="relative overflow-hidden rounded-3xl p-12 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 2px 8px rgba(255, 255, 255, 0.8)'
              }}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3), 0 0 0 8px rgba(16, 185, 129, 0.1)'
                }}
              >
                <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Thank you for reaching out
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                We've received your message and will get back to you as soon as possible.
              </p>
              <button
                onClick={handleReset}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors text-lg"
              >
                Send another message →
              </button>
            </div>
          ) : (
            // Form State
            <div 
              className="relative overflow-hidden rounded-3xl p-8 md:p-12"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 2px 8px rgba(255, 255, 255, 0.8)'
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
                  >
                    <User className="w-4 h-4" />
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full px-5 py-4 rounded-xl transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 2px rgba(255, 255, 255, 0.8)'
                    }}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Smith"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
                  >
                    <Mail className="w-4 h-4" />
                    Work email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full px-5 py-4 rounded-xl transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 2px rgba(255, 255, 255, 0.8)'
                    }}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@company.com"
                  />
                </div>

                {/* Company Field */}
                <div>
                  <label
                    htmlFor="company"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
                  >
                    <Building2 className="w-4 h-4" />
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    className="w-full px-5 py-4 rounded-xl transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 2px rgba(255, 255, 255, 0.8)'
                    }}
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="Acme Inc"
                  />
                </div>

                {/* Role Field */}
                <div>
                  <label
                    htmlFor="role"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
                  >
                    <User className="w-4 h-4" />
                    Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    className="w-full px-5 py-4 rounded-xl transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 2px rgba(255, 255, 255, 0.8)'
                    }}
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    placeholder="Head of Payments"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="message"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    className="w-full px-5 py-4 rounded-xl transition-all resize-none"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 2px rgba(255, 255, 255, 0.8)'
                    }}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us about your payment infrastructure and what you're looking to improve..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-6 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    style={{
                      background: submitting 
                        ? 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                      boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                    disabled={submitting}
                  >
                    {submitting ? "Sending..." : "Send message"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Partnerships Section */}
          <div className="mt-20 pt-16 border-t border-gray-200 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Partnerships
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Interested in joining the Revelius Network or exploring strategic
              partnerships? Use the form above to get in touch with our
              partnerships team.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
