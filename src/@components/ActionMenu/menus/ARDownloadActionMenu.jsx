import React, { useMemo } from 'react'
import { ActionMenu, Button, Spacer } from '@components'
import { createUseStyles } from '@style'
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
      Download AR Model
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
