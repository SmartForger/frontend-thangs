import React from 'react'
import classnames from 'classnames'

import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body } from '@physna/voxel-ui/@atoms/Typography'

import { ContainerColumn, ContainerRow, Spacer } from '@components'

const useStyles = createUseStyles(theme => {
  return {
    TabbedFileContent__clickable: {
      cursor: 'pointer',
    },
    TabbedFileContent_Underline: {
      height: '3px',
    },
    TabbedFileContent_Underline__selected: {
      backgroundColor: theme.colors.blue[500],
    },
    TabbedFileContent_Text__selected: {
      color: theme.colors.blue[500],
    },
  }
})

const TabbedFileContent = props => {
  const {
    tabs = [],
    selected: selectedKey,
    setSelected,
    model,
    onRowSelect,
    setActiveViewer,
  } = props
  const c = useStyles()
  const selectedTab = tabs.find(tab => tab.key === selectedKey) || {}
  const { Component } = selectedTab
  return (
    <>
      <ContainerRow>
        {tabs.map((tab = {}, ind) => {
          const handleClick = () => {
            setSelected(tab.key)
          }
          return (
            <React.Fragment key={`tab_${ind}`}>
              <ContainerColumn
                className={c.TabbedFileContent__clickable}
                onClick={handleClick}
              >
                <Body
                  className={classnames({
                    [c.TabbedFileContent_Text__selected]: selectedKey === tab.key,
                  })}
                >
                  {tab.label}
                </Body>
                <Spacer size={'.5rem'} />
                <div
                  className={classnames(c.TabbedFileContent_Underline, {
                    [c.TabbedFileContent_Underline__selected]: selectedKey === tab.key,
                  })}
                ></div>
              </ContainerColumn>
              <Spacer size={'2rem'} />
            </React.Fragment>
          )
        })}
      </ContainerRow>
      <ContainerRow fullWidth>
        <Component
          model={model}
          onRowSelect={onRowSelect}
          setActiveViewer={setActiveViewer}
        />
      </ContainerRow>
    </>
  )
}

export default TabbedFileContent
