import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [errorMessage, setErrorMessage] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password.')
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({
        title, author, url
      })
      blogFormRef.current.toggleVisibility()
      setTitle('')
      setAuthor('')
      setUrl('')
      blogService.getAll().then(blogs =>
        setBlogs(blogs)
      )
      setErrorMessage('New blog ' + newBlog.title + ' by ' + newBlog.author + ' created.')
    } catch (exception) {
      setErrorMessage('Could not create a new blog.')
    } finally {
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }

  }

  const handleDelete = async (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const loginForm = () => (
    <form onSubmit={handleLogin} id='login-form'>
      <h2>Log in to application</h2>
      <div>
        username
        <input
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id='login-button'>Login</button>
    </form>
  )

  const newBlogForm = () => (
    <Togglable buttonLabel="Create a new blog" ref={blogFormRef}>
      <NewBlogForm
        title={title}
        author={author}
        url={url}
        handleTitleChange={({ target }) => setTitle(target.value)}
        handleAuthorChange={({ target }) => setAuthor(target.value)}
        handleUrlChange={({ target }) => setUrl(target.value)}
        handleNewBlog={handleNewBlog}
      />
    </Togglable>
  )

  return (
    <div>
      <Notification message={errorMessage} />
      {user === null ?
        loginForm() :
        <div>
          <h2>Blogs</h2>
          <p>{user.name} logged in</p>
          <button type="submit" onClick={handleLogout}>logout</button>
          {newBlogForm()}
          <ul>
            {blogs.sort(function (a, b) {
              return a.likes - b.likes;
            }).map(blog =>
              <Blog key={blog.id} blog={blog} user={user.username} handleDelete={handleDelete} />
            )}
          </ul>
        </div>
      }
    </div>
  )
}

export default App