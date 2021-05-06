import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ModelThumbnail, Spacer, Tag, TagOptionActionMenu } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'

const useStyles = createUseStyles(_theme => {
  return {
    Compare: {
      display: 'flex',
      flexDirection: 'row',
    },
    Compare_Tag: {
      position: 'absolute !important',
      top: '1rem',
      left: '1rem',
      zIndex: 1,
    },
    Compare_Viewer: {
      position: 'relative',
      borderRadius: '.5rem',
      background: '#F7F7FB',
      width: 'calc(50% - .5rem)',
    },
    Model_ModelViewer: {
      padding: 0,
      height: '100%',
    },
  }
})

const Compare = ({ models: modelSets = [] }) => {
  const c = useStyles({})
  const [activeSet, setActiveSet] = useState(modelSets[0])
  const modelOptions = useMemo(
    () =>
      modelSets.map(set => {
        return {
          label: set.model1.name,
          value: set.model1.partIdentifier,
        }
      }),
    [modelSets]
  )

  const handleChange = useCallback(
    modelId => {
      setActiveSet(
        modelSets.find(modelSet => modelSet?.model1?.partIdentifier === modelId)
      )
    },
    [modelSets]
  )

  useEffect(() => {
    if (modelSets && modelSets[0]) {
      setActiveSet(modelSets[0])
    }
  }, [modelSets])
  return (
    <div className={c.Compare}>
      <div className={c.Compare_Viewer}>
        {modelSets.length === 1 ? (
          <Tag
            className={c.Compare_Tag}
            color={'#999999'}
            maxWidth={'9.375rem'}
            lightText
          >
            {activeSet?.model1?.name}
          </Tag>
        ) : (
          <TagOptionActionMenu
            targetClass={c.Compare_Tag}
            onChange={handleChange}
            options={modelOptions}
            selectedValue={activeSet?.model1?.name}
          />
        )}
        <ModelThumbnail className={c.Model_ModelViewer} model={activeSet?.model1} />
      </div>
      <Spacer size={'1rem'} />
      <div className={c.Compare_Viewer}>
        <Tag className={c.Compare_Tag} color={'#30BE93'} lightText>
          New Version
        </Tag>
        <ModelThumbnail
          className={c.Model_ModelViewer}
          model={activeSet?.model2}
          useThumbnailer={true}
        />
      </div>
    </div>
  )
}

export default Compare
