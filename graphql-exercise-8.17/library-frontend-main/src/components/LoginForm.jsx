import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState('mluukkai')
  const [password, setPassword] = useState('secret')


  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error)
      setError(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {    
    if (result.data) { 
        console.log("result",result.data)     
        const token = result.data.login.value      
        setToken(token)      
        localStorage.setItem('library-user-token', token)    
      }  
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
    setUsername("")
    setPassword("")
  }

  if(result.loading){
    return <div>loading</div>
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm