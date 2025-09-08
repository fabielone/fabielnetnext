'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Track loading performance
    if (typeof window !== 'undefined' && 'performance' in window) {
      const handleLoad = () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        
        console.log('🚀 Performance Metrics:');
        console.log(`   📊 Total Load Time: ${Math.round(loadTime)}ms`);
        console.log(`   ⚡ DOM Content Loaded: ${Math.round(domContentLoaded)}ms`);
        console.log(`   🎨 First Paint: ${Math.round(navigation.responseEnd - navigation.fetchStart)}ms`);
        
        // Log to console for debugging
        if (loadTime > 3000) {
          console.warn('⚠️ Page load time is over 3 seconds. Consider further optimizations.');
        } else if (loadTime < 1000) {
          console.log('✅ Excellent page load time!');
        } else {
          console.log('👍 Good page load time');
        }
      };

      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    }
  }, []);

  return null; // This component doesn't render anything
}
