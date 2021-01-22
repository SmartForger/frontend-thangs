import React, { useMemo } from 'react'
import { ActionMenu, Slider, MetadataSecondary } from '@components'
import { createUseStyles } from '@style'
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
  }
})

const noop = () => null

const ExplodeTarget = ({ onClick = noop }) => {
  const c = useStyles({})

  return (
    <div className={c.ExplodeDropdown_ClickableButton} onClick={onClick}>
      <MetadataSecondary className={c.ExplodeDropdown__desktop}>
        Explode
      </MetadataSecondary>
      <ExplodeIcon className={c.ExplodeDropdown__mobile} />
    </div>
  )
}

const ExplodeMenu = ({
  onChange = noop,
  onSliderEnd = noop,
  selectedValue: magnitude,
  key,
}) => {
  return (
    <Slider
      key={key}
      onChangeCommitted={onSliderEnd}
      onChange={onChange}
      value={magnitude}
    />
  )
}

const ExplodeActionMenu = ({
  onChange = noop,
  onSliderEnd = noop,
  selectedValue,
  key,
}) => {
  const menuProps = useMemo(() => {
    return { onChange, onSliderEnd, selectedValue, key }
  }, [key, onChange, onSliderEnd, selectedValue])

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
