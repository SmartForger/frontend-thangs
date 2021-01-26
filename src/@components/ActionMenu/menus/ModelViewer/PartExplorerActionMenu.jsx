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
  TreeView,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowDown } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ExitIcon } from '@svg/icon-X-sm.svg'
import { ReactComponent as SearchIcon } from '@svg/icon-search.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { xl, md_972, md_viewer, lg_viewer },
  } = theme
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
      maxWidth: '100%',
      [md_viewer]: {
        width: '15rem',
        maxWidth: '15rem',
      },

      [md_972]: {
        width: '17.5rem',
        maxWidth: '17.5rem',
      },
    },
    AssemblyExplorer_Wrapper: {
      ...theme.mixins.scrollbar,
      overflowY: 'scroll',
      maxHeight: '23rem',

      [xl]: {
        maxHeight: '28rem',
      },
    },
    PartSelectorRow_Row: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',

      '& > svg': {
        flex: 'none',
      },
    },
    PartSelectorRow_Column: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    AssemblyExplorer_Spacer: {
      flex: 'none',
    },
    PartSelectorRow: {
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden',
      flex: 1,
    },
    PartSelectorRow__hover: {
      borderRadius: '.25rem',

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
    PartExplorerActionMenu: {
      bottom: '5rem',
      right: '0',
      maxHeight: '80vh',
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

      '& + div': {
        flex: 'none',
      },
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

      [md_viewer]: {
        maxWidth: '5.5rem',
      },

      [lg_viewer]: {
        maxWidth: '9rem',
      },

      [xl]: {
        maxWidth: '11rem',
      },
    },
    PartExplorerTarget_Thumbnail: {
      flex: '0 0 auto',
      height: '2rem !important',
      padding: '0px !important',
      width: '2rem',
    },
    PartExplorerTarget__tablet: {
      [md_viewer]: {
        display: 'none !important',
      },

      [md_972]: {
        display: 'flex !important',
      },
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
    PartExplorerTarget_mobile: {
      display: 'flex',

      [md_viewer]: {
        display: 'none',
      },
    },
  }
})

const noop = () => null

const PartSelectorRow = ({ part = {}, onClick }) => {
  const c = useStyles({})
  const { parts, name, newFileName } = part
  const isAssembly = parts && parts.length > 0
  return (
    <>
      <div className={c.PartSelectorRow} title={name}>
        <div className={c.PartSelectorRow_Column} onClick={onClick}>
          <Spacer size={'.5rem'} />
          <div className={c.PartSelectorRow_Row}>
            <Spacer size={'.5rem'} />
            <ModelThumbnail
              key={newFileName}
              className={c.PartSelectorRow_Thumbnail}
              name={name}
              model={part}
              mini={true}
              lazyLoad={true}
            />
            <Spacer size={'.75rem'} />
            <div className={c.PartExplorerDropdown_PartText}>
              <SingleLineBodyText>{name}</SingleLineBodyText>
              <Spacer size={'.5rem'} />
              <Tag secondary={!isAssembly}>{isAssembly ? 'Assembly' : 'Part'}</Tag>
            </div>
            <Spacer size={'.5rem'} />
          </div>
          <Spacer size={'.5rem'} />
        </div>
      </div>
    </>
  )
}

const AssemblyExplorer = ({
  className,
  parts,
  partTree,
  isSearchingParts,
  onChange,
  selectedPart,
}) => {
  const c = useStyles()

  const treeData = useMemo(() => {
    return isSearchingParts ? parts.map(p => ({ ...p, subs: [] })) : partTree
  }, [parts, partTree, isSearchingParts])

  return (
    <TreeView
      className={className}
      nodes={treeData}
      levelPadding={20}
      defaultExpanded={parts.length < 2}
      rootCollapsible={false}
      isSelected={node => node.name === selectedPart.name}
      classes={{
        item: c.PartSelectorRow__hover,
        itemSelected: c.PartSelectorRow__selected,
      }}
      showDivider={false}
      rowSpacing='.25rem'
      renderNode={(node, level) => (
        <PartSelectorRow part={node} level={level} onClick={() => onChange(node)} />
      )}
    />
  )
}

export const PartExplorerMenu = ({
  onChange = noop,
  partList = [],
  partTreeData = [],
  selectedValue: selectedPart,
}) => {
  const c = useStyles({})
  const [partsToDisplay, setPartsToDisplay] = useState(partList)
  const handleInputChange = useCallback(
    value => {
      if (!value || value === '') setPartsToDisplay(partList)
      const newParts = partList.filter(file => {
        const fileName = file.name.toLowerCase()
        return fileName.includes(value.toLowerCase())
      })
      setPartsToDisplay(newParts)
    },
    [partList]
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
          parts={partsToDisplay}
          partTree={partTreeData}
          isSearchingParts={partsToDisplay.length < partList.length}
          onChange={onChange}
          selectedPart={selectedPart}
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
  selectedValue: selectedPart = {},
}) => {
  const c = useStyles({})
  return (
    <div>
      <Spacer size={'1rem'} className={c.PartExplorerTarget_mobile} />
      <div className={c.PartExplorerTarget} onClick={onClick}>
        <ModelThumbnail
          key={selectedPart.newFileName}
          className={c.PartExplorerTarget_Thumbnail}
          name={selectedPart.name}
          model={{ ...selectedPart, uploadedFile: selectedPart.newFileName }}
          mini={true}
        />
        <Spacer size={'1rem'} />
        <SingleLineBodyText className={c.PartExplorerTarget_ModelName}>
          {selectedPart.name}
        </SingleLineBodyText>
        <Spacer size={'.5rem'} />
        {selectedPart.parts && selectedPart.parts.length > 0 ? (
          <Tag className={c.PartExplorerTarget__tablet}>Assembly</Tag>
        ) : (
          <Tag className={c.PartExplorerTarget__tablet} secondary>
            Part
          </Tag>
        )}
        <Spacer className={c.PartExplorerTarget__tablet} size={'.5rem'} />
        {isOpen ? (
          <ExitIcon className={c.PartExplorerTarget_Arrow} />
        ) : (
          <ArrowDown className={c.PartExplorerTarget_Arrow} />
        )}
      </div>
      <Spacer size={'1rem'} className={c.PartExplorerTarget_mobile} />
    </div>
  )
}

const PartExplorerActionMenu = ({
  onChange = noop,
  selectedValue,
  partList,
  partTreeData,
}) => {
  const c = useStyles({})
  const menuProps = useMemo(() => {
    return {
      actionBarTitle: 'Select a model',
      className: c.PartExplorerActionMenu,
      partList,
      partTreeData,
      onChange,
      selectedValue,
      tabletLayout: true,
    }
  }, [c.PartExplorerActionMenu, onChange, partList, partTreeData, selectedValue])

  const targetProps = useMemo(() => {
    return { selectedValue }
  }, [selectedValue])

  return (
    <ActionMenu
      MenuComponent={PartExplorerMenu}
      MenuComponentProps={menuProps}
      TargetComponent={PartExplorerTarget}
      TargetComponentProps={targetProps}
      isAutoClosed={false}
      isOpenByDefault={true}
    />
  )
}

export default PartExplorerActionMenu
