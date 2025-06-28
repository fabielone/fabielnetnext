// app/business/register/page.tsx
import LLCorderForm from 'src/app/components/substances/order/llcorder/LLCorderForm';
import LLCOrderForm from 'src/app/components/substances/order/LLCOrderForm';

export default function BusinessRegistrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-5">
      
      <LLCorderForm/> 
    </div>
  );
}