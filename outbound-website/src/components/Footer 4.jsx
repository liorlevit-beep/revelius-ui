import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t mt-auto bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Product Column */}
          <div>
            <h3 className="font-bold mb-4 text-gray-900">Product</h3>
            <div className="space-y-3">
              <Link
                to="/product"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
              >
                Product
              </Link>
              <Link
                to="/solutions"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
              >
                Solutions
              </Link>
              <Link
                to="/network"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
              >
                Network
              </Link>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h3 className="font-bold mb-4 text-gray-900">Solutions</h3>
            <div className="space-y-3">
              <Link
                to="/solutions#psps"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
              >
                PSPs & PayFacs
              </Link>
              <Link
                to="/solutions#platforms"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
              >
                Marketplaces & Platforms
              </Link>
              <Link
                to="/solutions#neobanks"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
              >
                Neobanks & Embedded Finance
              </Link>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold mb-4 text-gray-900">Company</h3>
            <div className="space-y-3">
              <Link
                to="/company"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
              >
                Company
              </Link>
              <Link
                to="/security"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
              >
                Security
              </Link>
              <Link
                to="/contact"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-bold mb-4 text-gray-900">Resources</h3>
            <div className="space-y-3">
              <Link
                to="/docs"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
              >
                Documentation
              </Link>
            </div>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-bold mb-4 text-gray-900">Legal</h3>
            <div className="space-y-3">
              <Link
                to="/privacy"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="block text-gray-600 hover:text-gray-900 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600">
          © 2026 Revelius. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
