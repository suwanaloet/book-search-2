// queries.js: This will hold the query GET_ME, which will execute the me query set up using Apollo Server.
import gql from 'graphql-tag';

export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;
