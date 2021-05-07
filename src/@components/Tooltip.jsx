import React, { useRef, useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'

import { Body } from '@physna/voxel-ui/@atoms/Typography'

import { ContainerRow, Spacer } from '@components'

function useHover() {
  const [value, setValue] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const handleMouseOver = () => setValue(true)
    const handleMouseOut = () => setValue(false)
    const element = ref && ref.current
    if (element) {
      element.addEventListener('mouseenter', handleMouseOver)
      element.addEventListener('mouseleave', handleMouseOut)
      return () => {
        element.removeEventListener('mouseenter', handleMouseOver)
        element.removeEventListener('mouseleave', handleMouseOut)
      }
    }
  }, [ref])
  return [ref, value]
}

const useStyles = createUseStyles(theme => ({
  Tooltip: {
    filter: 'drop-shadow(0 0.125rem 0.75rem rgba(0, 0, 0, 0.2))',
    position: 'absolute',
    width: '18rem',
    visibility: 'hidden',
    opacity: 0,
    zIndex: '2',
  },
  Tooltip_Box: {
    background: theme.colors.white[400],
    borderRadius: '.5rem',
    boxSizing: 'border-box',
    overflowY: 'auto',
    position: 'absolute',
    whiteSpace: 'break-spaces',
  },
  Tooltip_Arrow: {
    background: theme.colors.white[400],
    left: '0.1rem',
    top: '0.25rem',
    height: '0.75rem',
    width: '0.75rem',
    position: 'absolute',
    transform: 'rotate(45deg)',
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

const TooltipOverlay = ({ anchorElement, isOpen, title, tooltipRef }) => {
  const c = useStyles()
  const [isVisible, setIsVisible] = useState(false)

  const transformCalcs = useMemo(() => {
    if (!tooltipRef.current) {
      return null
    }

    const boxPos = { x: 0, y: 0 }
    const arrowPos = { x: 0, y: 0 }
    const rect = tooltipRef.current.getBoundingClientRect()

    boxPos.x = -130 * (rect.width / 288)

    if (rect.bottom > window.innerHeight) {
      boxPos.y = -1 * (rect.height + 42)
      arrowPos.y = -1 * 45
    }

    return [
      { transform: `translate(${boxPos.x}px, ${boxPos.y}px)` },
      { transform: `translate(${arrowPos.x}px, ${arrowPos.y}px) rotate(45deg)` },
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, anchorElement, tooltipRef])

  const [boxStyle, arrowStyle] = transformCalcs || []

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  return createPortal(
    <div className={classnames(c.Tooltip, { [c.Tooltip_isOpen]: isVisible })}>
      <div style={arrowStyle} className={c.Tooltip_Arrow}></div>
      <Spacer size='0.5rem' />
      <div ref={tooltipRef} style={boxStyle} className={c.Tooltip_Box}>
        <Spacer size='0.75rem' />
        <ContainerRow>
          <Spacer size='1rem' />
          <Body multiline>{title}</Body>
          <Spacer size='1rem' />
        </ContainerRow>
        <Spacer size='0.75rem' />
      </div>
    </div>,
    anchorElement
  )
}

const Tooltip = ({ title, children }) => {
  const c = useStyles()
  const boxRef = useRef(null)
  const [targetRef, isOpen] = useHover()

  return (
    <div ref={targetRef} className={c.Tooltip_Container}>
      {children}
      {targetRef.current && (
        <TooltipOverlay
          title={title}
          anchorElement={targetRef.current}
          tooltipRef={boxRef}
          isOpen={isOpen}
        />
      )}
    </div>
  )
}

export default Tooltip
