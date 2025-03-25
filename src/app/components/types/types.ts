// types/navigation.ts
export type Language = 'es' | 'en';

export interface NavItem {
  name: string;
  path?: string;
  subItems?: SubItem[];
}

export interface SubItem {
  name: string;
  subSections: SubSection[];
}

export interface SubSection {
  name: string;
  path: string;
}