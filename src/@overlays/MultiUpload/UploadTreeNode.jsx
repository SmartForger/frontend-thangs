import React from 'react'
import cn from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body, Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'

import { Spacer, Spinner, Tooltip } from '@components'
import { formatBytes } from '@utilities'

import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as InfoIcon } from '@svg/icon-info.svg'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import { ReactComponent as ModelIcon } from '@svg/icon-model.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    UploadTreeNode: {
      display: 'flex',
      alignItems: 'center',
      height: '2.5rem',
      flex: 1,
      minWidth: 0,

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

      '& > svg': {
        flex: 'none',
      },
    },
    UploadTreeNode_FileWrapper: {
      display: 'flex',
      alignItems: 'center',
    },
    UploadTreeNode_FileName: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      lineHeight: '1rem !important',
      maxWidth: '11rem',

      [md]: {
        maxWidth: '14rem',
      },
    },
    UploadTreeNode_Icon: {
      '& [fill]': {
        fill: '#000',
      },
      '& [stroke]': {
        stroke: '#000',
      },
    },
    UploadTreeNode_Actions: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    UploadTreeNode_Button: {
      cursor: 'pointer',
      marginRight: '0.5rem',
      '& [fill]': {
        fill: theme.colors.white[900],
      },
      '& [stroke]': {
        stroke: theme.colors.white[900],
      },

      '&:hover': {
        '& [fill]': {
          fill: theme.colors.grey[300],
        },
        '& [stroke]': {
          stroke: theme.colors.grey[300],
        },
      },
    },
  }
})

const UploadTreeNode = ({ node, level: _l, onUpload, onRemove, isLoading }) => {
  const c = useStyles()

  const handleRemove = () => {
    onRemove(node)
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
      <div className={c.UploadTreeNode_FileWrapper}>
        <Body className={c.UploadTreeNode_FileName} title={node.name}>
          {node.id === 'multipart' && !node.name ? 'Multipart Model' : node.name}
        </Body>
        {node.size && (
          <>
            <Spacer width={'0.5rem'} />
            <Metadata type={MetadataType.secondary}>
              {isLoading ? 'validating...' : formatBytes(node.size)}
            </Metadata>
          </>
        )}
      </div>
      <Spacer size={'0.5rem'} />
      <div className={c.UploadTreeNode_Actions}>
        {!node.loading && !node.valid ? (
          <UploadIcon className={c.UploadTreeNode_Button} onClick={onUpload} />
        ) : !isLoading ? (
          <TrashCanIcon className={c.UploadTreeNode_Button} onClick={handleRemove} />
        ) : null}
      </div>
    </div>
  )
}

export default UploadTreeNode
