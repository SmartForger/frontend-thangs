import React, { useCallback, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'
import {
  ActionMenu,
  ModelThumbnail,
  MultiLineBodyText,
  Spacer,
  SingleLineBodyText,
  Tag,
  TextInput,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowDown } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ExitIcon } from '@svg/icon-X-sm.svg'
import { ReactComponent as SearchIcon } from '@svg/icon-search.svg'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    PartExplorerDropdown: {
      right: '-2rem',
      width: 'auto',
      bottom: '5.1rem',
      display: 'flex',
      padding: '1rem',
      position: 'absolute',
      overflow: 'hidden',
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
      width: '2rem',
      height: '2rem',
      boxSizing: 'border-box',
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
    AssemblyExplorer_Wrapper: {
      maxHeight: '20rem',
      overflowY: 'scroll',
      ...theme.mixins.scrollbar,
    },
    PartSelectorRow_Row: {
      display: 'flex',
      flexDirection: 'row',
      cursor: 'pointer',
    },
    PartSelectorRow_Column: {
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
    },
    AssemblyExplorer_Spacer: {
      flex: 'none',
    },
    PartSelectorRow: {
      borderRadius: '.25rem',
      display: 'flex',
      flexDirection: 'row',

      '&:hover': {
        backgroundColor: theme.colors.white[900],
      },
    },
    PartSelectorRow__selected: {
      backgroundColor: theme.colors.white[900],
    },
    PartExplorerDropdown_PartText: {
      display: 'flex',
      minWidth: '10rem',
      flexDirection: 'column',
      justifyContent: 'center',

      '& > span': {
        overflow: 'hidden',
        alignItems: 'center',
        lineHeight: '1rem',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },
    },
    PartSelectorRow_Thumbnail: {
      flex: 'none',
      backgroundColor: theme.colors.white[400],
      border: `1px solid ${theme.colors.white[900]}`,
      borderRadius: 4,
      padding: '0 !important',
      width: '2.625rem',
      height: '2.625rem',
      boxSizing: 'border-box',
    },
    PartExplorerTarget: {
      ...theme.mixins.flexRow,
      alignItems: 'center',
    },
    PartExplorerTarget_ModelName: {
      maxWidth: '11rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    SearchBar_Wrapper: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      background: theme.colors.white[600],
      borderRadius: '.5rem',
      width: '100%',

      '& input': {
        background: theme.colors.white[600],
        border: 'none',
        outline: 'none',
        fontSize: '1rem',
        lineHeight: '1.5rem',
        padding: 0,

        '&::placeholder': {
          fontSize: '1rem',
          color: theme.colors.grey[300],
          fontWeight: 500,
          lineHeight: '1rem',
        },
        '&:focus, &:active': {
          background: theme.colors.white[600],
          color: theme.colors.grey[300],
          '&::placeholder': {
            color: 'transparent',
          },
        },
        '&:-webkit-autofill': {
          '-webkit-box-shadow': `0 0 0px 1000px ${theme.colors.white[600]} inset`,
          '-webkit-text-fill-color': theme.colors.grey[300],
          border: 'none',
        },
      },
    },
    SearchBar_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
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
  level = 0,
}) => {
  const c = useStyles({ level })
  const isAssembly = useMemo(() => part.parts && part.parts.length > 0, [part])

  return (
    <>
      <div
        className={classnames(c.PartSelectorRow, {
          [c.PartSelectorRow__selected]: selectedFilename === part.filename,
        })}
      >
        {level > 0 && <Spacer width={`${level * 0.5}rem`} height={'2.625rem'} />}
        <div className={c.PartSelectorRow_Column} onClick={handleClick}>
          <Spacer size={'.5rem'} />
          <div className={c.PartSelectorRow_Row}>
            <Spacer size={'.5rem'} />
            <ModelThumbnail
              key={model.newFileName}
              className={c.PartSelectorRow_Thumbnail}
              name={part.name}
              model={{ ...model, uploadedFile: part.filename.replace('/', '%2F') }}
            />
            <Spacer size={'.75rem'} />
            <div className={c.PartExplorerDropdown_PartText}>
              <SingleLineBodyText>{part.name}</SingleLineBodyText>
              {model.isAssembly && (
                <>
                  <Spacer size={'.5rem'} />
                  <Tag secondary={!isAssembly}>{isAssembly ? 'Assembly' : 'Part'}</Tag>
                </>
              )}
            </div>
            <Spacer size={'.5rem'} />
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
  className,
  model,
  parts,
  handleChange,
  selectedFilename,
  level = 0,
}) => {
  const c = useStyles({})
  return (
    <div className={classnames(className, c.AssemblyExplorer)}>
      {parts.map((part, index) => {
        const handleClick = () => {
          handleChange(part.filename)
        }

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
  const [partsToDisplay, setPartsToDisplay] = useState(parts)

  const handleOnInputChange = useCallback(
    value => {
      if (!value || value === '') setPartsToDisplay(parts)
      const newParts = parts.filter(file => {
        const fileName = file.name.toLowerCase()
        return fileName.includes(value.toLowerCase())
      })
      setPartsToDisplay(newParts)
    },
    [parts]
  )

  return (
    <div className={c.PartExplorerMenu}>
      <div className={classnames(c.SearchBar_Wrapper)}>
        <Spacer size={'.5rem'} />
        <div className={c.SearchBar_Row}>
          <Spacer size={'1rem'} />
          <SearchIcon
            className={classnames(c.SearchBar_SearchIcon, c.SearchBar_FormIcon)}
          />
          <Spacer size={'.5rem'} />
          <TextInput
            name='search'
            placeholder={'Filter models by name'}
            className={c.SearchBar_FormInput}
            onChange={e => {
              handleOnInputChange(e.target.value)
            }}
          />
        </div>
        <Spacer size={'.5rem'} />
      </div>
      <Spacer size={'1rem'} className={c.AssemblyExplorer_Spacer} />
      {partsToDisplay.length > 0 ? (
        <AssemblyExplorer
          className={c.AssemblyExplorer_Wrapper}
          model={model}
          parts={partsToDisplay}
          handleChange={handleChange}
          selectedFilename={selectedFilename}
        />
      ) : (
        <MultiLineBodyText>No models found</MultiLineBodyText>
      )}
    </div>
  )
}

export const PartExplorerTarget = ({ isOpen, model = {}, selectedValue: filename }) => {
  const c = useStyles({})

  return (
    <div className={c.PartExplorerTarget}>
      <ModelThumbnail
        key={model.newFileName}
        className={c.PartExplorerTarget_Thumbnail}
        name={model}
        model={{ ...model, uploadedFile: model.newFileName }}
      />
      <Spacer size={'1rem'} />
      <SingleLineBodyText className={c.PartExplorerTarget_ModelName}>
        {filename}
      </SingleLineBodyText>
      <Spacer size={'.5rem'} />
      {model.isAssembly ? <Tag>Assembly</Tag> : <Tag secondary>Part</Tag>}
      <Spacer size={'.5rem'} />
      {isOpen ? (
        <ExitIcon className={c.PartExplorerTarget_Arrow} />
      ) : (
        <ArrowDown className={c.PartExplorerTarget_Arrow} />
      )}
    </div>
  )
}

const PartExplorerActionMenu = ({ onChange = noop, selectedValue, model }) => {
  return (
    <ActionMenu
      MenuComponent={PartExplorerMenu}
      MenuComponentProps={{
        onChange,
        actionBarTitle: 'Select a model',
        model,
        selectedValue,
      }}
      TargetComponent={PartExplorerTarget}
      TargetComponentProps={{ selectedValue }}
    />
  )
}

export default PartExplorerActionMenu
