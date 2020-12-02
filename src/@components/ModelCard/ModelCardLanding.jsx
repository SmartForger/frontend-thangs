import React from 'react'
import { createUseStyles } from '@style'
import ModelCardBase from './ModelCardBase'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { xxl },
  } = theme

  const MQ_DEPEND_PROPS = {
    ModelCard_UserLine: {
      MS: {
        marginBottom: '1rem',
      },
      DS: {
        marginBottom: '1.5rem',
      },
      DB: {
        marginLeft: '1.5rem',
        marginRight: '1.5rem',
        marginTop: '1.375rem',
        marginBottom: '2rem',

        '& > div': {
          width: '1.875rem !important',
          height: '1.875rem !important',
          '& > img': {
            width: '1.875rem !important',
            height: '1.875rem !important',
          },
        },
      }
    },
    ModelCard_Thumbnail: {
      MS: {
        height: '146px !important',
      },
      DS: {
        height: '157px !important',
      },
      DB: {
        height: '270px !important',
      },
    },
    ModelCard_Footer: {
      MS: {
        marginTop: '1rem',
        width: '7.75rem',
      },

      DS: {
        marginTop: '1.5rem',
        width: '11.31rem',
        '& > *:last-child': {
          marginTop: '.375rem',
        },
      },

      DB: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '2rem',
        marginBottom: '1.375rem',
        marginLeft: '1.5rem',
        marginRight: '1.5rem',
        width: 'unset',
        '& > *:last-child': {
          marginTop: 0,
        },
      },
    },
    ModelCard_Name: {
      MS: {
        maxWidth: '7.75rem',
      },

      DS: {
        maxWidth: '11.31rem',
      },

      DB: {
        maxWidth: 'unset',
      },
    },
  }

  return {
    '@keyframes spinner': {
      from: {
        '-moz-transform': 'rotateY(0deg)',
        '-ms-transform': 'rotateY(0deg)',
        transform: 'rotateY(0deg)',
      },
      to: {
        '-moz-transform': 'rotateY(-180deg)',
        '-ms-transform': 'rotateY(-180deg)',
        transform: 'rotateY(-180deg)',
      },
    },
    ModelCard: {
      position: 'relative',
      backgroundColor: theme.variables.colors.cardBackground,
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '.75rem',
      border: `2px solid ${theme.colors.white[900]}`,
      transition: 'all 100ms',

      '&:hover': {
        transition: 'all 400ms',
        boxShadow: '0px 20px 80px rgba(0, 0, 0, 0.2)',
        zIndex: 1,
      },
    },
    ModelCard_UserLine: {
      margin: '1.125rem',
      marginLeft: '1.25rem',
      marginRight: '1.25rem',

      '@media (min-width: 470px)': {
        ...MQ_DEPEND_PROPS.ModelCard_UserLine.DS
      },

      '@media (min-width: 736px)': {
        ...MQ_DEPEND_PROPS.ModelCard_UserLine.MS
      },

      '@media (min-width: 924px)': {
        ...MQ_DEPEND_PROPS.ModelCard_UserLine.DS
      },  

      '@media (min-width: 1096px)': {
        ...MQ_DEPEND_PROPS.ModelCard_UserLine.MS
      },

      [xxl]: {
        ...MQ_DEPEND_PROPS.ModelCard_UserLine.DB
      },
    },
    ModelCard_Thumbnail: {
      margin: 'auto !important',
      padding: '0 !important',
      width: '100%',

      '@media (min-width: 470px)': {
        ...MQ_DEPEND_PROPS.ModelCard_Thumbnail.DS
      },

      '@media (min-width: 736px)': {
        ...MQ_DEPEND_PROPS.ModelCard_Thumbnail.MS
      },

      '@media (min-width: 924px)': {
        ...MQ_DEPEND_PROPS.ModelCard_Thumbnail.DS
      },  

      '@media (min-width: 1096px)': {
        ...MQ_DEPEND_PROPS.ModelCard_Thumbnail.MS
      },

      [xxl]: {
        ...MQ_DEPEND_PROPS.ModelCard_Thumbnail.DB
      },
    },
    ModelCard_Footer: {
      marginLeft: '1.25rem',
      marginRight: '1.25rem',
      marginBottom: '1.125rem',
      '& > *:last-child': {
        marginTop: '.375rem',
      },
      '@media (min-width: 470px)': {
        ...MQ_DEPEND_PROPS.ModelCard_Footer.DS
      },

      '@media (min-width: 736px)': {
        ...MQ_DEPEND_PROPS.ModelCard_Footer.MS
      },

      '@media (min-width: 924px)': {
        ...MQ_DEPEND_PROPS.ModelCard_Footer.DS
      },  

      '@media (min-width: 1096px)': {
        ...MQ_DEPEND_PROPS.ModelCard_Footer.MS
      },

      [xxl]: {
        ...MQ_DEPEND_PROPS.ModelCard_Footer.DB
      },
    },
    ModelCard_Name: {
      fontWeight: 500,
      fontSize: '.875rem',
      color: theme.colors.black[100],

      whiteSpace: 'nowrap',
      lineHeight: '1rem !important',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      '@media (min-width: 470px)': {
        ...MQ_DEPEND_PROPS.ModelCard_Name.DS
      },

      '@media (min-width: 736px)': {
        ...MQ_DEPEND_PROPS.ModelCard_Name.MS
      },

      '@media (min-width: 924px)': {
        ...MQ_DEPEND_PROPS.ModelCard_Name.DS
      },  

      '@media (min-width: 1096px)': {
        ...MQ_DEPEND_PROPS.ModelCard_Name.MS
      },

      [xxl]: {
        ...MQ_DEPEND_PROPS.ModelCard_Name.DB
      },
    },

    ModelCard_LikesAndComments: {
      display: 'flex',
      flexDirection: 'row',

      '& > span:not(:last-child)': {
        marginRight: '1rem',
      },
    },
    ModelCard_ActivityCount: {
      ...theme.text.thumbnailActivityCountText,

      '& svg, & path': {
        fill: theme.colors.purple[900],
      },

      '& > *': {
        marginRight: '.25rem',
      },

      display: 'flex',
      alignItems: 'center',
      letterSpacing: 0,
    },
    ModelCard_Icon__liked: {
      animation: '$spinner 250ms linear 0s 1',

      '-webkit-transform-style': 'preserve-3d',
      '-moz-transform-style': 'preserve-3d',
      '-ms-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d',
    },
    ModelCard_EditModel: {
      position: 'absolute',
      right: '1rem',
      top: '1rem',
    },
  }
})

const ModelCard = (props) => {
  const c = useStyles()
 
  return (
    <ModelCardBase c={c} {...props} />
  )
}

export default ModelCard
