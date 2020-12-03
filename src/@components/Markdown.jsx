import React from 'react'
import ReactMarkdown from 'react-markdown'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    Markdown: {
      '& p': {
        margin: '0',

        '& ~ p': {
          marginTop: '.5rem',
        },
      },
    },
  }
})

const allowedTypes = [
  'link',
  'blockquote',
  'thematicBreak',
  'strong',
  'emphasis',
  'paragraph',
  'break',
  'text',
]

const Markdown = ({ children, className }) => {
  const c = useStyles()
  return (
    <ReactMarkdown
      source={children}
      allowedTypes={allowedTypes}
      unwrapDisallowed
      linkTarget={'_blank'}
      className={classnames(className, c.Markdown)}
    />
  )
}

export default Markdown
