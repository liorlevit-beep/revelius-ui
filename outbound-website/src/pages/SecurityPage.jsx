import { useState, useEffect } from 'react';
import { Shield, Lock, Eye, Database, Key, Code, Activity, FileCheck, AlertCircle } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import GlossyButton from '../components/GlossyButton';

export default function SecurityPage() {
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
              href="#principles" 
              onClick={(e) => handleAnchorClick(e, 'principles')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Principles
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#data" 
              onClick={(e) => handleAnchorClick(e, 'data')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Data Protection
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#infrastructure" 
              onClick={(e) => handleAnchorClick(e, 'infrastructure')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Infrastructure
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#access" 
              onClick={(e) => handleAnchorClick(e, 'access')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Access Control
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a 
              href="#compliance" 
              onClick={(e) => handleAnchorClick(e, 'compliance')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors relative group"
            >
              Compliance
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="relative py-24 text-center overflow-hidden min-h-[500px] flex items-center">
        <AnimatedBackground />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <h1 className="hero-headline text-5xl md:text-6xl mb-6 text-white leading-tight" data-text="Security">
            Security
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-4 leading-relaxed max-w-4xl mx-auto">
            Revelius is built for regulated payment environments where trust, isolation, and auditability matter.
          </p>
          <p className="text-lg text-gray-300">
            Security is designed into the system, not added later.
          </p>
        </div>
      </section>

      {/* Security Principles */}
      <section id="principles" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xl text-gray-700 mb-12 text-center">
            Our security approach is guided by a small set of principles.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Least privilege by default
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Access is granted only when necessary and scoped to the minimum required for the task.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Logical isolation between customers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Customer data and environments are separated to prevent cross-contamination and unauthorized access.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Read-only access wherever possible
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Write permissions are restricted to specific operations and users to reduce risk surface.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Auditability and traceability
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All access and changes are logged to support compliance reviews and incident investigation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section id="data" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center" style={{ boxShadow: '0 8px 20px -6px rgba(59, 130, 246, 0.4)' }}>
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              Data Protection
            </h2>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Revelius ingests merchant metadata, transaction context, business content, and routing configuration to provide intelligence and recommendations. We do not process card numbers, CVVs, or authentication secrets unless explicitly required for specific integrations. Data handling follows encryption, retention, and minimization best practices.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Encryption in transit using industry-standard TLS</h4>
                <p className="text-gray-600 text-sm">All data transmitted between systems is encrypted to prevent interception</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Encryption at rest for stored data</h4>
                <p className="text-gray-600 text-sm">Data persisted in storage is encrypted to protect against unauthorized access</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Strict data retention and minimization</h4>
                <p className="text-gray-600 text-sm">Data is retained only as long as necessary for operational and compliance purposes</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Key className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Customer-controlled data access</h4>
                <p className="text-gray-600 text-sm">Customers maintain control over their data and can request deletion or export</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure and Isolation */}
      <section id="infrastructure" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center" style={{ boxShadow: '0 8px 20px -6px rgba(168, 85, 247, 0.4)' }}>
              <Database className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              Infrastructure and Isolation
            </h2>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Revelius operates on cloud-based infrastructure with clear separation between production, staging, and development environments. Customer data and processing are logically isolated to prevent unauthorized cross-tenant access. Infrastructure is monitored continuously to detect and respond to anomalies.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Isolated customer environments</h4>
                <p className="text-gray-600 text-sm">Each customer's data and processing are logically separated from other tenants</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Controlled network access</h4>
                <p className="text-gray-600 text-sm">Network boundaries and firewall rules restrict access to authorized systems and users</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Continuous infrastructure monitoring</h4>
                <p className="text-gray-600 text-sm">Automated monitoring detects configuration drift, anomalies, and potential security issues</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Access Control */}
      <section id="access" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center" style={{ boxShadow: '0 8px 20px -6px rgba(16, 185, 129, 0.4)' }}>
              <Key className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              Access Control
            </h2>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Access to internal systems and customer data is governed by role-based access control. Internal team access is restricted to the minimum required for job function, following the principle of least privilege. All access is authenticated, logged, and reviewed periodically.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Multi-factor authentication for internal systems</h4>
                <p className="text-gray-600 text-sm">Team members authenticate using multiple factors to access production and sensitive systems</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Access reviewed and logged</h4>
                <p className="text-gray-600 text-sm">Access patterns are logged and reviewed regularly to detect anomalies or unnecessary permissions</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Key className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">No shared credentials</h4>
                <p className="text-gray-600 text-sm">Each user has individual credentials to ensure accountability and traceability</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Security */}
      <section id="application" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center" style={{ boxShadow: '0 8px 20px -6px rgba(249, 115, 22, 0.4)' }}>
              <Code className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              Application Security
            </h2>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Application development follows secure coding practices with peer code reviews and change management processes. Dependencies are monitored for vulnerabilities and updated regularly. Automated testing runs in continuous integration pipelines to catch issues before deployment.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Code className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Regular dependency updates</h4>
                <p className="text-gray-600 text-sm">Third-party libraries and dependencies are monitored for security vulnerabilities and patched promptly</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Automated testing in CI</h4>
                <p className="text-gray-600 text-sm">Continuous integration pipelines run security checks and tests before code reaches production</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Separation of duties between development and production</h4>
                <p className="text-gray-600 text-sm">Production access is controlled independently from development to reduce insider risk</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Security */}
      <section id="operations" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center" style={{ boxShadow: '0 8px 20px -6px rgba(99, 102, 241, 0.4)' }}>
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              Operational Security
            </h2>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Production systems are monitored continuously with automated alerting for anomalies and potential incidents. Incident response procedures are documented and tested to ensure rapid identification and containment. Changes to production systems follow controlled processes with review and approval gates.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Centralized logging</h4>
                <p className="text-gray-600 text-sm">System events, access, and changes are logged centrally for monitoring and forensic analysis</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Incident response procedures</h4>
                <p className="text-gray-600 text-sm">Documented procedures guide rapid detection, containment, and resolution of security incidents</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Controlled change management</h4>
                <p className="text-gray-600 text-sm">Production changes require review, approval, and documentation to maintain stability and security</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Posture */}
      <section id="compliance" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center" style={{ boxShadow: '0 8px 20px -6px rgba(59, 130, 246, 0.4)' }}>
              <FileCheck className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              Compliance Posture
            </h2>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Revelius is designed to support customers operating in regulated payment environments. Security controls align with industry best practices and common compliance frameworks. Formal certifications may be pursued as the company scales and customer requirements evolve.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Alignment with common security best practices</h4>
                <p className="text-gray-600 text-sm">Security controls are built around widely recognized frameworks and industry standards</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Support for customer audits and questionnaires</h4>
                <p className="text-gray-600 text-sm">We work with customers to complete security assessments and due diligence reviews</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Transparent security documentation on request</h4>
                <p className="text-gray-600 text-sm">Detailed security documentation is available to customers under appropriate agreements</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible Disclosure */}
      <section id="disclosure" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center" style={{ boxShadow: '0 8px 20px -6px rgba(16, 185, 129, 0.4)' }}>
              <AlertCircle className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              Responsible Disclosure
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              We welcome reports from security researchers and the community. If you discover a potential security issue, please contact our security team via the main contact form. We appreciate responsible disclosure and will work with you to understand and address valid reports promptly.
            </p>
            <p className="text-gray-600">
              Please provide detailed information about the issue, including steps to reproduce, potential impact, and any relevant technical details. We commit to acknowledging reports quickly and keeping you informed as we investigate and remediate.
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
            Built to earn trust.
          </h2>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
            Security is foundational to how Revelius operates. We are committed to protecting customer data and maintaining the trust required in regulated payment environments.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <GlossyButton to="/contact" variant="dark">
              Contact us about security
            </GlossyButton>
          </div>
        </div>
      </section>
    </div>
  );
}
