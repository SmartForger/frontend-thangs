// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/*
 * Enables us to mock a dependency through the window that will be shared
 * between the Cypress context and the running application.
 *
 * Note that it is necessary to read the module from the window inside of the
 * application code.
 */
Cypress.Commands.add('mockOnWindow', (mock = {}) => {
  Cypress.on('window:before:load', win => {
    for (let [key, value] of Object.entries(mock)) {
      win[key] = value
    }
  })
})
