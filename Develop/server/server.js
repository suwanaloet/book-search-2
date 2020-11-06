const express = require('express');
const path = require('path');
const db = require('./config/connection');
// We nuked the routes
// const routes = require('./routes');
//https://arcane-oasis-77610.herokuapp.com/ | https://git.heroku.com/arcane-oasis-77610.git
const app = express();
const PORT = process.env.PORT || 3001;
//import apollo - npm i apollo-server-express
const { ApolloServer } = require('apollo-server-express');
//import typedefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
//import auth middleware
const { authMiddleware } = require('./utils/auth');
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});


//implement apollo server and apply to express server as middleware
server.applyMiddleware({app});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// We nuked the routes
//app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

/*npm install node-gyp -g
npm install bcrypt -g

npm install bcrypt --save
*/
