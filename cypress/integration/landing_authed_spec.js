import 'cypress-file-upload'

describe('The Landing Page (authorized)', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('Log in').click({ force: true })
    cy.get('[data-cy=cy_email-input]').focus().type('test@test.com')
    cy.get('[data-cy=cy_password-input]').focus().type('test')
    cy.get('[data-cy=signup-form]').submit()
    cy.get('[data-cy=signup-form]').should('not.be.visible')
  })

  it('Clicking by Notifications, Profile, Upload buttons', () => {
    cy.visit('/')
    cy.get('[class^="NotificationsButton_NotificationIconWrapper"]').click({ force: true, multiple: true })
    cy.get('[class^="NotificationsButton"] + [class*="DropdownMenu"]').should('be.visible')
    
    cy.get('[class^="ProfileDropdown_ClickableButton"]').click({ force: true, multiple: true })
    cy.get('[class^="NotificationsButton"] + [class*="DropdownMenu"]').should('not.be.visible')
    cy.get('[class^="ProfileDropdown_ClickableButton"] + [class*="DropdownMenu"]').should('be.visible')
  
    cy.get('[data-cy=upload-button]').click({ force: true, multiple: true })
    cy.get('[class^="ProfileDropdown_ClickableButton"] + [class*="DropdownMenu"]').should('not.be.visible')
    
    cy.get('[data-cy=upload-overlay]').should('be.visible')
  })
})
