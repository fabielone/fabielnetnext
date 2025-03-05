// types/navigation.ts
import { ReactNode } from 'react';

export interface SubSection {
  name: string;
  path: string;
}

export interface SubItem {
  name: string;
  subSections: SubSection[];
}

export interface NavItem {
  name: string;
  path?: string;
  subItems?: SubItem[];
}

export interface MobileMenuItemProps {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

export interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  openCategories: Record<string, boolean>;
  onToggleCategory: (category: string) => void;
  onNavigate: () => void;
}