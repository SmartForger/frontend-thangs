import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import {
  Checkbox,
  Divider,
  Spacer,
  SingleLineBodyText,
  MultiLineBodyText,
  TitleTertiary,
  Pill,
} from '@components'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { lg },
  } = theme

  return {
    SearchCard: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: theme.colors.white[400],
      borderRadius: '.5rem',
      '&:hover': {
        '& div > span': {
          [lg]: {
            opacity: 1,
          },
        },

        '& a h3': {
          textDecoration: 'underline',
        },
      },
    },
    SearchCard_Content: {
      width: '100%',
    },
    SearchCard_TopRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    SearchCard_Title: {
      display: 'flex',
      flexDirection: 'row',
      height: '1.875rem',
    },
    SearchCard_RemoveButton: {
      cursor: 'pointer',

      [lg]: {
        opacity: 0,
      },
    },
    SearchCard_SearchType: {
      color: theme.colors.grey[300],
    },
    SearchCard_ToggleBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  }
})

const SearchCard = ({ className, search = {} }) => {
  const c = useStyles()
  const { dispatch } = useStoreon()
  const {
    attachmentId,
    id,
    isActive,
    newResultCount = 10,
    phyndexerId,
    searchTerm = 'model',
  } = search
  const [enabled, setEnabled] = useState(isActive)

  const handleToggle = useCallback(
    e => {
      if (e && e.target && e.target.checked) {
        dispatch(types.ENABLE_SUBSCRIPTION, { id })
        setEnabled(true)
      } else {
        dispatch(types.DISABLE_SUBSCRIPTION, { id })
        setEnabled(false)
      }
    },
    [dispatch, id]
  )

  const handleDelete = useCallback(() => {
    dispatch(types.DELETE_SUBSCRIPTION, { id })
  }, [dispatch, id])

  const handleSearch = useCallback(() => {
    dispatch(types.READ_SUBSCRIPTION, { id })
  }, [dispatch, id])

  return (
    <div className={classnames(className, c.SearchCard)}>
      <Spacer size='1.5rem' />
      <div className={c.SearchCard_Content}>
        <Spacer size='1.5rem' />
        <div className={c.SearchCard_TopRow}>
          <Link
            to={`/search/${searchTerm ? searchTerm : 'model'}${
              attachmentId ? `?modelId=${attachmentId}&phynId=${phyndexerId}` : ''
            }`}
            onClick={handleSearch}
          >
            <div className={c.SearchCard_Title}>
              <TitleTertiary>
                {attachmentId ? `#${attachmentId}` : searchTerm}
              </TitleTertiary>
              <Spacer size='.5rem' />
              {newResultCount > 0 && (
                <>
                  <Pill>{newResultCount} New</Pill>
                  <Spacer size='.5rem' />
                </>
              )}
            </div>
          </Link>
          <span className={c.SearchCard_RemoveButton} onClick={handleDelete}>
            <MultiLineBodyText>
              Remove
              <Spacer size={'.5rem'} />
              <TrashCanIcon />
            </MultiLineBodyText>
          </span>
        </div>
        <Spacer size='.75rem' />
        <MultiLineBodyText className={c.SearchCard_SearchType}>
          {attachmentId ? 'Model Search' : 'Text Search'}
        </MultiLineBodyText>
        <Spacer size='.75rem' />
        <Divider spacing={0} />
        <Spacer size='1rem' />
        <div className={c.SearchCard_ToggleBar}>
          <SingleLineBodyText>Get notified of new models</SingleLineBodyText>
          <Checkbox checked={enabled} onChange={handleToggle} />
        </div>
        <Spacer size='1rem' />
      </div>
      <Spacer size='1.5rem' />
    </div>
  )
}

export default SearchCard
