import React, { useCallback, useEffect, useState } from 'react'
import api from '@services/api'
import * as EmailValidator from 'email-validator'
import { useForm } from '@hooks'
import { TextInput, Spinner, Button } from '@components'
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import { createUseStyles } from '@style'
import { overlayview } from '@utilities/analytics'

const useStyles = createUseStyles(_theme => {
  return {
    SelectVersionModel: {},
  }
})

const SelectVersionModel = ({ model, part }) => {
  const [waiting, setWaiting] = useState(false)
  const c = useStyles()

  const initialState = {
    message: '',
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialState,
  })

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
    },
    [onInputChange]
  )

  const handleSubmit = async () => {
    setWaiting(true)
  }

  useEffect(() => {
    overlayview('SelectVersionModel')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className={c.SelectVersionModel}></div>
}

export default SelectVersionModel
