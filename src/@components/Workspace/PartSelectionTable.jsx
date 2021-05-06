import React, { useMemo, useCallback, useRef, useState } from 'react'
import cn from 'classnames'

import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body, Label, Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'
import InfiniteTreeView from '@components/InfiniteTreeView'
import { Checkbox, ContainerColumn, ContainerRow, Spacer } from '@components'
import { ReactComponent as IconArrowHierarchy } from '@svg/icon-arrow-hierarchy.svg'
const useStyles = createUseStyles(theme => {
  return {
    PartSelectionTable_Body: {
      ...theme.mixins.scrollbar,
      overflowX: 'hidden !important',
      overflowY: 'scroll !important',
    },
    PartSelectionTable_Item: {},
    PartSelectionTable_Item__selected: {
      backgroundColor: theme.colors.purple[200],
    },
    PartSelectionTable_FileRow: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      cursor: 'pointer',
      justifyContent: 'space-between',
    },
    PartSelectionTable_HeaderRow: {
      display: 'flex',
      width: '100%',
      overflowY: 'scroll',
      ...theme.mixins.scrollbar,
    },
    PartSelectionTable_Cell: {
      display: 'flex',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      flex: 'none',

      '& > span': {
        lineHeight: '1rem',
      },
    },
    PartSelectionTable_SortOrder: {
      marginLeft: '0.25rem',
    },
    PartSelectionTable_Name: {
      flex: '1',
      display: 'flex',
      alignItems: 'center',
    },
    PartSelectionTable_Compare: {
      justifyContent: 'left',
      fontWeight: 600,

      '&:hover': {
        color: theme.colors.black[600],
      },
    },
  }
})

const noop = () => null

const COLUMNS = {
  NAME: 'name',
  SCORE: 'score',
}

const sortParts = (node = [], sortBy, sortOrder) => {
  if (node.length) {
    const nodeParts = [...node]
    nodeParts.sort((a, b) => {
      return sortOrder === 'asc' ? a.name - b.name : b.name - a.name
    })
    nodeParts.forEach(a => {
      sortParts(a, sortBy, sortOrder)
    })
    return nodeParts
  }
  return node
}

const PartSelectionTableHeader = ({ onDeselect = noop, isSelected, partCount }) => {
  const c = useStyles()

  const handleDeselect = useCallback(() => {
    if (isSelected) {
      onDeselect()
    }
  }, [isSelected, onDeselect])

  return (
    <ContainerColumn>
      <Spacer size={'.75rem'} />
      <ContainerRow alignItems={'center'} justifyContent={'space-between'}>
        <ContainerRow alignItems={'center'}>
          <Checkbox
            checked={isSelected}
            disabled={!isSelected}
            onChange={handleDeselect}
            isIndeterminate
          />
          <Spacer size={'.5rem'} />
          <Label>Parts</Label>
          <Spacer size={'.125rem'} />
          <Label className={c.PartSelectionTable_PartCount}>({partCount})</Label>
        </ContainerRow>
      </ContainerRow>
      <Spacer size={'.75rem'} />
    </ContainerColumn>
  )
}

const PartSelectionTable = props => {
  const {
    allNodes,
    className,
    minHeight = 100,
    onCompare = noop,
    onSelectParts,
    searchCase,
    selectedDiffModel,
    selectedParts,
    sortedBy: initialSortedBy,
  } = props
  const c = useStyles()
  const containerRef = useRef()

  const selectPart = useCallback(
    id => {
      const newSelectedParts = [...selectedParts]
      newSelectedParts.push(id)
      onSelectParts(newSelectedParts)
    },
    [selectedParts, onSelectParts]
  )

  const deselectPart = useCallback(
    id => {
      const newSelectedParts = selectedParts.filter(partId => partId !== id)
      onSelectParts(newSelectedParts)
    },
    [selectedParts, onSelectParts]
  )

  const [{ sortedBy, order }, setSort] = useState({
    sortedBy: initialSortedBy || COLUMNS.NAME,
    order: 'desc',
  })

  const handleSort = useCallback(
    newSortedBy => {
      const newOrder = sortedBy !== newSortedBy ? 'asc' : order === 'asc' ? 'desc' : 'asc'

      setSort({ sortedBy: newSortedBy, order: newOrder })
    },
    [sortedBy, order]
  )

  const handleDeselectAll = useCallback(() => {
    onSelectParts([])
  }, [onSelectParts])

  const sortedNodes = useMemo(() => sortParts(allNodes, sortedBy, order), [
    allNodes,
    order,
    sortedBy,
  ])

  const renderNode = useCallback(
    (
      node,
      {
        _toggleNode,
        selectedParts,
        selectPart = noop,
        deselectPart = noop,
        onCompare = noop,
        selectedDiffModel,
      }
    ) => {
      const handleClick = () => {
        if (selectedParts.includes(node.partIdentifier)) {
          deselectPart(node.partIdentifier)
        } else {
          selectPart(node.partIdentifier)
        }
      }

      const handleCompare = () => {
        onCompare(node)
      }

      return (
        <div className={c.PartSelectionTable_FileRow}>
          <div className={cn(c.PartSelectionTable_FileName, c.PartSelectionTable_Cell)}>
            {onSelectParts && (
              <>
                <Checkbox
                  checked={selectedParts.includes(node.partIdentifier)}
                  onChange={handleClick}
                />
                <Spacer size={'.5rem'} />
              </>
            )}
            <Body>{node.name}</Body>
          </div>
          <ContainerRow alignItems={'center'}>
            {selectedDiffModel?.partIdentifier === node?.partIdentifier && (
              <>
                <IconArrowHierarchy />
                <Spacer size={'.25rem'} />
              </>
            )}
            <Metadata
              type={MetadataType.secondary}
              className={cn(c.PartSelectionTable_Compare, c.PartSelectionTable_Cell)}
              onClick={handleCompare}
            >
              Compare
            </Metadata>
          </ContainerRow>
        </div>
      )
    },
    [
      c.PartSelectionTable_Cell,
      c.PartSelectionTable_Compare,
      c.PartSelectionTable_FileName,
      c.PartSelectionTable_FileRow,
      onSelectParts,
    ]
  )

  return (
    <div className={className} ref={containerRef}>
      {allNodes.length > 0 || searchCase ? (
        <>
          <PartSelectionTableHeader
            sortedBy={sortedBy}
            onSort={handleSort}
            onDeselect={handleDeselectAll}
            order={order}
            isSelected={selectedParts.length > 0}
            partCount={allNodes.length}
          />
          {allNodes.length > 0 ? (
            <InfiniteTreeView
              classes={{
                root: c.PartSelectionTable_Body,
                item: c.PartSelectionTable_Item,
                itemSelected: c.PartSelectionTable_Item__selected,
              }}
              hideRowIcons
              isSelected={node =>
                onSelectParts ? null : selectedParts.includes(node.partIdentifier)
              }
              itemHeight={40}
              levelPadding={0}
              minHeight={minHeight}
              nodes={sortedNodes}
              renderNode={renderNode}
              nodeProps={{
                selectedParts,
                selectPart,
                deselectPart,
                selectedDiffModel,
                onCompare,
              }}
            />
          ) : (
            <Body className={c.NoResultsFound}>No Results Found</Body>
          )}
        </>
      ) : null}
    </div>
  )
}

export default PartSelectionTable
