import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: 'https://5wmwst53.api.sanity.io/v1/graphql/production/default',
  cache: new InMemoryCache(),
});