import { gql } from "@apollo/client"

const ALL_BOOKS = gql`
  query allBooks($genre: String){
    allBooks(genre: $genre) {
      id
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const addBookToCache = (cache, bookToAdd) => {
    cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        const bookExists = allBooks.some(
            (book) => book.id === bookToAdd.id,
        )

        if(bookExists) {
            return { allBooks }
        }

        return {
            allBooks: allBooks.concat(bookToAdd)
        }
    })
}