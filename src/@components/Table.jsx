import React from 'react'
import cn from 'classnames'
import { ContextMenuTrigger } from 'react-contextmenu'
import { MetadataSecondary, Spacer } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ArrowUpIcon } from '@svg/icon-arrow-up-sm.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Table_Body: {
      ...theme.mixins.scrollbar,
      overflowX: 'hidden !important',
      overflowY: 'scroll !important',
    },
    Table_Item: {
      borderBottom: `1px solid ${theme.colors.white[900]}`,
    },
    Table_Item__selected: {
      backgroundColor: theme.colors.purple[200],
    },
    Table_FileRow: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      cursor: 'pointer',
    },
    Table_HeaderRow: {
      display: 'flex',
      width: '100%',
      overflowY: 'scroll',
      ...theme.mixins.scrollbar,
    },
    Table_HeaderCell: {
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
    Table_Cell: {
      display: 'flex',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      flex: 'none',
      paddingRight: '1rem',
    },
    Table_SortOrder: {
      marginLeft: '0.25rem',
    },
    Table_FileName: {
      flex: '1',
      display: 'flex',
      alignItems: 'center',
    },
    Table_Date: {
      width: '18%',
      justifyContent: 'left',
    },
    Table_Size: {
      width: '9%',
      justifyContent: 'left',
    },
    Table_Contributors: {
      width: '14%',
      display: 'flex',
      justifyContent: 'left',
    },
    Table_Action: {
      width: '7%',
    },
    Table_ExpandIcon: {
      width: '0.75rem',
      cursor: 'pointer',
      marginRight: '0.75rem',
      '& svg': {
        display: 'block',
        margin: 'auto',
        transition: 'transform 150ms ease-in-out',
      },
    },
    Table_ExpandIcon__expanded: {
      '& svg': {
        transform: 'rotate(90deg)',
      },
    },
    Table_AssemblyIcon: {
      marginRight: '0.5rem',
    },
    Table_MissingFile: {
      color: theme.colors.errorTextColor,
    },
    NoResultsFound: {
      display: 'flex',
      padding: '2rem',
      justifyContent: 'center',
    },
    NoFilesMessage: {
      top: '15.75rem',
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%)',
      [md]: {
        position: 'relative',
        margin: '2rem',
        padding: '2rem',
        top: 'unset',
        left: 'unset',
        transform: 'unset',
      },
      textAlign: 'center',
    },
    Table_UploadZone: {
      [md]: {
        width: '27rem',
        margin: '0 auto',
      },
      '& > div': {
        outline: 'none',
      },
    },
    Table_DropzoneIcon__mobile: {
      display: 'initial',
      [md]: {
        display: 'none',
      },
    },
    Table_DropzoneIcon__desktop: {
      display: 'none',
      [md]: {
        display: 'block',
      },
    },
    Table_UploadButton: {
      width: '5.25rem',
      position: 'absolute',
      bottom: '8rem',
      left: 0,
      right: 0,
      margin: 'auto',
      display: 'none',
      [md]: {
        display: 'flex',
      },
    },
  }
})

const noop = () => null

const SortByArrow = ({ order }) => {
  const c = useStyles()

  return order === 'asc' ? (
    <ArrowUpIcon className={c.Table_SortOrder} />
  ) : (
    <ArrowDownIcon className={c.Table_SortOrder} />
  )
}

// const Table = ({
//   columns = [],
//   showContextMenus,
// }) => {
//   return (
//     <TableHeader></TableHeader>
//   )
// }

const TableHeader = ({
  columns = [],
  sortBy,
  order,
  showContextMenus,
  onSort = noop,
}) => {
  const c = useStyles()
  return (
    <div>
      <Spacer size={'.625rem'} />
      <div className={c.Table_HeaderRow}>
        {columns.map((col, ind) => {
          const { key, className, title } = col
          return (
            <MetadataSecondary
              key={`table_header_${key}${ind}`}
              className={cn(className, c.Table_HeaderCell)}
              onClick={() => {
                onSort(key)
              }}
            >
              {title}
              {sortBy === key && <SortByArrow order={order} />}
            </MetadataSecondary>
          )
        })}
        {showContextMenus && <div className={cn(c.Table_Action, c.Table_HeaderCell)} />}
      </div>
      <Spacer size={'.625rem'} />
    </div>
  )
}

const TableRow = (rowData = [], menuProps) => {
  const c = useStyles()

  return (
    <ContextMenuTrigger holdToDisplay={-1} {...menuProps}>
      {rowData.map((data, ind) => {
        const { content, onClick, className } = data
        return (
          <div
            key={`table_row_${ind}`}
            className={cn(className, c.FileTable_FileRow)}
            onClick={onClick}
          >
            {content}
          </div>
        )
      })}
    </ContextMenuTrigger>
  )
}

export { TableHeader, TableRow }
