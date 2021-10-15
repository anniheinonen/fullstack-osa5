describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'Anni',
            username: 'anniheinonen',
            password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function () {
        cy.get('#login-form').should('exist')
    })

    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.get('#username').type('anniheinonen')
            cy.get('#password').type('salainen')
            cy.get('#login-button').click()
            cy.contains('Anni logged in')
        })

        it('fails with wrong credentials', function () {
            cy.get('#username').type('anniheinonen')
            cy.get('#password').type('wrongpassword')
            cy.get('#login-button').click()
            cy.contains('Wrong username or password.')
        })
    })

    describe('When logged in', function () {
        beforeEach(function () {
            cy.get('#username').type('anniheinonen')
            cy.get('#password').type('salainen')
            cy.get('#login-button').click()
        })

        it('A blog can be created', function () {
            cy.contains('Create a new blog').click()
            cy.get('#title').type('testiblogi')
            cy.get('#author').type('testiauthor')
            cy.get('#url').type('testiurl')
            cy.get('#new-blog').click()

            cy.contains('New blog testiblogi by testiauthor created.')
            cy.contains('testiblogi')
        })

        describe('When blog created', function () {
            beforeEach(function () {
                cy.contains('Create a new blog').click()
                cy.get('#title').type('testiblogi')
                cy.get('#author').type('testiauthor')
                cy.get('#url').type('testiurl')
                cy.get('#new-blog').click()
            })

            it('A blog can be liked', function () {
                cy.contains('View').click()
                cy.get('.like-button').click()
                cy.contains('Likes: 1')
            })

            it('A blog can be removed', function () {
                cy.contains('View').click()
                cy.get('.remove-button').click()
                cy.contains('testiblogi').should('not.exist')
            })
        })

        describe('Many blogs', function () {

            it('Blogs are ordered by likes', function () {
                cy.contains('Create a new blog').click()
                cy.get('#title').type('testiblogi1')
                cy.get('#author').type('testiauthor1')
                cy.get('#url').type('testiurl1')
                cy.get('#new-blog').click()

                cy.contains('Create a new blog').click()
                cy.get('#title').type('testiblogi2')
                cy.get('#author').type('testiauthor2')
                cy.get('#url').type('testiurl2')
                cy.get('#new-blog').click()

                cy.contains('Create a new blog').click()
                cy.get('#title').type('testiblogi3')
                cy.get('#author').type('testiauthor3')
                cy.get('#url').type('testiurl3')
                cy.get('#new-blog').click()

                cy.wait(300)
                cy.contains('testiblogi2').parent().find('.view-button').click()
                cy.contains('testiblogi2').parent().find('.like-button').click()

                cy.contains('Likes: 1')
                cy.contains('testiblogi2').parent().find('.like-button').click()
                cy.contains('Likes: 2')

                cy.contains('testiblogi1').parent().find('.view-button').click()
                cy.contains('testiblogi1').parent().find('.like-button').click()
                cy.contains('Likes: 1')

                cy.reload()

                let i = 1
                cy.get('ul>li').each((li) => {
                    if(i === 1) {
                        cy.get(li).get('.blog-title').contains('testiblogi3')
                    } else if(i === 2) {
                        cy.get(li).get('.blog-title').contains('testiblogi1')
                    } else cy.get(li).get('.blog-title').contains('testiblogi2')
                    i += 1
                })

            })

        })


    })
})