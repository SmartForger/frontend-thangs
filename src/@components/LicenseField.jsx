import React, { useCallback, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import { ReactComponent as ClearIcon } from '@svg/icon-X-sm.svg'
import { Button, Input, Spacer } from '@components'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'

const noop = () => null
const useStyles = createUseStyles(_theme => {
  return {
    LicenseField_Field: {
      flexGrow: 1,
      marginBottom: '1rem',
      position: 'relative',
    },
    LicenseField_ClearButton: {
      cursor: 'pointer',
      marginBottom: '1rem',
      position: 'absolute',
      right: '1rem',
      top: '1rem',
    },
  }
})
const LicenseField = ({ className, onChange = noop, value, model = {} }) => {
  const c = useStyles()
  const hiddenFileInput = React.useRef(null)
  const { dispatch, license } = useStoreon('license')
  const { isLoading } = license
  const directory = useMemo(
    () => (model.newFileName ? model.newFileName.split('/')[0] : ''),
    [model.newFileName]
  )
  const displayValue = useMemo(() => {
    if (!value) return null
    const fullValue = value.split('/')
    return fullValue[fullValue.length - 1]
  }, [value])

  const handleLicenseClick = useCallback(
    event => {
      if (isLoading) return
      event.preventDefault()
      hiddenFileInput.current.click()
    },
    [isLoading]
  )

  const handleClearLicense = useCallback(() => {
    onChange(null)
  }, [onChange])

  const handleSuccess = useCallback(
    file => {
      onChange(file)
    },
    [onChange]
  )

  const handleError = useCallback(() => {
    onChange(null)
  }, [onChange])

  const handleLicenseChange = useCallback(
    event => {
      const file = event.target.files[0] || null
      if (file) {
        dispatch(types.UPLOAD_MODEL_LICENSE, {
          file: file.name,
          directory,
          modelId: model.id || null,
          onFinish: handleSuccess,
          onError: handleError,
        })
      } else {
        onChange(null)
      }
    },
    [directory, dispatch, handleError, handleSuccess, model.id, onChange]
  )

  return (
    <div className={className}>
      <div className={c.LicenseField_Field}>
        <div onClick={handleLicenseClick}>
          <Input
            disabled={true}
            name='license'
            label={displayValue || 'Attach license'}
          />
        </div>
        {displayValue ? (
          <ClearIcon
            onClick={handleClearLicense}
            className={c.LicenseField_ClearButton}
          />
        ) : null}
      </div>
      <Spacer size={'1rem'} />
      <div>
        <Button onClick={handleLicenseClick}>Browse</Button>
        <input
          type='file'
          onChange={handleLicenseChange}
          ref={hiddenFileInput}
          style={{ display: 'none' }}
          accept='.pdf,.txt,.md'
        />
      </div>
    </div>
  )
}

export default LicenseField
