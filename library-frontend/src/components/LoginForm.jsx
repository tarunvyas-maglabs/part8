import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { useState } from "react"
import { useApolloClient } from "@apollo/client/react"

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

const LoginForm = ({ show, setToken, setPage, setError }) => {
  
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')

  const client = useApolloClient()

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('book-user-token', token)
      client.resetStore()
      setPage('books')
    },
    onError: () => {
      setError('login failed')
    }
  })

  const submit = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
    setUsername('')
    setPassword('')
  }

  if(!show) {
    return null
  }

  return(
    <div>
      <h2>login</h2>
      <form onSubmit={submit}>
        <div>
          <label>
            username
            <input value={username} onChange={({ target }) => setUsername(target.value)}/>
          </label>
        </div>
        <div>
          <label>
            password
            <input type='password' value={password} onChange={({ target }) => setPassword(target.value)}/>
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm