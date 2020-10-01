import 'cypress-file-upload'

const MODEL_FILE = 'horn1.stl'
const FILE_NAME = 'Test Name'
const FILE_DESCRIPTION = 'Test Description'


describe('The Model Page', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('Log in').click({ force: true })
    cy.get('[data-cy=cy_email-input]').focus().type('test@test.com')
    cy.get('[data-cy=cy_password-input]').focus().type('test')
    cy.get('[data-cy=signup-form]').submit()
    cy.get('[data-cy=signup-form]').should('not.be.visible')
  })

  it('Upload model', () => {
    cy.get('[data-cy=upload-button]').click({ force: true, multiple: true })
    cy.fixture(MODEL_FILE, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then(fileContent => {
        cy.get('.ReactModalPortal [data-cy=file-upload]').attachFile({
          fileContent,
          filePath: MODEL_FILE,
          encoding: 'utf-8',
        })
      })
    cy.get('[data-cy=upload-form] [name=name]').focus().clear().type(FILE_NAME)
    cy.get('[data-cy=upload-form] [name=description]').focus().type(FILE_DESCRIPTION)
    cy.get('[data-cy=upload-form]').submit()
    cy.visit('/Test')
    cy.get(`[data-cy="${FILE_NAME}"]`).should('be.visible')
  })

  it('Delete model', () => {
    cy.visit('/Test')
    cy.get(`[data-cy="${FILE_NAME}"] [data-cy=edit-model-icon]`).click({ force: true })
    cy.get('[data-cy=delete-model-button]').click({ force: true })
    cy.get('[data-cy=confirm-delete-model-button]').click({ force: true })
    cy.get(`[data-cy="${FILE_NAME}"]`).should('not.be.visible')
  })
})
