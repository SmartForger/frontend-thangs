import React from 'react'
import cn from 'classnames'
import { Spacer, SingleLineBodyText, Spinner, Tooltip } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as InfoIcon } from '@svg/icon-info.svg'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import { ReactComponent as ModelIcon } from '@svg/icon-model.svg'

const UploadTreeNode = ({ node }) => {
  const c = useStyles()

  return (
    <div
      className={cn(c.UploadTreeNode, {
        missing: !node.loading && !node.valid,
      })}
    >
      {node.loading ? (
        <Spinner size={'1rem'} />
      ) : !node.valid ? (
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
    </div>
  )
}

const useStyles = createUseStyles(theme => {
  return {
    UploadTreeNode: {
      display: 'flex',
      alignItems: 'center',
      height: '2.5rem',

      '&.missing': {
        '& $UploadTreeItem_FileName': {
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
  }
})

export default UploadTreeNode
