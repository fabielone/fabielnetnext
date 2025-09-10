import LoadingSpinner from 'src/app/components/atoms/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner 
          size="large" 
          color="text-green-600" 
          message="Loading our clients..." 
        />
        <div className="mt-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Showcasing Our Partners
          </h2>
          <p className="text-gray-600">
            Loading information about our valued clients and allies...
          </p>
        </div>
      </div>
    </div>
  );
}
