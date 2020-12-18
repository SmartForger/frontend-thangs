import React, { useCallback, useState } from 'react'
import { useStoreon } from 'storeon/react'
import {
  Badge,
  DropdownMenu,
  Input,
  ModelThumbnail,
  Spacer,
  SingleLineBodyText,
  TitleTertiary,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowDown } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ExitIcon } from '@svg/icon-X-sm.svg'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    PartExplorerDropdown: {
      width: 'auto',
      right: 0,
      bottom: '4.2rem',
      position: 'absolute',
      display: 'flex',
      padding: '1rem',
    },
    PartExplorerDropdown_Arrow: {
      width: '0.75rem',
      height: '0.75rem',
      '& > path': {
        fill: '#000',
      },
    },
    PartExplorerDropdown_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    PartExplorerDropdown_DropdownMenuDivider: {
      margin: '.25rem 0',
      border: 'none',
      borderTop: `1px solid ${theme.colors.grey[100]}`,
    },
    PartExplorerDropdown_Row: {
      display: 'flex',
      flexDirection: 'row',
    },
    PartExplorerDropdown_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
    PartExplorerDropdown_Thumbnail: {
      flex: 'none',
      border: `1px solid ${theme.colors.white[900]}`,
      borderRadius: 4,
      padding: '0px !important',
      width: '2rem',
      height: '2rem !important',
    },
    PartExplorerDropdown_ModelName: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      maxWidth: '6.5rem',
      lineHeight: '1rem',
    },
  }
})

const noop = () => null
export const PartExplorerMenu = ({ files = [] }) => {
  const c = useStyles({})
  //Loop through files and build nested tree
  //Each row has an event handler which on click should change the viewer.

  const handleOnInputChange = useCallback(
    (e, value) => {
      files.filter(file => file.name.includes(value))
    },
    [files]
  )

  return (
    <div className={c.PartExplorerDropdown}>
      <div>
        <Input
          id='assembly-search-input'
          name='part'
          label='Search models'
          maxLength='150'
          type='text'
          onChange={handleOnInputChange}
        />
        {/* <AssemblyTree /> */}
      </div>
    </div>
  )
}

export const PartExplorerDropdown = ({
  selectedValue: model = {},
  // files = [],
  onSelectedFile = noop,
}) => {
  const c = useStyles({})
  const [isVisible, setIsVisible] = useState(true)
  const { dispatch } = useStoreon()

  const handleOnClick = useCallback(() => {
    dispatch(types.OPEN_ACTION_BAR, {
      Component: PartExplorerActionMenu,
      data: {
        selectedValue: model,
        handleChange: onSelectedFile,
      },
    })
  }, [dispatch, model, onSelectedFile])

  return (
    <div
      className={c.PartExplorerDropdown_ClickableButton}
      onClick={ev => {
        ev.stopPropagation()
        setIsVisible(!isVisible)
        handleOnClick()
      }}
    >
      <ModelThumbnail
        key={model.newFileName}
        className={c.PartExplorerDropdown_Thumbnail}
        name={model}
        model={{ ...model, uploadedFile: model.newFileName }}
      />
      <Spacer size={'1rem'} />
      <SingleLineBodyText className={c.PartExplorerDropdown_ModelName}>
        {model.name}
      </SingleLineBodyText>
      <Spacer size={'.5rem'} />
      {model.isAssembly ? <Badge>Assembly</Badge> : <Badge secondary>Part</Badge>}
      <Spacer size={'.5rem'} />
      {isVisible ? (
        <ExitIcon className={c.PartExplorerDropdown_Arrow} />
      ) : (
        <ArrowDown className={c.PartExplorerDropdown_Arrow} />
      )}
    </div>
  )
}

const PartExplorerDropdownMenu = ({ handleChange = noop, selectedValue }) => {
  const c = useStyles({})

  return (
    <DropdownMenu
      className={c.PartExplorerDropdown}
      TargetComponent={PartExplorerDropdown}
      TargetComponentProps={{ selectedValue, handleChange }}
    >
      <PartExplorerMenu handleChange={handleChange} />
    </DropdownMenu>
  )
}

const PartExplorerActionMenu = ({ handleChange = noop }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()

  const handleSelect = useCallback(
    value => {
      handleChange(value)
      dispatch(types.CLOSE_ACTION_BAR)
    },
    [dispatch, handleChange]
  )

  return (
    <>
      <Spacer size={'2rem'} />
      <div className={c.PartExplorerDropdown_ActionMenu}>
        <Spacer size={'2rem'} />
        <TitleTertiary>Select a model</TitleTertiary>
        <PartExplorerMenu handleChange={handleSelect} />
      </div>
      <Spacer size={'2rem'} />
    </>
  )
}

export default PartExplorerDropdownMenu
