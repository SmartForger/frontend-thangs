import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    ProgressText: {
      textAlign: 'left',
    },
  }
})

export function ProgressText({ text, className }) {
  const c = useStyles()
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (dots.length < 3) {
        setDots(`${dots}.`)
      } else {
        setDots('.')
      }
    }, 500)
    return () => clearTimeout(timeout)
  }, [dots, setDots])

  return (
    <div className={classnames(className, c.ProgressText)}>
      {text}
      {dots}
    </div>
  )
}
