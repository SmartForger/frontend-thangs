<<<<<<< HEAD
import React, { useCallback, useState } from 'react'
=======
import React, { useCallback, useState, useMemo } from 'react'
>>>>>>> 1ea4785... Update components with hooks and export defaults
import { useHistory } from 'react-router-dom'
import { ReactComponent as SearchIcon } from '@svg/search-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    SearchBar: {},
    SearchBar_form: {
      flexGrow: 1,
      backgroundColor: theme.variables.colors.searchBackground,
      borderRadius: '.5rem',
      position: 'relative',
      display: 'flex',
    },
    SearchBar_SearchIcon: {
      position: 'absolute',
      top: '50%',
      left: '1rem',
      transform: 'translateY(-50%)',
      height: '1rem',
      width: '1rem',

      [md]: {
        height: '1.5rem',
        width: '1.5rem',
      },
    },
    SearchBar_input: {
      border: 'none',
      padding: '.5625rem .5rem .5625rem 2.5rem',
      background: 'none',
      width: '100%',
      lineHeight: '1.125rem',

      '&::placeholder': {
        ...theme.mixins.text.inputPlaceholderText,
      },

      [md]: {
        paddingLeft: '3.5rem',
      },
    },
  }
})

const useSearch = (initialSearchQuery = '') => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const history = useHistory()
  const executeSearch = useMemo(() => {
    history.push(`/search/${searchQuery}`)
  }, [history, searchQuery])
  return { searchQuery, setSearchQuery, executeSearch }
}

const SearchBar = ({ className, initialSearchQuery }) => {
  const c = useStyles()
  const { searchQuery, setSearchQuery, executeSearch } = useSearch(initialSearchQuery)

  const handleChange = useCallback(
    e => {
      e.persist()
      setSearchQuery(e.target.value)
    },
    [setSearchQuery]
  )

  const handleSubmit = useCallback(
    e => {
      e.preventDefault()
      executeSearch()
    },
    [executeSearch]
  )

  return (
    <form onSubmit={handleSubmit} className={classnames(className, c.SearchBar_form)}>
      <SearchIcon className={c.SearchBar_SearchIcon} />
      <input
        className={c.SearchBar_input}
        placeholder='Search models by name, description, owner, etc...'
        value={searchQuery}
        onChange={handleChange}
      />
    </form>
  )
}

export default SearchBar
