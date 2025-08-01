'use client'
import { useState } from 'react';
import { LLCFormData } from '../types';

export const useOrderForm = (initialState: LLCFormData) => {
  const [formData, setFormData] = useState<LLCFormData>(initialState);
  
  const updateFormData = <K extends keyof LLCFormData>(field: K, value: LLCFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Add validation logic and other form methods
  return { formData, updateFormData };
};
