import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import classnames from 'classnames'

import { TextInput } from '@components'
import { useOverlay, useTranslations } from '@hooks'
import { createUseStyles } from '@style'

import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import { ReactComponent as SearchIcon } from '@svg/icon-search.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md, lg },
  } = theme

  return {
    SearchBar: {
      width: '100%',
    },
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
          fontSize: '1rem',
          color: theme.colors.grey[500],
          fontWeight: 500,
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
      minWidth: '15rem',
      margin: '0 auto',

      [md]: {
        width: '80%',
        maxWidth: '42rem',
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
  const { setOverlay, setOverlayOpen } = useOverlay()
  const history = useHistory()
  const c = useStyles({})
  const t = useTranslations({})
  const [searchTerm, setSearchTerm] = useState(undefined)
  const [showUploadText, setShowUploadText] = useState(false)

  const handleSearchSubmit = e => {
    e.preventDefault()
    if (searchTerm) {
      history.push(`/search/${encodeURIComponent(searchTerm)}`)
      setOverlayOpen(false)
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
    <div className={c.SearchBar}>
      <form className={c.SearchBar_Form} onSubmit={handleSearchSubmit}>
        <div className={classnames(c.SearchBar_Wrapper)}>
          <SearchIcon
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
                onClick={() => setOverlay({ isOpen: true, template: 'searchByUpload' })}
                title={t('header.searchUploadText')}
              >
                <div className={classnames(c.SearchBar_UploadIcon)}>
                  <UploadIcon />
                </div>
                <span>{t('header.searchUploadText')}</span>
              </div>
              <SearchIcon
                title={t('header.searchTextTitle')}
                className={classnames(
                  c.SearchBar_SearchIcon,
                  c.SearchBar_SearchActionIcon
                )}
                onClick={handleSearchSubmit}
              />
            </>
          )}
        </div>
      </form>
    </div>
  )
}

export default SearchBar
