import React, { useRef, useState } from 'react'
import { LandingCard, Spacer } from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as RightArrowIcon } from '@svg/icon-right-caret.svg'
import { ReactComponent as LeftArrowIcon } from '@svg/icon-left-caret.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { xl },
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

      [xl]: {
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

      [xl]: {
        marginLeft: '0',
        cursor: 'default',
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
      [xl]: {
        display: 'none',
      },
    },
    Carousel_RightArrow: {
      width: '3rem',
      height: '3rem',
      position: 'absolute',
      right: '0',
      bottom: '2.5rem',
      backgroundColor: 'white',
      borderRadius: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid black',
      filter: 'drop-shadow(0px 2px 12px rgba(0, 0, 0, .6))',

      [xl]: {
        display: 'none',
      },
    },
    Carousel_LeftArrow: {
      width: '3rem',
      height: '3rem',
      position: 'absolute',
      left: '0',
      bottom: '2.5rem',
      backgroundColor: 'white',
      borderRadius: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid black',
      filter: 'drop-shadow(0px 2px 12px rgba(0, 0, 0, .6))',

      [xl]: {
        display: 'none',
      },
    },
  }
})

const Carousel = ({ className, cards = [] }) => {
  const c = useStyles({})
  const carouselRef = useRef()
  // const [active, setActive] = useState(false)
  // const [initialX, setInitialX] = useState()
  // const [xOffset, setXOffset] = useState(0)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // const pauseEvent = (e = {}) => {
  //   if (e.stopPropagation) e.stopPropagation()
  //   if (e.preventDefault) e.preventDefault()
  //   e.cancelBubble = true
  //   e.returnValue = false
  //   return false
  // }

  // const dragStart = e => {
  //   if (!e) {
  //     e = window.event
  //   }
  //   if (e.target && e.target.nodeName === 'IMG') {
  //     e.preventDefault()
  //   } else if (e.srcElement && e.srcElement.nodeName === 'IMG') {
  //     e.returnValue = false
  //   }
  //   setInitialX(e.clientX + carouselRef.current.scrollLeft)
  //   setActive(true)
  //   pauseEvent(e)
  // }

  // const dragEnd = e => {
  //   if (!e) {
  //     e = window.event
  //   }
  //   setActive(false)
  //   let start = 1,
  //     animate = () => {
  //       const step = Math.sin(start)
  //       if (step <= 0) {
  //         window.cancelAnimationFrame(animate)
  //       } else {
  //         carouselRef.current.scrollLeft += xOffset * step
  //         start -= 0.02
  //         window.requestAnimationFrame(animate)
  //       }
  //     }
  //   animate()
  // }

  // const drag = e => {
  //   if (active === true) {
  //     if (!e) {
  //       e = window.event
  //     }
  //     const diffX = initialX - (e.clientX + carouselRef.current.scrollLeft)
  //     carouselRef.current.scrollLeft += diffX
  //     setXOffset(diffX)
  //   }
  //   pauseEvent(e)
  // }

  const handleRightArrowClick = () => {
    const maxScrollWidth =
      carouselRef.current.scrollWidth - carouselRef.current.clientWidth
    let start = 1,
      animate = () => {
        const step = Math.sin(start)
        if (step <= 0) {
          window.cancelAnimationFrame(animate)
        } else {
          carouselRef.current.scrollLeft += 20 * step
          start -= 0.02
          window.requestAnimationFrame(animate)
        }

        if (carouselRef.current.scrollLeft > 0) {
          setShowLeftArrow(true)
        }

        if (carouselRef.current.scrollLeft >= maxScrollWidth) {
          setShowRightArrow(false)
        }
      }
    animate()
  }

  const handleLeftArrowClick = () => {
    const maxScrollWidth =
      carouselRef.current.scrollWidth - carouselRef.current.clientWidth
    let start = 1,
      animate = () => {
        const step = Math.sin(start)
        if (step <= 0) {
          window.cancelAnimationFrame(animate)
        } else {
          carouselRef.current.scrollLeft += -20 * step
          start -= 0.02
          window.requestAnimationFrame(animate)
        }

        if (carouselRef.current.scrollLeft <= 0) {
          setShowLeftArrow(false)
        }
        if (carouselRef.current.scrollLeft < maxScrollWidth) {
          setShowRightArrow(true)
        }
      }
    animate()
  }

  return (
    <>
      <div ref={carouselRef} className={classnames(className, c.Carousel_Wrapper)}>
        <ul className={classnames(c.Carousel)}>
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
      {showRightArrow && (
        <div className={c.Carousel_RightArrow} onClick={handleRightArrowClick}>
          <RightArrowIcon />
        </div>
      )}
      {showLeftArrow && (
        <div className={c.Carousel_LeftArrow} onClick={handleLeftArrowClick}>
          <LeftArrowIcon />
        </div>
      )}
    </>
  )
}

export default Carousel
