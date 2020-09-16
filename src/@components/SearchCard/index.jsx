import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import {
  Checkbox,
  Divider,
  Spacer,
  SingleLineBodyText,
  TitleTertiary,
  Pill,
} from '@components'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(_theme => {
  return {
    SearchCard: {
      position: 'relative',
    },
    SearchCard_RemoveButton: {
      display: 'none',

      '&:hover': {
        display: 'flex',
      },
    },
  }
})

const SearchCard = ({ className, search }) => {
  const c = useStyles()
  const { dispatch } = useStoreon()
  const [enabled, setEnabled] = useState(search.enabled)

  const handleToggle = useCallback(() => {
    if (enabled) {
      dispatch(types.DISABLE_SUBSCRIPTION, { id: search.id })
      setEnabled(false)
    } else {
      dispatch(types.ENABLE_SUBSCRIPTION, { id: search.id })
      setEnabled(true)
    }
  }, [dispatch, enabled, search])

  const handleDelete = useCallback(() => {
    dispatch(types.DELETE_SUBSCRIPTION, { id: search.id })
  }, [dispatch, search])

  const handleSearch = useCallback(() => {
    dispatch(types.READ_SUBSCRIPTION, { id: search.id })
  }, [dispatch, search])

  return (
    <div className={classnames(className, c.SearchCard)}>
      <Spacer size='1.5rem' />
      <div>
        <Spacer size='1.5rem' />
        <div>
          <Link to={'/search'} onClick={handleSearch}>
            <div>
              <TitleTertiary>SearchTerm/ModelId</TitleTertiary>
              <Spacer size='.5rem' />
              {search.new && <Pill>New</Pill>}
            </div>
          </Link>
          <div className={c.SearchCard_RemoveButton}>
            Remove <TrashCanIcon onClick={handleDelete} />
          </div>
        </div>
        <Spacer size='.75rem' />
        <p>Text Search</p>
        <Spacer size='.75rem' />
        <Divider />
        <Spacer size='.75rem' />
        <div>
          <SingleLineBodyText>Get notified of new models</SingleLineBodyText>
          <Checkbox checked={enabled} onClick={handleToggle} />
        </div>
        <Spacer size='.75rem' />
      </div>
      <Spacer size='1.5rem' />
    </div>
  )
}

export default SearchCard
