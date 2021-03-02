import { useState, useCallback, useRef } from 'react'
import { useTranslations } from '@hooks'
const useForm = (opts = {}) => {
  const { initialValidationSchema, initialState } = opts
  const [inputState, setInputState] = useState(initialState || {})
  const [inputErrors, setInputErrors] = useState([])
  const validationSchema = useRef(initialValidationSchema)
  const t = useTranslations({})

  const onInputChange = useCallback(
    (key, value) => {
      setInputErrors(inputErrors.filter(inputError => inputError.key !== key))
      setInputState(inputState => {
        return {
          ...inputState,
          [key]: value,
        }
      })
    },
    [inputErrors]
  )

  const onInputError = useCallback(
    errors => {
      const newInputErrors = Object.keys(errors).map(inputKey => {
        const { type } = errors[inputKey]
        return {
          key: inputKey,
          message: type
            ? t(`input.${inputKey}.errors.required`)
            : t(`input.${inputKey}.errors.invalid`),
        }
      })
      setInputErrors(newInputErrors)
    },
    [t]
  )

  const clearAllInputs = () => {
    Object.keys(inputState).forEach(key => {
      onInputChange(key, '')
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
      onInputError(errors)
      return { isValid: !hasErrors, errors }
    }
    return { isValid: true, errors: {} }
  }, [inputState, onInputError])

  const onFormSubmit = callbackFn => event => {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }

    const { isValid, errors } = validateState()
    callbackFn(inputState, isValid, errors)
  }

  const resetForm = useCallback(() => {
    setInputState(initialState)
  }, [initialState])

  const checkError = useCallback(
    field => {
      return inputErrors.find(error => error.key === field) || {}
    },
    [inputErrors]
  )

  const updateValidationSchema = useCallback(newValidationSchema => {
    validationSchema.current = newValidationSchema
  }, [])

  return {
    checkError,
    clearAllInputs,
    inputState,
    inputErrors,
    onFormSubmit,
    onInputChange,
    resetForm,
    setInputState,
    updateValidationSchema,
  }
}

export default useForm
