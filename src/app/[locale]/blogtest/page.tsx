// app/[locale]/blogtest/page.tsx
import { getApolloClient } from 'src/app/components/lib/apollo-client';
import { gql } from '@apollo/client';
import Link from 'next/link';
import Image from 'next/image';

export default async function BlogPage({
  params,
}: {
  params: { locale: string };
}) {
  const client = await getApolloClient(params.locale);
  
  const { data } = await client.query({
    query: gql`
      query getposts {
        posts {
          nodes {
            id
            title
            slug
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    `,
    variables: {
      language: params.locale.toUpperCase()
    }
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.posts?.nodes?.map((post: any) => (
          <article key={post.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <Link href={`/${params.locale}/blog/${post.slug}`}>
              <div className="relative h-48 w-full">
                {post.featuredImage?.node?.sourceUrl ? (
                  <Image
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.featuredImage.node.altText || post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}