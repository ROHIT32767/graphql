import { useState, useEffect } from 'react'
import { ALL_BOOKS_BY_USER,ME } from '../queries'
import { useQuery, useApolloClient,useLazyQuery } from "@apollo/client";
const Authors = (props) => {
  if (!props.show) {
    return null
  }
  const user = useQuery(ME);
  const [getBooks, result] = useLazyQuery(ALL_BOOKS_BY_USER);
  const [favoriteBooks, setFavoriteBooks] = useState([])

  useEffect(() => {
    if (result.data) {
      console.log("result.data",result.data)
      setFavoriteBooks(result.data.allBooks)
    }
  }, [setFavoriteBooks, result])

  useEffect(() => {
    if (user.data) {
      console.log("user.data",user.data)
      console.log("favorite genre",user.data.me.favoriteGenre)
      getBooks({ variables: { genre: user.data.me.favoriteGenre } })
    }
  }, [getBooks, user])

  if (result.loading || user.loading) {
    return <div>loading...</div>
  }
  return (
    <div>
      <h2>Books in your favourite genre {user.data.me.favoriteGenre}</h2>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {favoriteBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
