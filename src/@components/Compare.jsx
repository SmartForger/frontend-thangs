import React from 'react'
import { ModelThumbnail, Spacer, Tag } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    Compare: {
      display: 'flex',
      flexDirection: 'row',
    },
    Compare_Tag: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
    },
    Compare_Viewer: {
      position: 'relative',
      borderRadius: '.5rem',
      background: '#F7F7FB',
    },
  }
})

const Compare = ({ model1: model1Data = [], model2: model2Data }) => {
  const c = useStyles({})

  return (
    <div className={c.Compare}>
      <div className={c.Compare_Viewer}>
        <Tag className={c.Compare_Tag} color={'#999999'} lightText>
          {model1Data[0] && model1Data[0].name}
        </Tag>
        <ModelThumbnail className={c.Model_ModelViewer} model={model1Data[0] || {}} />
      </div>
      <Spacer size={'1rem'} />
      <div className={c.Compare_Viewer}>
        <Tag className={c.Compare_Tag} color={'#30BE93'} lightText>
          New Version
        </Tag>
        <ModelThumbnail
          className={c.Model_ModelViewer}
          model={model2Data}
          useThumbnailer={true}
        />
      </div>
    </div>
  )
}

export default Compare
