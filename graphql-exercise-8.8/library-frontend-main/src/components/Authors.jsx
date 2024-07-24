import { useState } from 'react'
import { EDIT_AUTHOR, ALL_BOOKS,ALL_AUTHORS } from '../queries'
import { useMutation } from '@apollo/client'
import Select from 'react-select';
const Authors = (props) => {
  const [name,setName] = useState("")
  const [born,setBorn] = useState(0)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      props.setError(messages)
    }
  })

  if (!props.show || editAuthor.loading) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    console.log("name",name)
    editAuthor({variables:{name:name.value,born:parseInt(born)}})
    setName("")
    setBorn(0)
  }
  const authors = props.authors
  const select_authors = props.authors.map(author => ({
    value: author.name,
    label: author.name
  }));
  console.log("authors",authors)
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>set birth year</h2>
      <form onSubmit={submit}>
        <div>
          name
          <Select
            value={name}
            onChange={setName}
            options={select_authors}
          />
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">Update Author</button>
      </form>
    </div>
  )
}

export default Authors
