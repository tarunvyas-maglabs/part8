import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const ME = gql`
  query {
    me {
      favoriteGenre
    }
  }
`

const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      id
      title
      published
      author {
        name
      }
      genres
    }
  }
`


const Recommended = ({ show }) => {
  
  const result = useQuery(ME)
  const favoriteGenre = result.data?.me?.favoriteGenre

  const recommendedBooksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre
  })
  
  if (!show) {
    return null
  }

  if(result.loading || recommendedBooksResult.loading) {
    return <div>loading...</div>
  }

  const recommendedBooks = recommendedBooksResult.data.allBooks

  return(
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{favoriteGenre}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  )

}

export default Recommended