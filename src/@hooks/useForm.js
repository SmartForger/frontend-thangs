import { useState, useCallback, useRef } from 'react'

const useForm = (opts = {}) => {
  const { initialValidationSchema, initialState } = opts
  const [inputState, setInputState] = useState(initialState || {})
  const validationSchema = useRef(initialValidationSchema)

  const onInputChange = useCallback((key, value) => {
    setInputState(inputState => {
      return {
        ...inputState,
        [key]: value,
      }
    })
  }, [])

  const clearAllInputs = () => {
    Object.keys(inputState).forEach(key => {
      onInputChange(key, undefined)
    })
  }

  const validateState = useCallback(() => {
    const { current: schema } = validationSchema

    if (schema) {
      const { error } = schema.validate(inputState)
      const errors = error
        ? /* eslint-disable indent */
          error.details.reduce((previous, currentError) => {
            return {
              ...previous,
              [currentError.path[0]]: currentError,
            }
          }, {})
        : {}
      /* eslint-enable indent */
      const hasErrors = !!error
      return { isValid: !hasErrors, errors }
    }
    return { isValid: true, errors: {} }
  }, [inputState, validationSchema])

  const onFormSubmit = callbackFn => event => {
    if (event) {
      event.preventDefault()
    }

    const { isValid, errors } = validateState()
    callbackFn(inputState, isValid, errors)
  }

  return {
    onFormSubmit,
    onInputChange,
    inputState,
    setInputState,
    clearAllInputs,
  }
}

export default useForm
