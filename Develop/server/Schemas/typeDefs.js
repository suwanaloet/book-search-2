// // import the gql tagged template function
const { gql } = require('apollo-server-express');

//create typedefs
/*
- Query me: which returns user
-input for savedBookInfo before mutation - for savebook
- Mutation
    login: email and password- returns Auth
    addUser: username, email, password- returns Auth
    saveBook: book author, description ,title, bookId, image, link- returns User
    removeBook: accepts bookId -returns User

-User : _id
        username
        email
        bookCount
        savedBooks (array of Book type)
-Book type : bookId (google api)
             authors (as array for multiple authors)
             description
             title
             image
             link
-Auth : token
        user (ref User)


*/

const typeDefs = gql`

type Query {
    me: User  
}

input BookInput {
    authors: [String]
    description: String
    title: String!
    bookId: ID!
    image: String
    link: String
}



type User {
    _id: ID!
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}

type Book {
    _id: ID!
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
}

type Auth {
    token: ID!
    user: User
}
`;

//export typedefs
module.exports = typeDefs;