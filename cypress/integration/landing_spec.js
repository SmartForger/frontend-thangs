import 'cypress-file-upload'

describe('The Landing Page', () => {
  it('Text search provides to results page', () => {
    cy.visit('/')
    cy.get('[data-cy=landing-search-input]').focus().type('airplane')
    cy.get('[data-cy=landing-search-form]').submit()
    cy.url().should('include', '/search/airplane')
  })

  it('Upload search bar apears after search input focus', () => {
    cy.visit('/')
    cy.get('[data-cy=landing-search-input]').focus()
    cy.get('[data-cy=landing-search-upload-bar]').should('be.visible')
  })

  it('Upload search bar disapears when text in search input', () => {
    cy.visit('/')
    cy.get('[data-cy=landing-search-input]').focus()
    cy.get('[data-cy=landing-search-upload-bar]').should('be.visible')
    cy.get('[data-cy=landing-search-input]').type('some_text')
    cy.get('[data-cy=landing-search-upload-bar]').should('not.be.visible')
    cy.get('[data-cy=landing-search-input]').clear()
    cy.get('[data-cy=landing-search-upload-bar]').should('be.visible')
  })

  it('Search by upload provides to results page', () => {
    const modelFile = 'horn1.stl'
    cy.visit('/')
    cy.get('[data-cy=landing-search-input]').focus()
    cy.fixture(modelFile, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then(fileContent => {
        cy.get('[data-cy=file-upload]').attachFile({
          fileContent,
          filePath: modelFile,
          encoding: 'utf-8',
        })
      })
    cy.url({timeout: 30000}).should('include', modelFile)
    cy.url().should('include', 'modelId')
    cy.url().should('include', 'phynId')
  })
})
