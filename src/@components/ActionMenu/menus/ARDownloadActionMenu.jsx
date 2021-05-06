import React, { useMemo } from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'

import { ActionMenu, Button } from '@components'

import { ReactComponent as AndroidIcon } from '@svg/icon-android.svg'
import { ReactComponent as AppleIcon } from '@svg/icon-apple.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme
  return {
    ARDownloadActionMenu: {},
    ARDownloadActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    ARDownloadActionMenu__desktop: {
      display: 'none',

      [md_viewer]: {
        display: 'flex',
      },
    },
    ARDownloadActionMenu__mobile: {
      display: 'flex',

      [md_viewer]: {
        display: 'none',
      },
    },
    ARDownloadTarget: {
      width: '100%',

      '& svg': {
        borderRadius: '.25rem',
        minWidth: '34px',
      },
    },
    ARDownloadDropdown_Wrapper: {
      width: '100% !important',
    },
    ARDownload_AndroidIcon: {
      marginTop: '-3px',
    },
    ARDownload_AppleIcon: {
      marginTop: '-5px',
    },
  }
})

const noop = () => null

const ARDownloadTarget = ({ onClick = noop, isLoading }) => {
  const c = useStyles({})
  return (
    <Button secondary className={c.ARDownloadTarget} onClick={onClick}>
      {isLoading ? 'Downloading Augmented Reality...' : 'Download Augmented Reality'}
    </Button>
  )
}

const ARDownloadActionMenu = ({
  onChange = noop,
  TargetComponent = ARDownloadTarget,
  isLoading = false,
}) => {
  const c = useStyles({})
  const options = useMemo(
    () => [
      {
        label: 'Android',
        value: 'android',
        Icon: function AndroidIconWithClass() {
          return <AndroidIcon className={c.ARDownload_AndroidIcon} />
        },
      },
      {
        label: 'iOS',
        value: 'ios',
        Icon: function AppleIconWithClass() {
          return <AppleIcon className={c.ARDownload_AppleIcon} />
        },
      },
    ],
    [c.ARDownload_AndroidIcon, c.ARDownload_AppleIcon]
  )

  const menuProps = useMemo(() => {
    return {
      onChange,
      actionBarTitle: 'Download Augmented Reality',
      options,
      tabletLayout: false,
      alignItems: 'center',
      className: c.ARDownloadDropdown_Wrapper,
    }
  }, [onChange, options, c.ARDownloadDropdown_Wrapper])

  const targetProps = useMemo(
    () => ({
      isLoading,
    }),
    [isLoading]
  )

  return (
    <ActionMenu
      MenuComponentProps={menuProps}
      TargetComponent={TargetComponent}
      TargetComponentProps={targetProps}
      isCloseOnSelect={true}
      isMobileOnly={true}
    />
  )
}

export default ARDownloadActionMenu
