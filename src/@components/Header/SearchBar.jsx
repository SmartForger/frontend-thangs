// https://stackoverflow.com/questions/48523058/encoding-uri-using-link-of-react-router-dom-not-working

import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import classnames from 'classnames'

import TextInput from '@components/TextInput'
import useTranslations from '@hooks/useTranslations'
import useQuery from '@hooks/useQuery'
import { useOverlay } from '@contexts/Overlay'
import { createUseStyles } from '@physna/voxel-ui/@style'

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
      background: theme.colors.purple[800],
      borderRadius: '.5rem',
      display: 'flex',
      margin: '0 1rem 1rem',
      position: 'relative',
      width: '100%',

      [md]: {
        margin: 0,
      },

      '& input': {
        background: theme.colors.purple[800],
        border: 'none',
        fontSize: '1rem',
        lineHeight: '1.5rem',
        outline: 'none',
        padding: '.5rem .75rem .5rem 2.25rem',

        '&::placeholder': {
          color: theme.colors.grey[500],
          fontSize: '1rem',
          fontWeight: '500',
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
      justifyContent: 'flex-start',
      margin: '0 auto',
      minWidth: '15rem',
      width: '100%',

      [md]: {
        width: '80%',
        maxWidth: '42rem',
      },
    },
    SearchBar_FormInput: {
      textOverflow: 'ellipsis',
      width: 'calc(100% - 60px)',
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
      cursor: 'pointer',
      position: 'absolute',
      right: '.75rem',
    },
    SearchBar_UploadBar: {
      alignItems: 'center',
      color: theme.colors.gold[500],
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden',
      position: 'absolute',
      right: '2.75rem',
      transition: 'width 1.4s',
      whiteSpace: 'nowrap',
      width: '1.125rem',

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
  const filter = useQuery('filter') || ''

  const handleSearchSubmit = useCallback(
    e => {
      e.preventDefault()
      if (searchTerm) {
        history.push(
          `/search/${encodeURIComponent(encodeURIComponent(searchTerm))}?filter=${filter}`
        )
        setOverlayOpen(false)
      }
    },
    [filter, history, searchTerm, setOverlayOpen]
  )

  const handleSearchByModel = useCallback(() => {
    setOverlay({ isOpen: true, template: 'searchByUpload' })
  }, [setOverlay])

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
      clearTimeout(timeout1)
      clearTimeout(timeout2)
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
                onClick={handleSearchByModel}
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
