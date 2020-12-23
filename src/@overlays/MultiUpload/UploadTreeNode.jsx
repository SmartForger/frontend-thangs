import React from 'react'
import cn from 'classnames'
import {
  Spacer,
  SingleLineBodyText,
  MetadataSecondary,
  Spinner,
  Tooltip,
} from '@components'
import { createUseStyles } from '@style'
import { formatBytes } from '@utilities'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as InfoIcon } from '@svg/icon-info.svg'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import { ReactComponent as ModelIcon } from '@svg/icon-model.svg'

const UploadTreeNode = ({ node, level, onUpload, onRemove }) => {
  const c = useStyles()

  const handleRemove = () => {
    onRemove(node.name)
  }

  return (
    <div
      className={cn(c.UploadTreeNode, {
        missing: !node.loading && (!node.valid || !node.treeValid),
      })}
    >
      {node.loading ? (
        <Spinner size={'1rem'} />
      ) : !node.valid || !node.treeValid ? (
        <Tooltip title='Missing file'>
          <InfoIcon className={c.UploadTreeNode_Icon} />
        </Tooltip>
      ) : node.isAssembly ? (
        <FileIcon className={c.UploadTreeNode_Icon} />
      ) : (
        <ModelIcon className={c.UploadTreeNode_Icon} />
      )}
      <Spacer size={12} />
      <SingleLineBodyText className={c.UploadTreeNode_FileName} title={node.name}>
        {node.name}
      </SingleLineBodyText>
      {node.size && (
        <>
          <Spacer width={'0.5rem'} />
          <MetadataSecondary>{formatBytes(node.size)}</MetadataSecondary>
        </>
      )}
      <Spacer size={'0.5rem'} />
      <div className={c.UploadTreeNode_Actions}>
        {!node.loading && !node.valid && (
          <UploadIcon className={c.UploadTreeNode_Button} onClick={onUpload} />
        )}
        {level === 0 && (
          <TrashCanIcon className={c.UploadTreeNode_Button} onClick={handleRemove} />
        )}
      </div>
    </div>
  )
}

const useStyles = createUseStyles(theme => {
  return {
    UploadTreeNode: {
      display: 'flex',
      alignItems: 'center',
      height: '2.5rem',
      flex: 1,

      '&.missing': {
        '& $UploadTreeNode_FileName': {
          color: '#DA7069',
        },
        '& $UploadTreeNode_Icon [fill]': {
          fill: '#DA7069',
        },
        '& $UploadTreeNode_Icon [stroke]': {
          stroke: '#DA7069',
        },
      },
    },
    UploadTreeNode_FileName: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      lineHeight: '1rem !important',
    },
    UploadTreeNode_Icon: {},
    UploadTreeNode_Actions: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    UploadTreeNode_Button: {
      cursor: 'pointer',
      marginRight: '0.5rem',
      '& $UploadTreeItem_FileName': {
        color: '#999',
        textDecoration: 'line-through',
      },
      '& [fill]': {
        fill: '#000',
      },
      '& [stroke]': {
        stroke: '#000',
      },
    },
  }
})

export default UploadTreeNode
