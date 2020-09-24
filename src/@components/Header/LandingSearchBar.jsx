import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'

import { Button, TextInput, Spacer } from '@components'
import { useTranslations } from '@hooks'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'

import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import { ReactComponent as MagnifyingGlass } from '@svg/magnifying-glass-header.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md, lg },
  } = theme

  return {
    SearchBar: {
      background: 'white',
      borderRadius: '.5rem',
      width: '100%',
      maxWidth: '44rem',
      position: 'relative',
    },
    SearchBar_Field: {
      alignItems: 'center',
      display: 'flex',
      position: 'relative',
      width: '100%',
      margin: '0 1rem 1rem',
      height: '1rem',
      lineHeight: '1.5rem',

      [md]: {
        margin: 0,
      },

      '& input': {
        border: 'none',
        outline: 'none',
        fontSize: '1rem',
        padding: '0 0 0 .5rem',
        lineHeight: '1rem',
        color: theme.colors.black[500],

        '&::placeholder': {
          fontSize: '.875rem',
          color: theme.colors.grey[500],
          fontWeight: 600,
        },
        '&:focus, &:active': {
          color: theme.variables.colors.textInput,
          '&::placeholder': {
            color: 'transparent',
          },
        },
        '&:-webkit-autofill': {
          '-webkit-box-shadow': `0 0 0px 1000px ${theme.colors.white[400]} inset`,
          '-webkit-text-fill-color': theme.colors.black[500],
          border: 'none',
        },
      },
    },
    SearchBar_Form: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-start',
      minWidth: '18.5rem',
      backgroundColor: theme.colors.white[400],
      borderRadius: '.5rem',

      // [md]: {
      //   width: '60%',
      //   maxWidth: '32rem',
      // },
    },
    SearchBar_FormInput: {
      width: '100%',
    },
    SearchBar_FormInput_active: {
      color: theme.colors.white[400],
      '&::placeholder': {
        color: 'transparent',
      },
    },
    SearchBar_IconWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    SearchBar_SearchIcon: {
      cursor: 'pointer',

      '& path, & polygon': {
        fill: theme.colors.black[500],
      },
    },
    SearchBar_UploadButton: {
      position: 'absolute',
      right: '7.5rem',
      top: '.5rem',

      '& path': {
        stroke: theme.colors.black[500],
        fill: theme.colors.black[500],
      },
    },
    SearchBar_SearchButton: {
      position: 'absolute',
      right: '.375rem',
    },
    SearchBar_UploadBar: {
      width: 18,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      color: theme.colors.gold[500],
      overflow: 'hidden',
      transition: 'width 1.4s',
      whiteSpace: 'nowrap',
      position: 'absolute',
      right: '2.75rem',
      cursor: 'pointer',

      '& path, & polygon': {
        fill: theme.colors.gold[500],
      },

      '&:hover': {
        [lg]: {
          width: '9.5rem',
        },
      },
    },
    SearchBar_UploadBar__expand: {
      [lg]: {
        width: '9.5rem',
      },
    },
    SearchBar_UploadIcon: {
      display: 'flex',
      marginRight: '.5rem',
    },
  }
})

const noop = () => null
const LandingSearchBar = ({ searchMinimized, setMinimizeSearch = noop }) => {
  const { dispatch } = useStoreon()
  const history = useHistory()
  const c = useStyles({ searchMinimized })
  const t = useTranslations({})
  const [searchTerm, setSearchTerm] = useState(undefined)

  const handleSearchSubmit = useCallback(
    e => {
      e.preventDefault()
      if (searchTerm) {
        setMinimizeSearch(true)
        setTimeout(() => {
          history.push(`/search/${encodeURIComponent(searchTerm)}`)
          dispatch(types.CLOSE_OVERLAY)
        }, 1000)
      }
    },
    [dispatch, history, searchTerm, setMinimizeSearch]
  )

  const handleUploadClick = useCallback(() => {
    dispatch(types.OPEN_OVERLAY, { overlayName: 'searchByUpload' })
  }, [dispatch])

  return (
    <div className={c.SearchBar}>
      <Spacer size={'1.25rem'} />
      <form className={c.SearchBar_Form} onSubmit={handleSearchSubmit}>
        <div className={classnames(c.SearchBar_Field)}>
          <div className={c.SearchBar_IconWrapper}>
            <Spacer size={'1.25rem'} />
            <MagnifyingGlass
              className={c.SearchBar_SearchIcon}
              onClick={handleSearchSubmit}
            />
          </div>
          <TextInput
            name='search'
            placeholder={t('header.searchPlaceholderText')}
            className={classnames(c.SearchBar_FormInput, {
              [c.SearchBar_FormInput_active]: searchTerm,
            })}
            onChange={e => {
              setSearchTerm(e.target.value)
            }}
            value={searchTerm || ''}
          />
          <Button className={c.SearchBar_SearchButton} onClick={handleSearchSubmit}>
            <MagnifyingGlass
              title={t('header.searchTextTitle')}
              className={c.SearchBar_SearchIcon}
            />
            <Spacer size={'.5rem'} />
            Search
          </Button>
        </div>
      </form>
      <Button className={c.SearchBar_UploadButton} onClick={handleUploadClick}>
        <UploadIcon />
      </Button>
      <Spacer size={'1.25rem'} />
    </div>
  )
}

export default LandingSearchBar
