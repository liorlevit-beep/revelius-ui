export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded border">
        <h1 className="text-2xl font-bold mb-6">Sign in to Revelius</h1>
        <button className="w-full py-3 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
