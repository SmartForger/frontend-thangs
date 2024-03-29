// https://stackoverflow.com/questions/48523058/encoding-uri-using-link-of-react-router-dom-not-working

import React, { useCallback, useRef, useState } from 'react'
import * as R from 'ramda'
import { useHistory } from 'react-router-dom'
import classnames from 'classnames'

import { Button, TextInput, Spacer } from '@components'
import { useFileUpload, useTranslations } from '@hooks'
import { useOverlay } from '@contexts/Overlay'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { track } from '@utilities/analytics'

import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import { ReactComponent as SearchIcon } from '@svg/icon-search.svg'
import { ReactComponent as SnackbarUploadIcon } from '@svg/snackbar-upload.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md, lg },
  } = theme

  return {
    LandingSearchBar: {
      maxWidth: '44rem',
      opacity: '1',
      position: 'relative',
      top: 0,
      transition: 'all 450ms',
      width: '100%',
      zIndex: '1',
    },

    LandingSearchBar_minimized: {
      opacity: '1',
      top: 0,
    },

    LandingSearchBar_Upload: {
      alignItems: 'center',
      background: theme.colors.white[400],
      borderRadius: '0 0 .5rem .5rem',
      borderTop: `1px solid ${theme.colors.white[900]}`,
      boxShadow: '0px .5rem 1.25rem rgba(0, 0, 0, 0.16)',
      color: theme.colors.black[500],
      display: 'flex',
      height: '5.5rem',
      justifyContent: 'center',
      position: 'absolute',
      top: '3.5rem',
      width: '100%',
      ...theme.text.viewerLoadingText,
    },
    LandingSearchBar_Upload__DragOvered: {
      background: theme.colors.blue[100],
    },
    LandingUpload_Button: {
      display: 'inline',
    },
    LandingUpload_Link: {
      ...theme.text.linkText,
      cursor: 'pointer',
    },
    LandingUpload_Text: {
      cursor: 'default',
    },
    LandingUpload_UploadIcon: {
      marginRight: '1rem',
      '& path': {
        fill: theme.colors.black[500],
      },
    },
    SearchBar: {
      background: 'white',
      borderRadius: '.5rem',
      width: '100%',
      position: 'relative',
    },
    SearchBar__withBottom: {
      borderRadius: '.5rem .5rem 0 0',
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
          fontSize: '1rem',
          color: theme.colors.grey[500],
          fontWeight: '500',
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
    },
    SearchBar_FormInput: {
      textOverflow: 'ellipsis',
      width: 'calc(100% - 190px)',
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
      right: '7.25rem',
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
      width: '1.125rem',
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

const SearchBar = ({
  className,
  setMinimizeSearch = noop,
  onChange,
  searchBarRef,
  ...props
}) => {
  const { setOverlay, setOverlayOpen } = useOverlay()
  const history = useHistory()
  const c = useStyles({})
  const t = useTranslations({})
  const [searchTerm, setSearchTerm] = useState(undefined)

  const handleSearchSubmit = useCallback(
    e => {
      e.preventDefault()
      if (searchTerm) {
        setMinimizeSearch(true)
        setTimeout(() => {
          history.push(`/search/${encodeURIComponent(encodeURIComponent(searchTerm))}`)
          if (setOverlayOpen) {
            setOverlayOpen(false)
          }
        }, 1000)
      }
    },
    [setOverlayOpen, history, searchTerm, setMinimizeSearch]
  )

  const handleUploadClick = useCallback(() => {
    setOverlay({ isOpen: true, template: 'searchByUpload' })
    track('Upload - Searchbar', { source: 'Searchbar - Upload Icon' })
  }, [setOverlay])

  return (
    <div className={classnames(c.SearchBar, className)}>
      <Spacer size={'1.25rem'} />
      <form
        className={c.SearchBar_Form}
        onSubmit={handleSearchSubmit}
        data-cy='landing-search-form'
      >
        <div className={classnames(c.SearchBar_Field)}>
          <div className={c.SearchBar_IconWrapper}>
            <Spacer size={'1.25rem'} />
            <SearchIcon className={c.SearchBar_SearchIcon} onClick={handleSearchSubmit} />
          </div>
          <TextInput
            name='search'
            placeholder={t('header.searchPlaceholderText')}
            inputRef={searchBarRef}
            className={classnames(c.SearchBar_FormInput, {
              [c.SearchBar_FormInput_active]: searchTerm,
            })}
            onChange={e => {
              setSearchTerm(e.target.value)
              onChange && onChange(e)
            }}
            value={searchTerm || ''}
            {...props}
          />
          <Button className={c.SearchBar_SearchButton} onClick={handleSearchSubmit}>
            <SearchIcon
              title={t('header.searchTextTitle')}
              className={c.SearchBar_SearchIcon}
            />
            <Spacer size={'.5rem'} />
            Search
          </Button>
        </div>
      </form>
      <Button tertiary className={c.SearchBar_UploadButton} onClick={handleUploadClick}>
        <UploadIcon />
      </Button>
      <Spacer size={'1.25rem'} />
    </div>
  )
}

const LandingSearchBar = ({ searchBarRef, searchMinimized, setMinimizeSearch }) => {
  const c = useStyles({ searchMinimized })
  const [isUploadOpened, setIsUploadOpened] = useState(false)
  const [isDragOvered, setIsDragOvered] = useState(false)
  const { setOverlay } = useOverlay()
  const uploadContainer = useRef(null)
  const searchBarContainer = useRef(null)
  const handleUploadClick = useCallback(() => {
    setOverlay({
      isOpen: true,
      template: 'searchByUpload',
      data: { isExplorerOpened: true },
    })
    track('Upload - Searchbar', { source: 'Dropdown - Upload Icon' })
  }, [setOverlay])

  const handleSetFile = useCallback(
    (file, errorState) => {
      setOverlay({
        isOpen: true,
        template: 'searchByUpload',
        data: { file, errorState },
      })
      track('Upload - Searchbar', { source: 'Dropdown - Drag and Drop' })
    },
    [setOverlay]
  )

  const { UploadZone } = useFileUpload({
    onSetFile: handleSetFile,
    noClick: true,
  })

  const openUpload = () => {
    document.addEventListener('click', handleClickOutside, true)
    setIsUploadOpened(true)
  }

  const closeUpload = () => {
    document.removeEventListener('click', handleClickOutside, true)
    setIsUploadOpened(false)
    setIsDragOvered(false)
  }

  const setCurtain = state => {
    const HeaderCurtain = document.getElementById('HeaderDesktopOnlyCurtain')
    if (HeaderCurtain) {
      HeaderCurtain.style.display = state ? 'unset' : 'none'
    }
  }

  const handleClickOutside = event => {
    const isTargetSearchBar =
      searchBarContainer.current && searchBarContainer.current.contains(event.target)
    const isTargetUploadInput =
      uploadContainer.current && uploadContainer.current.contains(event.target)

    if (!isTargetSearchBar && !isTargetUploadInput) {
      setCurtain(false)
      closeUpload()
    }
  }

  const handleSearchBarFocus = event => {
    setCurtain(true)
    if (!isUploadOpened) {
      searchBarContainer.current = event.target
      openUpload()
    }
  }

  return (
    <div
      className={classnames(c.LandingSearchBar, {
        [c.LandingSearchBar_minimized]: searchMinimized,
      })}
    >
      <SearchBar
        data-cy='landing-search-input'
        className={classnames(isUploadOpened && c.SearchBar__withBottom)}
        searchBarRef={searchBarRef}
        setMinimizeSearch={setMinimizeSearch}
        onFocus={handleSearchBarFocus}
        onChange={e => {
          const value = R.path(['target', 'value'], e) || ''
          if (value) {
            closeUpload()
          } else {
            openUpload()
          }
        }}
        autoComplete='off'
      />

      {isUploadOpened && (
        <UploadZone>
          <div
            data-cy='landing-search-upload-bar'
            className={classnames(
              c.LandingSearchBar_Upload,
              isDragOvered && c.LandingSearchBar_Upload__DragOvered
            )}
            ref={uploadContainer}
            onDragOver={event => {
              event.preventDefault()
              setIsDragOvered(true)
            }}
            onDragLeave={event => {
              event.preventDefault()
              setIsDragOvered(false)
            }}
          >
            <div className={classnames(c.LandingUpload_UploadIcon)}>
              <SnackbarUploadIcon />
            </div>

            <div className={c.LandingUpload_Text}>
              <span className={c.LandingUpload_Link} onClick={handleUploadClick}>
                Upload
              </span>{' '}
              or drag and drop a file (e.g., .stl) here to do a geometric search.
            </div>
          </div>
        </UploadZone>
      )}
    </div>
  )
}

export default LandingSearchBar
