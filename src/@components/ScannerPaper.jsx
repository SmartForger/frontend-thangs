import React from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { MetadataPrimary, SingleLineBodyText } from './Text'

const useStyles = createUseStyles(theme => {
  return {
    ScannerPaper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 170,
      height: 220,
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

const ScannerPaper = ({ polygonCount }) => {
  const c = useStyles()

  return (
    <div className={c.ScannerPaper}>
      <div>
        {polygonCount ? (
          <>
            <SingleLineBodyText>{polygonCount}</SingleLineBodyText>
            <MetadataPrimary>polygons scanned</MetadataPrimary>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default ScannerPaper
