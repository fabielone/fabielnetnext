import MyServices from '../components/molecules/services'
import Hero from '../components/molecules/hero/hero'
import BlogList from '../components/molecules/blogsection'
import ReviewsScroller from '../components/molecules/sections/reviews'

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
