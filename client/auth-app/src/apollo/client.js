import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4001/graphql",
    credentials: "include", // MUITO IMPORTANTE
  }),
  cache: new InMemoryCache(),
});

export default client;