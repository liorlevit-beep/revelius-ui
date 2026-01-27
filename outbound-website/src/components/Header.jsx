import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import GlossyButton from './GlossyButton';

// Dashboard URL - GitHub Pages or production
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 
  (import.meta.env.PROD ? 'https://liorlevit-beep.github.io/revelius-ui/app' : 'http://localhost:5174');

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/product', label: 'Product' },
    { to: '/solutions', label: 'Solutions' },
    { to: '/network', label: 'Network' },
    { to: '/security', label: 'Security' },
    { to: '/docs', label: 'Docs' },
    { to: '/company', label: 'Company' }
  ];

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${scrolled ? 'bg-white/80 border-gray-200/80 shadow-lg' : 'bg-white/60 border-gray-200/50 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl text-gray-900 hover:text-blue-600 transition-colors" style={{ fontFamily: 'Alice, serif', fontWeight: 700 }}>
            Revelius
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-6">
            {navLinks.map(link => (
              <Link 
                key={link.to}
                to={link.to} 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-3 items-center">
            <GlossyButton href={`${DASHBOARD_URL}/auth`} variant="outline-dark">
              Sign in
            </GlossyButton>
            <GlossyButton to="/contact" variant="dark">
              Request access
            </GlossyButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[73px] bg-white/95 backdrop-blur-xl z-40">
          <nav className="flex flex-col p-6 space-y-4">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-gray-700 hover:text-gray-900 py-3 border-b border-gray-200 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-6 space-y-3">
              <GlossyButton href={`${DASHBOARD_URL}/auth`} variant="outline-dark" className="w-full">
                Sign in
              </GlossyButton>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                <GlossyButton variant="dark" className="w-full">
                  Request access
                </GlossyButton>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
