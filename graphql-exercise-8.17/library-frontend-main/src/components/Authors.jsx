import { useState, useEffect } from "react";
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";
import { useQuery, useApolloClient } from "@apollo/client";
import { useMutation } from "@apollo/client";
import Select from "react-select";
const Authors = (props) => {
  if(!props.show){
    return null
  }
  const [name, setName] = useState("");
  const [born, setBorn] = useState(0);
  const result = useQuery(ALL_AUTHORS);

  const [authors, setAuthors] = useState([]);

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      props.setError(messages);
    },
    update: (cache, { data: { editAuthor } }) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return {
          allAuthors: allAuthors.map((author) =>
            author.name === editAuthor.name ? editAuthor : author
          ),
        };
      });
    },
  });


  useEffect(() => {
    if (result.data) {
      setAuthors(result.data.allAuthors);
    }
  }, [result]);

  const submit = async (event) => {
    event.preventDefault();
    editAuthor({ variables: { name: name.value, born: parseInt(born) } });
    setName("");
    setBorn(0);
  };

  if (editAuthor.loading || result.loading) {
    return <div>loading...</div>;
  }

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
          {authors
            ? authors.map((a) => (
                <tr key={a.name}>
                  <td>{a.name}</td>
                  <td>{a.born}</td>
                  <td>{a.bookCount}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>

      <h2>set birth year</h2>
      {authors ? (
        <form onSubmit={submit}>
          <div>
            name
            <Select
              value={name}
              onChange={setName}
              options={authors.map((author) => ({
                value: author.name,
                label: author.name,
              }))}
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
      ) : null}
    </div>
  );
};

export default Authors;
