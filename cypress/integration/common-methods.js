export function isElement(el, prop) {
  cy.get(el).should(prop)
}

export function clickOnElementByText(text) {
  cy.contains(text).click({ force: true })
}

export function clickOnElementByDataCy(dataCy) {
  cy.get(dataCy).click()
}

export function goTo(path) {
  cy.visit(path, { timeout: 10000 })
}

export function submitForm(formName) {
  cy.get(formName).submit()
}

export function fillInputWithText(field, text) {
  cy.get(field).focus().type(text)
}

export function isTextExist(text) {
  cy.contains(text)
}

export function clearField(field) {
  cy.get(field).clear()
}
