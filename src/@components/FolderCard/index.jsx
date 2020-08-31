import React from 'react'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { Card, FolderInfo } from '@components'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    FolderCard: {},
    FolderCard_CardContents: {
      gridArea: 'info',
      borderRadius: '.5rem .5rem 0 0',
      height: 'auto !important',
      flexDirection: 'row !important',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    FolderCard_UploadIcon: {
      padding: '1.5rem',
      fill: theme.colors.gold[500],
    },
  }
})

const CardContents = ({ className, folder }) => {
  const { dispatch } = useStoreon()
  const c = useStyles()
  return (
    <Card className={classnames(className, c.FolderCard_CardContents)}>
      <FolderInfo name={folder.name} members={folder.members} models={folder.models} />
      <div
        className={c.FolderCard_UploadIcon}
        onClick={e => {
          e.preventDefault()
          dispatch(types.OPEN_OVERLAY, {
            modalName: 'upload',
            modalData: { folderId: folder.id },
          })
        }}
      >
        <UploadIcon />
      </div>
    </Card>
  )
}

const FolderCard = ({ folder }) => {
  return (
    <Link to={`/folder/${folder.id}`}>
      <CardContents folder={folder} />
    </Link>
  )
}

export default FolderCard
