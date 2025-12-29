'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { QuestionnaireSection } from '@/lib/questionnaire/types';

interface UseQuestionnaireProps {
  token: string;
}

interface QuestionnaireData {
  id: string;
  orderId: string;
  stateCode: string;
  status: string;
  currentSection?: string;
  responses: Record<string, any>;
  prePopulatedData: Record<string, any>;
  products: string[];
  order?: any;
}

export function useQuestionnaire({ token }: UseQuestionnaireProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData | null>(null);
  const [sections, setSections] = useState<QuestionnaireSection[]>([]);
  const [stateConfig, setStateConfig] = useState<any>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasChangesRef = useRef(false);

  // Fetch questionnaire data
  const fetchQuestionnaire = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/questionnaire/${token}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load questionnaire');
      }
      
      setQuestionnaire(data.questionnaire);
      setSections(data.sections || []);
      setStateConfig(data.stateConfig);
      setResponses(data.questionnaire?.responses || {});
      
      // Set initial section based on current progress
      if (data.questionnaire?.currentSection && data.sections) {
        const sectionIndex = data.sections.findIndex(
          (s: QuestionnaireSection) => s.id === data.questionnaire.currentSection
        );
        if (sectionIndex >= 0) {
          setCurrentSectionIndex(sectionIndex);
        }
      }
      
      // Check if already completed
      if (data.questionnaire?.status === 'COMPLETED') {
        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load questionnaire');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Update a single response
  const updateResponse = useCallback((questionId: string, value: any) => {
    setResponses(prev => {
      const updated = { ...prev, [questionId]: value };
      hasChangesRef.current = true;
      return updated;
    });
  }, []);

  // Update multiple responses at once
  const updateResponses = useCallback((updates: Record<string, any>) => {
    setResponses(prev => {
      const updated = { ...prev, ...updates };
      hasChangesRef.current = true;
      return updated;
    });
  }, []);

  // Save progress
  const saveProgress = useCallback(async (silent = false) => {
    if (!hasChangesRef.current && silent) return;
    
    try {
      if (!silent) setSaving(true);
      
      const currentSection = sections[currentSectionIndex]?.id;
      
      const res = await fetch(`/api/questionnaire/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses,
          currentSection
        })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save progress');
      }
      
      hasChangesRef.current = false;
    } catch (err: any) {
      if (!silent) {
        setError(err.message || 'Failed to save progress');
      }
      console.error('Auto-save error:', err);
    } finally {
      if (!silent) setSaving(false);
    }
  }, [token, responses, sections, currentSectionIndex]);

  // Submit questionnaire
  const submitQuestionnaire = useCallback(async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      const res = await fetch(`/api/questionnaire/${token}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit questionnaire');
      }
      
      setSubmitted(true);
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Failed to submit questionnaire');
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  }, [token, responses]);

  // Navigate sections
  const goToSection = useCallback((index: number) => {
    if (index >= 0 && index < sections.length) {
      saveProgress(true); // Auto-save before navigating
      setCurrentSectionIndex(index);
    }
  }, [sections.length, saveProgress]);

  const nextSection = useCallback(() => {
    goToSection(currentSectionIndex + 1);
  }, [currentSectionIndex, goToSection]);

  const prevSection = useCallback(() => {
    goToSection(currentSectionIndex - 1);
  }, [currentSectionIndex, goToSection]);

  // Auto-save every 30 seconds
  useEffect(() => {
    autoSaveTimerRef.current = setInterval(() => {
      if (hasChangesRef.current && !submitted) {
        saveProgress(true);
      }
    }, 30000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [saveProgress, submitted]);

  // Initial fetch
  useEffect(() => {
    if (token) {
      fetchQuestionnaire();
    }
  }, [token, fetchQuestionnaire]);

  // Calculate progress
  const calculateProgress = useCallback(() => {
    if (!sections.length) return 0;
    
    let totalQuestions = 0;
    let answeredQuestions = 0;
    
    sections.forEach(section => {
      section.questions.forEach(q => {
        if (q.required) {
          totalQuestions++;
          if (responses[q.id] !== undefined && responses[q.id] !== '' && responses[q.id] !== null) {
            answeredQuestions++;
          }
        }
      });
    });
    
    return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  }, [sections, responses]);

  return {
    loading,
    error,
    questionnaire,
    sections,
    stateConfig,
    responses,
    currentSectionIndex,
    currentSection: sections[currentSectionIndex] || null,
    saving,
    submitting,
    submitted,
    progress: calculateProgress(),
    isFirstSection: currentSectionIndex === 0,
    isLastSection: currentSectionIndex === sections.length - 1,
    updateResponse,
    updateResponses,
    saveProgress,
    submitQuestionnaire,
    goToSection,
    nextSection,
    prevSection,
    refetch: fetchQuestionnaire
  };
}
