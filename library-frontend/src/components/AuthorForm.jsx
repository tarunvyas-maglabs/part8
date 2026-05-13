import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";

const EDIT_BORN = gql`
  mutation editAuthor(
    $name: String!
    $setBornTo: Int!
    ) {
      editAuthor(name: $name, setBornTo: $setBornTo) {
        name
        born
        bookCount
        id
      }
    }
`

const AuthorForm = ({ authors }) => {
  const [name, setName] = useState(authors[1].name)
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_BORN, {
    onCompleted: (data) => {
      if (!data.editAuthor) {
        console.log('Error: Author not found')
      }
    }
  })

  const submit = (event) => {
    event.preventDefault()
    console.log(name)

    editAuthor({ variables: { name: name, setBornTo: Number(born) } })
    setName('')
    setBorn('')
  }

  return(
    <div>
      <h2>change number</h2>
      <form onSubmit={submit}>
        <div>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map(a => (
              <option value={a.name} key={a.id}>{a.name}</option>)
            )}
          </select>
        </div>
        <div>
          born
          <input value={born} onChange={({ target }) => setBorn(target.value)}/>
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default AuthorForm