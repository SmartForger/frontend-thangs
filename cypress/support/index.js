// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import {
  clearModelsAndFolders,
  registerUser,
  unfollowUser,
} from '../utils/common-methods'

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

    unfollowUser(sideUser, activeUser)
    clearModelsAndFolders(activeUser)
    clearModelsAndFolders(sideUser)
  })
})
// Alternatively you can use CommonJS syntax:
// require('./commands')
