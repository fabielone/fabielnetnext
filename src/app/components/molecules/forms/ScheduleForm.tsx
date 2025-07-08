'use client';

import { useState, useCallback , useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaPhone, 
  FaCheckCircle 
} from 'react-icons/fa';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { 
  format, 
  addMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  isBefore,
  isSameDay
} from 'date-fns';
import { es } from 'date-fns/locale';

// Configuration
const services = [
  { 
    id: 'formation', 
    name: 'Business Formation', 
    description: 'LLC, Corporation, Nonprofit setup' 
  },
  { 
    id: 'software', 
    name: 'Software Development', 
    description: 'Web & mobile app development' 
  },
  { 
    id: 'marketing', 
    name: 'Marketing Services', 
    description: 'Digital marketing & branding' 
  },
];

const availableTimes = [
  '09:00 AM', '10:00 AM', '11:00 AM', 
  '12:00 PM', '01:00 PM', '02:00 PM', 
  '03:00 PM', '04:00 PM'
];

// Custom Calendar Hook
function useCalendar({ 
  monthsInAdvance = 3, 
  onDateSelect,
  selectedDate
}: { 
  monthsInAdvance?: number, 
  onDateSelect: (date: Date) => void,
  selectedDate?: Date | null 
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const generateMonthDays = (month: Date) => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    
    return eachDayOfInterval({ start, end });
  };

  const isValidDate = (date: Date) => {
    const maxAllowedDate = addMonths(new Date(), monthsInAdvance);
    
    if (isBefore(date, new Date())) {
      return false;
    }
    
    return isBefore(date, maxAllowedDate) || isSameMonth(date, maxAllowedDate);
  };

  const renderCalendar = () => {
    const monthDays = generateMonthDays(currentMonth);
    const weekdays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
    // Add this scroll effect

    return (
      <div className="calendar">
        <div className="calendar-header flex justify-between items-center mb-4">
          <button 
            type="button"
            onClick={() => setCurrentMonth(prev => addMonths(prev, -1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <h2 className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h2>
          <button 
            type="button"
            onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            →
          </button>
        </div>

        <div className="calendar-grid grid grid-cols-7 gap-1">
          {weekdays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
              {day}
            </div>
          ))}

          {monthDays.map((date, index) => {
            const isCurrentMonth = isSameMonth(date, currentMonth);
            const today = isToday(date);
            const valid = isValidDate(date);
            const selected = selectedDate && isSameDay(date, selectedDate);

            return (
              <button
                key={index}
                type="button"
                disabled={!isCurrentMonth || !valid}
                className={`p-2 rounded-lg text-sm 
                  ${!isCurrentMonth ? 'text-gray-300' : ''}
                  ${today ? 'bg-green-100 text-green-800 font-bold' : ''}
                  ${valid ? 'hover:bg-amber-100 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}
                  ${selected ? 'bg-amber-500 text-white' : ''}
                `}
                onClick={() => valid && onDateSelect(date)}
              >
                {format(date, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return {
    currentMonth,
    setCurrentMonth,
    renderCalendar
  };
}

// Main Consultation Form Component
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
    urgency: 'scheduled',
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  // Add this scroll effect
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [step]); // Triggered when step changes
  // Scroll to top when submission occurs
  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [isSubmitted]); // Triggered when submission status changes
  // Callback for date selection
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  }, []);

  // Use Calendar Hook
  const { 
    currentMonth, 
    setCurrentMonth, 
    renderCalendar 
  } = useCalendar({
    onDateSelect: selectDate,
    selectedDate
  });

  // Form Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectService = (serviceId: string) => {
    setFormData(prev => ({ ...prev, service: serviceId }));
    setStep(2);
  };

  const selectTime = (time: string) => {
    setSelectedTime(time);
    setFormData(prev => ({
      ...prev,
      urgency: 'scheduled',
      message: selectedDate 
        ? `Scheduled for ${selectedDate.toLocaleDateString()} at ${time}` 
        : ''
    }));
  };

  const handleUrgencyChange = (urgency: string) => {
    setFormData(prev => ({
      ...prev,
      urgency,
      message: ''
    }));
    setSelectedDate(null);
    setSelectedTime(null);
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

  const resetForm = () => {
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
  };

  // Render Methods
  const renderServiceStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Select Your Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => selectService(service.id)}
            className={`p-6 border rounded-xl text-left 
              ${formData.service === service.id 
            ? 'border-amber-500 bg-amber-50' 
            : 'border-gray-200 hover:border-amber-300'
          }`}
          >
            <h3 className="font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSchedulingStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Schedule Consultation</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          {renderCalendar()}
        </div>
        {selectedDate && (
          <div className="w-full md:w-1/3 space-y-2">
            <h3 className="font-medium">Available Times</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => selectTime(time)}
                  className={`p-2 rounded-lg ${
                    selectedTime === time 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
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
        <h3 className="font-medium text-gray-800 mb-2">Alternative Options:</h3>
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
              <span className="block text-gray-800 font-medium">As Soon As Possible</span>
              <span className="block text-gray-600 text-sm">We'll contact you immediately</span>
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
              <span className="block text-gray-800 font-medium">Anytime</span>
              <span className="block text-gray-600 text-sm">We'll contact you when convenient</span>
            </div>
          </label>
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep(3)}
          className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          disabled={formData.urgency === 'scheduled' && !selectedTime}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderContactStep = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
        <button
          type="button"
          onClick={() => setStep(2)}
          className="text-gray-600 hover:text-gray-800 flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div>
          <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
          <select
            id="preferredContact"
            name="preferredContact"
            value={preferredContact}
            onChange={(e) => setPreferredContact(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="any">Any Method</option>
            <option value="email">Email</option>
            <option value="phone">Phone Call</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Additional Message (Optional)</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
            placeholder="Provide any additional details"
          ></textarea>
        </div>
        <div className="flex space-x-4">
          <button 
            type="button"
            onClick={() => setStep(2)}
            className="w-1/3 border border-gray-300 text-gray-700 p-2 rounded hover:bg-gray-100 transition-colors"
          >
            Back
          </button>
          <button 
            type="submit" 
            className="w-2/3 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
          >
            Schedule Consultation
          </button>
        </div>
      </div>
    </form>
  );

  const renderSubmissionConfirmation = () => (
    <div className="text-center p-8 bg-white rounded-xl shadow-md">
      <FaCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Consultation Scheduled!</h2>
      <p className="text-gray-600 mb-6">
        {formData.urgency === 'asap' 
          ? 'We will contact you as soon as possible.' 
          : formData.urgency === 'anytime' 
            ? 'We will contact you soon.' 
            : selectedDate && selectedTime 
              ? `We look forward to meeting you on ${selectedDate.toLocaleDateString()} at ${selectedTime}.` 
              : 'We will contact you to confirm details.'}
      </p>
      <button
        onClick={resetForm}
        className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
      >
        Schedule Another Consultation
      </button>
    </div>
  );

  // Main Render
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {isSubmitted 
            ? renderSubmissionConfirmation() 
            : step === 1 
              ? renderServiceStep() 
              : step === 2 
                ? renderSchedulingStep() 
                : renderContactStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}