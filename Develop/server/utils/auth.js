const jwt = require('jsonwebtoken');

// set token secret and expiration date- changed to 4 hours
const secret = 'mysecretsshhhhh';
const expiration = '4h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via  req.query or headers - removed
    // let token = req.query.token || req.headers.authorization;

    // allows token to be sent via req.body, req.query, or headers - new
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"] - unchanged
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // no token? return request
    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

     // return updated request object
     return req;
  },
  // didn't realize it was down here at first, removed the added one up top
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
