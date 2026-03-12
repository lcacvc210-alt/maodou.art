import { getLatestPosts } from '@/lib/posts'
import HomePageContent from '@/components/HomePageContent'

export default function Home() {
  const featuredPosts = getLatestPosts(3)
  
  return <HomePageContent featuredPosts={featuredPosts} />
}
