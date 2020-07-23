import React from 'react'
import { animated } from 'react-spring'
import { Link } from 'react-router-dom'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    ModelDisplay: {
      width: '11.5rem',
      height: '8.5rem',
      background: ({ imgURL }) => imgURL || theme.color.white[400],
      margin: '.5rem',
      borderRadius: '2%',
      textAlign: 'center',
      boxShadow: 'inset 0 0 0 3px black',
    },
    ModelDisplay_LinkBox: {
      textDecoration: 'none',
      transition: 'all 0.2s',

      '&:hover': {
        transform: 'scale(0.9)',
      },
    },
    ModelDisplay_ModelName: {
      textAlign: 'center',
    },
  }
})

const ModelDisplay = ({
  imgURL,
  model,
  style, // This prop is used to attach react-spring animations
}) => {
  const c = useStyles({ imgURL })
  const LinkBox = animated(Link)
  return (
    <LinkBox
      className={c.ModelDisplay_LinkBox}
      to={`/model/${model.id}`}
      style={style}
      data-cy='profile-model-link'
    >
      <animated.div className={c.ModelDisplay} />
      <div className={c.ModelDisplay_ModelName}>{model.name}</div>
    </LinkBox>
  )
}

export { ModelDisplay }
