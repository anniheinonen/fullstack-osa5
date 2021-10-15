import React from 'react'
import PropTypes from 'prop-types'

const NewBlogForm = ({
    handleNewBlog,
    title,
    handleTitleChange,
    author,
    handleAuthorChange,
    url,
    handleUrlChange
}) => {
    return (
        <form onSubmit={handleNewBlog}>
            <h2>Create new</h2>
            <div>
                Title:
                <input
                    id='title'
                    type="text"
                    value={title}
                    name="Title"
                    onChange={handleTitleChange}
                />
            </div>
            <div>
                Author:
                <input
                    id='author'
                    type="text"
                    value={author}
                    name="author"
                    onChange={handleAuthorChange}
                />
            </div>
            <div>
                Url:
                <input
                    id='url'
                    type="text"
                    value={url}
                    name="Url"
                    onChange={handleUrlChange}
                />
            </div>
            <button type="submit" id='new-blog'>Create</button>
        </form>
    )
}

NewBlogForm.propTypes = {
    handleNewBlog: PropTypes.func.isRequired,
    handleTitleChange: PropTypes.func.isRequired,
    handleAuthorChange: PropTypes.func.isRequired,
    handleUrlChange: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }
export default NewBlogForm