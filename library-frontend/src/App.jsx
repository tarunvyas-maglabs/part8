import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import { useApolloClient } from '@apollo/client/react'
import Notification from './components/Notification'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('book-user-token'))
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)

  const client = useApolloClient()

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
