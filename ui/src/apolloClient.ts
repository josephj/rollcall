import { ApolloClient, InMemoryCache } from "@apollo/client";

const dataset = process.env.REACT_APP_DATA_SET || "development";
export const apolloClient = new ApolloClient({
  uri: `https://5wmwst53.api.sanity.io/v1/graphql/${dataset}/default`,
  cache: new InMemoryCache(),
});
