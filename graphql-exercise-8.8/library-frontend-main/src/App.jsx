import { useState } from "react";
import { useQuery } from '@apollo/client'
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import {ALL_AUTHORS,ALL_BOOKS} from './queries'
import Notify from './components/Notify'

const App = () => {
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null)
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }
  if(authors.loading || books.loading){
    return <div>loading...</div>
  }
  return (
    <div>
       <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors show={page === "authors"} authors={authors.data.allAuthors} setError={notify} />

      <Books show={page === "books"} books={books.data.allBooks} setError={notify}/>

      <NewBook show={page === "add"} setError={notify}/>
    </div>
  );
};

export default App;
