import { Link } from 'react-router-dom';

export default function Solutions() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Solutions</h1>
      <p className="text-lg text-gray-600 mb-8">
        Payment solutions for every business type.
      </p>
      <div className="space-y-4">
        <Link to="/solutions/fintechs" className="block p-6 border rounded hover:border-blue-600">
          <h2 className="text-2xl font-bold mb-2">For Fintechs</h2>
          <p className="text-gray-600">Launch payment features fast.</p>
        </Link>
        <Link to="/solutions/merchants" className="block p-6 border rounded hover:border-blue-600">
          <h2 className="text-2xl font-bold mb-2">For Merchants</h2>
          <p className="text-gray-600">Optimize checkout and reduce costs.</p>
        </Link>
      </div>
    </div>
  );
}
