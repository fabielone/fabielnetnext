// app/business/register/page.tsx
'use client'
import { Suspense, lazy } from 'react';
import LoadingSpinner from 'src/app/components/atoms/LoadingSpinner';

// Dynamic import for LLCorderForm
const LLCorderForm = lazy(() => import('src/app/components/molecules/forms/order/llcorder/LLCorderForm'));

// Loading fallback component
const PageLoadingFallback = () => (
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

export default function BusinessRegistrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Suspense fallback={<PageLoadingFallback />}>
        <LLCorderForm/> 
      </Suspense>
    </div>
  );
}