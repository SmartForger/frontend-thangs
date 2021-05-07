export const VALIDATION_REQUIRED = 'required'
export const VALIDATION_EMAIL = 'email'
export const VALIDATION_ARRAY = 'array'
export const VALIDATION_ARRAY_ITEM = 'array_item'
export const VALIDATION_MIN_LENGTH = 'min_length'
export const VALIDATION_HAS_VALUE = 'has_value'
export const VALIDATION_PATTERN = 'pattern'

const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

const isInvalidArray = (itemSchema, val) => {
  if (typeof val.some !== 'function' || !itemSchema.item) {
    return VALIDATION_ARRAY
  }

  const itemError = val.some(item => validateChain(itemSchema.item, item))
  return itemError ? VALIDATION_ARRAY_ITEM : null
}

const hasMinLength = (itemSchema, val) => {
  const isValid =
    typeof val.length === 'number' &&
    typeof itemSchema.length === 'number' &&
    val.length >= itemSchema.length
  return !isValid
    ? {
      type: VALIDATION_MIN_LENGTH,
      length: itemSchema.length,
    }
    : null
}

const validateItem = (item, val) => {
  const itemType = typeof item === 'string' ? item : item.type

  switch (itemType) {
    case VALIDATION_REQUIRED:
      return !val ? VALIDATION_REQUIRED : null

    case VALIDATION_EMAIL:
      return !val || emailRegExp.test(val) ? null : VALIDATION_EMAIL

    case VALIDATION_ARRAY:
      return !val ? null : isInvalidArray(item, val)

    case VALIDATION_MIN_LENGTH:
      return !val ? null : hasMinLength(item, val)

    case VALIDATION_HAS_VALUE:
      return val === undefined || val === null ? VALIDATION_HAS_VALUE : null

    case VALIDATION_PATTERN:
      return !val || item.pattern.test(val) ? null : VALIDATION_PATTERN

    default:
      break
  }
}

const validateChain = (chain, val) => {
  if (typeof chain.map !== 'function') {
    return null
  }

  const vResult = chain.map(item => validateItem(item, val)).filter(item => !!item)
  return vResult.length === 0 ? null : vResult
}

export const validate = (schema, val) => {
  const keys = Object.keys(schema)
  const errors = {}
  let isValid = true

  keys.forEach(k => {
    const { rules } = schema[k]
    const vResult = validateChain(rules, val[k])
    if (vResult) {
      errors[k] = vResult
      isValid = false
    }
  })

  return { isValid, errors }
}

export const getErrorMessage = (field, error) => {
  const { label, messages } = field
  const errorType = typeof error === 'string' ? error : error.type
  const defaultMessages = {
    [VALIDATION_REQUIRED]: `${label} is required`,
    [VALIDATION_EMAIL]: `${label} is not valid email`,
    [VALIDATION_ARRAY]: `${label} is not an array`,
    [VALIDATION_ARRAY_ITEM]: `${label} has invalid array item(s)`,
    [VALIDATION_MIN_LENGTH]: `${label} has length of less than ${error.length}`,
    [VALIDATION_HAS_VALUE]: `${label} doesn't exist`,
    [VALIDATION_PATTERN]: `${label} is not a valid format`,
  }

  const msg =
    typeof messages === 'string'
      ? messages
      : messages?.[errorType] || defaultMessages[errorType]

  return { details: error, message: msg }
}
