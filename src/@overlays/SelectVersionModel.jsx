import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from '@hooks'
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
