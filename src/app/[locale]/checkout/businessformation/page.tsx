// app/business/register/page.tsx
import LLCOrderForm from 'src/app/components/substances/order/LLCOrderForm';
import BusinessRegistrationForm from '../../../components/forms/BusinessRegistrationForm';

export default function BusinessRegistrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
      <BusinessRegistrationForm />
      <LLCOrderForm />
    </div>
  );
}