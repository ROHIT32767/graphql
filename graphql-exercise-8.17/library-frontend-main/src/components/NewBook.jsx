import { useState } from 'react'
import { CREATE_BOOK, ALL_BOOKS,ALL_AUTHORS } from '../queries'
import { useMutation } from '@apollo/client'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])


  const [ createBook ] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      props.setError(messages)
    },
    update: (cache, response) => {
      try {
        cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
          return {
            allBooks: allBooks.concat(response.data.addBook),
          };
        });
        cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
          const addedBookAuthor = response.data.addBook.author;
          let updatedAuthors = allAuthors;
          const authorExists = allAuthors.some(author => author.name === addedBookAuthor.name);
          if (!authorExists) {
            updatedAuthors = allAuthors.concat(addedBookAuthor);
          }
          return { 
            allAuthors: updatedAuthors,
          };
        });
      } catch (error) {
        console.error('Error updating cache:', error);
      }
    }
  })

  if (!props.show || createBook.loading) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    createBook({variables:{title:title,author:author,published:parseInt(published),genres:genres}})

    setTitle('')
    setPublished(0)
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook