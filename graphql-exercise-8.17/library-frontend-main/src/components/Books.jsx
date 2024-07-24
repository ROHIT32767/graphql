import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import { useState,useEffect } from "react";
const Books = (props) => {
  if (!props.show) {
    return null;
  }
  const [books,setBooks] = useState([]);
  const[genres,setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('')
  const [filteredBooks, setFilteredBooks] = useState([])

  const result = useQuery(ALL_BOOKS);
  
  useEffect(()=>{
    if(result.data){
      setBooks(result.data.allBooks)
      const allBooks = result.data.allBooks
      const genres = allBooks.map(book => book.genres).flat()
      setGenres([...new Set(genres)])
      setSelectedGenre(null)
    }
  },[result])

  useEffect(()=>{
    if(selectedGenre){
      setFilteredBooks(books.filter(book => book.genres.includes(selectedGenre)))
    }else{
      setFilteredBooks(books)
    }
  },[selectedGenre,books])  

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks ? filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )): null}
        </tbody>
      </table>

      <div>
        {genres.map(genre => <button key={genre} onClick={() => setSelectedGenre(genre)}>{genre}</button>)}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>

    </div>
  );
};

export default Books;
