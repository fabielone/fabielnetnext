// components/forms/ConsultationForm.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaPhone, FaCheckCircle } from 'react-icons/fa';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { format, addDays, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

const services = [
  { id: 'formation', name: 'Business Formation', description: 'LLC, Corporation, Nonprofit setup' },
  { id: 'software', name: 'Software Development', description: 'Web & mobile app development' },
  { id: 'marketing', name: 'Marketing Services', description: 'Digital marketing & branding' },
];

const availableTimes = [
  '09:00 AM', '10:00 AM', '11:00 AM', 
  '12:00 PM', '01:00 PM', '02:00 PM', 
  '03:00 PM', '04:00 PM'
];

export default function ConsultationForm() {
    const [step, setStep] = useState<number>(1);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [preferredContact, setPreferredContact] = useState<string>('any');
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: '',
      urgency: 'scheduled', // 'asap' or 'anytime'
    });
  
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
    // Generate next 14 days for calendar with proper typing
    const generateDates = (): Date[] => {
      const dates: Date[] = [];
      for (let i = 0; i < 14; i++) {
        dates.push(addDays(new Date(), i));
      }
      return dates;
    };
  
    const dates = generateDates();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectService = (serviceId: string) => {
    setFormData(prev => ({ ...prev, service: serviceId }));
    setStep(2);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const selectTime = (time: string) => {
    setSelectedTime(time);
    setFormData(prev => ({
      ...prev,
      urgency: 'scheduled',
      // Only include scheduling info if both date and time are selected
      message: selectedDate ? `Scheduled for ${format(selectedDate, 'MMMM d, yyyy')} at ${time}` : ''
    }));
  };
  
  const handleUrgencyChange = (urgency: string) => {
    setFormData(prev => ({
      ...prev,
      urgency,
      // Clear any existing scheduling message when changing urgency
      message: ''
    }));
    setSelectedDate(null);
    setSelectedTime(null);
  };
  const isDateSelected = (date: Date): boolean => {
    return selectedDate !== null && date.toDateString() === selectedDate.toDateString();
  };

  const formatSelectedDate = (): string => {
    return selectedDate ? format(selectedDate, 'PPPP', { locale: es }) : '';
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Consultation scheduled:', {
      ...formData,
      date: selectedDate,
      time: selectedTime
    });
    setIsSubmitted(true);
  };


  const getStepIcon = (stepNumber: number) => {
    if (stepNumber < step) {
      return <IoMdCheckmarkCircle className="text-green-500 w-5 h-5" />;
    }
    const icons = [FaCalendarAlt, FaClock, FaPhone];
    const Icon = icons[stepNumber - 1];
    return <Icon className={`w-4 h-4 ${stepNumber === step ? 'text-amber-500' : 'text-gray-400'}`} />;
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-auto"
      >
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <FaCheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Gracias por programar tu consulta!</h2>
        <p className="text-gray-600 mb-6">
  {formData.urgency === 'asap' ? 
    'Nos pondremos en contacto contigo lo antes posible.' : 
    formData.urgency === 'anytime' ? 
    'Nos pondremos en contacto contigo pronto.' : 
    selectedDate && selectedTime ? 
    `Te esperamos el ${formatSelectedDate()} a las ${selectedTime}.` : 
    'Nos pondremos en contacto contigo para confirmar los detalles.'}
</p>
        <div className="bg-amber-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Resumen de tu consulta:</h3>
          <p className="text-gray-700">
            <span className="font-medium">Servicio:</span> {services.find(s => s.id === formData.service)?.name}
          </p>
          {formData.urgency === 'scheduled' && selectedDate && selectedTime && (
            <p className="text-gray-700">
              <span className="font-medium">Fecha y hora:</span> {formatSelectedDate()} a las {selectedTime}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setStep(1);
            setFormData({
              name: '',
              email: '',
              phone: '',
              service: '',
              message: '',
              urgency: 'scheduled',
            });
            setSelectedDate(null);
            setSelectedTime(null);
          }}
          className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Programar otra consulta
        </button>
      </motion.div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white rounded-xl shadow-lg">      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stepNumber < step ? 'bg-green-100' : stepNumber === step ? 'bg-amber-100' : 'bg-gray-100'}`}>
                {getStepIcon(stepNumber)}
              </div>
              <span className={`text-xs mt-2 ${stepNumber <= step ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                {['Servicio', 'Horario', 'Contacto'][stepNumber - 1]}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: step > 3 ? 0 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: step > 3 ? 0 : -50 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Selecciona tu servicio</h2>
              <p className="text-gray-600">¿En qué podemos ayudarte hoy?</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      type="button"
                      onClick={() => selectService(service.id)}
                      className={`w-full p-6 border rounded-xl text-left transition-all ${formData.service === service.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{service.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        </div>
                        {formData.service === service.id && (
                          <IoMdCheckmarkCircle className="text-green-500 w-5 h-5" />
                        )}
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Scheduling */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Programa tu consulta</h2>
              <p className="text-gray-600">Selecciona una fecha y hora o elige otra opción</p>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-800 flex items-center">
                      <FaCalendarAlt className="mr-2 text-amber-500" />
                      Fecha preferida
                    </h3>
                    <div className="grid grid-cols-7 gap-1">
                      {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, index) => (
                        <div key={index} className="text-center text-xs font-medium text-gray-500 p-1">
                          {day}
                        </div>
                      ))}
                      {dates.map((date, index) => {
                        const selected = isDateSelected(date);
                        const today = isToday(date);
                        return (
                          <button
                            key={index}
                            onClick={() => selectDate(date)}
                            className={`p-2 rounded-lg text-sm ${
                              selected 
                                ? 'bg-amber-500 text-white' 
                                : today 
                                  ? 'bg-gray-100 text-gray-800' 
                                  : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            {format(date, 'd')}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-800 flex items-center">
                        <FaClock className="mr-2 text-amber-500" />
                        Hora preferida
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {availableTimes.map((time) => (
                          <button
                            key={time}
                            onClick={() => selectTime(time)}
                            className={`p-2 rounded-lg text-sm ${
                              selectedTime === time 
                                ? 'bg-amber-500 text-white' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <h3 className="font-medium text-gray-800 mb-2">O elige otra opción:</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:border-amber-300 cursor-pointer">
                      <input
                        type="radio"
                        name="urgency"
                        checked={formData.urgency === 'asap'}
                        onChange={() => handleUrgencyChange('asap')}
                        className="h-4 w-4 text-amber-500 focus:ring-amber-500"
                      />
                      <div>
                        <span className="block text-gray-800 font-medium">Lo antes posible</span>
                        <span className="block text-gray-600 text-sm">Nos pondremos en contacto contigo inmediatamente</span>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:border-amber-300 cursor-pointer">
                      <input
                        type="radio"
                        name="urgency"
                        checked={formData.urgency === 'anytime'}
                        onChange={() => handleUrgencyChange('anytime')}
                        className="h-4 w-4 text-amber-500 focus:ring-amber-500"
                      />
                      <div>
                        <span className="block text-gray-800 font-medium">Cualquier momento</span>
                        <span className="block text-gray-600 text-sm">Nos pondremos en contacto cuando estés disponible</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Regresar
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  disabled={formData.urgency === 'scheduled' && !selectedTime}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Información de contacto</h2>
              <p className="text-gray-600">Por favor proporciónanos tus datos para coordinar la consulta</p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 mb-1">Preferencia de contacto</label>
                  <select
                    id="preferredContact"
                    name="preferredContact"
                    value={preferredContact}
                    onChange={(e) => setPreferredContact(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="any">Cualquier método</option>
                    <option value="email">Correo electrónico</option>
                    <option value="phone">Llamada telefónica</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje adicional (opcional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Describe brevemente lo que necesitas o cualquier información adicional"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Regresar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={!formData.name || !formData.email || !formData.phone}
                >
                  Programar consulta
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}