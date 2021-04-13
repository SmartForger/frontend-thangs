import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import cn from 'classnames'
import { ContextMenuTrigger } from 'react-contextmenu'

import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body } from '@physna/voxel-ui/@atoms/Typography'

import InfiniteTreeView from '@components/InfiniteTreeView'
import { Checkbox, Spacer, TableHeader, Tag } from '@components'
import { flattenTree } from '@utilities/tree'

import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'

const useStyles = createUseStyles(theme => {
  return {
    PartTable_Body: {
      ...theme.mixins.scrollbar,
      overflowX: 'hidden !important',
      overflowY: 'scroll !important',
    },
    PartTable_Item: {
      borderBottom: `1px solid ${theme.colors.white[900]}`,
    },
    PartTable_Item__selected: {
      backgroundColor: theme.colors.purple[200],
    },
    PartTable_FileRow: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      cursor: 'pointer',
      justifyContent: 'space-between',
    },
    PartTable_HeaderRow: {
      display: 'flex',
      width: '100%',
      overflowY: 'scroll',
      ...theme.mixins.scrollbar,
    },
    PartTable_HeaderCell: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      flex: 'none',
      paddingRight: '1rem',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      color: '#000',
    },
    PartTable_Cell: {
      display: 'flex',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      flex: 'none',
      paddingRight: '1rem',

      '& > span': {
        lineHeight: '1rem',
      },
    },
    PartTable_SortOrder: {
      marginLeft: '0.25rem',
    },
    PartTable_Name: {
      flex: '1',
      display: 'flex',
      alignItems: 'center',
    },
    PartTable_Score: {
      justifyContent: 'left',
    },
  }
})

const noop = () => null
const handleMenuButton = e => {
  e.stopPropagation()
}

const COLUMNS = {
  NAME: 'name',
  SCORE: 'score',
}

const sortParts = (node, sortBySize, sortOrder) => {
  if (node.parts) {
    node.parts.sort((a, b) => {
      if (!sortBySize) {
        const valA = a.isPrimary ? 2 : a.parts && a.parts.length > 0 ? 1 : 0
        const valB = b.isPrimary ? 2 : b.parts && b.parts.length > 0 ? 1 : 0

        return valB - valA
      }

      return sortOrder === 'asc' ? a.size - b.size : b.size - a.size
    })
    node.parts.forEach(a => {
      sortParts(a, sortBySize, sortOrder)
    })
  }
}

const PartTableHeader = ({ sortedBy, order, onSort = noop }) => {
  const c = useStyles()
  const colData = useMemo(
    () => [
      {
        key: COLUMNS.NAME,
        className: c.PartTable_Name,
        title: 'Name',
      },
      {
        key: COLUMNS.SCORE,
        className: c.PartTable_Score,
        title: 'Score',
      },
    ],
    [c]
  )

  return (
    <TableHeader
      columns={colData}
      sortBy={sortedBy}
      order={order}
      onSort={onSort}
      showContextMenus={false}
    />
  )
}

const PartTable = ({
  className,
  file,
  filterTerm,
  // heightOffset = 0,
  minHeight = 300,
  model = {},
  searchCase,
  selectedParts,
  setSelectedParts,
  showContextMenus = false,
  sortedBy: initialSortedBy,
}) => {
  const c = useStyles()
  const containerRef = useRef()

  const addSelectedParts = useCallback(
    id => {
      const newSelectedParts = [...selectedParts]
      newSelectedParts.push(id)
      setSelectedParts(newSelectedParts)
    },
    [selectedParts, setSelectedParts]
  )

  const removeSelectedFile = useCallback(
    id => {
      const newSelectedParts = [...selectedParts].filter(partId => partId !== id)
      setSelectedParts(newSelectedParts)
    },
    [selectedParts, setSelectedParts]
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

  const allNodes = useMemo(() => {
    let result = []
    let parts = model
    sortParts(parts, sortedBy === COLUMNS.SIZE, order)
    const list = flattenTree(model.parts, 'parts').filter(part =>
      part.name.includes(filterTerm)
    )
    return result.concat(list)
  }, [model, sortedBy, order, filterTerm])

  const renderNode = useCallback(
    (
      node,
      { _toggleNode, selectedParts, addSelectedParts = noop, removeSelectedFile = noop }
    ) => {
      const menuProps = showContextMenus
        ? {
          id: 'Subpart_Menu',
          attributes: {
            className: c.PartTable_FileRow,
          },
          collect: () => ({ part: node }),
        }
        : null

      const handleClick = () => {
        if (selectedParts.includes(node.partIdentifier)) {
          removeSelectedFile(node.partIdentifier)
        } else {
          addSelectedParts(node.partIdentifier)
        }
      }

      const PartTableContents = () => {
        return (
          <div className={c.PartTable_FileRow} onClick={handleClick}>
            <div className={cn(c.PartTable_FileName, c.PartTable_Cell)}>
              <Spacer size={'.5rem'} />
              {setSelectedParts && (
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
            <div className={cn(c.PartTable_Contributors, c.PartTable_Cell)}>
              <Tag lightText color={'#30BE93'}>
                98%
              </Tag>
            </div>
            {showContextMenus && (
              <div
                className={cn(c.PartTable_Action, c.PartTable_Cell)}
                onClick={handleMenuButton}
              >
                <ContextMenuTrigger holdToDisplay={0} {...menuProps}>
                  <DotStackIcon />
                </ContextMenuTrigger>
              </div>
            )}
          </div>
        )
      }

      return menuProps ? (
        <ContextMenuTrigger holdToDisplay={-1} {...menuProps}>
          <PartTableContents />
        </ContextMenuTrigger>
      ) : (
        <PartTableContents />
      )
    },
    [showContextMenus, c, setSelectedParts]
  )

  useEffect(() => {
    //Check if any parts original files match
    const newSelectedParts = []
    allNodes.forEach(node => {
      if (node.originalFileName === file.fileName) {
        newSelectedParts.push(node.partIdentifier)
      }
    })
    setSelectedParts(newSelectedParts)
  }, [allNodes, file, setSelectedParts])

  return (
    <div className={className} ref={containerRef}>
      {allNodes.length > 0 || searchCase ? (
        <>
          <PartTableHeader sortedBy={sortedBy} onSort={handleSort} order={order} />
          {allNodes.length > 0 ? (
            <InfiniteTreeView
              classes={{
                root: c.PartTable_Body,
                item: c.PartTable_Item,
                itemSelected: c.PartTable_Item__selected,
              }}
              hideRowIcons
              isSelected={node =>
                setSelectedParts ? null : selectedParts.includes(node.partIdentifier)
              }
              itemHeight={48}
              levelPadding={0}
              minHeight={minHeight}
              nodes={allNodes}
              renderNode={renderNode}
              nodeProps={{ selectedParts, addSelectedParts, removeSelectedFile }}
            />
          ) : (
            <Body className={c.NoResultsFound}>No Results Found</Body>
          )}
        </>
      ) : null}
    </div>
  )
}

export default PartTable
