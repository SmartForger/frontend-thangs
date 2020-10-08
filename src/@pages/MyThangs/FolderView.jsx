import React, { useMemo } from 'react'
import * as R from 'ramda'
import {
  Button,
  Spacer,
  TitleTertiary,
  Spinner,
  FileTable,
  FolderCard,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as InviteIcon } from '@svg/icon-invite.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-filled.svg'
import classnames from 'classnames'

const useStyles = createUseStyles(_theme => {
  return {
    FolderView: {
      display: 'flex',
      flexDirection: 'row',

      '& > div': {
        flex: 'none',
      },
    },
    FolderView_Content: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '56rem',
    },
    FolderView_Folders: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',

      '& > div': {
        flex: 'none',
        marginTop: '1.5rem',
      },
    },
    FolderView_Row: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    FolderView_Spinner: {
      marginTop: '10rem',
    },
  }
})

const FolderHeader = ({ folder }) => {
  const c = useStyles({})
  return (
    <div className={c.FolderView_Row}>
      <div className={c.FolderView_Row}>
        <FolderIcon />
        <Spacer size={'1rem'} />
        <div className={c.FolderView_Row}>
          <TitleTertiary>{folder.name}</TitleTertiary>
          <Spacer size={'.5rem'} />
          <StarIcon />
        </div>
      </div>
      <Button>
        <InviteIcon />
        <Spacer size={'.5rem'} />
        Invite Users
      </Button>
    </div>
  )
}

const FolderView = ({ className, id, folders }) => {
  const c = useStyles({})
  const folder = useMemo(() => R.find(R.propEq('id', id))(folders.data) || {}, [
    folders,
    id,
  ])

  if (!folder || R.isEmpty(folder)) {
    return (
      <main className={classnames(className, c.FolderView)}>
        <Spinner className={c.FolderView_Spinner} />
      </main>
    )
  }
  const { subfolders = [], name } = folder
  const directSubFolders = subfolders.filter(
    subfolder => !subfolder.name.replace(`${name}//`, '').includes('//')
  )

  return (
    <main className={classnames(className, c.FolderView)}>
      <Spacer size='2rem' />
      <div className={c.FolderView_Content}>
        <Spacer size='2rem' />
        <FolderHeader folder={folder} />
        <Spacer size='4rem' />
        <TitleTertiary>Folders</TitleTertiary>
        <div className={c.FolderView_Folders}>
          {directSubFolders.map((folder, index) => (
            <React.Fragment key={`folder=${folder.id}_${index}`}>
              <FolderCard folder={folder} />
              <Spacer size={'2rem'} />
            </React.Fragment>
          ))}
        </div>
        <Spacer size='4rem' />
        <TitleTertiary>Files</TitleTertiary>
        <Spacer size='2rem' />
        <FileTable models={folder.models}></FileTable>
      </div>
      <Spacer size='2rem' />
    </main>
  )
}

export default FolderView
