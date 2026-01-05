// utils/language.ts
import { Language } from '../types/types';

export const getLanguageFromPath = (pathname: string): Language => {
  return 'en';
};

export const removeLanguagePrefix = (pathname: string): string => {
  return pathname.replace(/^\/en/, '') || '/';
};

export const addLanguagePrefix = (pathname: string, language: Language): string => {
  const pathWithoutLang = removeLanguagePrefix(pathname);
  return `/en${pathWithoutLang}`;
};