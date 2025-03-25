// app/consultation/page.tsx
import ConsultationForm from '../../components/forms/ScheduleForm';

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Agenda una consulta gratuita
        </h1>
        <ConsultationForm />
      </div>
    </div>
  );
}