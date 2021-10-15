import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Togglable />', () => {
    let component
    let blog
    let mockHandler

    beforeEach(() => {
        blog = {
            title: 'Testititle',
            author: 'Testiauthor',
            url: 'Testiurl',
            likes: 3,
            user: {
                name: 'testiuser'
            }
        }

        mockHandler = jest.fn()

        component = render(
            <Blog blog={blog} likeCalled={mockHandler}/>
        )
    })

    test('Only title and author should be rendered at first', () => {
        expect(component.container).toHaveTextContent('Testititle')
        expect(component.container).toHaveTextContent('Testiauthor')
        expect(component.container.querySelector('.blogContent')).toHaveStyle('display: none')
    })

    test('after clicking the button, children are displayed', () => {
        const button = component.getByText('View')
        fireEvent.click(button)

        const div = component.container.querySelector('.blogContent')
        expect(div).not.toHaveStyle('display: none')
    })

    test('clicking the button twice calls event handler twice', async () => {

        let button = component.getByText('View')
        fireEvent.click(button)

        button = component.getByText('Like')
        fireEvent.click(button)
        fireEvent.click(button)

        expect(mockHandler.mock.calls).toHaveLength(2)
    })
})