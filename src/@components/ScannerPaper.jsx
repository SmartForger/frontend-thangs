import React from 'react'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    ScannerPaper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 150,
      height: 190,
      background: theme.colors.white[100],
      border: `1px solid ${theme.colors.grey[100]}`,
      borderRadius: 4,
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
      '& p': {
        margin: 0,
        color: theme.colors.grey[300],
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
  }
})

const ScannerPaper = ({ facetsAmount }) => {
  const c = useStyles()

  return (
    <div className={c.ScannerPaper}>
      <div>
        {facetsAmount ? (
          <>
            <div>{facetsAmount}</div>
            <p>facets scanned</p>
          </>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}

export default ScannerPaper
