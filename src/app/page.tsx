import { BlogPosts } from 'src/app/components/posts'
import MyServices from './components/substances/sections/services'
import Hero from './components/substances/hero/hero'
import BlogList from './components/substances/sections/blogsection'
import ReviewsScroller from './components/molecules/sections/reviews'

export default function Page() {
  return (
    <section>
      <Hero/>
      <ReviewsScroller />
      <MyServices /> 
      <BlogList />
    </section>
  )
}
