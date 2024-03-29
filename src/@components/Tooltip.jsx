import React, { useRef, useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'

import { Body } from '@physna/voxel-ui/@atoms/Typography'

import { ContainerColumn, ContainerRow, Spacer } from '@components'
import { useHover } from '@hooks'
import IconTooltipArrow from '@svg/IconTooltipArrow'

export const TooltipPlacements = {
  top: 'top',
  bottom: 'bottom',
  bottomLeft: 'bottomLeft',
  left: 'left',
  right: 'right',
}

const useStyles = createUseStyles(theme => ({
  Tooltip: {
    filter: 'drop-shadow(0 0.125rem 0.75rem rgba(0, 0, 0, 0.2))',
    left: ({ placement }) => (placement === TooltipPlacements.right ? 0 : 'auto'),
    opacity: 0,
    position: 'absolute',
    right: ({ placement }) => (placement === TooltipPlacements.left ? 0 : 'auto'),
    top: 0,
    visibility: 'hidden',
    zIndex: '2',
  },
  Tooltip_Box: {
    background: theme.colors.white[400],
    borderRadius: '.5rem',
    boxSizing: 'border-box',
    overflowY: 'auto',
    whiteSpace: 'nowrap',
  },
  Tooltip_Arrow: {
    flex: '0 0 auto',
    transform: ({ placement }) =>
      placement === TooltipPlacements.right
        ? 'translate(2px, 0px) rotate(270deg)'
        : placement === TooltipPlacements.left
          ? 'translate(-2px, 0px) rotate(90deg)'
          : 'translate(0px, 0px) rotate(0deg)',
  },
  Tooltip_Container: {
    position: 'relative',
    width: 'fit-content',
  },
  Tooltip_isOpen: {
    opacity: 1,
    visibility: 'visible',
  },
}))

const TooltipOverlay = ({
  anchorElement,
  isOpen,
  title,
  tooltipRef,
  defaultPlacement = TooltipPlacements.bottom,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [placement, setPlacement] = useState(defaultPlacement)
  const [arrowOffset, setArrowOffset] = useState(0)
  const c = useStyles({ placement })

  const transformCalcs = useMemo(() => {
    if (!tooltipRef.current) {
      return null
    }

    const boxPos = { x: 0, y: 0 }
    const rect = tooltipRef.current.getBoundingClientRect()

    if (defaultPlacement === TooltipPlacements.top && rect.top < 0) {
      setPlacement(TooltipPlacements.bottom)
    }

    if (
      defaultPlacement === TooltipPlacements.bottom &&
      rect.bottom > window.innerHeight
    ) {
      setPlacement(TooltipPlacements.top)
    }

    if (defaultPlacement === TooltipPlacements.left && rect.left < 0) {
      setPlacement(TooltipPlacements.right)
    }

    if (defaultPlacement === TooltipPlacements.right && rect.right > window.innerWidth) {
      setPlacement(TooltipPlacements.left)
    }

    if (placement === TooltipPlacements.bottom) {
      boxPos.x = -1 * (rect.width / 2) + anchorElement.clientWidth / 2
      boxPos.y = anchorElement.clientHeight
    }
    if (placement === TooltipPlacements.bottomLeft) {
      boxPos.x = -1 * rect.width + anchorElement.clientWidth
      boxPos.y = anchorElement.clientHeight
      setArrowOffset(anchorElement.clientWidth / 2 - 6)
    }
    if (placement === TooltipPlacements.top) {
      boxPos.x = -1 * (rect.width / 2) + anchorElement.clientWidth / 2
      boxPos.y = -1 * (rect.height + anchorElement.clientHeight)
    }
    if (placement === TooltipPlacements.right) {
      boxPos.x = anchorElement.clientWidth
      boxPos.y = -1 * (rect.height / 2) + anchorElement.clientHeight / 2
    }
    if (placement === TooltipPlacements.left) {
      boxPos.x = -1 * anchorElement.clientWidth
      boxPos.y = -1 * (rect.height / 2) + anchorElement.clientHeight / 2
    }

    return {
      transform: `translate(${boxPos.x}px, ${boxPos.y}px)`,
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, anchorElement, tooltipRef, window.innerHeight, window.innerWidth])

  const boxStyle = transformCalcs || []

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  const TooltipWrapper = ({ children, style, ref }) => {
    if (
      placement === TooltipPlacements.bottom ||
      placement === TooltipPlacements.bottomLeft ||
      placement === TooltipPlacements.top
    ) {
      return (
        <ContainerColumn
          alignItems={placement === TooltipPlacements.bottomLeft ? 'left' : 'center'}
          elementRef={ref}
          reverse={placement === TooltipPlacements.top}
          style={style}
        >
          {children}
        </ContainerColumn>
      )
    } else {
      return (
        <ContainerRow
          alignItems='center'
          elementRef={ref}
          reverse={placement === TooltipPlacements.left}
          style={style}
        >
          {children}
        </ContainerRow>
      )
    }
  }
  if (!title) return null
  return createPortal(
    <div
      className={classnames(c.Tooltip, { [c.Tooltip_isOpen]: isVisible })}
      style={boxStyle}
    >
      <TooltipWrapper>
        <Spacer size='0.5rem' />
        <ContainerRow justifyContent={'flex-end'}>
          <Spacer width={`${arrowOffset}px`} height={0} />
          <IconTooltipArrow className={c.Tooltip_Arrow}></IconTooltipArrow>
          <Spacer width={`${arrowOffset}px`} height={0} />
        </ContainerRow>
        <div className={c.Tooltip_Box} ref={tooltipRef}>
          <Spacer size='0.75rem' />
          <ContainerRow>
            <Spacer size='1rem' />
            <Body multiline>{title}</Body>
            <Spacer size='1rem' />
          </ContainerRow>
          <Spacer size='0.75rem' />
        </div>
      </TooltipWrapper>
    </div>,
    anchorElement
  )
}

const Tooltip = ({ className, title, children, defaultPlacement }) => {
  const c = useStyles({})
  const boxRef = useRef(null)
  const [targetRef, isOpen] = useHover()

  return (
    <div ref={targetRef} className={classnames(className, c.Tooltip_Container)}>
      {children}
      {targetRef.current && (
        <TooltipOverlay
          title={title}
          anchorElement={targetRef.current}
          tooltipRef={boxRef}
          isOpen={isOpen}
          defaultPlacement={defaultPlacement}
        />
      )}
    </div>
  )
}

export default Tooltip
