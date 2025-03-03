import { BlogPosts } from 'app/components/posts'
import MyServices from './components/substances/sections/services'
import Hero from './components/substances/hero/hero'
import BlogList from './components/substances/sections/blogsection'

export default function Page() {
  return (
    <section>
      <Hero/>
      <MyServices /> 
      <BlogList />
    </section>
  )
}
