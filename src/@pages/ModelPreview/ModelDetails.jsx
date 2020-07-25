import React from 'react'
import * as R from 'ramda'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    ModelDetails: {},
    ModelDetails_Table: {
      borderSpacing: '.5rem 0',
      margin: '0 -.5rem',
    },
    ModelDetails_Cell: {
      padding: 0,
      lineHeight: '1rem',
      verticalAlign: 'middle',
    },
    ModelDetails_Cell__first: {
      ...theme.mixins.text.modelDetailsLabelText,
      height: '1.5rem',
      textTransform: 'uppercase',
    },
    ModelDetails_Cell__second: {
      paddingBottom: 1,
    },
  }
})

const title = R.replace(/(^|\s)\S/g, R.toUpper)
const titleCase = R.pipe(R.toLower, title)

export const ModelDetails = ({ model, className }) => {
  const c = useStyles()
  const category = model.category && titleCase(model.category)
  return (
    <table className={classnames(className, c.ModelDetails_Table)}>
      <tbody>
        <AttrRow name='Material' value={model.material} />
        <AttrRow name='Weight' value={model.weight} />
        <AttrRow name='Height' value={model.height} />
        <AttrRow name='Category' value={category} />
      </tbody>
    </table>
  )
}

const AttrRow = ({ name, value }) => {
  const c = useStyles()
  if (!value || !name) {
    return null
  }

  return (
    <tr>
      <td className={classnames(c.ModelDetails_Cell, c.ModelDetails_Cell__first)}>
        {name}
      </td>
      <td className={classnames(c.ModelDetails_Cell, c.ModelDetails_Cell__second)}>
        {value}
      </td>
    </tr>
  )
}
