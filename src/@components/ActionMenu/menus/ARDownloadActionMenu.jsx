import React, { useMemo } from 'react'
import { ActionMenu, Button, Spacer } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as ARIcon } from '@svg/icon-ar.svg'

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
    ARDownloadTarget_Text: {
      textAlign: 'left',
      whiteSpace: 'pre-wrap',

      [md_viewer]: {
        whiteSpace: 'unset',
      },
    },
  }
})

const noop = () => null

const ARDownloadTarget = ({ onClick = noop }) => {
  const c = useStyles({})
  return (
    <Button secondary className={c.ARDownloadTarget} onClick={onClick}>
      <ARIcon />
      <Spacer size={'.5rem'} />
      <span className={c.ARDownloadTarget_Text}>
        Download GLB for AR Viewing (App&nbsp;Required)
      </span>
    </Button>
  )
}

const ARDownloadActionMenu = ({ onChange = noop }) => {
  const options = useMemo(
    () => [
      {
        label: 'Download for Android',
        value: 'android',
      },
      {
        label: 'Download for iOS (Coming Soon)',
        value: 'ios',
      },
    ],
    []
  )

  const menuProps = useMemo(() => {
    return {
      onChange,
      actionBarTitle: 'Download AR Model',
      options,
      tabletLayout: false,
      alignItems: 'center',
    }
  }, [onChange, options])

  return (
    <ActionMenu
      MenuComponentProps={menuProps}
      TargetComponent={ARDownloadTarget}
      isCloseOnSelect={true}
      isMobileOnly={true}
    />
  )
}

export default ARDownloadActionMenu
