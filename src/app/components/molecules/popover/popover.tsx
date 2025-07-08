// components/ui/popover.tsx
import { useState, useRef, useEffect, CSSProperties, ReactNode } from 'react';
import { FiX } from 'react-icons/fi';

type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  className?: string;
};

export function Popover({
  trigger,
  children,
  align = 'center',
  sideOffset = 8,
  className = '',
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // Close when pressing Escape
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Calculate position with proper CSSProperties type
  const getPopoverPosition = (): CSSProperties => {
    if (!triggerRef.current || !popoverRef.current) return {};

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;

    let left = triggerRect.left;
    const top = triggerRect.bottom + scrollY + sideOffset;

    // Handle alignment
    if (align === 'center') {
      left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
    } else if (align === 'end') {
      left = triggerRect.right - popoverRect.width;
    }

    // Ensure popover stays in viewport
    const adjustedLeft = Math.min(
      Math.max(left, 8), // Minimum 8px from left
      window.innerWidth - popoverRect.width - 8 // Minimum 8px from right
    );

    return {
      position: 'absolute',
      left: `${adjustedLeft}px`,
      top: `${top}px`,
    } as CSSProperties;
  };

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="focus:outline-none"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          style={getPopoverPosition()}
          className={`
            z-50 min-w-[12rem] rounded-lg border border-gray-200 bg-white
            shadow-lg transition-opacity duration-200 dark:border-gray-700 dark:bg-gray-800
            ${className}
          `}
        >
          <div className="relative p-1">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-2 top-2 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <FiX className="h-4 w-4" />
            </button>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}