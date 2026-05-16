import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import { useState } from "react"

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

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const allBooksResult = useQuery(ALL_BOOKS)
  const filteredResult = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre
  })

  if (!props.show) {
    return null
  }

  if (allBooksResult.loading || filteredResult.loading) {
    return <div>loading...</div>
  }

  const allBooks = allBooksResult.data.allBooks
  const books = genre ? filteredResult.data.allBooks : allBooks

  const allGenres = allBooks.map(b => b.genres).flat()
  const genres = Array.from(new Set(allGenres))

  return (
    <div>
      <h2>books</h2>
      {genre && (
        <p>in genre <strong>{`${genre}`}</strong></p>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map(genre => (
        <button onClick={() => setGenre(genre)} key={genre}>{genre}</button>
      ))}
      <button onClick={() => setGenre(null)} >all books</button>
    </div>
  )
}

export default Books
