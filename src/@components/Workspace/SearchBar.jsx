import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'

import { TextInput } from '@components'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'

import { ReactComponent as SearchIcon } from '@svg/icon-search.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    SearchBar: {
      width: '30rem',
    },
    SearchBar_Wrapper: {
      alignItems: 'center',
      display: 'flex',
      position: 'relative',
      margin: '0 1rem 1rem',
      background: theme.colors.white[600],
      borderRadius: '.5rem',
      width: '100%',

      [md]: {
        margin: 0,
      },

      '& input': {
        background: theme.colors.white[600],
        border: 'none',
        outline: 'none',
        fontSize: '1rem',
        padding: '.75rem .75rem .75rem 2.25rem',
        lineHeight: '1.5rem',

        '&::placeholder': {
          fontSize: '1rem',
          color: theme.colors.grey[300],
          fontWeight: 500,
          lineHeight: '1rem',
        },
        '&:focus, &:active': {
          background: theme.colors.white[600],
          color: theme.colors.grey[300],
          '&::placeholder': {
            color: 'transparent',
          },
        },
        '&:-webkit-autofill': {
          '-webkit-box-shadow': `0 0 0px 1000px ${theme.colors.white[600]} inset`,
          '-webkit-text-fill-color': theme.colors.grey[300],
          border: 'none',
        },
      },
    },
    SearchBar_Form: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    SearchBar_FormInput: {},
    SearchBar_FormInput_active: {
      color: theme.colors.grey[300],
      '&::placeholder': {
        color: 'transparent',
      },
    },
    SearchBar_SearchIcon: {
      cursor: 'pointer',

      '& path, & polygon': {
        fill: theme.colors.grey[300],
      },
    },
    SearchBar_FormIcon: {
      position: 'absolute',
      left: '.75rem',
      '& path, & polygon': {
        fill: theme.colors.grey[300],
      },
    },
    SearchBar_SearchActionIcon: {
      position: 'absolute',
      right: '.75rem',
      cursor: 'pointer',
    },
  }
})

const SearchBar = () => {
  const { dispatch } = useStoreon()
  const history = useHistory()
  const c = useStyles({})
  const [searchTerm, setSearchTerm] = useState(undefined)

  const handleSearchSubmit = e => {
    e.preventDefault()
    if (searchTerm) {
      history.push(`/search/${encodeURIComponent(searchTerm)}`)
      dispatch(types.CLOSE_OVERLAY)
    }
  }

  return (
    <div className={c.SearchBar}>
      <form className={c.SearchBar_Form} onSubmit={handleSearchSubmit}>
        <div className={classnames(c.SearchBar_Wrapper)}>
          <SearchIcon
            className={classnames(c.SearchBar_SearchIcon, c.SearchBar_FormIcon)}
            onClick={handleSearchSubmit}
          />
          <TextInput
            name='search'
            placeholder={'Search to find your models'}
            className={classnames(c.SearchBar_FormInput, {
              [c.SearchBar_FormInput_active]: searchTerm,
            })}
            onChange={e => {
              setSearchTerm(e.target.value)
            }}
            value={searchTerm || ''}
          />
        </div>
      </form>
    </div>
  )
}

export default SearchBar
