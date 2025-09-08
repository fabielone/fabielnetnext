import LoadingSpinner from 'src/app/components/atoms/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner 
          size="large" 
          color="text-blue-600" 
          message="Loading LLC Formation..." 
        />
        <div className="mt-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Preparing Your Business Formation
          </h2>
          <p className="text-gray-600">
            Setting up your secure LLC registration form...
          </p>
        </div>
      </div>
    </div>
  );
}
