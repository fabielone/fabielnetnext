// components/BlogPost.tsx
import Image from 'next/image';
import { ReactNode } from 'react';

type BlogPostProps = {
  title: string;
  headerImage: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  content: ReactNode;
};

export default function BlogPost({
  title,
  headerImage,
  author,
  date,
  readTime,
  content,
}: BlogPostProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-6">{title}</h1>
      
      {/* Meta Information */}
      <div className="flex items-center gap-4 mb-8">
        <Image
          src={author.avatar}
          alt={author.name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <p className="font-medium">{author.name}</p>
          <div className="flex gap-2 text-sm text-gray-500">
            <span>{date}</span>
            <span>•</span>
            <span>{readTime} read</span>
          </div>
        </div>
      </div>
      
      {/* Header Image */}
      <div className="mb-8 rounded-xl overflow-hidden">
        <Image
          src={headerImage}
          alt={title}
          width={1200}
          height={630}
          className="w-full h-auto object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {content}
      </div>
    </article>
  );
}