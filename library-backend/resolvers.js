const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { GraphQLError } = require('graphql/error')

const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async() => Book.collection.countDocuments(),
    authorCount: async() => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) filter.author = author._id
      }
      if (args.genre) {
        filter.genres = args.genre
      }
      return Book.find(filter).populate('author')
    },
    allAuthors: async () => { 
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async(root) => { 
      return Book.find({ author: root._id }).countDocuments()
    }
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if(!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }

      let author = await Author.findOne({ name: args.author })

      if(!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Failed to create author', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }

      const newBook = new Book({ ...args, author: author._id })
      try {
        await newBook.save()
      } catch (error) {
        throw new GraphQLError('Failed to add book', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        })
      }
      const book = await Book.findById(newBook._id).populate('author')
      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, { currentUser }) => {
      if(!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }

      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Failed to update author', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.setBornTo,
            error
          }
        })
      }
      return author
    },
    createUser: async(root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError('Failed to create user', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        })
      }
      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if(!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    _resetDatabase: async() => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers