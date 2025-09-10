import LoadingSpinner from 'src/app/components/atoms/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner 
          size="large" 
          color="text-blue-600" 
          message="Loading contact information..." 
        />
        <div className="mt-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Getting Ready to Connect
          </h2>
          <p className="text-gray-600">
            Loading our contact form and support information...
          </p>
        </div>
      </div>
    </div>
  );
}
