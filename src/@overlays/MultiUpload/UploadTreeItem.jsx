import React from 'react'
import cn from 'classnames'
import { createUseStyles } from '@style'
import { SingleLineBodyText, Spacer, Spinner, MetadataSecondary } from '@components'
import { formatBytes } from '@utilities'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as ModelIcon } from '@svg/icon-model.svg'
import { ReactComponent as TreeOpenIcon } from '@svg/icon-tree-open.svg'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import { ReactComponent as InfoIcon } from '@svg/icon-info.svg'

const useStyles = createUseStyles(theme => {
  return {
    UploadTreeItem_Root: {
      paddingBottom: '.75rem',
      paddingTop: '.75rem',
      borderBottom: `1px solid ${theme.variables.colors.border}`,
      color: '#000',
      display: 'flex',
      alignItems: 'center',

      '&.missing': {
        '& $UploadTreeItem_FileName': {
          color: '#DA7069',
        },
        '& $UploadTreeItem_Icon [fill]': {
          fill: '#DA7069',
        },
        '& $UploadTreeItem_Icon [stroke]': {
          stroke: '#DA7069',
        },
      },
      '&.skipped': {
        '& $UploadTreeItem_FileName': {
          color: '#999',
          textDecoration: 'line-through',
        },
        '& $UploadTreeItem_Icon [fill]': {
          fill: '#999',
        },
        '& $UploadTreeItem_Icon [stroke]': {
          stroke: '#999',
        },
      },
    },
    UploadTreeItem_OpenIcon: {
      marginRight: '0.5rem',
    },
    UploadTreeItem_Icon: {},
    UploadTreeItem_FileName: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      lineHeight: '1rem !important',
    },
    UploadTreeItem_Actions: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    UploadTreeItem_Button: {
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

const UploadTreeItem = ({ file, onSkip, onRemove }) => {
  const c = useStyles()

  const handleRemove = () => {
    onRemove(file.name)
  }

  const handleSkip = () => {
    onSkip(file.name)
  }

  return (
    <div
      className={cn(c.UploadTreeItem_Root, {
        missing: !file.loading && !file.valid && !file.skipped,
        skipped: !file.loading && !file.valid && file.skipped,
      })}
    >
      <div style={{ width: 3 * file.level - 1.5 + 'rem' }} />
      {file.isAssembly ? (
        <>
          {file.level > 0 && <Spacer size={'1.25rem'} />}
          {file.loading ? (
            <Spinner size={'1rem'} />
          ) : !file.valid ? (
            <InfoIcon className={c.UploadTreeItem_Icon} />
          ) : (
            <FileIcon className={c.UploadTreeItem_Icon} />
          )}
        </>
      ) : (
        <>
          {file.level > 0 && <TreeOpenIcon className={c.UploadTreeItem_OpenIcon} />}
          {file.loading ? (
            <Spinner size={'1rem'} />
          ) : !file.valid ? (
            <InfoIcon className={c.UploadTreeItem_Icon} />
          ) : (
            <ModelIcon className={c.UploadTreeItem_Icon} />
          )}
        </>
      )}
      <Spacer width={'0.5rem'} />
      <SingleLineBodyText className={c.UploadTreeItem_FileName} title={file.name}>
        {file.name}
      </SingleLineBodyText>
      {file.size && (
        <>
          <Spacer width={'0.5rem'} />
          <MetadataSecondary>{formatBytes(file.size)}</MetadataSecondary>
        </>
      )}
      <Spacer size={'0.5rem'} />
      <div className={c.UploadTreeItem_Actions}>
        {!file.loading && !file.skipped && !file.valid && (
          <UploadIcon
            className={c.UploadTreeItem_Button}
            className={c.UploadTreeItem_Button}
            onClick={handleSkip}
          />
        )}
        {file.level === 0 && (
          <TrashCanIcon className={c.UploadTreeItem_Button} onClick={handleRemove} />
        )}
      </div>
    </div>
  )
}

export default UploadTreeItem
