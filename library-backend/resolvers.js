const Author = require('./models/author')
const Book = require('./models/book')
const { GraphQLError } = require('graphql/error')

const resolvers = {
  Query: {
    bookCount: async() => Book.collection.countDocuments(),
    authorCount: async() => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genres) {
        return Book.find({})
      }
      if(args.author && !args.genres) {
        return Book.find({ author: args.author })
      }
      if(args.genres && !args.author) {
        return Book.find({ genres: { $all: args.genres } })
      }
      return Book.find({ author: args.author, genres: { $all: args.genres } })
    },
    allAuthors: async () => { 
      return Author.find({})
    }
  },
  Author: {
    bookCount: async(root) => { 
      return Book.find({ author: root._id }).countDocuments()
    }
  },
  Mutation: {
    addBook: async (root, args) => {

      let author = await Author.findOne({ name: args.author })

      if(!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Failed to add book', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        })
      }
      return book
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })

      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          }
        })
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
    }
  }
}

module.exports = resolvers