import { MODEL, SEARCH, USER, USER2 } from './constants'

export const inputSelectors = {
  email: '[name=email]',
  password: '[name=password]',
  confirmPassword: '[name=confirmPass]',
  username: '[name=username]',
  search: '[name=search]',
  upload: '[name=upload]',
  multiUpload: '[name=multi-upload]',
  modelTitle: '[name=name]',
  modelDescription: '[name=description]',
  comment: '[name=body]',
}

export const usernameInput = {
  validInput: USER.NAME,
  type: 'text',
  selector: inputSelectors.username,
}

export const emailInput = {
  validInput: USER.EMAIL,
  invalidInput: USER.INVALID_EMAIL,
  wrongInput: USER.NAME,
  type: 'text',
  selector: inputSelectors.email,
}

export const passwordInput = {
  validInput: USER.PASSWORD,
  invalidInput: USER.INVALID_PASSWORD,
  type: 'password',
  selector: inputSelectors.password,
}

export const confirmPasswordInput = {
  validInput: USER.PASSWORD,
  invalidInput: USER.INVALID_PASSWORD,
  type: 'password',
  selector: inputSelectors.confirmPassword,
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

export const TEST_USER_1 = {
  emailInput: emailInput,
  passwordInput: passwordInput,
}

export const multiUploadInput = {
  type: 'file',
  selector: inputSelectors.multiUpload,
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

export const enterWrongValue = (el, input) => {
  return findInput(el, input).focus().type(input.wrongInput, {
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
