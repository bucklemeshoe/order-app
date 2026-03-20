import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { blogPosts } from '@/lib/blog-data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | O.App',
  description: 'Insights and strategies for modern food businesses in South Africa.',
}

export default function BlogListingPage() {
  return (
    <div className="container mx-auto px-4 max-w-5xl font-[family-name:var(--font-sans)] animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-zinc-900 mb-6 font-[family-name:var(--font-heading)] tracking-tight">
          Restaurant Growth <br /> <span className="text-brand">Insights & Strategies.</span>
        </h1>
        <p className="text-zinc-600 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Tactical guides, industry news, and hard truths about building a profitable food business in the digital age.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className="group block">
            <Card className="border-0 shadow-xl overflow-hidden rounded-[2rem] transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 bg-white h-full flex flex-col">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image 
                  src={post.coverImage} 
                  alt={post.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              
              <CardContent className="p-8 flex flex-col flex-grow">
                {/* tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-2 pr-3 pl-1 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold">
                      <span className="w-6 h-6 rounded-full bg-brand/15 flex items-center justify-center text-[10px]">{tag.icon}</span> <span>{tag.name}</span>
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900 mb-3 group-hover:text-brand transition-colors line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-zinc-600 mb-6 line-clamp-3 text-sm font-medium flex-grow">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 pt-4 border-t border-zinc-100 mt-auto">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
