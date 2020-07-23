import React from 'react'
import { useTrail } from 'react-spring'
import { Tag } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    TagsBox: {
      display: 'flex',
      flexFlow: 'row wrap',
      alignContent: 'flex-start',
      background: theme.colors.white[500],
      padding: '.5rem',
      borderRadius: '.25rem',
    },
  }
})

export const TagsBox = ({ items }) => {
  const c = useStyles()
  const config = { mass: 4, tension: 2000, friction: 95 }
  const [trail] = useTrail(items.length, () => ({
    config,
    to: { opacity: 1, transform: 'translate(0,0)' },
    from: { opacity: 0, transform: 'translate(0,1000%)' },
  }))

  return (
    <div className={c.TagsBox}>
      {/* <button onClick={Bounce}>Bounce</button> */}
      {trail.map((tag, index) => (
        <Tag key={index}>{items[index].name}</Tag>
      ))}
    </div>
  )
}
