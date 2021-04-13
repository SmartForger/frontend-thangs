import React, { useCallback, useMemo, useState, useRef } from 'react'

import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body } from '@physna/voxel-ui/@atoms/Typography'

import {
  ActionMenu,
  ModelThumbnail,
  Spacer,
  Tag,
  SearchInput,
  InfiniteTreeView,
} from '@components'

import { ReactComponent as ArrowDown } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ExitIcon } from '@svg/icon-X-sm.svg'

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
      flex: '1 !important',
    },
    AssemblyExplorer_Spacer: {
      flex: 'none',
    },
    PartSelectorRow: {
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden',
      flex: '1 !important',
    },
    PartSelectorRow__hover: {
      borderRadius: '.25rem',
      height: '58px !important',

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
      minWidth: '0',
      flex: '1 !important',

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
    PartExplorerTarget_mobile: {
      display: 'flex',

      [md_viewer]: {
        display: 'none',
      },
    },
  }
})

const noop = () => null

const PartSelectorRow = ({ part = {}, onClick, onEnter }) => {
  const c = useStyles({})
  const { hasChildren, name, newFileName } = part

  const handleMouseEnter = () => {
    onEnter && onEnter(part)
  }

  return (
    <div className={c.PartSelectorRow} title={name} onMouseEnter={handleMouseEnter}>
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
            <Body>{name}</Body>
            <Spacer size={'.5rem'} />
            <Tag secondary={!hasChildren}>{hasChildren ? 'Assembly' : 'Part'}</Tag>
          </div>
          <Spacer size={'.5rem'} />
        </div>
        <Spacer size={'.5rem'} />
      </div>
    </div>
  )
}

const AssemblyExplorer = ({
  classes,
  parts,
  onChange,
  selectedParts,
  scrollToItem,
  onHoverPart,
}) => {
  return (
    <InfiniteTreeView
      classes={classes}
      width={280}
      maxHeight={300}
      itemHeight={62}
      levelPadding={20}
      nodes={parts}
      isSelected={node => selectedParts.includes(node.id)}
      scrollToItem={scrollToItem}
      renderNode={node => (
        <PartSelectorRow
          part={node}
          onClick={() => onChange(node)}
          onEnter={onHoverPart}
        />
      )}
    />
  )
}

export const PartExplorerMenu = ({
  onChange = noop,
  partList = [],
  selectedValue,
  highlightedValue,
  onHoverPart,
  onLeave,
}) => {
  const c = useStyles({})
  const containerRef = useRef()
  const [partsToDisplay, setPartsToDisplay] = useState(partList)
  const handleInputChange = useCallback(
    value => {
      if (!value || value === '') {
        setPartsToDisplay(partList)
        return
      }

      const newParts = partList.filter(file => {
        const fileName = file.name.toLowerCase()
        return fileName.includes(value.toLowerCase())
      })
      setPartsToDisplay(newParts.map(file => ({ ...file, level: 1 })))
    },
    [partList]
  )

  const highlightedParts = useMemo(() => {
    const result = []
    if (selectedValue && selectedValue.id) {
      result.push(selectedValue.id)
    }
    if (highlightedValue && highlightedValue.id) {
      result.push(highlightedValue.id)
    }
    return result
  }, [selectedValue, highlightedValue])

  const handleMouseOut = useCallback(() => {
    if (onLeave) {
      onLeave()
    }
  }, [onLeave])

  return (
    <div className={c.PartExplorerMenu} ref={containerRef} onMouseLeave={handleMouseOut}>
      <SearchInput onChange={handleInputChange} />
      <Spacer size={'.5rem'} className={c.AssemblyExplorer_Spacer} />
      {partsToDisplay.length > 0 ? (
        <AssemblyExplorer
          classes={{
            root: c.AssemblyExplorer_Wrapper,
            item: c.PartSelectorRow__hover,
            itemSelected: c.PartSelectorRow__selected,
          }}
          parts={partsToDisplay}
          onChange={onChange}
          onHoverPart={onHoverPart}
          onLeave={onLeave}
          selectedParts={highlightedParts}
          scrollToItem={highlightedValue}
        />
      ) : (
        <Body multiline>No models found</Body>
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
        <Body className={c.PartExplorerTarget_ModelName}>{selectedPart.name}</Body>
        <Spacer size={'.5rem'} />
        {selectedPart.hasChildren ? (
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
  onHoverPart,
  onLeave,
  selectedValue,
  highlightedValue,
  partList,
}) => {
  const c = useStyles({})
  const menuProps = useMemo(() => {
    return {
      actionBarTitle: 'Select a model',
      className: c.PartExplorerActionMenu,
      partList,
      onChange,
      onHoverPart,
      onLeave,
      selectedValue,
      highlightedValue,
      tabletLayout: true,
    }
  }, [
    c.PartExplorerActionMenu,
    onChange,
    onHoverPart,
    onLeave,
    partList,
    selectedValue,
    highlightedValue,
  ])

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
      isExternalClosed={true}
      isOpenByDefault={true}
    />
  )
}

export default PartExplorerActionMenu
