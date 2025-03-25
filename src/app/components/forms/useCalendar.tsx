import { useState } from 'react';
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

interface CalendarProps {
  monthsInAdvance?: number;
  onDateSelect: (date: Date) => void;
  selectedDate?: Date | null;
}

export function useCalendar({ 
  monthsInAdvance = 3, 
  onDateSelect,
  selectedDate
}: CalendarProps) {
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
    const weekdays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

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