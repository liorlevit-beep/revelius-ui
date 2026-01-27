import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Zap, Shield, Eye, Layers, GitBranch, TrendingUp, FileCheck, BarChart3, Clock, Users, ChevronDown } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import GlossyButton from '../components/GlossyButton';

export default function Product() {
  const [openFaq, setOpenFaq] = useState(null);
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

  const faqItems = [
    {
      id: 0,
      question: 'Do I need to replace my PSPs?',
      answer: 'No. The BYOP mode works alongside your existing providers. You keep all current integrations. Revelius adds intelligence and recommendations without requiring you to change execution logic or replace infrastructure.'
    },
    {
      id: 1,
      question: 'Can I start without the network?',
      answer: 'Yes. Most customers start with BYOP to gain visibility and confidence in routing recommendations before requesting network access. BYOP delivers value immediately without requiring approval or operational changes.'
    },
    {
      id: 2,
      question: 'What changes when I join the network?',
      answer: 'Routing execution moves from your infrastructure to Revelius. Instead of receiving recommendations, transactions are automatically routed to the best provider in the network. You gain access to vetted providers you may not have direct relationships with, and operational overhead decreases.'
    },
    {
      id: 3,
      question: 'Is routing explainable?',
      answer: 'Yes. Every routing decision includes the context signals, provider constraints, and reasoning that led to the recommendation or execution. This evidence trail supports compliance reviews, dispute resolution, and internal audits.'
    },
    {
      id: 4,
      question: 'How do you handle compliance constraints?',
      answer: 'Revelius maps regional regulations, category restrictions, and provider-specific compliance requirements into routing logic. Transactions are only routed to providers that meet the necessary regulatory and business policy criteria for that specific merchant and transaction context.'
    },
    {
      id: 5,
      question: 'Can I mix both modes by region or business line?',
      answer: 'Yes. You can use BYOP for some segments while leveraging network access for others. Common patterns include using BYOP for established markets while using the network to expand into new regions or categories where you lack direct provider relationships.'
    }
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div>
      {/* In-Page Navigation */}
      <nav className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300 ${scrolled ? 'bg-white/70 border-gray-200/80 shadow-lg' : 'bg-white/60 border-gray-200/50 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 py-4 overflow-x-auto">
            <a 
              href="#two-sided" 
              onClick={(e) => handleAnchorClick(e, 'two-sided')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Overview
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#byop" 
              onClick={(e) => handleAnchorClick(e, 'byop')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              BYOP
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#network" 
              onClick={(e) => handleAnchorClick(e, 'network')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Network
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
              href="#faq" 
              onClick={(e) => handleAnchorClick(e, 'faq')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="relative py-24 text-center overflow-hidden min-h-[600px] flex items-center">
        <AnimatedBackground />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <h1 className="hero-headline text-5xl md:text-6xl mb-6 text-white leading-tight" data-text="Product">
            Product
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-4xl mx-auto">
            Revelius turns fragmented payments into an intelligent system. Start with visibility and control. Move to fully automated routing when ready.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-6">
            <GlossyButton href="#byop" variant="light" onClick={(e) => handleAnchorClick(e, 'byop')}>
              Bring your own providers
            </GlossyButton>
            <GlossyButton href="#network" variant="light" onClick={(e) => handleAnchorClick(e, 'network')}>
              Request network access
            </GlossyButton>
          </div>
          <a href="#how" onClick={(e) => handleAnchorClick(e, 'how')} className="text-gray-200 hover:text-white font-medium inline-flex items-center gap-2 transition-colors">
            See how it works <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Payments are fragmented. Multiple PSPs, different regions, shifting risk profiles. Static routing rules break when business models evolve, compliance requirements change, or provider performance drifts. Authorization rates decline and operational overhead climbs.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
              <p className="text-lg text-gray-700">
                Routing logic becomes brittle as you add providers, enter new categories, or scale across regions
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
              <p className="text-lg text-gray-700">
                Approval rates drift without visibility into why specific transactions fail or which provider performs best per segment
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
              <p className="text-lg text-gray-700">
                Compliance constraints and category restrictions create operational friction that slows onboarding and limits expansion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Sided Product */}
      <section id="two-sided" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[28rem] h-[28rem] bg-blue-200 rounded-full" style={{ filter: 'blur(100px)' }} />
          <div className="absolute bottom-20 right-1/4 w-[28rem] h-[28rem] bg-purple-200 rounded-full" style={{ filter: 'blur(100px)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Left Card: BYOP */}
            <div className="group relative p-8 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 20px -6px rgba(59, 130, 246, 0.4)' }}>
                  <Layers className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Bring your own providers
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Connect your existing PSPs and acquirers while Revelius provides intelligence, visibility, and recommendations.
                </p>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Centralized visibility across all your providers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Context-aware routing recommendations per transaction</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Explainable decisions with full audit trail</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Fast adoption without changing execution logic</span>
                  </li>
                </ul>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">You control execution</span>
                </div>
              </div>
            </div>

            {/* Right Card: Network */}
            <div className="group relative p-8 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 20px -6px rgba(168, 85, 247, 0.4)' }}>
                  <GitBranch className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Revelius PSP Network (Request Access)
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Routing becomes fully automatic across a vetted provider ecosystem once approved for network access.
                </p>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Automatic routing decisions per transaction</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Vetted network of providers and acquirers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Continuous optimization based on real performance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Reduced operational overhead and manual routing</span>
                  </li>
                </ul>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 border border-purple-200">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Revelius executes routing</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-lg text-gray-600 font-medium">
            Same intelligence. Different level of automation.
          </p>
        </div>
      </section>

      {/* BYOP Details */}
      <section id="byop" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Bring your own providers
          </h2>
          
          <div className="space-y-6 mb-10 text-lg text-gray-700 leading-relaxed">
            <p>
              Connect your existing PSPs, acquirers, and payment infrastructure. You maintain all current integrations and execution control. Revelius sits alongside your stack to profile provider performance, understand transaction context, and generate intelligent routing recommendations.
            </p>
            <p>
              Every transaction is analyzed for business context, risk signals, regional constraints, and category requirements. Revelius maps these to your providers' strengths and limitations, then recommends the best route. You decide whether to adopt the recommendation or maintain existing logic.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">What you get</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Centralized provider intelligence</h4>
                <p className="text-gray-600 text-sm">Single view of approval rates, latency, and compliance constraints across all connected PSPs</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center flex-shrink-0">
                <GitBranch className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Context-aware routing recommendations</h4>
                <p className="text-gray-600 text-sm">Per-transaction guidance based on business model, region, category, and real-time provider performance</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Explainable, auditable decisions</h4>
                <p className="text-gray-600 text-sm">Every recommendation includes the reasoning and evidence trail for compliance and dispute resolution</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Faster onboarding alignment</h4>
                <p className="text-gray-600 text-sm">Clear visibility into category restrictions and regional compliance reduces back and forth with providers</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 md:col-span-2">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Reduced brittle rule maintenance</h4>
                <p className="text-gray-600 text-sm">Context-driven routing adapts as your business evolves without requiring manual rule rewrites</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <GlossyButton to="/contact" variant="dark">
              Connect your providers
            </GlossyButton>
          </div>
        </div>
      </section>

      {/* Network Access Details */}
      <section id="network" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Request access to the Revelius PSP Network
          </h2>
          
          <div className="space-y-6 mb-10 text-lg text-gray-700 leading-relaxed">
            <p>
              Once approved for network access, routing becomes fully automatic. Revelius executes transactions across a vetted ecosystem of providers and acquirers, selecting the best route per transaction based on real-time context and performance data.
            </p>
            <p>
              Access is controlled to protect network quality, ensure compliance, and maintain trust across all participants. Approval depends on business model fit, regional coverage, category alignment, and operational readiness.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">How access works</h3>
          
          <div className="space-y-6 mb-10">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Business model and risk profile review</h4>
                <p className="text-gray-600">We assess your merchant base, transaction patterns, and compliance posture to ensure network fit</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Regions, categories, and compliance readiness</h4>
                <p className="text-gray-600">Coverage evaluation ensures your operational scope aligns with network provider capabilities and regulatory requirements</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Volume expectations and operational fit</h4>
                <p className="text-gray-600">Transaction volume, integration complexity, and support requirements determine onboarding timeline and priority</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <GlossyButton to="/contact" variant="dark">
              Request network access
            </GlossyButton>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-center text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            Four steps from integration to measurable improvement
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6" style={{ boxShadow: '0 8px 20px -6px rgba(59, 130, 246, 0.4)' }}>
                <Layers className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Connect</h3>
              <p className="text-gray-600">
                Integrate your existing providers or request network access to unlock automatic routing
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6" style={{ boxShadow: '0 8px 20px -6px rgba(168, 85, 247, 0.4)' }}>
                <Eye className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Understand</h3>
              <p className="text-gray-600">
                Revelius profiles transaction context, merchant risk, regional requirements, and provider constraints in real time
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6" style={{ boxShadow: '0 8px 20px -6px rgba(16, 185, 129, 0.4)' }}>
                <GitBranch className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Decide</h3>
              <p className="text-gray-600">
                The system determines merchant eligibility and selects the best provider route per transaction
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6" style={{ boxShadow: '0 8px 20px -6px rgba(249, 115, 22, 0.4)' }}>
                <TrendingUp className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Improve</h3>
              <p className="text-gray-600">
                Performance data feeds back into routing logic, creating measurable approval uplift and operational efficiency
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section id="outcomes" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Measurable outcomes
          </h2>
          <p className="text-center text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            Real improvements across the payment lifecycle
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Approval uplift</h3>
              <p className="text-gray-600 leading-relaxed">
                Context-aware routing directs transactions to providers best suited for the merchant's category, region, and risk profile
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Faster onboarding decisions</h3>
              <p className="text-gray-600 leading-relaxed">
                Clear visibility into provider restrictions and compliance requirements reduces time to first transaction
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Lower operational load</h3>
              <p className="text-gray-600 leading-relaxed">
                Automated context extraction and routing recommendations eliminate manual rule maintenance and debugging
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Expanded category coverage</h3>
              <p className="text-gray-600 leading-relaxed">
                Network access opens routes to categories and regions previously blocked by single-provider limitations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-center text-xl text-gray-600 mb-16">
            Clear answers to common questions
          </p>

          <div className="space-y-4">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors pr-4">
                    {item.question}
                  </h3>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center transition-all duration-300 ${openFaq === item.id ? 'rotate-180 bg-gradient-to-br from-blue-100 to-purple-100' : ''}`}>
                    <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${openFaq === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                  </div>
                </button>
                
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: openFaq === item.id ? '500px' : '0px',
                    opacity: openFaq === item.id ? 1 : 0
                  }}
                >
                  <div className="px-6 pb-5 pt-0">
                    <div className="pl-0 border-l-4 border-blue-100 pl-4">
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            Start with control. Move to automation.
          </h2>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
            Whether you bring your own providers or request network access, Revelius transforms fragmented payments into an intelligent system.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <GlossyButton to="/contact" variant="dark">
              Get a demo
            </GlossyButton>
            <GlossyButton to="/contact" variant="outline-dark">
              Request network access
            </GlossyButton>
          </div>
        </div>
      </section>
    </div>
  );
}
