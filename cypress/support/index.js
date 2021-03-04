import './commands'
import { registerUser, clearModelsAndFolders } from '../utils/common-methods'

Cypress.Cookies.defaults({
  preserve: ['activeUser', 'sideUser'],
})

before(() => {
  registerUser('activeUser')
  registerUser('sideUser')
})

after(() => {
  let activeUser
  let sideUser

  cy.getCookie('activeUser').then(({ value }) => {
    activeUser = JSON.parse(value)
  })
  cy.getCookie('sideUser').then(({ value }) => {
    sideUser = JSON.parse(value)

    clearModelsAndFolders(activeUser).then(() => {
      clearModelsAndFolders(sideUser)
    })
  })
})
