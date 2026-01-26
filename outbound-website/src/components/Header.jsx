import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Revelius
          </Link>
          
          <nav className="flex gap-6">
            <Link to="/product">Product</Link>
            <Link to="/solutions">Solutions</Link>
            <Link to="/network">Network</Link>
            <Link to="/security">Security</Link>
            <Link to="/docs">Docs</Link>
            <Link to="/company">Company</Link>
          </nav>

          <div className="flex gap-3">
            <Link to="/signin" className="px-4 py-2 border rounded">
              Sign in
            </Link>
            <Link to="/request-access" className="px-4 py-2 bg-blue-600 text-white rounded">
              Request access
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
