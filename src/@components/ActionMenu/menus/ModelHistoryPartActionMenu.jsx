import React, { useMemo } from 'react'
import { ActionMenu } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme
  return {
    ModelHistoryPartActionMenu: {},
    ModelHistoryPartActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    ModelHistoryPartActionMenu__desktop: {
      display: 'none',

      [md_viewer]: {
        display: 'flex',
      },
    },
    ModelHistoryPartActionMenu__mobile: {
      display: 'flex',

      [md_viewer]: {
        display: 'none',
      },
    },
  }
})

const noop = () => null

const MenuTarget = ({ onClick = noop }) => {
  const c = useStyles({})
  return (
    <DotStackIcon
      className={c.ModelHistoryPartActionMenu_ClickableButton}
      onClick={onClick}
    />
  )
}

const ModelHistoryPartActionMenu = (onChange = noop) => {
  const options = useMemo(
    () => [
      {
        label: 'Show Diff',
        value: 'showDiff',
      },
    ],
    []
  )

  const menuProps = useMemo(() => {
    return { onChange, actionBarTitle: '', options, tabletLayout: false }
  }, [onChange, options])

  return (
    <ActionMenu
      MenuComponentProps={menuProps}
      TargetComponent={MenuTarget}
      isCloseOnSelect={true}
      isMobileOnly={true}
    />
  )
}

export default ModelHistoryPartActionMenu
