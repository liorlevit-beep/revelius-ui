import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Store, Landmark, CreditCard, Layers, Eye, GitBranch, FileCheck, TrendingUp, Shield, ArrowRight, ChevronDown } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import GlossyButton from '../components/GlossyButton';

export default function Solutions() {
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
      question: 'Can different teams use Revelius differently?',
      answer: 'Yes. Organizations often deploy Revelius across multiple business units with different product modes. One team might use BYOP for established markets while another uses network access for expansion into new categories or regions.'
    },
    {
      id: 1,
      question: 'Do solutions require different integrations?',
      answer: 'No. The core integration is the same across all solutions. Differences lie in configuration, context signals prioritized, and which capabilities are emphasized for your specific use case.'
    },
    {
      id: 2,
      question: 'Can I start with one solution and expand?',
      answer: 'Yes. Most customers start with a specific pain point like onboarding or routing optimization, then expand to additional use cases as they see results. The platform supports incremental adoption without requiring rework.'
    },
    {
      id: 3,
      question: 'Is Revelius opinionated by industry?',
      answer: 'No. Revelius adapts to your business model, risk appetite, and compliance requirements. The system learns from your decisions and constraints rather than imposing a one-size-fits-all approach.'
    },
    {
      id: 4,
      question: 'How long does onboarding typically take?',
      answer: 'Integration timeline depends on scope and existing infrastructure. Most deployments begin showing value within weeks as the system profiles transactions and providers. Full optimization continues as the learning cycle matures.'
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
              href="#who" 
              onClick={(e) => handleAnchorClick(e, 'who')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Who we serve
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#psps" 
              onClick={(e) => handleAnchorClick(e, 'psps')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              PSPs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#platforms" 
              onClick={(e) => handleAnchorClick(e, 'platforms')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Platforms
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#neobanks" 
              onClick={(e) => handleAnchorClick(e, 'neobanks')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Neobanks
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
      <section id="hero" className="relative py-24 text-center overflow-hidden min-h-[500px] flex items-center">
        <AnimatedBackground />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <h1 className="hero-headline text-5xl md:text-6xl mb-6 text-white leading-tight" data-text="Solutions">
            Solutions
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-4 leading-relaxed max-w-4xl mx-auto">
            Revelius adapts to how different payment companies operate, onboard, and manage risk.
          </p>
          <p className="text-lg text-gray-300">
            Same intelligence layer. Different outcomes.
          </p>
        </div>
      </section>

      {/* Who We Serve */}
      <section id="who" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xl text-gray-700 leading-relaxed mb-12 max-w-4xl">
            Revelius is built for companies that onboard merchants, manage payment flow, and retain liability. Whether you are a PSP routing transactions, a platform onboarding sub-merchants, or a neobank expanding into new categories, Revelius turns fragmented context into confident decisions.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* PSPs */}
            <div className="group p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 20px -6px rgba(59, 130, 246, 0.4)' }}>
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Payment Service Providers (PSPs)
              </h3>
              <p className="text-gray-600">
                Approval rates matter when every basis point impacts revenue and merchant retention.
              </p>
            </div>

            {/* PayFacs */}
            <div className="group p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 20px -6px rgba(168, 85, 247, 0.4)' }}>
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                PayFacs and Acquirers
              </h3>
              <p className="text-gray-600">
                Risk and compliance responsibility requires continuous visibility into merchant activity.
              </p>
            </div>

            {/* Marketplaces */}
            <div className="group p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 20px -6px rgba(16, 185, 129, 0.4)' }}>
                <Store className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Marketplaces and Platforms
              </h3>
              <p className="text-gray-600">
                Sub-merchant onboarding at scale introduces hidden risk and category drift.
              </p>
            </div>

            {/* Neobanks */}
            <div className="group p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 20px -6px rgba(249, 115, 22, 0.4)' }}>
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Neobanks and Challenger Banks
              </h3>
              <p className="text-gray-600">
                Regulatory exposure means limited tolerance for compliance surprises.
              </p>
            </div>

            {/* Embedded Finance */}
            <div className="group p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-indigo-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 20px -6px rgba(99, 102, 241, 0.4)' }}>
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Fintechs with Embedded Payments
              </h3>
              <p className="text-gray-600">
                Payment features accelerate product roadmaps but introduce operational complexity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution: PSPs and PayFacs */}
      <section id="psps" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center" style={{ boxShadow: '0 8px 20px -6px rgba(59, 130, 246, 0.4)' }}>
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              For PSPs and PayFacs
            </h2>
          </div>
          
          <div className="space-y-6 mb-10 text-lg text-gray-700 leading-relaxed">
            <p>
              PSPs and PayFacs operate under constant pressure to improve approval rates while managing risk and compliance across fragmented provider stacks. Static routing rules fail when merchant profiles evolve, categories shift, or provider performance drifts. Every declined transaction represents lost revenue and weakened merchant trust.
            </p>
            <p>
              Revelius profiles every merchant's business model, transaction patterns, and content to ensure routing decisions reflect real-world context. The system maps these signals to provider constraints and performance data, delivering recommendations or executing routes that maximize approvals while maintaining compliance posture.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">How Revelius helps</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <GitBranch className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Smarter merchant-to-provider alignment</h4>
                <p className="text-gray-600 text-sm">Context-aware routing considers category, region, risk profile, and real-time provider performance</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Transaction-level routing decisions</h4>
                <p className="text-gray-600 text-sm">Every transaction is evaluated independently based on current context rather than static rule sets</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Reduced false declines and manual reviews</h4>
                <p className="text-gray-600 text-sm">Better context understanding decreases unnecessary friction and operational overhead</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Explainable compliance decisions</h4>
                <p className="text-gray-600 text-sm">Every routing choice includes audit trail and reasoning for regulatory reviews and disputes</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 mb-6">
            <p className="text-gray-800 font-medium">
              PSPs using Revelius improve approval rates while maintaining control over execution and provider relationships.
            </p>
          </div>

          <GlossyButton to="/contact" variant="dark">
            Get started
          </GlossyButton>
        </div>
      </section>

      {/* Solution: Marketplaces and Platforms */}
      <section id="platforms" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center" style={{ boxShadow: '0 8px 20px -6px rgba(16, 185, 129, 0.4)' }}>
              <Store className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              For Marketplaces and Platforms
            </h2>
          </div>
          
          <div className="space-y-6 mb-10 text-lg text-gray-700 leading-relaxed">
            <p>
              Marketplaces and platforms onboard sub-merchants at scale, but growth introduces complexity. Sub-merchants change what they sell, expand into new categories, or modify business models without notification. Traditional onboarding snapshots become outdated quickly, creating compliance exposure and provider misalignment.
            </p>
            <p>
              Revelius continuously monitors sub-merchant activity, scanning content, transaction patterns, and category drift in real time. This ongoing visibility ensures provider eligibility remains accurate and compliance requirements stay current as sub-merchants evolve.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">How Revelius helps</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Continuous sub-merchant monitoring</h4>
                <p className="text-gray-600 text-sm">Ongoing content and transaction scanning detects changes in business model or category</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Category and content alignment</h4>
                <p className="text-gray-600 text-sm">Automated classification ensures merchants remain within approved categories and compliance boundaries</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <GitBranch className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Dynamic provider eligibility</h4>
                <p className="text-gray-600 text-sm">Sub-merchant profiles update in real time, adjusting routing as business models and categories shift</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Faster onboarding at scale</h4>
                <p className="text-gray-600 text-sm">Automated context extraction and provider matching accelerates sub-merchant approval workflows</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 mb-6">
            <p className="text-gray-800 font-medium">
              Platforms using Revelius scale sub-merchant onboarding without increasing compliance risk or operational overhead.
            </p>
          </div>

          <GlossyButton to="/contact" variant="dark">
            Get started
          </GlossyButton>
        </div>
      </section>

      {/* Solution: Neobanks and Embedded Finance */}
      <section id="neobanks" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center" style={{ boxShadow: '0 8px 20px -6px rgba(249, 115, 22, 0.4)' }}>
              <Landmark className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              For Neobanks and Embedded Finance
            </h2>
          </div>
          
          <div className="space-y-6 mb-10 text-lg text-gray-700 leading-relaxed">
            <p>
              Neobanks and embedded finance providers operate under heightened regulatory scrutiny. Sponsor banks and compliance teams have limited tolerance for surprises. Adding payment features accelerates product roadmaps but introduces operational complexity and potential exposure if merchant activity drifts into prohibited categories.
            </p>
            <p>
              Revelius provides early visibility into merchant behavior before transactions scale. Continuous scanning and context analysis ensure compliance teams can act proactively rather than reactively. Every decision includes explainable reasoning suitable for regulatory audits and sponsor bank reviews.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">How Revelius helps</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Early risk visibility before transactions scale</h4>
                <p className="text-gray-600 text-sm">Proactive monitoring identifies potential issues during onboarding rather than after volume grows</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Continuous merchant and content scanning</h4>
                <p className="text-gray-600 text-sm">Ongoing analysis detects category drift and business model changes that impact compliance posture</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Explainable decisions for regulators and auditors</h4>
                <p className="text-gray-600 text-sm">Complete audit trail with reasoning and evidence for every onboarding and routing decision</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Controlled expansion into new categories</h4>
                <p className="text-gray-600 text-sm">Clear visibility into category restrictions and provider eligibility reduces friction with sponsor banks</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 mb-6">
            <p className="text-gray-800 font-medium">
              Neobanks using Revelius expand payment offerings with confidence, backed by continuous governance and explainable decisions.
            </p>
          </div>

          <GlossyButton to="/contact" variant="dark">
            Get started
          </GlossyButton>
        </div>
      </section>

      {/* Cross-Solution Capabilities */}
      <section id="capabilities" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xl text-gray-700 mb-12">
            Every solution is powered by the same core capabilities.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Contextual understanding of merchants and content
              </h3>
              <p className="text-gray-600">
                Automated scanning and classification turns fragmented signals into structured business context
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mb-4">
                <GitBranch className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Transaction-level decisioning
              </h3>
              <p className="text-gray-600">
                Every transaction is evaluated independently based on current context and real-time constraints
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Provider performance profiling
              </h3>
              <p className="text-gray-600">
                Continuous monitoring of approval rates, latency, and compliance constraints per provider and segment
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Explainable outcomes
              </h3>
              <p className="text-gray-600">
                Full audit trail with reasoning and evidence for every decision, suitable for compliance reviews
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 lg:col-span-2">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Continuous learning over static rules
              </h3>
              <p className="text-gray-600">
                System adapts as merchant behavior, provider performance, and compliance requirements evolve without manual rule rewrites
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Solutions Connect to Product */}
      <section id="connect" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            All solutions map to the same product
          </h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-10 text-center max-w-3xl mx-auto">
            Whether you are a PSP, platform, or neobank, every solution connects to the two product modes: Bring your own providers or request access to the Revelius PSP Network.
          </p>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border-2 border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Control-first adoption</h3>
                  <p className="text-gray-700 mb-3">
                    Start with visibility and recommendations. Connect your existing providers, gain intelligence, and control when to act on routing guidance.
                  </p>
                  <a href="/product#byop" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2 transition-colors">
                    Learn about BYOP <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border-2 border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Automation-first adoption</h3>
                  <p className="text-gray-700 mb-3">
                    Request network access for fully automatic routing across vetted providers. Revelius handles execution while you maintain oversight and compliance.
                  </p>
                  <a href="/product#network" className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center gap-2 transition-colors">
                    Learn about network access <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
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
            Common questions about solutions
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
                    <div className="pl-4 border-l-4 border-blue-100">
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
            Built for how payments actually work.
          </h2>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
            Whether you manage PSP relationships, onboard sub-merchants, or navigate regulatory requirements, Revelius adapts to your reality.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <GlossyButton to="/contact" variant="dark">
              Get a demo
            </GlossyButton>
            <GlossyButton to="/product" variant="outline-dark">
              Explore the product
            </GlossyButton>
          </div>
        </div>
      </section>
    </div>
  );
}
