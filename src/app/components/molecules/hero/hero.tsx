'use client';

import dynamic from 'next/dynamic';
import { PillsProps } from '../../atoms/pills/pills';
import TwoColumn from '../../atoms/layout/twocolumns';   
import HeroLeft from '../sections/hero_left'

// Dynamically import HeroRight since it's less critical for initial load
const HeroRight = dynamic(() => import('../sections/hero_right'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
});

export default function Hero() {
  return(
    <div className="px-2 md:px-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <TwoColumn 
        leftContent={<HeroLeft  />} 
        rightContent={<HeroRight />}
      />
    </div>
  )
}