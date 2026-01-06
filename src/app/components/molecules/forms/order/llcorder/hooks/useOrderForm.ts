'use client'
import { useState, useEffect } from 'react';
import { LLCFormData } from '../types';

// Generate a unique order ID
const generateOrderId = (): string => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export const useOrderForm = (initialState: LLCFormData) => {
  const [formData, setFormData] = useState<LLCFormData>(() => {
    // Try to restore form data from sessionStorage (for returning from OAuth login)
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('llcFormData');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Clear the stored data after retrieving it
          sessionStorage.removeItem('llcFormData');
          
          // IMPORTANT: Always generate a fresh orderId when restoring
          // This prevents overwriting existing orders in the database
          // The orderId from session may belong to an already-completed order
          const freshOrderId = generateOrderId();
          
          return { 
            ...initialState, 
            ...parsed,
            orderId: freshOrderId  // Always use fresh orderId
          };
        } catch {
          // If parsing fails, use initial state
        }
      }
    }
    return initialState;
  });
  
  const updateFormData = <K extends keyof LLCFormData>(field: K, value: LLCFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Add validation logic and other form methods
  return { formData, updateFormData };
};