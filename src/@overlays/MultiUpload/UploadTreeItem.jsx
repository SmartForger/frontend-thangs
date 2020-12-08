import React from 'react'
import cn from 'classnames'
import { createUseStyles } from '@style'
import { SingleLineBodyText, Spacer, Spinner } from '@components'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as ModelIcon } from '@svg/icon-model.svg'
import { ReactComponent as TreeOpenIcon } from '@svg/icon-tree-open.svg'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import { ReactComponent as CheckIcon } from '@svg/icon-check.svg'

const useStyles = createUseStyles(theme => {
  return {
    UploadTreeItem_Root: {
      paddingBottom: '1rem',
      paddingTop: '1rem',
      borderBottom: `1px solid ${theme.variables.colors.border}`,
      color: '#000',
      display: 'flex',
      alignItems: 'center',

      '&.missing': {
        '& $UploadTreeItem_FileName': {
          color: '#DA7069',
        },
        '& path[fill]': {
          fill: '#DA7069',
        },
        '& path[stroke]': {
          stroke: '#DA7069',
        },
      },
      '&.skipped': {
        '& $UploadTreeItem_FileName': {
          color: '#999',
          textDecoration: 'line-through',
        },
        '& path[fill]': {
          fill: '#999',
        },
        '& path[stroke]': {
          stroke: '#999',
        },
      },
    },
    UploadTreeItem_OpenIcon: {
      marginRight: '0.5rem',
    },
    UploadTreeItem_FileName: {
      textOverflow: 'ellipsis',
      width: '16rem',
      overflow: 'hidden',
      lineHeight: '1rem !important',
    },
    UploadTreeItem_Actions: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  }
})

const UploadTreeItem = ({ file, level, onSkip, onRemove }) => {
  const c = useStyles()

  const handleRemove = () => {
    onRemove(file.name)
  }

  const handleSkip = () => {
    onSkip([file.name])
  }

  console.log(file.name, file.valid, file.skipped)

  return (
    <div
      className={cn(c.UploadTreeItem_Root, {
        missing: !file.valid && !file.skipped,
        skipped: !file.valid && file.skipped,
      })}
    >
      <div style={{ width: 3 * level - 1.5 + 'rem' }} />
      {file.isAssembly ? (
        <>
          {level > 0 && <Spacer size={'1.25rem'} />}
          {file.loading ? <Spinner size={'1rem'} /> : <FileIcon />}
        </>
      ) : (
        <>
          {level > 0 && <TreeOpenIcon className={c.UploadTreeItem_OpenIcon} />}
          {file.loading ? <Spinner size={'1rem'} /> : <ModelIcon />}
        </>
      )}
      <Spacer size={'0.5rem'} />
      <SingleLineBodyText className={c.UploadTreeItem_FileName} title={file.name}>
        {file.name}
      </SingleLineBodyText>
      <Spacer size={'0.5rem'} />
      <div className={c.UploadTreeItem_Actions}>
        {!file.skipped && !file.valid && <CheckIcon onClick={handleSkip} />}
        <Spacer size={'0.5rem'} />
        {level === 0 && <TrashCanIcon onClick={handleRemove} />}
      </div>
    </div>
  )
}

export default UploadTreeItem
