import { Link } from "react-router-dom";
import { Building2, Store, Network, CheckCircle2, ArrowRight, Sparkles, TrendingUp, Zap, FileText, Target, ShieldCheck } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";
import ContextGapSection from "../components/ContextGapSection";
import GlossyButton from "../components/GlossyButton";
import AnimatedFlowSection from "../components/AnimatedFlowSection";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 text-center overflow-hidden min-h-[600px] flex items-center">
        <AnimatedBackground />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <h1 className="hero-headline text-5xl md:text-6xl mb-6 text-white leading-tight" data-text="The intelligence layer behind modern payments">
            The intelligence layer behind modern payments
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-4 leading-relaxed">
            Revelius turns business context into smarter decisions, improving
            authorization rates, reducing risk, and connecting the payment
            ecosystem through shared intelligence.
          </p>
          <p className="text-lg text-gray-300 mb-10 max-w-3xl mx-auto">
            Revelius sits between merchants, fintechs, and payment
            infrastructure to ensure every transaction is understood, routed
            correctly, and defensible.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <GlossyButton
              to="/contact"
              variant="light"
            >
              Request access
            </GlossyButton>
            <GlossyButton
              to="/network"
              variant="outline"
            >
              Join the network
            </GlossyButton>
          </div>
        </div>
      </section>

      {/* Context Gap Section */}
      <ContextGapSection />

      {/* Built for Everyone - Premium Glass Version */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Subtle background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 mb-4">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Built for everyone in payments
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              One platform. Three entry points.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revelius serves the entire payment ecosystem through a single intelligence layer.
            </p>
          </div>

          {/* Three Premium Glass Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 mb-12">
            {/* Card 1: Fintechs - Blue Theme */}
            <div className="group relative animate-slide-up h-full" style={{ animationDelay: '0.1s' }}>
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              
              <div className="relative h-full flex flex-col bg-white/80 backdrop-blur-xl border border-blue-100/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transform: 'rotate(-45deg)', width: '200%', height: '200%', top: '-50%', left: '-50%' }} />
                
                {/* Icon header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                    For fintechs and PSPs
                  </p>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  Decisioning and compliance infrastructure
                </h3>
                <p className="text-gray-700 mb-6">
                  Revelius helps fintechs and PSPs move beyond static rules and manual reviews.
                </p>
                
                <div className="mb-6 flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <p className="font-semibold text-gray-900">What you get:</p>
                  </div>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2 text-gray-700 group/item hover:text-blue-600 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Context-aware merchant classification</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 group/item hover:text-blue-600 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Smarter routing inputs</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 group/item hover:text-blue-600 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Continuous post-onboarding monitoring</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 group/item hover:text-blue-600 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Automated evidence for audits and disputes</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-8 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <p className="font-semibold text-gray-900">What it enables:</p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-600 font-bold">↑</span>
                      <span>Higher approval rates</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-600 font-bold">↓</span>
                      <span>Lower false positives</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-600 font-bold">⚡</span>
                      <span>Faster onboarding</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-600 font-bold">🛡</span>
                      <span>Stronger regulatory posture</span>
                    </li>
                  </ul>
                </div>

                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors group/link mt-auto"
                >
                  <span>Explore for fintechs</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 2: Merchants - Emerald Theme */}
            <div className="group relative animate-slide-up h-full" style={{ animationDelay: '0.2s' }}>
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              
              <div className="relative h-full flex flex-col bg-white/80 backdrop-blur-xl border border-emerald-100/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transform: 'rotate(-45deg)', width: '200%', height: '200%', top: '-50%', left: '-50%' }} />
                
                {/* Icon header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                    For merchants
                  </p>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">
                  Improve authorization rates without changing your stack
                </h3>
                <p className="text-gray-700 mb-6">
                  Merchants lose revenue when their business is misunderstood.
                </p>
                
                <div className="mb-8 flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <p className="font-semibold text-gray-900">Revelius helps merchants:</p>
                  </div>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2 text-gray-700 group/item hover:text-emerald-600 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Get classified correctly</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 group/item hover:text-emerald-600 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Avoid unnecessary declines</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 group/item hover:text-emerald-600 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Benefit from smarter routing</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 group/item hover:text-emerald-600 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Strengthen chargeback outcomes</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-8 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>All without changing their payment provider or checkout flow.</span>
                  </p>
                </div>

                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 transition-colors group/link mt-auto"
                >
                  <span>Improve my authorization rate</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 3: PSP Partners - Purple Theme */}
            <div className="group relative animate-slide-up h-full" style={{ animationDelay: '0.3s' }}>
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-400 to-violet-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              
              <div className="relative h-full flex flex-col bg-white/80 backdrop-blur-xl border border-purple-100/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transform: 'rotate(-45deg)', width: '200%', height: '200%', top: '-50%', left: '-50%' }} />
                
                {/* Icon header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Network className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                    For PSP partners
                  </p>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                  Join the Revelius Network
                </h3>
                <p className="text-gray-700 mb-6">
                  Revelius connects PSPs, acquirers, and platforms into a shared intelligence layer.
                </p>
                
                <div className="mb-6 flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <Network className="w-4 h-4 text-purple-600" />
                    <p className="font-semibold text-gray-900">The network enables:</p>
                  </div>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2 text-gray-700 group/item hover:text-purple-600 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>Better merchant segmentation</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 group/item hover:text-purple-600 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>Safer onboarding</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 group/item hover:text-purple-600 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>Cleaner routing decisions</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 group/item hover:text-purple-600 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>Reduced scheme exposure</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-8 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100">
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span>Each participant benefits from a clearer picture of merchant behavior without sharing raw data.</span>
                  </p>
                </div>

                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition-colors group/link mt-auto"
                >
                  <span>Join the Revelius Network</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Inline CTA Row */}
          <div className="flex gap-4 justify-center flex-wrap pt-8 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <GlossyButton to="/signin" variant="outline-dark">
              Sign in
            </GlossyButton>
            <GlossyButton to="/contact" variant="dark">
              Request access
            </GlossyButton>
          </div>
        </div>
      </section>

      {/* How It Works - Animated Flow */}
      <AnimatedFlowSection />

      {/* Built for how payments actually work today */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[28rem] h-[28rem] bg-blue-200 rounded-full" style={{ filter: 'blur(100px)' }} />
          <div className="absolute bottom-20 right-1/4 w-[28rem] h-[28rem] bg-purple-200 rounded-full" style={{ filter: 'blur(100px)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Built for how payments actually work today
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Revelius brings clarity to a system that was never designed for modern commerce
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Dynamic Business */}
            <div 
              className="group relative p-8 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)'
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div 
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    boxShadow: '0 8px 20px -6px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  <Zap className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Businesses change faster than rules
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  Real-time context captures what static classifications miss
                </p>
              </div>
            </div>

            {/* Card 2: Content Matters */}
            <div 
              className="group relative p-8 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)'
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div 
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    boxShadow: '0 8px 20px -6px rgba(168, 85, 247, 0.4)'
                  }}
                >
                  <FileText className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Content matters more than labels
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  Deep analysis reveals true business models beyond surface descriptions
                </p>
              </div>
            </div>

            {/* Card 3: Contextual Risk */}
            <div 
              className="group relative p-8 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)'
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div 
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    boxShadow: '0 8px 20px -6px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <Target className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Risk is contextual, not static
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  Intelligent signals adapt to actual behavior, not rigid rules
                </p>
              </div>
            </div>

            {/* Card 4: Evidence-Based */}
            <div 
              className="group relative p-8 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)'
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div 
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    boxShadow: '0 8px 20px -6px rgba(249, 115, 22, 0.4)'
                  }}
                >
                  <ShieldCheck className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Decisions need evidence, not assumptions
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  Every action backed by traceable sources for audit-ready confidence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Turn context into better payment outcomes.
          </h2>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed">
            Whether you're a fintech optimizing decisioning, a merchant
            improving approvals, or a PSP building safer scale, Revelius gives
            you the intelligence layer you're missing.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <GlossyButton to="/contact" variant="dark">
              Request access
            </GlossyButton>
            <GlossyButton to="/network" variant="outline-dark">
              Join the network
            </GlossyButton>
          </div>
        </div>
      </section>
    </div>
  );
}
