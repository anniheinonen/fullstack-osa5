import React, { useState } from 'react'
import blogService from '../services/blogs'
const Blog = ({ blog, user, handleDelete, likeCalled}) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const [blogState, setBlog] = useState(blog)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const newBlog = {
      user: blog.user.id,
      likes: blogState.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    blogService.update(blog.id, newBlog).then(blogs =>
      setBlog(newBlog)
    )
  }

  const addLike = () => {
    if(likeCalled) likeCalled()
    handleLike()
  }

  const removeBlog = () => {
    if (window.confirm("Do you want to remove blog " + blog.title + " by " + blog.author + "?")) {
      blogService.remove(blog.id).then(blogs =>
        handleDelete(blog.id)
      )
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <li style={blogStyle} className='blog'>
      <span className='blog-title'>{blog.title} {blog.author}</span>
      <button style={hideWhenVisible} onClick={toggleVisibility} className='view-button'>View</button>
      <button style={showWhenVisible} onClick={toggleVisibility}>Hide</button>
      <div style={showWhenVisible} className="blogContent">
        <p>{blog.url}</p>
        <p>Likes: {blogState.likes}</p>
        <button onClick={addLike} id='like-button' className='like-button'>Like</button>
        <p>{blog.user.name}</p>
        <button style={user === blog.user.username ? showWhenVisible : hideWhenVisible} onClick={removeBlog} className='remove-button'>Remove</button>
      </div>
    </li>
  )
}
export default Blog