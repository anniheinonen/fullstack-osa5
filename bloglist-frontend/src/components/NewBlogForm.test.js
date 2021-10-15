import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import NewBlogForm from "./NewBlogForm"

test('Calls event handler when a blog is created', () => {

    const createBlog = jest.fn()

    const useless = () => {

    }

    const component = render(
        <NewBlogForm handleNewBlog={createBlog} handleTitleChange={useless} handleAuthorChange={useless} handleUrlChange={useless} title='title' author='author' url='url'/>
    )

    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, {
        target: { value: 'Testitle' }
    })
    fireEvent.change(author, {
        target: { value: 'testiauthor' }
    })
    fireEvent.change(url, {
        target: { value: 'testiurl' }
    })
    fireEvent.submit(form)
    expect(createBlog.mock.calls).toHaveLength(1)
})