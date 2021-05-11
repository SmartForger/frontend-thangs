import React, { useMemo } from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'

import { ActionMenu, Slider } from '@components'
import { ReactComponent as ExplodeIcon } from '@svg/icon-explode.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme
  return {
    ExplodeDropdown_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    ExplodeDropdown__desktop: {
      display: 'none',

      [md_viewer]: {
        display: 'flex',
      },
    },
    ExplodeDropdown__mobile: {
      display: 'flex',

      [md_viewer]: {
        display: 'none',
      },
    },
    ExplodeMenu: {
      padding: '0 0.75rem',
    },
    ExplodeDropdownMenu: {
      bottom: '3rem !important',
      marginLeft: '-4rem',
    },
  }
})

const noop = () => null

const ExplodeTarget = ({ onClick = noop }) => {
  const c = useStyles({})

  return (
    <div className={c.ExplodeDropdown_ClickableButton} onClick={onClick}>
      <Metadata type={MetadataType.secondary} className={c.ExplodeDropdown__desktop}>
        Explode
      </Metadata>
      <ExplodeIcon className={c.ExplodeDropdown__mobile} />
    </div>
  )
}

const ExplodeMenu = ({
  onSliderChange = noop,
  onSliderEnd = noop,
  selectedValue: magnitude,
  key,
}) => {
  const c = useStyles()

  return (
    <div className={c.ExplodeMenu}>
      <Slider
        key={key}
        onChangeCommitted={(ev, value) => onSliderEnd(value)}
        onChange={(ev, value) => onSliderChange(value)}
        value={magnitude}
      />
    </div>
  )
}

const ExplodeActionMenu = ({
  onSliderChange = noop,
  onSliderEnd = noop,
  selectedValue,
  key,
}) => {
  const c = useStyles({})

  const menuProps = useMemo(() => {
    return {
      onSliderChange,
      onSliderEnd,
      selectedValue,
      key,
      className: c.ExplodeDropdownMenu,
    }
  }, [c.ExplodeDropdownMenu, key, onSliderChange, onSliderEnd, selectedValue])

  const targetProps = useMemo(() => {
    return { selectedValue }
  }, [selectedValue])

  return (
    <ActionMenu
      MenuComponent={ExplodeMenu}
      MenuComponentProps={menuProps}
      TargetComponent={ExplodeTarget}
      TargetComponentProps={targetProps}
      isMobileActionBarActive={false}
      isAutoClosed={false}
      isExternalClosed={true}
    />
  )
}

export default ExplodeActionMenu
