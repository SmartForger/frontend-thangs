import React from 'react'
import cn from 'classnames'
import { createUseStyles } from '@style'
import { SingleLineBodyText, Spacer } from '@components'
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
    },
    UploadTreeItem_OpenIcon: {
      marginRight: '0.5rem',
    },
    UploadTreeItem_FileName: {
      textOverflow: 'ellipsis',
      width: '16rem',
      overflow: 'hidden',
      lineHeight: '1rem !important',
      '&.missing': {
        color: '#DA7069',
      },
      '&.skipped': {
        color: '#999',
        textDecoration: 'line-through',
      },
    },
    UploadTreeItem_Actions: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  }
})

const UploadTreeItem = ({ file, level }) => {
  const c = useStyles()

  return (
    <div className={c.UploadTreeItem_Root}>
      <div style={{ width: 1.5 * level + 'rem' }} />
      {file.isAssembly ? (
        <>
          {level > 0 && <Spacer size={'1.25rem'} />}
          <FileIcon />
        </>
      ) : (
        <>
          <TreeOpenIcon className={c.UploadTreeItem_OpenIcon} />
          <ModelIcon />
        </>
      )}
      <Spacer size={'0.5rem'} />
      <SingleLineBodyText
        className={cn(c.UploadModels_FileName, {
          missing: file.valid && !file.skipped,
          skipped: file.valid && file.skipped,
        })}
        title={file.name}
      >
        {file.name}
      </SingleLineBodyText>
      <Spacer size={'0.5rem'} />
      <div className={c.UploadTreeItem_Actions}>
        <CheckIcon />
        <Spacer size={'0.5rem'} />
        <TrashCanIcon />
      </div>
    </div>
  )
}

export default UploadTreeItem
