import React from 'react'
import { HoopsModelViewer } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    Compare: {
      display: 'flex',
      flexDirection: 'row',
    },
  }
})

const Compare = ({ model1: model1Data, model2: model2Data }) => {
  const c = useStyles({})

  return (
    <div className={c.Compare}>
      <HoopsModelViewer
        className={c.Model_ModelViewer}
        model={model1Data}
        minimizeTools={true}
      />
      <HoopsModelViewer
        className={c.Model_ModelViewer}
        model={model2Data}
        minimizeTools={true}
      />
    </div>
  )
}

export default Compare
