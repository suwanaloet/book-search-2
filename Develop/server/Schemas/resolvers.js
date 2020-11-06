// Define the query and mutation functionality to work with the Mongoose models.
const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                return userData;
            }

            throw new AuthenticationError('Not logged in!');
        },
    },
    Mutation: {
        // Accepts an email and password as parameters; returns an Auth type.
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        // Accepts a username, email, and password as parameters; returns an Auth type.
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        //Accepts a book author's array, description, title, bookId, image, and link as parameters; returns a User type. 
        //*******must pass in bookData instead of args or mutation wont push and will return null.
        //savedBooks [BookSchema] is the array designated in User.js
        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
              const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $push: { savedBooks: bookData } },
                { new: true }
              );
      
              return updatedUser;
            }
      
            throw new AuthenticationError('You need to be logged in!');
          },
      
        //Accepts a book's bookId as a parameter; returns a User type.
        removeBook: async (parent, args, context) => {
            if (context.user) {
                const updatedBook = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                );

                return updatedBook;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
    },

};
module.exports = resolvers;