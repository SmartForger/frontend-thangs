import { useState, useCallback, useRef } from 'react'
import { getErrorMessage, validate } from '@utilities/validation'
import { useOverlay } from './useOverlay'

const useForm = (opts = {}) => {
  const { initialValidationSchema, initialState } = opts
  const [inputState, setInputState] = useState(initialState || {})
  const [inputErrors, setInputErrors] = useState({})
  const validationSchema = useRef(initialValidationSchema)
  const { setOverlayData } = useOverlay()

  const onInputChange = useCallback((key, value) => {
    setInputErrors(errors => ({ ...errors, [key]: undefined }))
    setInputState(inputState => {
      return {
        ...inputState,
        [key]: value,
      }
    })
  }, [])

  const clearAllInputs = () => {
    Object.keys(inputState).forEach(key => {
      onInputChange(key, '')
    })
  }

  const validateState = useCallback(() => {
    const { current: schema } = validationSchema

    if (schema) {
      const { isValid, errors } = validate(schema, inputState)

      const newErrors = {}
      for (let k in errors) {
        newErrors[k] = getErrorMessage(schema[k], errors[k][0])
      }
      setInputErrors(newErrors)

      return { isValid, errors: Object.values(newErrors) }
    }
    return { isValid: true, errors: [] }
  }, [inputState])

  const onFormSubmit = callbackFn => event => {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }

    const { isValid, errors } = validateState()

    if (!isValid) {
      setOverlayData({
        shake: true,
      })
    }

    callbackFn(inputState, isValid, errors)
  }

  const resetForm = useCallback(() => {
    setInputState(initialState)
  }, [initialState])

  const checkError = useCallback(
    field => {
      return inputErrors[field] || {}
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
