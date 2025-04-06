// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export function getApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_WP_GRAPHQL_URL,
      headers: {
        // Remove language header if not needed
        'Content-Type': 'application/json',
      }
    }),
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
      }
    }
  });
}