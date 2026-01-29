import { useState, useEffect } from 'react';
import { Eye, Layers, GitBranch, TrendingUp, Shield, CheckCircle2 } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import GlossyButton from '../components/GlossyButton';

export default function Company() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnchorClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div>
      {/* In-Page Navigation */}
      <nav className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300 ${scrolled ? 'bg-white/70 border-gray-200/80 shadow-lg' : 'bg-white/60 border-gray-200/50 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 py-4 overflow-x-auto">
            <a 
              href="#problem" 
              onClick={(e) => handleAnchorClick(e, 'problem')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              The Problem
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#perspective" 
              onClick={(e) => handleAnchorClick(e, 'perspective')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Our Perspective
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#what" 
              onClick={(e) => handleAnchorClick(e, 'what')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              What We Build
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#how" 
              onClick={(e) => handleAnchorClick(e, 'how')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              How We Build
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#who" 
              onClick={(e) => handleAnchorClick(e, 'who')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Who We Build For
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#longterm" 
              onClick={(e) => handleAnchorClick(e, 'longterm')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Long-Term View
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="relative py-24 text-center overflow-hidden min-h-[500px] flex items-center">
        <AnimatedBackground />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <h1 className="hero-headline text-5xl md:text-6xl mb-6 text-white leading-tight" data-text="Company">
            Company
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-4 leading-relaxed max-w-4xl mx-auto">
            Revelius is building an intelligence layer for modern payments.
          </p>
          <p className="text-lg text-gray-300">
            We help payment systems understand context, risk, and change.
          </p>
        </div>
      </section>

      {/* The Problem We Saw */}
      <section id="problem" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            The problem we saw
          </h2>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Payments evolved from static merchant setups with a single acquiring bank to dynamic global systems where a single platform might onboard thousands of merchants across dozens of categories and regions. Business models became fluid. Merchants expanded into new categories. Product catalogs changed constantly. What was once a straightforward approval process became a continuous compliance and risk management challenge.
            </p>
            <p>
              The infrastructure supporting these decisions did not evolve at the same pace. Risk assessments stayed anchored to onboarding snapshots. Routing logic relied on static rules that broke as merchant behavior shifted. Compliance reviews happened manually, too late to prevent issues. The payment ecosystem needed a layer that could understand merchants as they actually operate, not as they described themselves at signup.
            </p>
          </div>
        </div>
      </section>

      {/* Our Perspective */}
      <section id="perspective" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our perspective
          </h2>
          
          <p className="text-xl text-gray-700 mb-12">
            We believe the core problem is not lack of tools, but lack of understanding.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-white border-l-4 border-blue-500 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-800 font-medium">
                  Payments are contextual, not static.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-white border-l-4 border-purple-500 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-800 font-medium">
                  Risk changes over time, not just at onboarding.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-white border-l-4 border-emerald-500 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center flex-shrink-0">
                <GitBranch className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-gray-800 font-medium">
                  Rules alone do not scale across regions and categories.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-white border-l-4 border-orange-500 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-800 font-medium">
                  Infrastructure should adapt as businesses evolve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Revelius Builds */}
      <section id="what" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            What Revelius builds
          </h2>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Revelius is an intelligence layer that sits above payment providers. It scans merchant websites, analyzes product catalogs, profiles transaction patterns, and maps these signals to provider constraints and compliance requirements. This understanding enables smarter onboarding, dynamic routing, and continuous risk monitoring without requiring merchants to change how they operate.
            </p>
            <p>
              The system connects four pieces that previously lived in silos: what merchants sell, how they describe their business, how transactions behave, and which providers can handle them. By building this connective layer, Revelius makes the entire payment stack more intelligent without replacing any of its components.
            </p>
          </div>
        </div>
      </section>

      {/* How We Build */}
      <section id="how" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How we build
          </h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Our engineering philosophy prioritizes safety, explainability, and suitability for regulated environments. Every decision Revelius makes can be traced back to evidence. Every recommendation includes reasoning. Automation happens only after visibility is established and controls are in place.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">Context before automation</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Understanding comes first. Automation follows only when context is clear and controls are validated.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900">Visibility before decisions</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Customers see what the system sees. Recommendations are transparent and evidence-backed.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900">Automation without black boxes</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Even fully automated routing includes audit trails and explainable reasoning for every transaction.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900">Infrastructure over point solutions</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Built as a foundational layer that improves the entire stack rather than solving isolated problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Build For */}
      <section id="who" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Who we build for
          </h2>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Revelius serves PSPs, PayFacs, marketplaces, platforms, and financial institutions that onboard merchants and retain liability for payment performance and compliance. These companies sit between merchants and payment infrastructure, making decisions that impact approval rates, regulatory exposure, and operational scale.
            </p>
            <p className="font-medium text-gray-900">
              We build for companies where trust, responsibility, and long-term relationships matter more than short-term growth at any cost.
            </p>
          </div>
        </div>
      </section>

      {/* Long-Term View */}
      <section id="longterm" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Long-term view
          </h2>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Revelius is designed as foundational infrastructure, not a feature. The payment ecosystem will continue to fragment across regions, categories, and business models. New providers will emerge. Regulations will evolve. Merchant behavior will shift. The intelligence layer that connects these pieces must be built to last.
            </p>
            <p>
              We are building for a payment landscape that looks different in ten years. That means making architectural choices that prioritize adaptability, explainability, and composability over chasing current trends. Infrastructure is measured in decades, not quarters.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[32rem] h-[32rem] bg-blue-300 rounded-full" style={{ filter: 'blur(120px)' }} />
          <div className="absolute bottom-0 right-1/4 w-[32rem] h-[32rem] bg-purple-300 rounded-full" style={{ filter: 'blur(120px)' }} />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Building the next layer of payment infrastructure.
          </h2>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
            If you are solving similar problems or want to understand how Revelius can support your payment operations, we would like to hear from you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <GlossyButton to="/contact" variant="dark">
              Get in touch
            </GlossyButton>
          </div>
        </div>
      </section>
    </div>
  );
}
