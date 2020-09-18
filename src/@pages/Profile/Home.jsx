import React, { useEffect, useState, useCallback } from 'react'
import * as R from 'ramda'
import {
  Layout,
  WithFlash,
  Spacer,
  Spinner,
  CardCollection,
  ProfilePicture,
  ProfileButton,
  SingleLineBodyText,
} from '@components'
import ModelCards from '@components/CardCollection/ModelCards'
import FolderCards from '@components/CardCollection/FolderCards'
import SearchCards from '@components/CardCollection/SearchCards'
import { Message404 } from '../404'
import { ReactComponent as ModelSquareIcon } from '@svg/model-square-icon.svg'
import { ReactComponent as FolderIcon } from '@svg/folder-icon.svg'
import { ReactComponent as SavedSearchIcon } from '@svg/saved-search-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import useFetchPerMount from '@hooks/useServices/useFetchPerMount'
import { useCurrentUserId, useCurrentUser } from '@hooks'
import * as types from '@constants/storeEventTypes'
import { useFlashNotification } from '@components/Flash'

const useStyles = createUseStyles(theme => {
  return {
    Home: {
      width: '100%',
    },
    Home_TextHeader: {
      ...theme.text.subheaderText,
      display: 'flex',
      alignItems: 'center',
      marginRight: '3.5rem',
      marginBottom: '1.5rem',
    },
    Home_Row: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      textDecoration: ({ selected }) => (selected ? 'underline' : 'none'),

      '&:hover': {
        textDecoration: 'underline',
      },
    },
    Profile_Row: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '3rem',
    },
    Profile_ProfilePicture: {
      marginRight: '.5rem',
    },
    Profile_Name: {
      ...theme.text.subheaderText,
    },
    Profile_ProfileButton: {
      marginTop: '.25rem',
      display: 'block',
    },
    Profile_EditProfileLink: {
      ...theme.text.boldText,
      ...theme.text.linkText,
    },

    Profile_NoContentMessage: {
      ...theme.text.smallHeaderText,
      marginTop: '1.75rem',
    },

    Profile_NoContentMessage__link: {
      ...theme.text.linkText,
    },
  }
})

export * from './EditProfile'
export * from './RedirectProfile'
export * from './Likes'

const CollectionTitle = ({ selected, onClick, className, title, amount }) => {
  const c = useStyles({ selected })
  return (
    <div className={classnames(className, c.Home_Row)} onClick={onClick}>
      <SingleLineBodyText>
        {amount ? [title, amount].join(' ') : title}
      </SingleLineBodyText>
    </div>
  )
}

const ModelsContent = ({ models: modelsAtom }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()

  if (!modelsAtom.isLoaded) {
    return <Spinner />
  }

  if (modelsAtom.isError) {
    return (
      <div data-cy='fetch-profile-error'>
        Error! We were not able to load this profile. Please try again later.
      </div>
    )
  }

  const sortedModels = ((Array.isArray(modelsAtom.data) && modelsAtom.data) || []).sort(
    (modelA, modelB) => {
      if (modelA.created === modelB.created) return 0
      if (modelA.created > modelB.created) return -1
      else return 1
    }
  )

  if (R.isEmpty(sortedModels)) {
    return (
      <div className={c.Profile_NoContentMessage}>
        <a
          href='/#'
          onClick={e => {
            e.preventDefault()
            dispatch(types.OPEN_OVERLAY, {
              overlayName: 'upload',
            })
          }}
        >
          <span className={c.Profile_NoContentMessage__link}>Upload</span>
        </a>{' '}
        your first model to start building your portfolio.
      </div>
    )
  }

  return (
    <CardCollection noResultsText='You have not uploaded any models yet.'>
      <ModelCards items={sortedModels} />
    </CardCollection>
  )
}

const FoldersContent = ({ folders: foldersAtom }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const { navigateWithFlash } = useFlashNotification()
  const folders = R.path(['data'], foldersAtom) || []
  const handleAfterCreate = useCallback(
    folder => {
      dispatch(types.CLOSE_OVERLAY)
      navigateWithFlash(
        `/folder/${folder.folderId}`,
        'Folder created successfully. If the provided unregistered email addresses, they will receive an email with instructions for accessing your folder.'
      )
    },
    [dispatch, navigateWithFlash]
  )

  if (!foldersAtom.isLoaded) {
    return <Spinner />
  }

  if (foldersAtom.isError) {
    return (
      <div data-cy='fetch-profile-error'>
        Error! We were not able to load this profile. Please try again later.
      </div>
    )
  }

  if (R.isEmpty(folders)) {
    return (
      <div className={c.Profile_NoContentMessage}>
        <a
          href='/#'
          onClick={e => {
            e.preventDefault()
            dispatch(types.OPEN_OVERLAY, {
              overlayName: 'createFolder',
              overlayData: {
                afterCreate: handleAfterCreate,
              },
            })
          }}
        >
          <span className={c.Profile_NoContentMessage__link}>Create</span>
        </a>{' '}
        a private shared folder, invite team members, and start collaborating on projects.
      </div>
    )
  }

  return (
    <CardCollection noResultsText='You have not uploaded any folders yet.'>
      <FolderCards items={folders} />
    </CardCollection>
  )
}

