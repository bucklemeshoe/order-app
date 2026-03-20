import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { blogPosts } from '@/lib/blog-data'
import { Metadata } from 'next'

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = blogPosts.find((p) => p.slug === params.slug)
  if (!post) {
    return { title: 'Not Found | O.App' }
  }
  return {
    title: `${post.title} | O.App Blog`,
    description: post.excerpt,
  }
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostDetail({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 max-w-4xl font-[family-name:var(--font-sans)] animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Back navigation */}
      <div className="mb-10 lg:mb-14">
        <Link href="/blog" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-brand transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to blog
        </Link>
      </div>

      {/* Header Container */}
      <header className="mb-12 md:text-center max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-start md:justify-center gap-2 mb-6">
          {post.tags.map((tag, i) => (
            <span key={i} className="inline-flex flex-shrink-0 items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-800 text-sm font-semibold">
              <span className="text-base">{tag.icon}</span> <span>{tag.name}</span>
            </span>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 mb-6 font-[family-name:var(--font-heading)] tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-start md:justify-center gap-4 text-sm font-medium text-zinc-500">
          <span>By <strong>{post.author}</strong></span>
          <span className="text-zinc-300">•</span>
          <span>{post.date}</span>
          <span className="text-zinc-300">•</span>
          <span>{post.readTime}</span>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl mb-16 bg-zinc-100">
        <Image 
          src={post.coverImage} 
          alt={post.title} 
          fill 
          priority
          className="object-cover" 
        />
      </div>

      {/* Article Content Container */}
      <div className="max-w-3xl mx-auto">
        <div 
          className="blog-content font-medium text-lg leading-relaxed text-zinc-700 space-y-6"
          dangerouslySetInnerHTML={{ __html: post.contentHTML }}
        />
        
        {/* Custom Scoped CSS specifically for HTML injected content */}
        <style dangerouslySetInnerHTML={{__html: `
          .blog-content h2 {
            font-size: 2.25rem;
            line-height: 2.5rem;
            font-weight: 900;
            color: #18181b; /* zinc-900 */
            margin-top: 3.5rem;
            margin-bottom: 1.5rem;
            font-family: var(--font-heading);
            letter-spacing: -0.025em;
          }
          
          .blog-content h3 {
            font-size: 1.5rem;
            line-height: 2rem;
            font-weight: 800;
            color: #18181b;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            font-family: var(--font-heading);
            letter-spacing: -0.015em;
          }

          .blog-content p {
            margin-bottom: 1.5rem;
          }

          .blog-content strong {
            font-weight: 700;
            color: #000;
          }

          .blog-content em {
            font-style: italic;
            color: #52525b; /* zinc-600 */
          }

          .blog-content ul {
            list-style-type: none;
            padding-left: 0;
            margin-top: 2rem;
            margin-bottom: 2rem;
          }
          
          .blog-content li {
            position: relative;
            padding-left: 2rem;
            margin-bottom: 1rem;
            font-size: 1.125rem;
            line-height: 1.75;
          }

          .blog-content li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: var(--color-brand, #F83D60);
            font-weight: 900;
            font-size: 1.5rem;
            line-height: 1.75rem;
          }
        `}} />
      </div>

    </article>
  )
}
