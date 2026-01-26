import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-3">Product</h3>
            <Link to="/product" className="block mb-2">Overview</Link>
          </div>
          
          <div>
            <h3 className="font-bold mb-3">Solutions</h3>
            <Link to="/solutions/fintechs" className="block mb-2">Fintechs</Link>
            <Link to="/solutions/merchants" className="block mb-2">Merchants</Link>
          </div>
          
          <div>
            <h3 className="font-bold mb-3">Company</h3>
            <Link to="/company" className="block mb-2">About</Link>
          </div>
          
          <div>
            <h3 className="font-bold mb-3">Legal</h3>
            <Link to="/privacy" className="block mb-2">Privacy</Link>
            <Link to="/terms" className="block mb-2">Terms</Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-sm text-gray-600">
          © 2026 Revelius. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
