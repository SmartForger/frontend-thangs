import React, { useCallback, useMemo, useState } from 'react'
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

const useStyles = createUseStyles(theme => {
  return {
    PartExplorerDropdown: {
      bottom: '5.1rem',
      display: 'flex',
      overflow: 'hidden',
      padding: '1rem',
      position: 'absolute',
      right: '-2rem',
      width: 'auto',
    },
    PartExplorerDropdown_Arrow: {
      height: '0.75rem',
      width: '0.75rem',
      '& > path': {
        fill: '#000',
      },
    },
    PartExplorerDropdown_ClickableButton: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
    },
    PartExplorerDropdown_DropdownMenuDivider: {
      border: 'none',
      borderTop: `1px solid ${theme.colors.grey[100]}`,
      margin: '.25rem 0',
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
      backgroundColor: theme.colors.white[400],
      border: `1px solid ${theme.colors.white[900]}`,
      borderRadius: 4,
      boxSizing: 'border-box',
      flex: 'none',
      height: '2rem',
      padding: '0px !important',
      width: '2rem',
    },
    PartExplorerDropdown_ModelName: {
      lineHeight: '1rem',
      maxWidth: '6.5rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    PartExplorerMenu: {
      display: 'flex',
      flexDirection: 'column',
    },
    AssemblyExplorer_Wrapper: {
      ...theme.mixins.scrollbar,
      maxHeight: '20rem',
      overflowY: 'scroll',
    },
    PartSelectorRow_Row: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
    },
    PartSelectorRow_Column: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
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
      flexDirection: 'column',
      justifyContent: 'center',
      minWidth: '10rem',

      '& > span': {
        alignItems: 'center',
        lineHeight: '1rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
    PartSelectorRow_Thumbnail: {
      backgroundColor: theme.colors.white[400],
      border: `1px solid ${theme.colors.white[900]}`,
      borderRadius: 4,
      boxSizing: 'border-box',
      flex: 'none',
      height: '2.625rem',
      padding: '0 !important',
      width: '2.625rem',
    },
    PartExplorerTarget: {
      ...theme.mixins.flexRow,
      alignItems: 'center',
      cursor: 'pointer',
    },
    PartExplorerTarget_ModelName: {
      lineHeight: '1.25rem !important',
      maxWidth: '11rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    PartExplorerTarget_Thumbnail: {
      flex: '0 0 auto',
      height: '2rem !important',
      padding: '0px !important',
      width: '2rem',
    },
    SearchBar_Wrapper: {
      background: theme.colors.white[600],
      borderRadius: '.5rem',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      width: '100%',

      '& input': {
        background: theme.colors.white[600],
        border: 'none',
        color: theme.colors.black[900],
        fontSize: '1rem',
        lineHeight: '1.5rem',
        outline: 'none',
        padding: 0,
        width: '100%',

        '&::placeholder': {
          color: theme.colors.black[900],
          fontSize: '.875rem',
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
      },
    },
    SearchBar_Icon: {
      flex: 'none',
    },
    SearchBar_Row: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
    },
  }
})

const noop = () => null

const PartSelectorRow = ({
  model,
  part,
  onClick,
  onChange,
  selectedFilename,
  level = 0,
}) => {
  const c = useStyles({ level })
  const isAssembly = useMemo(() => part.parts && part.parts.length > 0, [part])

  return (
    <>
      <div
        className={classnames(c.PartSelectorRow, {
          [c.PartSelectorRow__selected]: selectedFilename === part.name,
        })}
      >
        {level > 0 && <Spacer width={`${level * 0.5}rem`} height={'2.625rem'} />}
        <div className={c.PartSelectorRow_Column} onClick={onClick}>
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
          onChange={onChange}
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
  onChange,
  selectedFilename,
  level = 0,
}) => {
  const c = useStyles({})
  return (
    <div className={classnames(className, c.AssemblyExplorer)}>
      {parts.map((part, index) => {
        const handleClick = () => {
          onChange(part.filename)
        }

        return (
          <PartSelectorRow
            key={`partRow_${index}_${level}`}
            model={model}
            part={part}
            onClick={handleClick}
            onChange={onChange}
            selectedFilename={selectedFilename}
            level={level}
          />
        )
      })}
    </div>
  )
}

export const PartExplorerMenu = ({ onChange = noop, model, selectedFilename }) => {
  const c = useStyles({})
  const { parts } = model
  const [partsToDisplay, setPartsToDisplay] = useState(parts)

  const handleInputChange = useCallback(
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
          <SearchIcon className={c.SearchBar_Icon} />
          <Spacer size={'.5rem'} />
          <TextInput
            name='search'
            placeholder={'Filter models by name'}
            onChange={e => {
              handleInputChange(e.target.value)
            }}
            autoComplete='off'
          />
        </div>
        <Spacer size={'.5rem'} />
      </div>
      <Spacer size={'.5rem'} className={c.AssemblyExplorer_Spacer} />
      {partsToDisplay.length > 0 ? (
        <AssemblyExplorer
          className={c.AssemblyExplorer_Wrapper}
          model={model}
          parts={partsToDisplay}
          onChange={onChange}
          selectedFilename={selectedFilename}
        />
      ) : (
        <MultiLineBodyText>No models found</MultiLineBodyText>
      )}
    </div>
  )
}

export const PartExplorerTarget = ({
  isOpen,
  onClick = noop,
  model = {},
  selectedValue: fileName,
}) => {
  const c = useStyles({})
  return (
    <div className={c.PartExplorerTarget} onClick={onClick}>
      <ModelThumbnail
        key={model.newFileName}
        className={c.PartExplorerTarget_Thumbnail}
        name={model}
        model={{ ...model, uploadedFile: model.newFileName }}
      />
      <Spacer size={'1rem'} />
      <SingleLineBodyText className={c.PartExplorerTarget_ModelName}>
        {fileName}
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
        selectedFilename: selectedValue,
      }}
      TargetComponent={PartExplorerTarget}
      TargetComponentProps={{ model, selectedValue }}
      isOpenByDefault={true}
    />
  )
}

export default PartExplorerActionMenu
