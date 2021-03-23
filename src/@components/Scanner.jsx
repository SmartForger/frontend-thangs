import React from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'

const useStyles = createUseStyles(theme => {
  return {
    '@keyframes scan': {
      '100%': { top: '95%' },
    },

    '@keyframes dash': {
      '0%': {
        strokeDasharray: '1, 150',
        strokeDashoffset: '0',
      },
      '50%': {
        strokeDasharray: '90, 150',
        strokeDashoffset: '-35',
      },
      '100%': {
        strokeDasharray: '90, 150',
        strokeDashoffset: '-124',
      },
    },

    Scanner: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },

    Scanner_line: {
      position: 'absolute',
      top: '5%',
      left: '-5%',
      width: '110%',
      height: '2px',
      background: theme.colors.gold[500],
      boxShadow: '0px 0px 8px rgba(255, 188, 0, 0.75)',
      borderRadius: 1,
      animation: '$scan 1.5s infinite alternate ease-in-out',
      zIndex: '20',
    },
    Scanner_container: {
      position: 'relative',
      width: '75vw',
      maxWidth: 400,
      paddingBottom: '100%',
      marginBottom: 24,
      border: `1px dashed ${theme.colors.grey[100]}`,
      borderRadius: 16,
    },

    Scanner_corner__postion_absolute: {
      position: 'absolute',
    },

    Scanner_corner_tl: { top: -2, left: -2 },
    Scanner_corner_tr: { top: -4, right: 0, transform: 'rotate(90deg)' },
    Scanner_corner_br: { bottom: -2, right: -2, transform: 'rotate(180deg)' },
    Scanner_corner_bl: { bottom: -5, left: -1, transform: 'rotate(-90deg)' },

    Scanner_content: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    Scanner_detail: {
      textAlign: 'center',
    },
  }
})

const SvgCorner = () => (
  <svg width='58' height='58' viewBox='0 0 58 58' fill='none'>
    <path d='M2 58V18C2 9.16344 9.16344 2 18 2H58' stroke='#232530' strokeWidth='3' />
  </svg>
)

const Scanner = ({ children, polygonCount }) => {
  const c = useStyles()

  return (
    <div className={c.Scanner}>
      <div className={c.Scanner_container}>
        <div
          className={classnames(c.Scanner_corner_tl, c.Scanner_corner__postion_absolute)}
        >
          <SvgCorner />
        </div>
        <div
          className={classnames(c.Scanner_corner_tr, c.Scanner_corner__postion_absolute)}
        >
          <SvgCorner />
        </div>
        <div
          className={classnames(c.Scanner_corner_br, c.Scanner_corner__postion_absolute)}
        >
          <SvgCorner />
        </div>
        <div
          className={classnames(c.Scanner_corner_bl, c.Scanner_corner__postion_absolute)}
        >
          <SvgCorner />
        </div>

        <div className={c.Scanner_content}>{children}</div>

        <div className={c.Scanner_line}></div>
      </div>
      <div className={c.Scanner_detail}>Scanning geometry...</div>
      {polygonCount ? (
        <div className={c.Scanner_detail}>{polygonCount} polygons scanned</div>
      ) : null}
    </div>
  )
}

export default Scanner
