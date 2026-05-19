import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import { useApolloClient, useSubscription } from '@apollo/client/react'
import Notification from './components/Notification'
import { gql } from "@apollo/client"
import { addBookToCache } from '../utils/apolloCache'

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
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
const App = () => {
  const [token, setToken] = useState(localStorage.getItem('book-user-token'))
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)

  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`Added ${addedBook.title} by ${addedBook.author.name}`)
      addBookToCache(client.cache, addedBook)
    }
  })

  const Notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token && (
          <button onClick={() => setPage('login')} >login</button>
        )}
        {token && (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommended')}>recommended</button>
            <button onClick={onLogout}>logout</button>
          </>
        )}
      </div>

      <Notification errorMessage={errorMessage}/>

      <Authors show={page === 'authors'} token={token}/>

      <Books show={page === 'books'} />
      
      <NewBook show={page === 'add'} />

      <Recommended show={page === 'recommended'}/>

      <LoginForm show={page === 'login'} setToken={setToken} setPage={setPage} setError={Notify}/>
    </div>
  )
}

export default App
