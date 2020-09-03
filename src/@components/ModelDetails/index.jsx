import React from 'react'
import * as R from 'ramda'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    ModelDetails: {
      borderSpacing: '.5rem 0',
      margin: '0 -.5rem',
    },
    ModelDetails_Cell: {
      padding: 0,
      lineHeight: '1rem',
      verticalAlign: 'middle',
    },
    ModelDetails_FirstCell: {
      ...theme.mixins.text.modelDetailsLabelText,
      height: '1.5rem',
      textTransform: 'uppercase',
    },
    ModelDetails_SecondCell: {
      paddingBottom: 1,
    },
  }
})

const title = R.replace(/(^|\s)\S/g, R.toUpper)
const titleCase = R.pipe(R.toLower, title)

const AttrRow = ({ name, value }) => {
  const c = useStyles()
  if (!value || !name) {
    return null
  }

  return (
    <tr>
      <td className={classnames(c.Cell, c.FirstCell)}>{name}</td>
      <td className={classnames(c.Cell, c.SecondCell)}>{value}</td>
    </tr>
  )
}

const ModelDetails = ({ model, className }) => {
  const c = useStyles()
  const { category, material, weight, height } = model
  if (!category && !material && !weight && !height) return null
  return (
    <table className={classnames(className, c.ModelDetails)}>
      <tbody>
        <AttrRow name='Material' value={model.material} />
        <AttrRow name='Weight' value={model.weight} />
        <AttrRow name='Height' value={model.height} />
        <AttrRow name='Category' value={category && titleCase(category)} />
      </tbody>
    </table>
  )
}

export default ModelDetails
