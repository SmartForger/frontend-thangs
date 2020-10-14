import { MODEL, SEARCH, USER } from '../integration/constants'

const inputSelectors = {
  loginEmailUsername: '[name=email]',
  loginPassword: '[name=password]',
  search: '[name=search]',
  upload: '[name=upload]',
  modelTitle: '[name=name]',
  modelDescription: '[name=description]',
  comment: '[name=body]',
}

export const loginEmailUsernameInput = {
  validInput: USER.EMAIL,
  invalidInput: USER.INVALID_EMAIL,
  type: 'text',
  selector: inputSelectors.loginEmailUsername,
}

export const loginPasswordInput = {
  validInput: USER.PASSWORD,
  invalidInput: USER.INVALID_PASSWORD,
  type: 'password',
  selector: inputSelectors.loginPassword,
}

export const searchInput = {
  validInput: SEARCH.VALID_QUERY,
  invalidInput: 'test12312',
  type: 'text',
  selector: inputSelectors.search,
}

export const modelTitleInput = {
  validInput: MODEL.TITLE,
  type: 'text',
  selector: inputSelectors.modelTitle,
}

export const modelDescriptionInput = {
  validInput: MODEL.DESCRIPTION,
  type: 'text',
  selector: inputSelectors.modelDescription,
}

export const commentInput = {
  validInput: MODEL.COMMENT,
  type: 'text',
  selector: inputSelectors.comment,
}

export const uploadInput = {
  type: 'file',
  selector: inputSelectors.upload,
}

export const findInput = (el, input, index = 0) => {
  return cy.get(el).then(el => {
    return new Cypress.Promise(resolve => {
      if (el.find(input.selector)) {
        resolve(el.find(input.selector).eq(index))
      } else {
        resolve(cy.get(el).find(input.selector))
      }
    })
  })
}

export const enterValidValue = (el, input) => {
  return findInput(el, input).focus().type(input.validInput, {
    force: true,
  })
}

export const enterInvalidValue = (el, input) => {
  return findInput(el, input).focus().type(input.invalidInput, {
    force: true,
  })
}

export const inputFocus = (el, input) => {
  return findInput(el, input).focus()
}

export const inputType = (el, input) => {
  return findInput(el, input).type(input.validInput, {
    force: true,
  })
}

export const clearInput = (el, input) => {
  return findInput(el, input).clear()
}
