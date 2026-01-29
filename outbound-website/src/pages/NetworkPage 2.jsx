import { useState, useEffect } from 'react';
import { Network, GitBranch, TrendingUp, Shield, CheckCircle2, Eye, Layers, Target, Users, ArrowRight } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import GlossyButton from '../components/GlossyButton';

export default function NetworkPage() {
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
              href="#why" 
              onClick={(e) => handleAnchorClick(e, 'why')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Why connect
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#how" 
              onClick={(e) => handleAnchorClick(e, 'how')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              How it works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#principles" 
              onClick={(e) => handleAnchorClick(e, 'principles')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Principles
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#join" 
              onClick={(e) => handleAnchorClick(e, 'join')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Join
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="relative py-24 text-center overflow-hidden min-h-[500px] flex items-center">
        <AnimatedBackground />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <h1 className="hero-headline text-5xl md:text-6xl mb-6 text-white leading-tight" data-text="The Revelius Network">
            The Revelius Network
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-4 leading-relaxed max-w-4xl mx-auto">
            A direct connection between payment providers and qualified demand.
          </p>
          <p className="text-lg text-gray-300">
            Built to improve routing, performance, and trust across the payment ecosystem.
          </p>
        </div>
      </section>

      {/* The Ecosystem Problem */}
      <section id="problem" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            The ecosystem problem
          </h2>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Payment providers compete for transaction volume without sufficient context about merchant business models, risk profiles, or category fit. Merchants and platforms route transactions based on static rules, commercial relationships, or limited performance signals. The result is traffic that does not align with provider strengths, creating unnecessary declines and operational friction.
            </p>
            <p>
              On the demand side, merchants and platforms struggle to identify which providers will approve their specific transactions. On the supply side, providers receive traffic they cannot serve effectively. This mismatch hurts approval rates, increases support load, and wastes resources on both ends.
            </p>
          </div>
        </div>
      </section>

      {/* Our Role in the Network */}
      <section id="role" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Revelius as an intelligence and distribution layer
          </h2>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Revelius sits between demand (merchants, platforms, PSP clients) and supply (payment providers, acquirers, networks). We profile merchants, understand their business context, and map transactions to provider capabilities. This creates alignment that static routing rules and direct integrations cannot achieve at scale.
            </p>
            <p>
              Revelius does not process payments, hold funds, or replace providers. We connect qualified demand to appropriate supply through intelligent routing recommendations or automated decisioning. Providers maintain direct merchant relationships and payment processing responsibilities.
            </p>
            <p className="font-medium text-gray-900 text-xl border-l-4 border-blue-500 pl-6">
              We route intelligence, not funds.
            </p>
          </div>
        </div>
      </section>

      {/* Why Payment Providers Connect */}
      <section id="why" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Why connect to Revelius
          </h2>
          
          <p className="text-xl text-gray-700 mb-10">
            Connecting to Revelius unlocks qualified, context-aware traffic.
          </p>

          <div className="space-y-5">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Better alignment between provider capabilities and merchant profiles</h3>
                <p className="text-gray-600 text-sm">
                  Transactions reach providers that can actually serve them based on category, region, and risk fit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Higher approval rates through improved routing decisions</h3>
                <p className="text-gray-600 text-sm">
                  Context-aware routing reduces unnecessary declines and improves conversion for both providers and merchants.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Reduced noise from unqualified or misaligned merchants</h3>
                <p className="text-gray-600 text-sm">
                  Pre-qualification filters out traffic that does not match provider constraints or appetite.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Faster onboarding through clearer risk and category context</h3>
                <p className="text-gray-600 text-sm">
                  Merchants arrive with validated business intelligence, reducing due diligence and time to first transaction.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Incremental volume without expanding sales overhead</h3>
                <p className="text-gray-600 text-sm">
                  Access new merchant segments and geographies without building direct sales or onboarding infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Value Is Created */}
      <section id="value" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How value is created
          </h2>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Revelius pre-qualifies demand by scanning merchant websites, profiling product catalogs, analyzing transaction patterns, and mapping these signals to provider constraints. This context allows routing systems to match transactions to providers that can approve them, reducing wasted attempts and operational friction.
            </p>
            <p>
              Providers receive traffic that better aligns with their risk appetite, regional coverage, and category strengths. Instead of competing for undifferentiated volume, providers benefit from intelligent matching that improves performance for everyone. This creates a positive feedback loop where better routing generates better data, which enables even smarter routing over time.
            </p>
          </div>
        </div>
      </section>

      {/* How the Connection Works */}
      <section id="how" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How the connection works
          </h2>
          
          <p className="text-lg text-gray-700 mb-10">
            Connecting to Revelius requires minimal operational overhead and no ongoing manual coordination.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-xl">Connect</h3>
                <p className="text-gray-700">
                  Provider integrates once with Revelius through standard APIs or existing orchestration platforms.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-xl">Describe</h3>
                <p className="text-gray-700">
                  Capabilities, regions, constraints, and category preferences are defined to guide routing decisions.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-xl">Match</h3>
                <p className="text-gray-700">
                  Revelius aligns eligible transactions and merchants with providers that can serve them effectively.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-xl">Learn</h3>
                <p className="text-gray-700">
                  Performance feedback continuously improves future routing decisions for the entire network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Principles */}
      <section id="principles" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Network principles
          </h2>
          
          <p className="text-xl text-gray-700 mb-10">
            The Revelius Network is built on clear principles.
          </p>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border-l-4 border-blue-500 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Non-exclusive participation</h3>
              <p className="text-gray-700">
                Providers maintain all existing relationships and can participate in multiple networks simultaneously.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border-l-4 border-purple-500 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Performance-based alignment</h3>
              <p className="text-gray-700">
                Routing decisions are driven by fit and performance data, not commercial relationships or opaque incentives.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border-l-4 border-emerald-500 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparency and explainability</h3>
              <p className="text-gray-700">
                Providers see why traffic is routed to them and can understand the context behind every transaction.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border-l-4 border-orange-500 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Respect for provider autonomy</h3>
              <p className="text-gray-700">
                Providers control their own pricing, terms, and merchant acceptance criteria without interference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who the Network Is For */}
      <section id="who" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Who the network is for
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
                <Network className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-gray-800 font-medium">
                Payment service providers and acquirers seeking qualified merchant traffic
              </p>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-gray-800 font-medium">
                Regional and specialized payment providers looking to expand beyond their existing distribution
              </p>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-gray-800 font-medium">
                Infrastructure and orchestration platforms that route transactions across multiple providers
              </p>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center flex-shrink-0">
                <GitBranch className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-gray-800 font-medium">
                Networks seeking better demand qualification and merchant context before routing
              </p>
            </div>
          </div>

          <p className="text-gray-700 text-lg">
            Participation is selective to maintain network quality and ensure all participants benefit from intelligent matching.
          </p>
        </div>
      </section>

      {/* Request to Join the Network */}
      <section id="join" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Request to join the network
          </h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Network access is controlled to protect quality, performance, and trust for all participants. Revelius prioritizes providers that demonstrate operational reliability, transparent performance data, and commitment to the network principles. We work with providers across geographies, categories, and maturity stages.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <GlossyButton to="/contact" variant="dark">
              Request network access
            </GlossyButton>
            <a 
              href="/contact" 
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2 transition-colors py-3"
            >
              Contact partnerships <ArrowRight className="w-4 h-4" />
            </a>
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
            A smarter way to connect supply and demand in payments.
          </h2>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
            The Revelius Network improves routing efficiency, approval rates, and trust for payment providers and the merchants they serve.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <GlossyButton to="/contact" variant="dark">
              Talk to partnerships
            </GlossyButton>
          </div>
        </div>
      </section>
    </div>
  );
}
