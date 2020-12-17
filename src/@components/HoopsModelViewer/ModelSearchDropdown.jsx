import React, { useCallback, useState } from 'react'
import { Input, Spacer, SingleLineBodyText } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowDown } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ArrowUp } from '@svg/icon-arrow-up-sm.svg'

const useStyles = createUseStyles(theme => {
  return {
    ModelSearchDropdown: {
      width: 'auto',
      right: 0,
    },
    ModelSearchDropdown_Arrow: {
      width: '0.75rem',
      height: '0.75rem',
      '& > path': {
        fill: '#000',
      },
    },
    ModelSearchDropdown_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    ModelSearchDropdown_DropdownMenuDivider: {
      margin: '.25rem 0',
      border: 'none',
      borderTop: `1px solid ${theme.colors.grey[100]}`,
    },
    ModelSearchDropdown_Row: {
      display: 'flex',
      flexDirection: 'row',
    },
    ModelSearchDropdown_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
  }
})

const noop = () => null
export const ModelSearchDropdownMenu = ({ selectedFile, files = [] }) => {
  const c = useStyles({})
  //Loop through files and build nested tree
  //Each row has an event handler which on click should change the viewer.

  const handleOnInputChange = useCallback((e, value) => {
    //filter files by partial search
  }, [])

  return (
    <div className={c.ModelSearchDropdown}>
      <Spacer size={'1rem'} />
      <div>
        <Spacer size={'1rem'} />
        <Input
          id='assembly-search-input'
          name='part'
          label='Search models'
          maxLength='150'
          type='text'
          onChange={handleOnInputChange}
        />
        <Spacer size={'1rem'} />
      </div>
      <Spacer size={'1rem'} />
    </div>
  )
}

export const ModelSearchDropdown = ({
  label,
  selectedFile,
  files = [],
  onSelectedFile = noop,
}) => {
  const c = useStyles({})
  const [isVisible, setIsVisible] = useState(true)

  return (
    <>
      <div
        className={c.ModelSearchDropdown_ClickableButton}
        onClick={ev => {
          ev.stopPropagation()
          setIsVisible(!isVisible)
        }}
      >
        <SingleLineBodyText>{label}</SingleLineBodyText>
        <Spacer size={'.5rem'} />
        {isVisible ? (
          <ArrowDown className={c.ModelSearchDropdown_Arrow} />
        ) : (
          <ArrowUp className={c.ModelSearchDropdown_Arrow} />
        )}
      </div>
      {isVisible && (
        <ModelSearchDropdownMenu
          selectedFile={selectedFile}
          files={files}
          onSelectedFile={onSelectedFile}
        />
      )}
    </>
  )
}
