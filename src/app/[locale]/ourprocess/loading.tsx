import LoadingSpinner from 'src/app/components/atoms/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner 
          size="large" 
          color="text-blue-600" 
          message="Loading our process..." 
        />
        <div className="mt-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Preparing Our Process Overview
          </h2>
          <p className="text-gray-600">
            Loading information about how we work with you...
          </p>
        </div>
      </div>
    </div>
  );
}
