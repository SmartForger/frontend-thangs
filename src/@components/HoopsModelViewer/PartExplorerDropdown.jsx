import React, { useCallback, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'
import {
  DropdownMenu,
  Input,
  ModelThumbnail,
  Spacer,
  SingleLineBodyText,
  Tag,
  TitleTertiary,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowDown } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ExitIcon } from '@svg/icon-X-sm.svg'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    PartExplorerDropdown: {
      right: '-2rem',
      width: 'auto',
      bottom: '4.2rem',
      display: 'flex',
      padding: '1rem',
      position: 'absolute',
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
      backgroundColor: theme.colors.white[400],
      border: `1px solid ${theme.colors.white[900]}`,
      borderRadius: 4,
      padding: '0px !important',
      width: '2.625rem',
      height: '2.625rem !important',
    },
    PartExplorerDropdown_ModelName: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      maxWidth: '6.5rem',
      lineHeight: '1rem',
    },
    PartExplorerMenu: {
      display: 'flex',
      flexDirection: 'column',
    },
    AssemblyExplorer: {
      maxHeight: '20rem',
      ...theme.mixins.scrollbar,
    },
    AssemblyExplorer__selected: {
      borderRadius: '.25rem',
      backgroundColor: theme.colors.white[900],
    },
    AssemblyExplorer_Row: {
      display: 'flex',
      flexDirection: 'row',
    },
    AssemblyExplorer_Spacer: {
      flex: 'none',
    },
    PartSelectorRow: {
      display: 'flex',
      flexDirection: 'row',
    },
    PartExplorerDropdown_PartText: {
      overflow: 'hidden',
      width: '15.5rem',
      textOverflow: 'ellipsis',
    },
  }
})

const noop = () => null

const PartSelectorRow = ({
  model,
  part,
  handleClick,
  handleChange,
  selectedFilename,
  level,
}) => {
  const c = useStyles({ level })
  const isAssembly = useMemo(() => part.parts && part.parts.length > 0, [part])
  console.log('part', part)
  return (
    <>
      <div className={c.PartSelectorRow}>
        <Spacer width={`${level * 8}rem`} height={'2.625rem'} />
        <div
          className={classnames(c.AssemblyExplorer, {
            [c.AssemblyExplorer__selected]: selectedFilename === part.filename,
          })}
          onClick={handleClick}
        >
          <Spacer size={'.5rem'} />
          <div className={c.AssemblyExplorer_Row}>
            <Spacer size={'.5rem'} />
            <ModelThumbnail
              key={model.newFileName}
              className={c.PartExplorerDropdown_Thumbnail}
              name={part.name}
              model={{ ...model, uploadedFile: encodeURIComponent(part.filename) }}
            />
            <Spacer size={'.75rem'} />
            <div className={c.PartExplorerDropdown_PartText}>
              <SingleLineBodyText>{part.name}</SingleLineBodyText>
              <Spacer size={'.5rem'} />
              <Tag secondary={!isAssembly}>{isAssembly ? 'Assembly' : 'Part'}</Tag>
            </div>
          </div>
          <Spacer size={'.5rem'} />
        </div>
      </div>
      {isAssembly && (
        <AssemblyExplorer
          model={model}
          parts={part.parts}
          handleChange={handleChange}
          selectedFilename={selectedFilename}
          level={level + 1}
        />
      )}
    </>
  )
}

const AssemblyExplorer = ({
  model,
  parts,
  handleChange,
  selectedFilename,
  level = 0,
}) => {
  const c = useStyles({})
  return (
    <div className={c.AssemblyExplorer}>
      {parts.map((part, index) => {
        const handleClick = () => {
          handleChange(part.filename)
        }
        console.log('part lvl up', part)
        return (
          <PartSelectorRow
            key={`partRow_${index}_${level}`}
            model={model}
            part={part}
            handleClick={handleClick}
            handleChange={handleChange}
            selectedFilename={selectedFilename}
            level={level}
          />
        )
      })}
    </div>
  )
}

export const PartExplorerMenu = ({ handleChange, model, selectedFilename }) => {
  const c = useStyles({})
  const { parts } = model

  const handleOnInputChange = useCallback(
    (e, value) => {
      parts.filter(file => file.name.includes(value))
    },
    [parts]
  )

  return (
    <div className={c.PartExplorerMenu}>
      <Input
        id='assembly-search-input'
        name='part'
        label='Search models'
        maxLength='150'
        type='text'
        onChange={handleOnInputChange}
      />
      <Spacer size={'1rem'} className={c.AssemblyExplorer_Spacer} />
      <AssemblyExplorer
        model={model}
        parts={parts}
        handleChange={handleChange}
        selectedFilename={selectedFilename}
      />
    </div>
  )
}

export const PartExplorerDropdown = ({
  model,
  selectedFilename,
  handleChange = noop,
}) => {
  const c = useStyles({})
  const [isVisible, setIsVisible] = useState(true)
  const { dispatch } = useStoreon()

  const handleOnClick = useCallback(() => {
    dispatch(types.OPEN_ACTION_BAR, {
      Component: PartExplorerActionMenu,
      data: {
        model,
        selectedFilename,
        handleChange,
      },
    })
  }, [dispatch, model, handleChange, selectedFilename])

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
      {model.isAssembly ? <Tag>Assembly</Tag> : <Tag secondary>Part</Tag>}
      <Spacer size={'.5rem'} />
      {isVisible ? (
        <ExitIcon className={c.PartExplorerDropdown_Arrow} />
      ) : (
        <ArrowDown className={c.PartExplorerDropdown_Arrow} />
      )}
    </div>
  )
}

const PartExplorerDropdownMenu = ({
  model = {},
  handleChange = noop,
  selectedFilename,
}) => {
  const c = useStyles({})

  return (
    <DropdownMenu
      className={c.PartExplorerDropdown}
      TargetComponent={PartExplorerDropdown}
      TargetComponentProps={{ model, handleChange, selectedFilename }}
      isOpen={true}
    >
      <PartExplorerMenu
        handleChange={handleChange}
        model={model}
        selectedFilename={selectedFilename}
      />
    </DropdownMenu>
  )
}

const PartExplorerActionMenu = ({
  model = {},
  handleChange = noop,
  selectedFilename,
}) => {
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
        <PartExplorerMenu
          model={model}
          handleChange={handleSelect}
          selectedFilename={selectedFilename}
        />
      </div>
      <Spacer size={'2rem'} />
    </>
  )
}

export default PartExplorerDropdownMenu
