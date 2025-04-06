// app/blog/[slug]/page.tsx
import { getApolloClient } from 'src/app/components/lib/apollo-client';
import { gql } from '@apollo/client';
import Image from 'next/image';
import { format } from 'date-fns';
import { RichText } from '@graphcms/rich-text-react-renderer';

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const client = getApolloClient('en');
  
  const { data } = await client.query({
    query: gql`
      query GetPostBySlug($slug: String!) {
        postBy(slug: $slug) {
          id
          title
          content
          date
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
        }
      }
    `,
    variables: {
      slug: params.slug
    }
  });

  const post = data?.postBy;
  const featuredImage = post?.featuredImage?.node;
  const author = post?.author?.node;

  if (!post) {
    return <div className="container mx-auto py-12 text-center">Post not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Featured Image */}
      {featuredImage?.sourceUrl && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={featuredImage.sourceUrl}
            alt={featuredImage.altText || post.title}
            width={featuredImage.mediaDetails?.width || 1200}
            height={featuredImage.mediaDetails?.height || 630}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      )}

      {/* Post Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        
        {/* Author and Date */}
        <div className="flex items-center space-x-4">
          {author?.avatar?.url && (
            <div className="flex-shrink-0">
              <Image
                src={author.avatar.url}
                alt={author.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">{author?.name || 'Unknown Author'}</p>
            <p className="text-sm text-gray-500">
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-blockquote:border-l-blue-600 prose-blockquote:bg-gray-50 prose-blockquote:px-6 prose-blockquote:py-2">
        <RichText content={post.content} />
      </article>

      {/* Tags/Categories (if available) */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Posted in</h3>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Technology
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Web Development
          </span>
        </div>
      </div>
    </div>
  );
}