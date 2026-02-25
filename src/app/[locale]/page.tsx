import { Suspense } from 'react'
import Hero from '../components/molecules/hero/hero'
import { LinkOptimizer } from '../components/hooks/useLinkOptimizer'
import MyServices from '../components/molecules/services'
import BlogList from '../components/molecules/blogsection'
import ReviewsScroller from '../components/molecules/sections/reviews'

export default function Page() {
  return (
    <section>
      <LinkOptimizer />
      <Hero />
      <Suspense fallback={<div className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />}>
        <ReviewsScroller />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />}>
        <MyServices />
      </Suspense>
      <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />}>
        <BlogList />
      </Suspense>
    </section>
  )
}
