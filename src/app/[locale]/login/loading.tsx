import LoadingSpinner from 'src/app/components/atoms/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner 
          size="large" 
          color="text-indigo-600" 
          message="Loading login form..." 
        />
        <div className="mt-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Preparing Secure Login
          </h2>
          <p className="text-gray-600">
            Setting up your secure login experience...
          </p>
        </div>
      </div>
    </div>
  );
}
