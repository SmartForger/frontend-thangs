import React, { useRef, useState } from 'react'
import { LandingCard, Spacer } from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { xxxl },
  } = theme
  return {
    Carousel_Wrapper: {
      width: 'calc(100% + 4rem)',
      position: 'absolute',
      overflowY: 'scroll',
      margin: '0 -2rem',

      '&::-webkit-scrollbar': {
        width: 0,
        background: 'transparent',
      },

      [xxxl]: {
        overflowY: 'visible',
        display: 'flex',
        justifyContent: 'center',
      },
    },
    Carousel: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: '2rem',
      cursor: 'grab',

      [xxxl]: {
        marginLeft: '0',
      },
    },
    Carousel__dragging: {
      cursor: 'grabbing',
      userSelect: 'none',
    },
    Carousel_CardWrapper: {
      display: 'flex',
      flexDirection: 'row',
    },
    Carousel_Card: {
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.16)',
      borderRadius: '.75rem',
      backgroundColor: theme.colors.white[400],
    },
    Carousel_LastCardSpacer: {
      [xxxl]: {
        display: 'none',
      },
    },
  }
})

const Carousel = ({ className, cards = [] }) => {
  const c = useStyles({})
  const carouselRef = useRef()
  const [active, setActive] = useState(false)
  const [initialX, setInitialX] = useState()
  const [xOffset, setXOffset] = useState(0)

  const pauseEvent = (e = {}) => {
    if (e.stopPropagation) e.stopPropagation()
    if (e.preventDefault) e.preventDefault()
    e.cancelBubble = true
    e.returnValue = false
    return false
  }

  const dragStart = e => {
    if (!e) {
      e = window.event
    }
    if (e.target && e.target.nodeName === 'IMG') {
      e.preventDefault()
    } else if (e.srcElement && e.srcElement.nodeName === 'IMG') {
      e.returnValue = false
    }
    setInitialX(e.clientX + carouselRef.current.scrollLeft)
    setActive(true)
    pauseEvent(e)
  }

  const dragEnd = e => {
    if (!e) {
      e = window.event
    }
    setActive(false)
    var start = 1,
      animate = () => {
        var step = Math.sin(start)
        if (step <= 0) {
          window.cancelAnimationFrame(animate)
        } else {
          carouselRef.current.scrollLeft += xOffset * step
          start -= 0.02
          window.requestAnimationFrame(animate)
        }
      }
    animate()
  }

  const drag = e => {
    if (active === true) {
      if (!e) {
        e = window.event
      }
      const diffX = initialX - (e.clientX + carouselRef.current.scrollLeft)
      carouselRef.current.scrollLeft += diffX
      setXOffset(diffX)
    }
    pauseEvent(e)
  }

  return (
    <div
      ref={carouselRef}
      onMouseDown={dragStart}
      onMouseUp={dragEnd}
      onMouseMove={drag}
      onTouchStart={dragStart}
      onTouchEnd={dragEnd}
      onTouchMove={drag}
      className={classnames(className, c.Carousel_Wrapper)}
    >
      <ul className={classnames(c.Carousel, { [c.Carousel__dragging]: active })}>
        {cards.map((card, ind) => {
          return (
            <li className={c.Carousel_CardWrapper} key={`CarouselCard_${ind}`}>
              <div className={c.Carousel_Card}>
                <LandingCard card={card} />
              </div>
              <Spacer
                size={'2.25rem'}
                className={classnames({
                  [c.Carousel_LastCardSpacer]: cards.length - 1 === ind,
                })}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Carousel
