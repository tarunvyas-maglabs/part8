import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { useState } from "react"

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

const LoginForm = ({ show, setToken, setPage }) => {
  
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('book-user-token', token)
      setPage('books')
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
          username
          <input value={username} onChange={({ target }) => setUsername(target.value)}/>
        </div>
        <div>
          password
          <input type='password' value={password} onChange={({ target }) => setPassword(target.value)}/>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm