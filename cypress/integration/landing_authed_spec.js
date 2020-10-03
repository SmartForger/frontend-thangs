import 'cypress-file-upload'
import { login } from './common-methods'

describe('The Landing Page (authorized)', () => {
  beforeEach(() => {
    login()
  })

  it('Clicking by Notifications, Profile, Upload buttons', () => {
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
