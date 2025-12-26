'use client'
import { useState, useEffect } from 'react';
import { LLCFormData } from '../types';

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
          return { ...initialState, ...parsed };
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