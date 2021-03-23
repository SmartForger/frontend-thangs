import React, { useCallback, useEffect, useState } from 'react'
import api from '@services/api'
import * as EmailValidator from 'email-validator'
import { useForm } from '@hooks'
import { TextInput, Spinner, Button } from '@components'
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { overlayview } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    ReportModel: {},
    ReportModel_Icon: {
      '& path': {
        fill: theme.colors.purple[900],
      },
    },
    ReportModel_PageHeader: {
      ...theme.text.uploadFrameText,
      color: theme.colors.purple[900],
      marginTop: '.5rem',
    },
    ReportModel_Body: {
      margin: 'auto',
      marginTop: '6.5rem',
    },
    ReportModel_FormControl: {
      marginTop: '2rem',
      width: '100%',
    },
    ReportModel_Label: {
      marginBottom: '.5rem',
    },
    ReportModel_TextInput: {
      width: '100%',
      marginTop: '.5rem',
    },
    ReportModel_Spinner: {
      display: 'inline-block',
      width: '2rem',
    },
    ReportModel_ButtonRow: {
      display: 'flex',
      marginTop: '3rem',
      justifyContent: 'flex-end',
    },
    ReportModel_SuccessText: {
      padding: '1rem 0',
    },
  }
})

const ReportModel = ({ model, afterSend }) => {
  const [waiting, setWaiting] = useState(false)
  const [formErrorMessage, setFormErrorMessage] = useState(null)
  const [formSuccessMessage, setFormSuccessMessage] = useState(null)
  const [invalidFields, setInvalidFields] = useState([])
  const c = useStyles()

  const initialState = {
    email: '',
    reason: '',
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

  const setFieldToValid = useCallback(
    fieldName => {
      if (invalidFields.indexOf(fieldName) !== -1) {
        const temp = [...invalidFields]
        temp.splice(invalidFields.indexOf(fieldName), 1)
        setInvalidFields(temp)
        setFormErrorMessage('')
      }
    },
    [invalidFields]
  )

  const validateEmail = useCallback(() => {
    if (!EmailValidator.validate(inputState.email)) {
      setInvalidFields(['email'])
      setFormErrorMessage('Please enter a valid e-mail address')
      return false
    } else {
      setFieldToValid('email')
      return true
    }
  }, [inputState, setFieldToValid])

  const handleSubmit = async () => {
    setWaiting(true)
    setFormErrorMessage(null)

    const res = await api({
      method: 'POST',
      endpoint: 'models/takedown',
      body: {
        email: inputState.email,
        reason: inputState.reason,
        modelId: model && model.id,
        phyndexerId: model && model.modelId,
      },
    })

    if (res.status !== 200) {
      setFormErrorMessage(
        res.data.detail || 'Sorry, we encounteed an unexpected error.  Please try again.'
      )
    } else {
      setFormSuccessMessage(
        'You should receive an email from our support team shortly. Thank you.'
      )
      return setTimeout(() => {
        afterSend()
      }, 2000)
    }
  }

  useEffect(() => {
    overlayview('ReportModel')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={c.ReportModel_Body}>
      <ErrorIcon width={'4rem'} height={'4rem'} className={c.ReportModel_Icon} />
      <h1 className={c.ReportModel_PageHeader}>
        Report a Model {waiting && <Spinner className={c.ReportModel_Spinner} />}
      </h1>
      {!!formErrorMessage && (
        <h4 className={c.ReportModel_ErrorText}>{formErrorMessage}</h4>
      )}
      {!!formSuccessMessage && (
        <h4 className={c.ReportModel_SuccessText}>{formSuccessMessage}</h4>
      )}
      <form onSubmit={onFormSubmit(handleSubmit)}>
        <div className={c.ReportModel_FormControl}>
          <label className={c.ReportModel_Label}>
            Email
            <TextInput
              className={c.ReportModel_TextInput}
              type='text'
              name='email'
              onChange={e => {
                handleOnInputChange('email', e.target.value)
              }}
              validator={validateEmail}
              value={inputState && inputState.email}
              required
              maxLength='250'
            />
          </label>
        </div>
        <div className={c.ReportModel_FormControl}>
          <label className={c.ReportModel_label}>Please describe the issue</label>
          <TextInput
            className={c.ReportModel_TextInput}
            name='reason'
            value={inputState && inputState.reason}
            onChange={e => {
              handleOnInputChange('reason', e.target.value)
            }}
            placeholder='Add a reason for flagging this model...'
            maxLength='500'
          />
        </div>
        <div className={c.ReportModel_ButtonRow}>
          <Button className={c.ReportModel_Button} type='submit'>
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ReportModel
