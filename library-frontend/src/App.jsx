import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import { useApolloClient } from '@apollo/client/react'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('book-user-token'))
  const [page, setPage] = useState('authors')

  const client = useApolloClient()

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
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

      <Authors show={page === 'authors'} token={token}/>

      <Books show={page === 'books'} />
      
      <NewBook show={page === 'add'} />

      <Recommended show={page === 'recommended'}/>

      <LoginForm show={page === 'login'} setToken={setToken} setPage={setPage}/>
    </div>
  )
}

export default App
