import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import ContextGapSection from '../components/ContextGapSection';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 text-center overflow-hidden min-h-[600px] flex items-center">
        <AnimatedBackground />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
            The intelligence layer behind modern payments
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-4 leading-relaxed">
            Revelius turns business context into smarter decisions, improving authorization rates, reducing risk, and connecting the payment ecosystem through shared intelligence.
          </p>
          <p className="text-lg text-gray-300 mb-10 max-w-3xl mx-auto">
            Revelius sits between merchants, fintechs, and payment infrastructure to ensure every transaction is understood, routed correctly, and defensible.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              to="/request-access" 
              className="px-8 py-3.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Request access
            </Link>
            <Link 
              to="/network" 
              className="px-8 py-3.5 border-2 border-gray-300 text-white rounded-lg font-medium hover:border-gray-200 hover:bg-white/5 transition-colors"
            >
              Join the network
            </Link>
          </div>
        </div>
      </section>

      {/* Context Gap Section */}
      <ContextGapSection />

      {/* Built for Everyone */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-4">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
              Built for everyone in payments
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              One platform. Three entry points.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revelius serves the entire payment ecosystem through a single intelligence layer.
            </p>
          </div>

          {/* Three Boxes */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 mb-12">
            {/* Box 1: Fintechs */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 transition-colors">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
                For fintechs and PSPs
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Decisioning and compliance infrastructure
              </h3>
              <p className="text-gray-700 mb-6">
                Revelius helps fintechs and PSPs move beyond static rules and manual reviews.
              </p>
              
              <div className="mb-6">
                <p className="font-semibold text-gray-900 mb-3">What you get:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Context-aware merchant classification</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Smarter routing inputs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Continuous post-onboarding monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Automated evidence for audits and disputes</span>
                  </li>
                </ul>
              </div>

              <div className="mb-8">
                <p className="font-semibold text-gray-900 mb-3">What it enables:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Higher approval rates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Lower false positives</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Faster onboarding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Stronger regulatory posture</span>
                  </li>
                </ul>
              </div>

              <Link 
                to="/solutions/fintechs" 
                className="inline-block text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Explore for fintechs →
              </Link>
            </div>

            {/* Box 2: Merchants */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 transition-colors">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
                For merchants
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Improve authorization rates without changing your stack
              </h3>
              <p className="text-gray-700 mb-6">
                Merchants lose revenue when their business is misunderstood.
              </p>
              
              <div className="mb-8">
                <p className="font-semibold text-gray-900 mb-3">Revelius helps merchants:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Get classified correctly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Avoid unnecessary declines</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Benefit from smarter routing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Strengthen chargeback outcomes</span>
                  </li>
                </ul>
              </div>

              <p className="text-gray-700 mb-8">
                All without changing their payment provider or checkout flow.
              </p>

              <Link 
                to="/request-access" 
                className="inline-block text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Improve my authorization rate →
              </Link>
            </div>

            {/* Box 3: PSP Partners */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 transition-colors">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
                For PSP partners
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Join the Revelius Network
              </h3>
              <p className="text-gray-700 mb-6">
                Revelius connects PSPs, acquirers, and platforms into a shared intelligence layer.
              </p>
              
              <div className="mb-6">
                <p className="font-semibold text-gray-900 mb-3">The network enables:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Better merchant segmentation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Safer onboarding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Cleaner routing decisions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Reduced scheme exposure</span>
                  </li>
                </ul>
              </div>

              <p className="text-gray-700 mb-8">
                Each participant benefits from a clearer picture of merchant behavior without sharing raw data.
              </p>

              <Link 
                to="/network" 
                className="inline-block text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Join the Revelius Network →
              </Link>
            </div>
          </div>

          {/* Inline CTA Row */}
          <div className="flex gap-4 justify-center flex-wrap pt-8 border-t border-gray-300">
            <Link 
              to="/signin" 
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
            <Link 
              to="/request-access" 
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Request access
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            From context to decisions in real time
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Discover</h3>
              <p className="text-gray-700">
                Revelius scans websites, apps, products, and content to understand what a business actually does.
              </p>
            </div>

            {/* Step 2 */}
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Understand</h3>
              <p className="text-gray-700">
                Signals are interpreted into structured risk, category, and behavior profiles.
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Route</h3>
              <p className="text-gray-700">
                That intelligence feeds routing logic, compliance decisions, and risk controls.
              </p>
            </div>

            {/* Step 4 */}
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-4">4</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Prove</h3>
              <p className="text-gray-700">
                Every decision is backed by evidence, ready for audits, disputes, or reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Built for how payments actually work today
          </h2>
          
          <div className="space-y-6 text-lg text-gray-700 mb-8">
            <div className="flex items-start">
              <span className="text-blue-600 font-bold mr-4 mt-1">•</span>
              <span>Businesses change faster than rules</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 font-bold mr-4 mt-1">•</span>
              <span>Content matters more than labels</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 font-bold mr-4 mt-1">•</span>
              <span>Risk is contextual, not static</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 font-bold mr-4 mt-1">•</span>
              <span>Decisions need evidence, not assumptions</span>
            </div>
          </div>

          <p className="text-xl text-center text-gray-900 font-medium mt-12">
            Revelius brings clarity to a system that was never designed for modern commerce.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Turn context into better payment outcomes.
          </h2>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed">
            Whether you're a fintech optimizing decisioning, a merchant improving approvals, or a PSP building safer scale, Revelius gives you the intelligence layer you're missing.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              to="/request-access" 
              className="px-8 py-3.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Request access
            </Link>
            <Link 
              to="/network" 
              className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Join the network
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