const SavedSearchesContent = ({ searchSubscriptions = {} }) => {
  const c = useStyles({})
  if (!searchSubscriptions.isLoaded) {
    return <Spinner />
  }

  if (searchSubscriptions.isError) {
    return (
      <div data-cy='fetch-profile-error'>
        Error! We were not able to load this profile. Please try again later.
      </div>
    )
  }

  if (R.isEmpty(searchSubscriptions.data)) {
    return (
      <div className={c.Profile_NoContentMessage}>
        Get notifications when more results are added by saving your
        <a href='/search'>
          <span className={c.Profile_NoContentMessage__link}>search.</span>
        </a>{' '}
        Find it on the search results page.
      </div>
    )
  }

  return (
    <CardCollection
      cardWidth={'22.5rem'}
      noResultsText='You have not saved and searches yet.'
    >
      <SearchCards items={searchSubscriptions.data} />
    </CardCollection>
  )
}

const PageContent = ({
  currentUserId,
  user = {},
  modelsAtom,
  folders,
  searchSubscriptions,
}) => {
  const c = useStyles({})
  const [selected, setSelected] = useState('models')

  const selectModels = useCallback(() => setSelected('models'), [])
  const selectFolders = useCallback(() => setSelected('folders'), [])
  const selectSearches = useCallback(() => setSelected('savedSearches'), [])

  const TabContent = useCallback(() => {
    switch (selected) {
      case 'models':
        return <ModelsContent models={modelsAtom} />
      case 'folders':
        return <FoldersContent folders={folders} />
      case 'savedSearches':
        return <SavedSearchesContent searchSubscriptions={searchSubscriptions} />
      default:
        return null
    }
  }, [folders, modelsAtom, searchSubscriptions, selected])

  return (
    <div className={c.Home}>
      <div className={c.Profile_Row}>
        <ProfilePicture
          className={c.Profile_ProfilePicture}
          size='5rem'
          src={user.profile && user.profile.avatarUrl}
          name={user.fullName || user.username}
        />
        <div>
          <h1 className={c.Profile_Name}>{user.fullName || user.username}</h1>
          <ProfileButton className={c.Profile_ProfileButton} userId={currentUserId} />
        </div>
      </div>
      <div className={c.Home_TextHeader}>
        <CollectionTitle
          selected={selected === 'models'}
          onClick={selectModels}
          title={'Models'}
          amount={((Array.isArray(modelsAtom.data) && modelsAtom.data) || []).length}
          Icon={ModelSquareIcon}
        />
        <Spacer size={'1.5rem'} />
        <CollectionTitle
          selected={selected === 'folders'}
          onClick={selectFolders}
          title={'Folders'}
          amount={((Array.isArray(folders.data) && folders.data) || []).length}
          Icon={FolderIcon}
        />
        <Spacer size={'1.5rem'} />
        <CollectionTitle
          selected={selected === 'savedSearches'}
          onClick={selectSearches}
          title={'Searches'}
          amount={
            ((Array.isArray(searchSubscriptions.data) && searchSubscriptions.data) || [])
              .length
          }
          Icon={SavedSearchIcon}
        />
      </div>
      <WithFlash>
        <TabContent />
      </WithFlash>
    </div>
  )
}

const Page = () => {
  const {
    atom: { isLoading, isError, data: user },
  } = useCurrentUser()
  const currentUserId = useCurrentUserId()
  const { atom: modelsAtom = {} } = useFetchPerMount(currentUserId, 'user-own-models')
  const { dispatch, folders, searchSubscriptions } = useStoreon(
    'folders',
    'searchSubscriptions'
  )
  useEffect(() => {
    dispatch(types.FETCH_FOLDERS)
    dispatch(types.FETCH_SUBSCRIPTIONS)
  }, [dispatch])

  if (isLoading) {
    return <Spinner />
  }

  if (isError) {
    return (
      <div data-cy='fetch-profile-error'>
        Error! We were not able to load this profile. Please try again later.
      </div>
    )
  }

  if (!user) {
    return (
      <div data-cy='fetch-profile-error'>
        <Message404 />
      </div>
    )
  }

  return (
    <PageContent
      user={user}
      currentUserId={currentUserId}
      folders={folders}
      modelsAtom={modelsAtom}
      searchSubscriptions={searchSubscriptions}
    />
  )
}

export const Home = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}
