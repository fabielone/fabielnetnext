import LoadingSpinner from 'src/app/components/atoms/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner 
          size="large" 
          color="text-purple-600" 
          message="Loading registration form..." 
        />
        <div className="mt-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Setting Up Your Account
          </h2>
          <p className="text-gray-600">
            Preparing the secure registration form...
          </p>
        </div>
      </div>
    </div>
  );
}
