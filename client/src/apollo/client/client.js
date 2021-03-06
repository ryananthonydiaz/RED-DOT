import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';
import { withClientState } from 'apollo-link-state';
import { AsyncStorage } from 'react-native';

const cache = new InMemoryCache();
const stateLink = withClientState({ cache });

const authLink = setContext(async (_, { headers, ...rest }) => {
  const token = await AsyncStorage.getItem('token');

  return {
    ...rest,
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

const httpLink = authLink.concat(new HttpLink({ uri: 'https://reddot-api-prod.herokuapp.com/' }));

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, httpLink]),
  resolvers: {},
});

export { ApolloProvider as default, client };
