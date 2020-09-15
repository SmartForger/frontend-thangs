import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'

import { TextInput } from '@components'
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
    SearchBar: {},
    SearchBar_Wrapper: {
      alignItems: 'center',
      display: 'flex',
      position: 'relative',
      width: '100%',
      margin: '0 1rem 1rem',
      background: theme.colors.purple[800],
      borderRadius: '.5rem',

      [md]: {
        margin: 0,
      },

      '& input': {
        background: theme.colors.purple[800],
        border: 'none',
        outline: 'none',
        fontSize: '1rem',
        padding: '.5rem .75rem .5rem 2.25rem',
        lineHeight: '1.5rem',

        '&::placeholder': {
          fontSize: '.875rem',
          color: theme.colors.grey[500],
          fontWeight: 600,
        },
        '&:focus, &:active': {
          background: theme.colors.purple[800],
          color: theme.colors.white[400],
          '&::placeholder': {
            color: 'transparent',
          },
        },
        '&:-webkit-autofill': {
          '-webkit-box-shadow': `0 0 0px 1000px ${theme.colors.purple[800]} inset`,
          '-webkit-text-fill-color': theme.colors.white[400],
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

      [md]: {
        width: '60%',
        maxWidth: '32rem',
      },
    },
    SearchBar_FormInput: {
      width: '100%',
      [md]: {
        width: '80%',
      },
    },
    SearchBar_FormInput_active: {
      color: theme.colors.white[400],
      '&::placeholder': {
        color: 'transparent',
      },
    },
    SearchBar_SearchIcon: {
      cursor: 'pointer',

      '& path, & polygon': {
        fill: theme.colors.gold[500],
      },
    },
    SearchBar_FormIcon: {
      position: 'absolute',
      left: '.75rem',
      '& path, & polygon': {
        fill: theme.colors.white[400],
      },
    },
    SearchBar_SearchActionIcon: {
      position: 'absolute',
      right: '.75rem',
      cursor: 'pointer',
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

const SearchBar = ({ showSearchTextFlash = false, isMobile }) => {
  const { dispatch } = useStoreon()
  const history = useHistory()
  const c = useStyles({})
  const t = useTranslations({})
  const [searchTerm, setSearchTerm] = useState(undefined)
  const [showUploadText, setShowUploadText] = useState(false)

  const handleSearchSubmit = e => {
    e.preventDefault()
    if (searchTerm) {
      history.push(`/search/${encodeURIComponent(searchTerm)}`)
      dispatch(types.CLOSE_OVERLAY)
    }
  }

  useEffect(() => {
    let timeout1, timeout2
    if (showSearchTextFlash) {
      timeout1 = setTimeout(() => {
        setShowUploadText(true)
        timeout2 = setTimeout(() => {
          setShowUploadText(false)
        }, 4000)
      }, 500)
    }

    return () => {
      clearTimeout(timeout2)
      clearTimeout(timeout1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <form className={c.SearchBar_Form} onSubmit={handleSearchSubmit}>
      <div className={classnames(c.SearchBar_Wrapper)}>
        <MagnifyingGlass
          className={classnames(c.SearchBar_SearchIcon, c.SearchBar_FormIcon)}
          onClick={handleSearchSubmit}
        />
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
        {!isMobile && (
          <>
            <div
              className={classnames(c.SearchBar_UploadBar, {
                [c.SearchBar_UploadBar__expand]: showUploadText,
              })}
              onClick={() =>
                dispatch(types.OPEN_OVERLAY, { overlayName: 'searchByUpload' })
              }
              title={t('header.searchUploadText')}
            >
              <div className={classnames(c.SearchBar_UploadIcon)}>
                <UploadIcon />
              </div>
              <span>{t('header.searchUploadText')}</span>
            </div>
            <MagnifyingGlass
              title={t('header.searchTextTitle')}
              className={classnames(c.SearchBar_SearchIcon, c.SearchBar_SearchActionIcon)}
              onClick={handleSearchSubmit}
            />
          </>
        )}
      </div>
    </form>
  )
}

export default SearchBar
