import React from 'react'
import { render } from 'enzyme'
import { createLevelNode } from '@utilities/test'
import InfiniteTreeView from './index'

describe('InfiniteTreeView', () => {
  const scrollToItem = createLevelNode(2)
  const baseProps = {
    nodes: [
      createLevelNode(0),
      createLevelNode(1),
      createLevelNode(2),
      createLevelNode(2),
      createLevelNode(1),
      createLevelNode(2),
      createLevelNode(3),
      createLevelNode(4),
      createLevelNode(4),
      createLevelNode(2),
      Array(100)
        .fill(0)
        .map(() => createLevelNode(1)),
      scrollToItem,
      Array(100)
        .fill(0)
        .map(() => createLevelNode(1)),
    ],
    // eslint-disable-next-line react/display-name
    renderNode: node => <div data-jest='node'>{node.name}</div>,
    itemHeight: 30,
    width: 300,
    maxHeight: 200,
    classes: {},
  }

  it('should render component', () => {
    const component = render(<InfiniteTreeView {...baseProps} />)
    expect(component.find('[data-jest="node"]').length).toBeGreaterThan(1)
    expect(component.find('[data-jest="node"]').length).toBeLessThan(
      baseProps.nodes.length
    )
  })
})
