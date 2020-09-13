import React from 'react'
import classnames from 'classnames'
import { ReactComponent as FolderIcon } from '@svg/folder-icon.svg'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    FolderIcon: {
      ...theme.text.regularText,
      padding: '1rem',
    },
    FolderInfo_Row: {
      display: 'flex',
    },
    FolderInfo_Subtext: {
      ...theme.text.cardSubtext,
      display: 'flex',
      marginTop: '.25rem',
      fontSize: '.875rem',

      '& > div + div': {
        marginLeft: '.25rem',
      },
    },
    FolderInfo_Icon: {
      color: theme.colors.blue[500],
      marginRight: '1rem',
      marginTop: '.25rem',
    },
    FolderInfo_Name__Bold: {
      ...theme.text.smallHeaderText,
    },
  }
})

const FolderInfo = ({
  name,
  members = [],
  models = [],
  boldName,
  hideModels,
  className,
}) => {
  const c = useStyles()
  return (
    <div className={classnames(className, c.FolderIcon)}>
      <div className={c.FolderInfo_Row}>
        <FolderIcon className={c.FolderInfo_Icon} />
        <div>
          <div className={classnames({ [c.FolderInfo_Name__Bold]: boldName })}>
            {name}
          </div>
          <div className={c.FolderInfo_Subtext}>
            {!hideModels && (
              <div>
                {models.length} Model
                {models.length !== 1 && 's'}
              </div>
            )}
            <div>
              {members.length} Member
              {members.length !== 1 && 's'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FolderInfo
