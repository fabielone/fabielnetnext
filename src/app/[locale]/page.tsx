'use client';

import dynamic from 'next/dynamic'
import Hero from '../components/molecules/hero/hero'
import PerformanceMonitor from '../components/utils/performance-monitor'

// Dynamically import components that are below the fold
const MyServices = dynamic(() => import('../components/molecules/services'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
})

const BlogList = dynamic(() => import('../components/molecules/blogsection'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
})

const ReviewsScroller = dynamic(() => import('../components/molecules/sections/reviews'), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
})

export default function Page() {
  return (
    <section>
      <PerformanceMonitor />
      <Hero/>
      <ReviewsScroller />
      <MyServices /> 
      <BlogList />
    </section>
  )
}
